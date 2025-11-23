<script lang="ts" setup>
import { Shield, Zap, Users, Lock, ArrowRight, Check } from "lucide-vue-next";

const { user, fetchSession, isAuthenticated } = useAuth();

onMounted(async () => {
	await fetchSession();
});

const login = () => {
	window.location.href = "/api/auth/login";
};

const features = [
	{
		icon: Shield,
		title: "Advanced Moderation",
		description: "Powerful moderation tools to keep your server safe and organized",
	},
	{
		icon: Zap,
		title: "Automation",
		description: "Automate repetitive tasks and streamline your server management",
	},
	{
		icon: Users,
		title: "Member Management",
		description: "Easily manage roles, permissions, and member activities",
	},
	{
		icon: Lock,
		title: "Secure & Encrypted",
		description: "Your data is encrypted and protected with industry-standard security",
	},
];

const benefits = [
	"Real-time server analytics",
	"Custom automation workflows",
	"Advanced permission management",
	"24/7 uptime monitoring",
	"Multi-server support",
	"Detailed activity logs",
];
</script>

<template>
	<div class="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
		<!-- Hero Section -->
		<main class="relative flex flex-col items-center justify-center min-h-screen px-6 py-20">
			<!-- Background Effects -->
			<div class="absolute inset-0 overflow-hidden pointer-events-none">
				<div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
				<div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
			</div>

			<!-- Content -->
			<div class="relative z-10 flex flex-col items-center gap-12 max-w-6xl mx-auto">
				<!-- Logo & Title -->
				<div class="flex flex-col items-center gap-6 text-center">
					<div class="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
						<Shield class="w-16 h-16 text-blue-400" />
					</div>
					<div class="flex flex-col gap-4">
						<h1 class="text-7xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
							Overseer
						</h1>
						<p class="text-2xl text-neutral-300 max-w-2xl">
							The ultimate Discord server management platform
						</p>
						<p class="text-lg text-neutral-400 max-w-xl">
							Powerful tools to moderate, automate, and grow your Discord community
						</p>
					</div>
				</div>

				<!-- CTA Buttons -->
				<div v-if="!isAuthenticated" class="flex flex-col sm:flex-row gap-4">
					<UiButton @click="login" size="lg" class="text-lg px-8 py-6 group">
						<Shield class="w-5 h-5 mr-2" />
						Login with Discord
						<ArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
					</UiButton>
				</div>
				<div v-else class="flex flex-col items-center gap-4">
					<div class="text-center">
						<p class="text-neutral-400">Welcome back,</p>
						<p class="text-2xl font-bold text-white">{{ user?.username }}</p>
					</div>
					<UiButton href="/dashboard" is="a" size="lg" class="text-lg px-8 py-6 group">
						Go to Dashboard
						<ArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
					</UiButton>
				</div>

				<!-- Features Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-12">
					<div
						v-for="feature in features"
						:key="feature.title"
						class="flex flex-col gap-4 p-6 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur hover:border-neutral-700 hover:bg-neutral-800/50 transition-all"
					>
						<div class="p-3 rounded-lg bg-blue-500/10 w-fit">
							<component :is="feature.icon" class="w-6 h-6 text-blue-400" />
						</div>
						<div class="flex flex-col gap-2">
							<h3 class="text-lg font-semibold">{{ feature.title }}</h3>
							<p class="text-sm text-neutral-400">{{ feature.description }}</p>
						</div>
					</div>
				</div>

				<!-- Benefits Section -->
				<div class="flex flex-col items-center gap-8 mt-12 w-full max-w-4xl">
					<h2 class="text-3xl font-bold text-center">Everything you need to manage your server</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
						<div
							v-for="benefit in benefits"
							:key="benefit"
							class="flex items-center gap-3 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800"
						>
							<div class="p-1 rounded-full bg-green-500/20">
								<Check class="w-4 h-4 text-green-400" />
							</div>
							<span class="text-neutral-200">{{ benefit }}</span>
						</div>
					</div>
				</div>

				<!-- Final CTA -->
				<div v-if="!isAuthenticated" class="flex flex-col items-center gap-4 mt-12 p-8 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
					<h3 class="text-2xl font-bold text-center">Ready to get started?</h3>
					<p class="text-neutral-300 text-center max-w-md">
						Join thousands of server owners who trust Overseer to manage their communities
					</p>
					<UiButton @click="login" size="lg" class="text-lg px-8 py-6">
						Get Started Free
					</UiButton>
				</div>
			</div>

			<!-- Footer -->
			<footer class="absolute bottom-8 text-center text-sm text-neutral-500">
				<p>© 2025 Overseer. All rights reserved.</p>
			</footer>
		</main>
	</div>
</template>
