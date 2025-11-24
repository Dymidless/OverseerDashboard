import { type JWTPayload, jwtVerify } from "jose";

export async function decryptJWT(encryptedJWT: string): Promise<JWTPayload | null> {
	try {
		const { payload } = await jwtVerify(encryptedJWT, JWT_SECRET);

		return payload;
	} catch {
		return null;
	}
}
