import { createRedirectUrl } from "../utils/createRedirectUrl.js";

export default defineCachedEventHandler(
	(event) => {
		const { clientId } = useRuntimeConfig();

		if (!clientId) {
			throw createError({
				statusCode: 500,
				statusMessage: "Missing CLIENT_ID environment variable",
			});
		}

		const redirectUrl = createRedirectUrl(clientId);

		return sendRedirect(event, redirectUrl);
	},
	{
		maxAge: 60,
	},
);
