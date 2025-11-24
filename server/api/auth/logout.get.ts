export default defineEventHandler((event) => {
	deleteCookie(event, "authorization");

	return sendRedirect(event, "/");
});
