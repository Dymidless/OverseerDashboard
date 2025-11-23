import { createRedirectUrl } from "../utils/createRedirectUrl.js";

export default defineCachedEventHandler(
	(event) => {
		const { clientId } = useRuntimeConfig();
		const redirectUrl = createRedirectUrl(clientId);

		return sendRedirect(event, redirectUrl);
	},
	{
		maxAge: 3600,
	},
);
