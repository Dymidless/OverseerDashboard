import { type JWTPayload, SignJWT } from "jose";

export async function encryptJWT(payload: JWTPayload): Promise<string> {
	const jwtToken = new SignJWT(payload);

	jwtToken.setProtectedHeader({
		alg: "HS256",
	});
	jwtToken.setIssuedAt();
	jwtToken.setExpirationTime("7d");

	const signedJWTToken = await jwtToken.sign(JWT_SECRET);

	return signedJWTToken;
}
