import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

type ScryptParameters = {
  n: number;
  r: number;
  p: number;
  salt: Buffer;
  expected: Buffer;
};

function parseScryptHash(encoded: string): ScryptParameters | null {
  const normalized = encoded.trim().replaceAll('\\$', '$');
  const versioned = normalized.startsWith('scrypt.v1.');
  const parts = versioned ? normalized.split('.') : normalized.split('$');

  const algorithm = parts[0];
  const n = versioned ? parts[2] : parts[1];
  const r = versioned ? parts[3] : parts[2];
  const p = versioned ? parts[4] : parts[3];
  const salt = versioned ? parts[5] : parts[4];
  const expectedValue = versioned ? parts[6] : parts[5];

  if (algorithm !== 'scrypt' || !n || !r || !p || !salt || !expectedValue) {
    return null;
  }

  const encoding = versioned ? 'base64url' : 'base64';
  const expected = Buffer.from(expectedValue, encoding);

  if (expected.length !== 64) {
    return null;
  }

  return {
    n: Number(n),
    r: Number(r),
    p: Number(p),
    salt: Buffer.from(salt, encoding),
    expected,
  };
}

export function createAdminPasswordHash(password: string) {
  if (password.length < 12) {
    throw new Error('Use uma senha com pelo menos 12 caracteres.');
  }

  const salt = randomBytes(24);
  const hash = scryptSync(password, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  });

  return [
    'scrypt',
    'v1',
    '16384',
    '8',
    '1',
    salt.toString('base64url'),
    hash.toString('base64url'),
  ].join('.');
}

export function verifyAdminPassword(password: string, encoded: string) {
  try {
    const parsed = parseScryptHash(encoded);

    if (!parsed) {
      return false;
    }

    const actual = scryptSync(password, parsed.salt, 64, {
      N: parsed.n,
      r: parsed.r,
      p: parsed.p,
      maxmem: 64 * 1024 * 1024,
    });

    return timingSafeEqual(actual, parsed.expected);
  } catch {
    return false;
  }
}
