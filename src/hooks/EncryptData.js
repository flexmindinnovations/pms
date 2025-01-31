import CryptoJS from 'crypto-js';

export const useEncrypt = () => {
    const secretKey = 'd4da0e29a2217e9f4f913b78d8568bff9466088b328ee153d29e9a2a50e4be20d7ab22e1dcdb76c840186c29f3089257be92c8746454164d25ba2cfde177ed4d';

    const setEncryptedData = (key, value) => {
        const stringValue = JSON.stringify(value);
        const encrypted = CryptoJS.AES.encrypt(stringValue, secretKey).toString();
        sessionStorage.setItem(key, encrypted);
    };

    const getEncryptedData = (key) => {
        const encrypted = sessionStorage.getItem(key);
        if (!encrypted) return null;
        if (encrypted) {
            try {
                const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                return JSON.parse(decrypted);
            } catch (error) {
                console.error("Failed to decrypt or parse data:", error);
                return null;
            }
        }
    };

    return {
        setEncryptedData,
        getEncryptedData,
    };
};
