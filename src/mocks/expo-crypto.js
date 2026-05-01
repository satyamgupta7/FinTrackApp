// Mock expo-crypto for Expo Go compatibility
const getRandomBytes = (byteCount) => {
  const array = new Uint8Array(byteCount);
  for (let i = 0; i < byteCount; i++) array[i] = Math.floor(Math.random() * 256);
  return array;
};

const getRandomBytesAsync = async (byteCount) => getRandomBytes(byteCount);

const digestStringAsync = async (algorithm, data) => {
  // Simple fallback — not cryptographically secure, only for Expo Go dev
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (Math.imul(31, hash) + data.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
};

const CryptoDigestAlgorithm = { SHA1: 'SHA-1', SHA256: 'SHA-256', SHA384: 'SHA-384', SHA512: 'SHA-512', MD2: 'MD2', MD4: 'MD4', MD5: 'MD5' };
const CryptoEncoding = { BASE64: 'base64', HEX: 'hex' };

module.exports = {
  getRandomBytes,
  getRandomBytesAsync,
  digestStringAsync,
  CryptoDigestAlgorithm,
  CryptoEncoding,
  default: { getRandomBytes, getRandomBytesAsync, digestStringAsync, CryptoDigestAlgorithm, CryptoEncoding },
};
