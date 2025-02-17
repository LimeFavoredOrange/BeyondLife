import { ec as EC } from 'elliptic';
import { FIX_SALT } from '@env';
import * as Crypto from 'expo-crypto';
import QuickCrypto from 'react-native-quick-crypto';
import { createCipheriv, createDecipheriv, createHmac } from 'react-native-quick-crypto';

import { Buffer } from 'buffer';

const ec = new EC('p256'); // 使用 SECP256R1 椭圆曲线

// HKDF 密钥派生实现
function hkdf(sharedSecret, length, salt = null, info = '') {
  const hashLen = 32; // SHA-256 输出长度为 32 字节
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
  const salt = FIX_SALT; // 固定盐值
  const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${email}:${password}:${salt}`);
  return hash; // 返回 SHA-256 哈希值作为种子
}

export async function generateECCKeyPair(email, password) {
  const ec = new EC('p256'); // 使用 SECP256R1 曲线
  const seed = await deriveSeed(email, password);
  const keyPair = ec.keyFromPrivate(seed, 'hex'); // 使用种子生成私钥

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
    randomBytes: () => Buffer.from(seed, 'hex'), // 确定性随机数
  });

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

export async function decryptData(backendData, privateKeyHex) {
  // 解析前端私钥
  const privateKey = ec.keyFromPrivate(privateKeyHex, 'hex');

  // 解析后端公钥
  const serverPublicKey = ec.keyFromPublic(backendData.serverPublicKey, 'hex');

  // 计算共享密钥 (sharedSecret)
  let sharedSecret = privateKey.derive(serverPublicKey.getPublic()).toString('hex');

  // Check the shared secret, its length should be 64
  // If the length is not 64, append 0 to the start of the shared secret, until the length is 64
  if (sharedSecret.length !== 64) {
    while (sharedSecret.length < 64) {
      sharedSecret = '0' + sharedSecret;
    }
  }

  console.log('Shared Secret:', sharedSecret);

  // 使用 HKDF 派生对称密钥
  const derivedKey = hkdf(sharedSecret, 32, null, 'handshake data'); // 与后端一致的 info 字段

  console.log('Derived Key:', derivedKey.toString('hex'));

  // 解密密文
  const ciphertext = Buffer.from(backendData.ciphertext, 'hex');
  const iv = Buffer.from(backendData.iv, 'hex');

  const decipher = createDecipheriv('aes-256-cfb', derivedKey, iv);
  let decrypted = decipher.update(ciphertext);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  console.log('Decrypted Message:', decrypted.toString('utf-8'));

  return decrypted.toString('utf-8');
}

// 基于密码生成确定性的公私钥对
export async function generateKeyPairFromPassword(email, password) {
  const seed = await deriveSeed(email, password);

  // 使用种子生成私钥
  const privateKey = ec.keyFromPrivate(seed, 'hex');
  const publicKey = privateKey.getPublic('hex'); // 从私钥派生公钥

  return { publicKey, privateKey: privateKey.getPrivate('hex') };
}
