import { createDecipheriv, createHash } from "node:crypto";

const IV_LENGTH = 12;
const TAG_LENGTH = 16;

export function decryptData(encryptedData: string): string {
	const { encryptionKey } = useRuntimeConfig();

	const bufferData = Buffer.from(encryptedData, "base64");

	const iv = bufferData.subarray(0, IV_LENGTH);
	const tag = bufferData.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
	const data = bufferData.subarray(IV_LENGTH + TAG_LENGTH);

	const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);

	decipher.setAuthTag(tag);

	const decryptedData = decipher.update(data);
	const final = decipher.final();
	const decryptedBuffer = Buffer.concat([decryptedData, final]);

	return decryptedBuffer.toString("utf-8");
}
