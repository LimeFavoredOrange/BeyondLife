import crypto from 'react-native-crypto';
import { encode as base64Encode, decode as base64Decode } from 'base64-arraybuffer';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

// 派生密钥
async function deriveKeyFromPassword(password) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, 'some_fixed_salt', 100000, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

// 基于密码生成公私钥对
export async function generateKeyPairFromPassword(password) {
  const seed = await deriveKeyFromPassword(password);

  // 使用种子生成密钥对
  const keyPair = crypto.createECDH('prime256v1');
  keyPair.setPrivateKey(seed);

  const publicKey = keyPair.getPublicKey();
  const privateKey = keyPair.getPrivateKey();

  return { publicKey, privateKey };
}

// 解密数据
export async function decryptData(privateKey, encryptedData) {
  const { ephemeralPublicKey, ciphertext, iv, tag } = encryptedData;

  // 导入后端返回的临时公钥
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.setPrivateKey(privateKey);

  // 计算共享密钥
  const sharedSecret = ecdh.computeSecret(base64Decode(ephemeralPublicKey));

  // 派生 AES 密钥
  const aesKey = crypto.createHash('sha256').update(sharedSecret).digest();

  // 使用 AES-GCM 解密
  const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, base64Decode(iv));
  decipher.setAuthTag(base64Decode(tag));

  const plaintext = decipher.update(base64Decode(ciphertext), 'binary', 'utf8') + decipher.final('utf8');

  return plaintext;
}
