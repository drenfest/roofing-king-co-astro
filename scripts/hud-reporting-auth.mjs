export const reportingScope = 'https://www.googleapis.com/auth/webmasters.readonly';

export async function refreshReportingAccessToken(config, request = fetch) {
  if (!config.clientId || !config.refreshToken) throw new Error('Missing reporting OAuth configuration');
  const params = { client_id: config.clientId, refresh_token: config.refreshToken, grant_type: 'refresh_token' };
  if (config.clientSecret) params.client_secret = config.clientSecret;
  if (config.requireReadonlyScope) params.scope = reportingScope;
  const response = await request('https://oauth2.googleapis.com/token', {
    method: 'POST', signal: AbortSignal.timeout(30000),
    headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(params)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) throw new Error(`Search Console authorization failed (${response.status}); check the private reporting credential`);
  if (config.requireReadonlyScope && payload.scope !== reportingScope) throw new Error('Reporting credential must grant Search Console read-only access only');
  return payload.access_token;
}
