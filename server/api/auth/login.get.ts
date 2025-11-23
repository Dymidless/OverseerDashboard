import { createRedirectUrl } from "../utils/createRedirectUrl.js";

export default defineEventHandler((event) => {
	const config = useRuntimeConfig();

	if (!config.clientId) {
		throw createError({
			statusCode: 500,
			statusMessage: "CLIENT_ID is not configured. Please check your .env.local file and restart the dev server.",
		});
	}

	const redirectUrl = createRedirectUrl(config.clientId);
	return sendRedirect(event, redirectUrl);
});
