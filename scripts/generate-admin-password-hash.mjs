import { randomBytes, scryptSync } from 'node:crypto';

const password = process.env.ADMIN_PASSWORD_TEMP;

if (!password || password.length < 12) {
  console.error(
    'Defina ADMIN_PASSWORD_TEMP com uma senha de pelo menos 12 caracteres.',
  );
  process.exit(1);
}

const salt = randomBytes(24);
const hash = scryptSync(password, salt, 64, {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
});

// Base64URL + pontos: seguro para .env.local, Vercel e cPanel.
console.log(
  [
    'scrypt',
    'v1',
    '16384',
    '8',
    '1',
    salt.toString('base64url'),
    hash.toString('base64url'),
  ].join('.'),
);
