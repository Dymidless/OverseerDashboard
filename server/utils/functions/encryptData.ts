import { createCipheriv, createHash, randomBytes } from "node:crypto";

export function encryptData(unencryptedData: string): string {
	const { encryptionKey } = useRuntimeConfig();

	const iv = randomBytes(ENCRYPTION_IV_LENGTH);
	const key = createHash("sha256").update(encryptionKey).digest();
	const cipher = createCipheriv(ENCRYPTION_ALGORITHM, key, iv);

	const encryptedData = cipher.update(unencryptedData, "utf-8");
	const final = cipher.final();
	const tag = cipher.getAuthTag();

	const encryptedBuffer = Buffer.concat([encryptedData, final]);
	const bufferData = Buffer.concat([iv, tag, encryptedBuffer]);

	return bufferData.toString("base64");
}
