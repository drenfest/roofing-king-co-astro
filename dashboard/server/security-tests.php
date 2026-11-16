<?php
declare(strict_types=1);
require __DIR__ . '/access.php';
require __DIR__ . '/vendor/autoload.php';

function expect(bool $condition, string $message): void {
    if (!$condition) throw new RuntimeException($message);
}
$now = time();
$allowed = ['member@example.com'];
$claims = ['email' => 'MEMBER@example.com', 'email_verified' => true, 'sub' => '123', 'iss' => 'https://accounts.google.com', 'aud' => 'test-client', 'iat' => $now, 'exp' => $now + 3600, 'nonce' => 'expected-nonce'];
expect(hudClaimsAllowed($claims, $allowed, 'expected-nonce', $now), 'Approved verified identity denied');
foreach ([['email' => 'outsider@example.com'], ['email_verified' => false], ['email_verified' => 'true'], ['sub' => ''], ['iss' => 'https://example.com'], ['nonce' => 'other'], ['exp' => $now - 1], ['iat' => $now + 120]] as $change) {
    expect(!hudClaimsAllowed(array_replace($claims, $change), $allowed, 'expected-nonce', $now), 'Invalid claim accepted: ' . json_encode(array_keys($change)));
}
expect(!hudClaimsAllowed($claims, [], 'expected-nonce', $now), 'Revoked access accepted');
$session = ['user' => $claims, 'expires' => $now + 100];
expect(hudSessionAllowed($session, $allowed, $now), 'Valid session denied');
expect(!hudSessionAllowed($session, [], $now), 'Allowlist removal did not revoke session');
expect(!hudSessionAllowed($session, $allowed, $now + 101), 'Expired session accepted');
expect(!hudSessionAllowed([], $allowed, $now), 'Anonymous session accepted');
$flow = ['state' => 'expected-state', 'nonce' => 'nonce', 'verifier' => 'verifier', 'created' => $now];
expect(hudValidFlow($flow, 'expected-state', $now), 'Valid state denied');
expect(!hudValidFlow($flow, 'wrong', $now), 'Forged state accepted');
expect(!hudValidFlow($flow, 'expected-state', $now + 601), 'Expired OAuth flow accepted');
expect(!hudValidFlow([], '', $now), 'Missing OAuth flow accepted');

// Generate an isolated signing key; no Google requests or production credentials.
$key = openssl_pkey_new(['private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA]);
$details = openssl_pkey_get_details($key);
$encode = fn(string $s): string => rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
$cert = tempnam(sys_get_temp_dir(), 'hud-jwks-');
file_put_contents($cert, json_encode(['keys' => [['kty' => 'RSA', 'alg' => 'RS256', 'kid' => 'test', 'n' => $encode($details['rsa']['n']), 'e' => $encode($details['rsa']['e'])]]]));
try {
    $verifier = new Google\Auth\AccessToken();
    $options = ['audience' => 'test-client', 'certsLocation' => $cert, 'throwException' => true];
    $token = Firebase\JWT\JWT::encode($claims, $key, 'RS256', 'test');
    expect($verifier->verify($token, $options)['sub'] === '123', 'Valid signature denied');
    foreach ([array_replace($claims, ['aud' => 'wrong-client']), array_replace($claims, ['exp' => $now - 100]), array_replace($claims, ['iss' => 'https://example.com'])] as $invalid) {
        $rejected = false;
        try { $verifier->verify(Firebase\JWT\JWT::encode($invalid, $key, 'RS256', 'test'), $options); } catch (Throwable $error) { $rejected = true; }
        expect($rejected, 'Invalid signed token accepted');
    }
    $parts = explode('.', $token);
    $parts[1] = $encode(json_encode(array_replace($claims, ['email' => 'forged@example.com'])));
    $rejected = false;
    try { $verifier->verify(implode('.', $parts), $options); } catch (Throwable $error) { $rejected = true; }
    expect($rejected, 'Forged signature accepted');
} finally { unlink($cert); }
echo "HUD security: identity, revocation, expiry, state, nonce, audience and signature checks passed.\n";
