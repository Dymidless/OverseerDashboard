export default defineCachedEventHandler(
	() => {
		console.log("CACHEDS!");
		return {
			date: Date.now(),
		};
	},
	{
		getKey: () => `hello:ahhhsd`,
		maxAge: 10,
		name: "user-session",
	},
);
