import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	css: ["./app/assets/css/fonts.css", "./app/assets/css/tailwind.css"],
	devtools: {
		enabled: true,
	},
	runtimeConfig: {
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		public: {
			baseURL: process.env.NUXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
		},
		secret: process.env.AUTH_SECRET,
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
