<script lang="ts" setup>
import { Users, Activity, Shield, Zap, Settings, ArrowLeft, Crown, Clock, ChevronRight } from "lucide-vue-next";

definePageMeta({
	layout: "dashboard-layout",
});

const route = useRoute();
const { user } = useAuth();
const guildId = route.params.guildId as string;

const { data: guildData, pending, error } = await useFetch(`/api/guilds/${guildId}`);

const stats = computed(() => {
	if (!guildData.value) return [];
	
	return [
		{
			label: "Total Members",
			value: guildData.value.approximate_member_count?.toLocaleString() || "N/A",
			icon: Users,
			color: "text-blue-400",
			bg: "bg-blue-500/10",
		},
		{
			label: "Online Members",
			value: guildData.value.approximate_presence_count?.toLocaleString() || "N/A",
			icon: Activity,
			color: "text-green-400",
			bg: "bg-green-500/10",
		},
		{
			label: "Boost Level",
			value: `Level ${guildData.value.premium_tier || 0}`,
			icon: Shield,
			color: "text-purple-400",
			bg: "bg-purple-500/10",
		},
		{
			label: "Active Plugins",
			value: "0",
			icon: Zap,
			color: "text-yellow-400",
			bg: "bg-yellow-500/10",
		},
	];
});

const getGuildIconUrl = (guild: any) => {
	if (guild?.icon) {
		return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
	}
	return null;
};
</script>

<template>
	<div class="flex flex-col min-h-screen">
		<!-- Loading State -->
		<div v-if="pending" class="flex items-center justify-center py-32">
			<div class="flex flex-col items-center gap-4">
				<div class="w-12 h-12 border-4 border-neutral-700 border-t-white rounded-full animate-spin"></div>
				<p class="text-neutral-400">Loading server data...</p>
			</div>
		</div>

		<!-- Error State -->
		<div v-else-if="error" class="flex flex-col items-center justify-center gap-4 py-32">
			<p class="text-red-500">Failed to load server data</p>
			<UiButton @click="() => navigateTo('/dashboard')" variant="secondary">
				<ArrowLeft class="w-4 h-4 mr-2" />
				Back to Servers
			</UiButton>
		</div>

		<!-- Content -->
		<template v-else-if="guildData">
			<!-- Hero Banner -->
			<div class="relative w-full h-80 bg-neutral-900 border-b border-neutral-800 overflow-hidden group">
				<!-- Animated Gradient Background -->
				<div class="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-neutral-900 to-purple-900/20 opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
				<div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
				
				<div class="absolute bottom-0 left-0 w-full">
					<div class="flex items-end gap-8 max-w-7xl mx-auto px-8 pb-10">
						<!-- Server Icon -->
						<div class="relative group/icon">
							<div class="w-40 h-40 rounded-3xl bg-neutral-800 ring-8 ring-neutral-950 overflow-hidden shadow-2xl transform group-hover/icon:scale-105 transition-transform duration-300">
								<img
									v-if="getGuildIconUrl(guildData)"
									:src="getGuildIconUrl(guildData)"
									:alt="guildData.name"
									class="w-full h-full object-cover"
								/>
								<div v-else class="flex items-center justify-center w-full h-full bg-neutral-800">
									<Shield class="w-16 h-16 text-neutral-600" />
								</div>
							</div>
							<div class="absolute -bottom-2 -right-2 bg-neutral-950 rounded-full p-2 ring-4 ring-neutral-950" title="Server Owner" v-if="guildData.owner">
								<Crown class="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
							</div>
						</div>

						<!-- Server Info -->
						<div class="flex flex-col gap-3 mb-4 flex-1">
							<div class="flex items-center gap-4">
								<h1 class="text-5xl font-black text-white tracking-tight drop-shadow-lg">{{ guildData.name }}</h1>
								<span v-if="guildData.owner" class="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20 uppercase tracking-wider backdrop-blur-sm">Owner</span>
							</div>
							<div class="flex items-center gap-6 text-neutral-300 font-medium">
								<div class="flex items-center gap-2 bg-neutral-950/30 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5">
									<Clock class="w-4 h-4 text-blue-400" />
									<span class="text-sm">Joined {{ new Date().toLocaleDateString() }}</span>
								</div>
								<div class="flex items-center gap-2 bg-neutral-950/30 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5">
									<span class="text-sm font-mono opacity-70">ID: {{ guildData.id }}</span>
								</div>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex gap-3 mb-4">
							<UiButton variant="secondary" size="lg" class="bg-neutral-950/50 backdrop-blur border-neutral-700 hover:bg-neutral-900 hover:text-white transition-all">
								<Settings class="w-5 h-5 mr-2" />
								Settings
							</UiButton>
						</div>
					</div>
				</div>
			</div>

			<div class="max-w-7xl mx-auto w-full p-8 flex flex-col gap-8">
				<!-- Stats Bar -->
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div
						v-for="stat in stats"
						:key="stat.label"
						class="flex items-center gap-4 p-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 transition-all group"
					>
						<div :class="['p-3 rounded-xl transition-colors', stat.bg, 'group-hover:scale-110 duration-300']">
							<component :is="stat.icon" :class="['w-6 h-6', stat.color]" />
						</div>
						<div class="flex flex-col">
							<span class="text-2xl font-bold text-white tracking-tight">{{ stat.value }}</span>
							<span class="text-xs font-medium text-neutral-500 uppercase tracking-wider">{{ stat.label }}</span>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<!-- Main Content (Left) -->
					<div class="lg:col-span-2 flex flex-col gap-8">
						<!-- Recent Activity Section -->
						<div class="flex flex-col gap-6">
							<div class="flex items-center justify-between">
								<h2 class="text-xl font-bold flex items-center gap-2">
									<Activity class="w-5 h-5 text-blue-500" />
									Recent Activity
								</h2>
								<UiButton variant="ghost" size="sm" class="text-neutral-400 hover:text-white">View All</UiButton>
							</div>

							<!-- Activity Timeline -->
							<div class="relative pl-4 space-y-8">
								<!-- Vertical Line -->
								<div class="absolute left-[27px] top-4 bottom-4 w-px bg-neutral-800"></div>

								<!-- Coming Soon State -->
								<div class="relative pl-12">
									<div class="absolute left-0 top-0 p-2 rounded-full bg-neutral-900 border border-neutral-800 z-10">
										<Clock class="w-5 h-5 text-neutral-500" />
									</div>
									<div class="flex flex-col gap-2 p-6 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30">
										<div class="flex items-center gap-3">
											<span class="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">Coming Soon</span>
										</div>
										<p class="text-neutral-400">
											Activity tracking is currently being implemented. Soon you'll be able to see all server events here in real-time.
										</p>
									</div>
								</div>

								<!-- Placeholder Items for Visual Structure -->
								<div class="relative pl-12 opacity-30 blur-[1px] select-none pointer-events-none">
									<div class="absolute left-0 top-0 p-2 rounded-full bg-neutral-900 border border-neutral-800 z-10">
										<Users class="w-5 h-5 text-neutral-500" />
									</div>
									<div class="flex flex-col gap-1 pt-1.5">
										<div class="flex items-center gap-2">
											<span class="font-medium text-white">New Member Joined</span>
											<span class="text-xs text-neutral-500">2 hours ago</span>
										</div>
										<p class="text-sm text-neutral-400">User <span class="text-blue-400">@alex_dev</span> joined the server</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Sidebar (Right) -->
					<div class="flex flex-col gap-6">
						<!-- Quick Actions -->
						<div class="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 flex flex-col gap-4">
							<h3 class="text-sm font-bold text-neutral-500 uppercase tracking-wider">Quick Actions</h3>
							<div class="grid grid-cols-1 gap-2">
								<button class="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800 transition-colors text-left group">
									<div class="p-2 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500/20 transition-colors">
										<Shield class="w-4 h-4" />
									</div>
									<div class="flex flex-col">
										<span class="font-medium text-sm">Moderation</span>
										<span class="text-xs text-neutral-500">Manage bans & kicks</span>
									</div>
									<ChevronRight class="w-4 h-4 ml-auto text-neutral-600 group-hover:text-neutral-400" />
								</button>
								<button class="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800 transition-colors text-left group">
									<div class="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 group-hover:bg-yellow-500/20 transition-colors">
										<Zap class="w-4 h-4" />
									</div>
									<div class="flex flex-col">
										<span class="font-medium text-sm">Plugins</span>
										<span class="text-xs text-neutral-500">Configure addons</span>
									</div>
									<ChevronRight class="w-4 h-4 ml-auto text-neutral-600 group-hover:text-neutral-400" />
								</button>
								<button class="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800 transition-colors text-left group">
									<div class="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
										<Users class="w-4 h-4" />
									</div>
									<div class="flex flex-col">
										<span class="font-medium text-sm">Members</span>
										<span class="text-xs text-neutral-500">View user list</span>
									</div>
									<ChevronRight class="w-4 h-4 ml-auto text-neutral-600 group-hover:text-neutral-400" />
								</button>
							</div>
						</div>

						<!-- Server Features -->
						<div v-if="guildData.features && guildData.features.length > 0" class="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 flex flex-col gap-4">
							<h3 class="text-sm font-bold text-neutral-500 uppercase tracking-wider">Enabled Features</h3>
							<div class="flex flex-wrap gap-2">
								<span
									v-for="feature in guildData.features.slice(0, 5)"
									:key="feature"
									class="px-2 py-1 text-[10px] font-medium rounded-md bg-neutral-800 text-neutral-400 border border-neutral-700"
								>
									{{ feature.replace(/_/g, ' ') }}
								</span>
								<span v-if="guildData.features.length > 5" class="px-2 py-1 text-[10px] font-medium rounded-md bg-neutral-800 text-neutral-500 border border-neutral-700">
									+{{ guildData.features.length - 5 }} more
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
