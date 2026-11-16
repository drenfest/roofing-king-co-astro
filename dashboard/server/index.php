<?php
declare(strict_types=1);

// This file and its dependencies are served as PHP, never as static source.
require __DIR__ . '/access.php';
$private = dirname(__DIR__, 2) . '/private_html/roof-king-hud';
header('Cache-Control: private, no-store, max-age=0');
header('Pragma: no-cache');
header('X-Robots-Tag: noindex, nofollow, noarchive');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Content-Security-Policy: default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com; font-src \'self\' https://fonts.gstatic.com; img-src \'self\' data:; connect-src \'self\'; object-src \'none\'; base-uri \'none\'; frame-ancestors \'none\'; form-action \'self\'');
header('X-Frame-Options: DENY');

function hudRedirect(string $url): never { header('Location: ' . $url, true, 303); exit; }
function hudFail(int $status, string $message): never {
    http_response_code($status);
    header('Content-Type: text/plain; charset=utf-8');
    echo $message;
    exit;
}

try {
    $config = json_decode((string)file_get_contents($private . '/config.json'), true, 16, JSON_THROW_ON_ERROR);
    if (!is_array($config) || empty($config['clientId']) || empty($config['clientSecret'])) throw new RuntimeException('Configuration unavailable');
} catch (Throwable $error) { hudFail(503, 'The dashboard sign-in is being configured. Please try again shortly.'); }

$origin = 'https://roofkingco.com';
// Keep the session and callback on one host, including visits from the www site.
if (strtolower((string)($_SERVER['HTTP_HOST'] ?? '')) === 'www.roofkingco.com') hudRedirect($origin . '/hud/');
// Never derive OAuth destinations from untrusted Host/forwarded headers.
$callback = $origin . '/hud/index.php?action=callback';
$allowed = array_map('strtolower', $config['allowedEmails'] ?? []);
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
session_name('roof_king_hud');
session_set_cookie_params(['lifetime' => 0, 'path' => '/hud/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
session_start();
$action = (string)($_GET['action'] ?? '');
$authenticated = hudSessionAllowed($_SESSION, $allowed, time());

try {
    if ($action === 'login') {
        $verifier = rtrim(strtr(base64_encode(random_bytes(48)), '+/', '-_'), '=');
        $flow = ['state' => bin2hex(random_bytes(32)), 'nonce' => bin2hex(random_bytes(32)), 'verifier' => $verifier, 'created' => time()];
        $_SESSION['flow'] = $flow;
        hudRedirect('https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query([
            'client_id' => $config['clientId'], 'redirect_uri' => $callback,
            'response_type' => 'code', 'scope' => 'openid email profile',
            'state' => $flow['state'], 'nonce' => $flow['nonce'],
            'code_challenge' => rtrim(strtr(base64_encode(hash('sha256', $verifier, true)), '+/', '-_'), '='),
            'code_challenge_method' => 'S256', 'prompt' => 'select_account'
        ], '', '&', PHP_QUERY_RFC3986));
    }
    if ($action === 'callback') {
        $flow = $_SESSION['flow'] ?? [];
        unset($_SESSION['flow']); // Every attempt consumes the transaction, including failures.
        if (!hudValidFlow($flow, (string)($_GET['state'] ?? ''), time()) || empty($_GET['code']) || isset($_GET['error'])) {
            hudFail(400, 'Sign-in expired or was cancelled. Return to /hud/ and try again.');
        }
        require $private . '/runtimes/@HUD_RUNTIME@/vendor/autoload.php';
        $http = new GuzzleHttp\Client(['timeout' => 20, 'connect_timeout' => 10]);
        $response = $http->post('https://oauth2.googleapis.com/token', ['form_params' => [
            'client_id' => $config['clientId'], 'client_secret' => $config['clientSecret'],
            'redirect_uri' => $callback, 'grant_type' => 'authorization_code',
            'code' => (string)$_GET['code'], 'code_verifier' => $flow['verifier']
        ]]);
        $tokens = json_decode((string)$response->getBody(), true, 16, JSON_THROW_ON_ERROR);
        $claims = (new Google\Auth\AccessToken())->verify((string)($tokens['id_token'] ?? ''), ['audience' => $config['clientId'], 'throwException' => true]);
        if (!$claims || !hudClaimsAllowed($claims, $allowed, $flow['nonce'], time())) {
            unset($_SESSION['user'], $_SESSION['expires']);
            hudFail(403, 'This Google account does not have dashboard access. Return to /hud/ to choose another account.');
        }
        session_regenerate_id(true);
        $_SESSION['user'] = ['email' => strtolower($claims['email']), 'email_verified' => true, 'sub' => $claims['sub']];
        $_SESSION['expires'] = time() + 28800;
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        hudRedirect($origin . '/hud/');
    }
    if ($action === 'data') {
        if (!$authenticated) hudFail(401, 'Sign in to view this report.');
        $dataset = $private . '/data/dashboard.json';
        if (!is_file($dataset)) hudFail(503, 'The report is being prepared. Please try again shortly.');
        ini_set('zlib.output_compression', '1');
        header('Content-Type: application/json; charset=utf-8');
        readfile($dataset);
        exit;
    }
    if ($action === 'logout') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !is_string($_SESSION['csrf'] ?? null)
            || !hash_equals($_SESSION['csrf'], (string)($_POST['csrf'] ?? ''))) hudFail(403, 'Invalid sign-out request.');
        $_SESSION = [];
        session_destroy();
        setcookie(session_name(), '', ['expires' => 1, 'path' => '/hud/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
        hudRedirect($origin . '/hud/');
    }
    if ($action !== '') hudFail(404, 'Not found.');
} catch (Throwable $error) {
    // OAuth responses and credentials must not appear in public errors or application logs.
    hudFail(502, 'Google sign-in could not be completed. Return to /hud/ and try again.');
}
header('Content-Type: text/html; charset=utf-8');
$asset = json_decode((string)file_get_contents(__DIR__ . '/assets.json'), true, 16, JSON_THROW_ON_ERROR);
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Roof King HUD | Search Performance</title>
<link rel="stylesheet" href="/hud/shell.css">
<?php if ($authenticated): foreach ($asset['css'] as $css): ?><link rel="stylesheet" href="/hud/<?= htmlspecialchars($css, ENT_QUOTES) ?>"><?php endforeach; endif; ?>
</head><body>
<?php if ($authenticated): ?>
<div class="account"><span><?= htmlspecialchars($_SESSION['user']['email'], ENT_QUOTES) ?></span><form action="/hud/index.php?action=logout" method="post"><input type="hidden" name="csrf" value="<?= htmlspecialchars($_SESSION['csrf'], ENT_QUOTES) ?>"><button type="submit">Sign out</button></form></div>
<div id="hud" aria-live="polite">Loading search performance…</div>
<script type="module" src="/hud/<?= htmlspecialchars($asset['file'], ENT_QUOTES) ?>"></script>
<?php else: ?>
<main class="login"><p class="brand">ROOF KING <strong>HUD</strong></p><h1>Search Performance</h1><p>Sign in with your approved Google account to view Roof King’s private dashboard.</p><a class="google" href="/hud/index.php?action=login" title="Sign in with Google">Sign in with Google</a><p class="note">Access is limited to the Roof King team. Sign-in requests your name, email address, and profile only.</p></main>
<?php endif; ?>
</body></html>
