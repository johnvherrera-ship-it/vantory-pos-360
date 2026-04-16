import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_STORAGE_KEY || 'vantory-pos-360-local-secret-key-2024';

export const encryptData = (data: any): string => {
  try {
    const jsonStr = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonStr, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

export const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedStr ? JSON.parse(decryptedStr) : null;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

/**
 * Enhanced localStorage wrapper with encryption
 */
export const storage = {
  set: (key: string, value: any) => {
    const encrypted = encryptData(value);
    if (encrypted) {
      localStorage.setItem(key, encrypted);
    }
  },
  
  get: (key: string, defaultValue: any = null) => {
    const saved = localStorage.getItem(key);
    if (!saved) return defaultValue;
    
    // Try to decrypt. If it fails, it might be old plain text data
    const decrypted = decryptData(saved);
    if (decrypted !== null) return decrypted;
    
    // Fallback: try to parse as regular JSON (to not lose old data)
    try {
      return JSON.parse(saved);
    } catch {
      return saved;
    }
  },

  remove: (key: string) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  }
};
