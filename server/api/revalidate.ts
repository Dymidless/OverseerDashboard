export default defineEventHandler(async () => {
	const cache = useStorage("cache:nitro:handlers:user-session");

	console.log(await cache.getKeys());

	await cache.removeItem("hello.json");

	return {
		cache,
		ok: true,
	};
});
