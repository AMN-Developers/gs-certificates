import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export function createAdminPasswordHash(password: string) {
  if (password.length < 12)
    throw new Error('Use uma senha com pelo menos 12 caracteres.');
  const salt = randomBytes(24);
  const hash = scryptSync(password, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  });
  return `scrypt$16384$8$1$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export function verifyAdminPassword(password: string, encoded: string) {
  try {
    const [algorithm, n, r, p, salt, expectedValue] = encoded.split('$');
    if (algorithm !== 'scrypt') return false;
    const expected = Buffer.from(expectedValue, 'base64');
    const actual = scryptSync(password, Buffer.from(salt, 'base64'), 64, { N: Number(n), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024 });
    return expected.length === 64 && timingSafeEqual(actual, expected);
  } catch { return false; }
}
