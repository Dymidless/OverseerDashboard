import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	css: ["./app/assets/css/fonts.css", "./app/assets/css/tailwind.css"],
	devtools: {
		enabled: true,
	},
	runtimeConfig: {
		clientId: "", // Populated by NUXT_CLIENT_ID
		clientSecret: "", // Populated by NUXT_CLIENT_SECRET
		secret: "your-secret-key-change-in-production", // Populated by NUXT_AUTH_SECRET
		botToken: "", // Populated by NUXT_BOT_TOKEN
		public: {
			baseURL: "http://localhost:3000", // Populated by NUXT_PUBLIC_BASE_URL
		},
		secret: "your-secret-key-change-in-production", // Populated by NUXT_AUTH_SECRET
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
