import crypto from 'react-native-quick-crypto';
import { Buffer } from 'buffer';

global.Buffer = Buffer;

// 使用密码派生种子
async function deriveSeed(password) {
  const salt = Buffer.from('fixed_salt_value'); // 固定盐值
  const iterations = 100000; // 推荐至少 100,000 次迭代
  const keyLength = 32;

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keyLength, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(Buffer.from(derivedKey));
    });
  });
}

// 去掉 PEM 格式中的头尾标识和换行符
function extractKeyContent(pem) {
  return pem
    .replace(/-----BEGIN [^-]+-----/g, '') // 去掉头部标识
    .replace(/-----END [^-]+-----/g, '') // 去掉尾部标识
    .replace(/\n/g, ''); // 去掉换行符
}

// 基于密码生成密钥对
export async function generateKeyPairFromPassword(password) {
  const seed = await deriveSeed(password);

  console.log('Derived Seed:', seed.toString('hex'));

  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      'ec', // 使用椭圆曲线算法
      {
        namedCurve: 'prime256v1',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: 'aes-256-cbc',
          passphrase: seed.toString('hex'),
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          console.error('Error generating key pair:', err);
          reject(err);
        } else {
          console.log('Key pair generated successfully!');
          // 提取纯内容
          const publicKeyContent = extractKeyContent(publicKey);
          const privateKeyContent = extractKeyContent(privateKey);
          resolve({ publicKey: publicKeyContent, privateKey: privateKeyContent });
        }
      }
    );
  });
}

// 示例调用
(async () => {
  const password = 'secure_password';

  try {
    const { publicKey, privateKey } = await generateKeyPairFromPassword(password);
    console.log('Public Key Content:', publicKey); // 纯内容
    console.log('Private Key Content:', privateKey); // 纯内容
  } catch (err) {
    console.error('Error:', err);
  }
})();
