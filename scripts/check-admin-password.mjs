import { readFileSync } from 'node:fs';
import { scryptSync, timingSafeEqual } from 'node:crypto';

const password = process.env.ADMIN_PASSWORD_TEMP;
const file = readFileSync('.env.local', 'utf8');
const line = file.split(/\r?\n/).find((item) => item.startsWith('ADMIN_PASSWORD_SCRYPT='));
// The generator escapes "$" for .env.local because Next.js expands variables
// in environment files. Decode it here so this local check validates the same
// value received by the application at runtime.
const encoded = line?.slice('ADMIN_PASSWORD_SCRYPT='.length).trim().replaceAll('\\$', '$');

if (!password || !encoded) {
  console.error('Senha temporária ou ADMIN_PASSWORD_SCRYPT não encontrado.');
  process.exit(1);
}

try {
  const [algorithm, n, r, p, saltValue, expectedValue] = encoded.split('$');
  const expected = Buffer.from(expectedValue || '', 'base64');
  const actual = scryptSync(password, Buffer.from(saltValue || '', 'base64'), 64, {
    N: Number(n), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024,
  });
  if (algorithm === 'scrypt' && expected.length === 64 && timingSafeEqual(actual, expected)) {
    console.log('HASH_OK');
  } else {
    console.log('HASH_INVALID');
  }
} catch {
  console.log('HASH_INVALID');
}
