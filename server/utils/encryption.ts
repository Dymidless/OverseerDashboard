import crypto from "node:crypto";

const ENCRYPTION_KEY = process.env.NUXT_AUTH_SECRET
const ALGORITHM = "aes-256-gcm";

interface EncryptedData {
    iv: string;
    encryptedData: string;
    authTag: string;
}

/**
 * Encrypts data using AES-256-GCM
 */
export function encryptData(data: string): string {
    // Generate a 32-byte key from the secret
    const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);

    // Generate a random IV
    const iv = crypto.randomBytes(16);

    // Create cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Encrypt
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Get auth tag for verification
    const authTag = cipher.getAuthTag();

    // Return everything together in JSON format
    const result: EncryptedData = {
        iv: iv.toString("hex"),
        encryptedData: encrypted,
        authTag: authTag.toString("hex"),
    };

    return JSON.stringify(result);
}

/**
 * Decrypts data using AES-256-GCM
 */
export function decryptData(encryptedString: string): string | null {
    try {
        const { iv, encryptedData, authTag }: EncryptedData = JSON.parse(encryptedString);

        // Generate a 32-byte key from the secret
        const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);

        // Create decipher
        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            key,
            Buffer.from(iv, "hex")
        );

        // Set auth tag
        decipher.setAuthTag(Buffer.from(authTag, "hex"));

        // Decrypt
        let decrypted = decipher.update(encryptedData, "hex", "utf8");
        decrypted += decipher.final("utf8");

        return decrypted;
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}
