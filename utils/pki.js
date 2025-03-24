import { ec as EC } from 'elliptic';
import { FIX_SALT } from '@env';
import * as Crypto from 'expo-crypto';
import QuickCrypto from 'react-native-quick-crypto';
import { createCipheriv, createDecipheriv, createHmac } from 'react-native-quick-crypto';

import { Buffer } from 'buffer';

const ec = new EC('p256'); // Using the SECP256R1 elliptic curve

// HKDF key derivation implementation
function hkdf(sharedSecret, length, salt = null, info = '') {
  const hashLen = 32; // The length of the hash output for SHA-256 is 32 bytes
  const pseudoRandomKey = createHmac('sha256', salt || Buffer.alloc(hashLen, 0))
    .update(Buffer.from(sharedSecret, 'hex'))
    .digest();

  let prev = Buffer.alloc(0);
  let output = Buffer.alloc(0);
  const infoBuffer = Buffer.from(info);

  for (let i = 0; output.length < length; i++) {
    const hmac = createHmac('sha256', pseudoRandomKey);
    hmac.update(Buffer.concat([prev, infoBuffer, Buffer.from([i + 1])]));
    prev = hmac.digest();
    output = Buffer.concat([output, prev]);
  }

  return output.slice(0, length);
}

// Generate a fixed seed based on email and password
async function deriveSeed(email, password) {
  const salt = FIX_SALT; // Use a fixed salt
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${email}:${password}:${salt}`);
  return hash; // Return the SHA-256 hash as the seed
}

export async function generateECCKeyPair(email, password) {
  const ec = new EC('p256'); // Using the SECP256R1 elliptic curve
  const seed = await deriveSeed(email, password);
  const keyPair = ec.keyFromPrivate(seed, 'hex'); // Use the seed to generate the private key

  return {
    publicKey: keyPair.getPublic('hex'),
    privateKey: keyPair.getPrivate('hex'),
  };
}

export async function generateRSAKeyPairFromSeed(email, password) {
  const seed = await deriveSeed(email, password);

  const keyPair = QuickCrypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    randomBytes: () => Buffer.from(seed, 'hex'), // Deterministic random number
  });

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

export async function decryptData(backendData, privateKeyHex) {
  // Parse the private key from the hex string
  const privateKey = ec.keyFromPrivate(privateKeyHex, 'hex');

  // Parse the server public key from the hex string
  const serverPublicKey = ec.keyFromPublic(backendData.serverPublicKey, 'hex');

  // Calculate the shared secret
  let sharedSecret = privateKey.derive(serverPublicKey.getPublic()).toString('hex');

  // Check the shared secret, its length should be 64
  // If the length is not 64, append 0 to the start of the shared secret, until the length is 64
  if (sharedSecret.length !== 64) {
    while (sharedSecret.length < 64) {
      sharedSecret = '0' + sharedSecret;
    }
  }

  console.log('Shared Secret:', sharedSecret);

  // Use HKDF to derive the symmetric key
  const derivedKey = hkdf(sharedSecret, 32, null, 'handshake data'); // 与后端一致的 info 字段

  console.log('Derived Key:', derivedKey.toString('hex'));

  // Convert the ciphertext and IV from hex to Buffer
  const ciphertext = Buffer.from(backendData.ciphertext, 'hex');
  const iv = Buffer.from(backendData.iv, 'hex');

  const decipher = createDecipheriv('aes-256-cfb', derivedKey, iv);
  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  console.log('Decrypted Message:', decrypted.toString('utf-8'));

  return decrypted.toString('utf-8');
}

// Generate a deterministic key pair based on the password
export async function generateKeyPairFromPassword(email, password) {
  const seed = await deriveSeed(email, password);

  // Generate the private key using the seed
  const privateKey = ec.keyFromPrivate(seed, 'hex');
  const publicKey = privateKey.getPublic('hex'); // Get the public key from the private key

  return { publicKey, privateKey: privateKey.getPrivate('hex') };
}
