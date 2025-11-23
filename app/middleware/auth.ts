export default defineRouteMiddleware((to, from) => {
	const sessionCookie = useCookie("auth_session");

	if (!sessionCookie.value && to.path.startsWith("/dashboard")) {
		return navigateTo("/");
	}
});
