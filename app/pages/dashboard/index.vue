<script lang="ts" setup>
import { ServerIcon, Users, Crown, Shield, Plus, Check, ExternalLink } from "lucide-vue-next";

definePageMeta({
	middleware: "auth",
});

const { user, fetchSession, isAuthenticated } = useAuth();
const config = useRuntimeConfig();

// Load session on mount
onMounted(async () => {
	await fetchSession();
	if (!isAuthenticated.value) {
		navigateTo("/");
	}
});

// Fetch real guilds from Discord with caching
const { data: guilds, pending, error, refresh } = await useFetch("/api/guilds", {
	key: "user-guilds",
	getCachedData: (key) => useNuxtData(key).data.value,
});

// Fetch guilds where bot is present with caching
const { data: botGuilds } = await useFetch<string[]>("/api/bot/guilds", {
	key: "bot-guilds",
	getCachedData: (key) => useNuxtData(key).data.value,
});

const getGuildIconUrl = (guild: any) => {
	if (guild.icon) {
		return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;
	}
	return null;
};

const navigateToGuild = (guildId: string) => {
	navigateTo(`/dashboard/${guildId}`);
};

const isBotInGuild = (guildId: string) => {
	return botGuilds.value?.includes(guildId) || false;
};

const getInviteUrl = () => {
	const clientId = config.public.clientId;
	const permissions = "8"; // Administrator permission
	return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot%20applications.commands`;
};

const sortedGuilds = computed(() => {
	if (!guilds.value) return [];
	
	return [...guilds.value].sort((a: any, b: any) => {
		const aHasBot = isBotInGuild(a.id);
		const bHasBot = isBotInGuild(b.id);
		
		if (aHasBot && !bHasBot) return -1;
		if (!aHasBot && bHasBot) return 1;
		
		if (a.owner && !b.owner) return -1;
		if (!a.owner && b.owner) return 1;
		
		return a.name.localeCompare(b.name);
	});
});

// Calculate stats
const totalServers = computed(() => guilds.value?.length || 0);
const adminServers = computed(() => guilds.value?.filter((g: any) => !g.owner).length || 0);
const ownedServers = computed(() => guilds.value?.filter((g: any) => g.owner).length || 0);
const botServers = computed(() => guilds.value?.filter((g: any) => isBotInGuild(g.id)).length || 0);
</script>

<template>
	<div class="flex flex-col gap-8 min-h-screen p-8">
		<!-- Header Section -->
		<div class="flex flex-col gap-6">
			<div class="flex items-center justify-between">
				<div class="flex flex-col gap-2">
					<h1 class="text-5xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
						Welcome back, {{ user?.username }}
					</h1>
					<p class="text-lg text-neutral-400">Select a server to start managing it</p>
				</div>
			</div>

			<!-- Stats Overview -->
			<div v-if="!pending && guilds" class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div class="flex items-center gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur">
					<div class="p-3 rounded-lg bg-blue-500/10">
						<ServerIcon class="w-6 h-6 text-blue-500" />
					</div>
					<div class="flex flex-col">
						<span class="text-2xl font-bold">{{ totalServers }}</span>
						<span class="text-sm text-neutral-400">Total Servers</span>
					</div>
				</div>
				<div class="flex items-center gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur">
					<div class="p-3 rounded-lg bg-green-500/10">
						<Check class="w-6 h-6 text-green-500" />
					</div>
					<div class="flex flex-col">
						<span class="text-2xl font-bold">{{ botServers }}</span>
						<span class="text-sm text-neutral-400">Bot Active</span>
					</div>
				</div>
				<div class="flex items-center gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur">
					<div class="p-3 rounded-lg bg-yellow-500/10">
						<Crown class="w-6 h-6 text-yellow-500" />
					</div>
					<div class="flex flex-col">
						<span class="text-2xl font-bold">{{ ownedServers }}</span>
						<span class="text-sm text-neutral-400">Owned</span>
					</div>
				</div>
				<div class="flex items-center gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur">
					<div class="p-3 rounded-lg bg-purple-500/10">
						<Shield class="w-6 h-6 text-purple-500" />
					</div>
					<div class="flex flex-col">
						<span class="text-2xl font-bold">{{ adminServers }}</span>
						<span class="text-sm text-neutral-400">Admin Access</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Loading State -->
		<div v-if="pending" class="flex items-center justify-center py-32">
			<div class="flex flex-col items-center gap-4">
				<div class="w-16 h-16 border-4 border-neutral-700 border-t-white rounded-full animate-spin"></div>
				<p class="text-lg text-neutral-400">Loading your servers...</p>
			</div>
		</div>

		<!-- Error State -->
		<div v-else-if="error" class="flex items-center justify-center py-32">
			<div class="flex flex-col items-center gap-4 p-8 rounded-xl border border-red-900/50 bg-red-950/20">
				<p class="text-xl text-red-400">Failed to load servers</p>
				<p class="text-sm text-neutral-400">{{ error.message }}</p>
				<UiButton @click="refresh" variant="secondary">Retry</UiButton>
			</div>
		</div>

		<!-- Guilds Grid -->
		<div v-else-if="sortedGuilds && sortedGuilds.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			<div
				v-for="guild in sortedGuilds"
				:key="guild.id"
				class="group relative flex flex-col gap-4 p-6 rounded-xl border transition-all duration-200 overflow-hidden"
				:class="isBotInGuild(guild.id) 
					? 'border-green-800/50 bg-green-950/20 hover:bg-green-900/30 hover:border-green-700/50' 
					: 'border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/80 hover:border-neutral-700'"
			>
				<!-- Bot Status Badge -->
				<div class="absolute top-3 right-3">
					<div v-if="isBotInGuild(guild.id)" class="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 border border-green-500/30">
						<div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
						<span class="text-xs text-green-400 font-medium">Bot Active</span>
					</div>
					<div v-else class="flex items-center gap-1 px-2 py-1 rounded-full bg-neutral-800 border border-neutral-700">
						<div class="w-2 h-2 rounded-full bg-neutral-500"></div>
						<span class="text-xs text-neutral-400">No Bot</span>
					</div>
				</div>

				<!-- Gradient Overlay -->
				<div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
				
				<!-- Content -->
				<div class="relative flex flex-col gap-4">
					<!-- Guild Icon & Name -->
					<div class="flex items-center gap-4">
						<div class="relative">
							<div
								class="flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-800 group-hover:bg-neutral-700 transition-colors overflow-hidden ring-2 ring-neutral-700 group-hover:ring-neutral-600"
							>
								<img
									v-if="getGuildIconUrl(guild)"
									:src="getGuildIconUrl(guild)"
									:alt="guild.name"
									class="w-full h-full object-cover"
								/>
								<ServerIcon v-else class="w-8 h-8 text-neutral-400" />
							</div>
							<Crown v-if="guild.owner" class="absolute -top-1 -right-1 w-5 h-5 text-yellow-500 drop-shadow-lg" />
						</div>
						<div class="flex flex-col items-start flex-1 min-w-0">
							<h3 class="text-lg font-semibold text-left group-hover:text-white transition-colors truncate w-full">
								{{ guild.name }}
							</h3>
							<div class="flex items-center gap-2">
								<span class="text-xs px-2 py-0.5 rounded-full" :class="guild.owner ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-500/20 text-purple-400'">
									{{ guild.owner ? "Owner" : "Admin" }}
								</span>
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="flex flex-col gap-2 pt-3 border-t border-neutral-800">
						<UiButton 
							v-if="isBotInGuild(guild.id)"
							@click="navigateToGuild(guild.id)"
							variant="secondary"
							class="w-full justify-center"
						>
							<Shield class="w-4 h-4 mr-2" />
							Manage Server
						</UiButton>
						<a
							v-else
							:href="getInviteUrl()"
							target="_blank"
							class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
						>
							<Plus class="w-4 h-4" />
							Invite Bot
							<ExternalLink class="w-3 h-3" />
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Empty State -->
		<div v-else class="flex flex-col items-center justify-center gap-6 py-32">
			<div class="p-6 rounded-full bg-neutral-800/50">
				<ServerIcon class="w-16 h-16 text-neutral-600" />
			</div>
			<div class="flex flex-col items-center gap-2 max-w-md text-center">
				<h3 class="text-2xl font-semibold">No servers found</h3>
				<p class="text-neutral-400">
					You need administrator permissions on a Discord server to manage it here
				</p>
			</div>
			<UiButton variant="default" class="mt-4" @click="refresh">
				<ServerIcon class="w-4 h-4 mr-2" />
				Refresh
			</UiButton>
		</div>
	</div>
</template>
