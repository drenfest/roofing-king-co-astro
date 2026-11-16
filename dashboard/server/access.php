<?php
declare(strict_types=1);

function hudAllowed(array $claims, array $allowed): bool {
    $email = strtolower((string)($claims['email'] ?? ''));
    return ($claims['email_verified'] ?? false) === true
        && $email !== '' && in_array($email, $allowed, true)
        && is_string($claims['sub'] ?? null) && $claims['sub'] !== '';
}

function hudSessionAllowed(array $session, array $allowed, int $now): bool {
    return isset($session['user'], $session['expires'])
        && is_int($session['expires']) && $session['expires'] > $now
        && hudAllowed($session['user'], $allowed);
}

function hudClaimsAllowed(array $claims, array $allowed, string $nonce, int $now): bool {
    return in_array($claims['iss'] ?? '', ['accounts.google.com', 'https://accounts.google.com'], true)
        && is_int($claims['exp'] ?? null) && $claims['exp'] > $now
        && is_int($claims['iat'] ?? null) && $claims['iat'] <= $now + 60
        && is_string($claims['nonce'] ?? null) && $nonce !== ''
        && hash_equals($nonce, $claims['nonce']) && hudAllowed($claims, $allowed);
}

function hudValidFlow(array $flow, string $state, int $now): bool {
    return is_string($flow['state'] ?? null) && $state !== ''
        && hash_equals($flow['state'], $state)
        && is_int($flow['created'] ?? null)
        && $flow['created'] <= $now && $flow['created'] >= $now - 600
        && is_string($flow['nonce'] ?? null) && is_string($flow['verifier'] ?? null);
}
