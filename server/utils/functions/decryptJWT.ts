import { type JWTPayload, jwtVerify } from "jose";

export async function decryptJWT(encryptedJWT: string): Promise<Session | null> {
	try {
		const { payload } = await jwtVerify(encryptedJWT, JWT_SECRET);

		return payload as unknown as Session;
	} catch {
		return null;
	}
}
