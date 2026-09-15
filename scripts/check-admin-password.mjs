import { readFileSync } from 'node:fs';
import { scryptSync, timingSafeEqual } from 'node:crypto';

const password = process.env.ADMIN_PASSWORD_TEMP;
const file = readFileSync('.env.local', 'utf8');
const line = file
  .split(/\r?\n/)
  .find((item) => item.startsWith('ADMIN_PASSWORD_SCRYPT='));
const encoded = line?.slice('ADMIN_PASSWORD_SCRYPT='.length).trim();

if (!password || !encoded) {
  console.error('Senha temporária ou ADMIN_PASSWORD_SCRYPT não encontrado.');
  process.exit(1);
}

try {
  const normalized = encoded.replaceAll('\\$', '$');
  const versioned = normalized.startsWith('scrypt.v1.');
  const parts = versioned ? normalized.split('.') : normalized.split('$');
  const n = versioned ? parts[2] : parts[1];
  const r = versioned ? parts[3] : parts[2];
  const p = versioned ? parts[4] : parts[3];
  const salt = versioned ? parts[5] : parts[4];
  const expectedValue = versioned ? parts[6] : parts[5];
  const encoding = versioned ? 'base64url' : 'base64';
  const expected = Buffer.from(expectedValue || '', encoding);
  const actual = scryptSync(password, Buffer.from(salt || '', encoding), 64, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: 64 * 1024 * 1024,
  });

  if (
    parts[0] === 'scrypt' &&
    expected.length === 64 &&
    timingSafeEqual(actual, expected)
  ) {
    console.log('HASH_OK');
  } else {
    console.log('HASH_INVALID');
  }
} catch {
  console.log('HASH_INVALID');
}
