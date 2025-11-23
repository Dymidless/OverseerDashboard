import { exchangeCode } from "../utils/exchangeCode.js";

export default defineEventHandler(async (event) => {
	const { code } = getQuery(event);

	if (typeof code !== "string") {
		return void sendRedirect(event, "/");
	}

	const exchangeCodeData = await exchangeCode(code);

	if (exchangeCodeData === null) {
		return {
			message: "Failed to exchange the authorization code",
		};
	}

	const { accessToken } = exchangeCodeData;

	return {
		accessToken,
	};
});
