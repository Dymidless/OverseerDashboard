import { SignJWT } from "jose";

export async function encryptJWT(session: Session): Promise<string> {
	const jwtToken = new SignJWT({
		...session,
	});

	jwtToken.setProtectedHeader({
		alg: "HS256",
	});
	jwtToken.setIssuedAt();
	jwtToken.setExpirationTime("7d");

	const signedJWTToken = await jwtToken.sign(JWT_SECRET);

	return signedJWTToken;
}
