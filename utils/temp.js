import { createCipheriv, createDecipheriv, createHmac } from 'react-native-quick-crypto';
import * as Crypto from 'expo-crypto';
import { ec as EC } from 'elliptic';
import { Buffer } from 'buffer';

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

// 后端返回的数据
const backendData = {
  ciphertext: '7e1e35f781b07f361a8f9c6fe9',
  iv: '8b7fc6dd2607cc45da7aa5f8d89d93b4',
  serverPublicKey:
    '04d18d0c262e0a623e293bc86c57940766079e33010dba423f05835b99a95ed1f7fe44609c144e077665eec07cc27395ad72647c06b19d426a6feacf50a38a1588',
};

const privateKeyHex = 'af7edcea1c54532969daf6145f80d6e45d17e22e0d74fc2c50a9ea8692187c07';

export async function decryptData(backendData, privateKeyHex) {
  // 初始化 EC 实例
  const ec = new EC('p256'); // 使用 SECP256R1 曲线

  // 解析前端私钥
  const privateKey = ec.keyFromPrivate(privateKeyHex, 'hex');

  // 解析后端公钥
  const serverPublicKey = ec.keyFromPublic(backendData.serverPublicKey, 'hex');

  // 计算共享密钥 (sharedSecret)
  const sharedSecret = privateKey.derive(serverPublicKey.getPublic()).toString('hex');

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

// 调用解密函数
decryptData(backendData, privateKeyHex).catch((err) => console.error(err));
