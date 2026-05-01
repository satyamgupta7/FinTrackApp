// Mock for ExpoCryptoAES — native module unavailable in Expo Go
export default {
  encrypt: () => Promise.reject(new Error('AES not available in Expo Go')),
  decrypt: () => Promise.reject(new Error('AES not available in Expo Go')),
};
