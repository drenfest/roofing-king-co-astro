import fs from 'node:fs/promises';
import path from 'node:path';

export async function publishHudReport(data, destination) {
  if (data.error || data.report?.property !== 'sc-domain:roofkingco.com' || !Array.isArray(data.rows) || !data.rows.length || !/^\d{4}-\d{2}-\d{2}$/.test(data.report?.dataThrough || '')) throw new Error('Invalid or empty Roof King report');
  const previous = await fs.readFile(destination, 'utf8').then(JSON.parse).catch(error => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (previous?.report?.dataThrough > data.report.dataThrough) throw new Error('Refusing to publish an older report');
  const combined = { ...data, observability: data.observability || previous?.observability || null };
  await fs.mkdir(path.dirname(destination), { recursive: true, mode: 0o750 });
  const temporary = `${destination}.${process.pid}.uploading`;
  try {
    await fs.writeFile(temporary, JSON.stringify(combined), { mode: 0o640, flag: 'wx' });
    await fs.rename(temporary, destination);
  } finally { await fs.rm(temporary, { force: true }); }
}
