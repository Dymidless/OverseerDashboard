export default defineCachedEventHandler(
	(event) => {
		const redirectUrl = createRedirectUrl();

		return sendRedirect(event, redirectUrl);
	},
	{
		maxAge: 60,
	},
);
