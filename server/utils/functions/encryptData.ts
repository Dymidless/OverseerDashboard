import { createCipheriv, randomBytes } from "node:crypto";

export function encryptData(unencryptedData: string): string {
	const iv = randomBytes(ENCRYPTION_IV_LENGTH);
	const cipher = createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, iv);

	const encryptedData = cipher.update(unencryptedData, "utf-8");
	const final = cipher.final();
	const tag = cipher.getAuthTag();

	const encryptedBuffer = Buffer.concat([encryptedData, final]);

	const bufferData = Buffer.concat([iv, tag, encryptedBuffer]);
	const bufferDataString = bufferData.toString("base64");

	return bufferDataString;
}
