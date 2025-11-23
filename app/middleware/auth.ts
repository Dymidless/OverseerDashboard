export default defineNuxtRouteMiddleware((to, from) => {
	if (!to.path.startsWith("/dashboard")) {
		return;
	}

	if (process.server) {
		return;
	}

	return;
});
