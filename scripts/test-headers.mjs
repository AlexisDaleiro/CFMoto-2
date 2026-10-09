import fs from 'node:fs/promises';
export async function testHeaders(base) {
  if (!base.includes('.vercel.app')) return {};
  if (process.env.TEST_COOKIE) return { Cookie: process.env.TEST_COOKIE };
  try {
    const jar = await fs.readFile('artifacts/sources/vercel-cookies.txt', 'utf8');
    const host = new URL(base).hostname;
    const cookies = jar.split('\n').filter(line => line && (!line.startsWith('#') || line.startsWith('#HttpOnly_'))).map(line => line.replace(/^#HttpOnly_/, '').split('\t')).filter(parts => parts.length >= 7 && host.endsWith(parts[0].replace(/^\./, ''))).map(parts => `${parts[5]}=${parts[6].trim()}`);
    return cookies.length ? { Cookie: cookies.join('; ') } : {};
  } catch { return {}; }
}
