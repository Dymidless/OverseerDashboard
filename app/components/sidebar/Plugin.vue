<script lang="ts" setup>
	const { item } = defineProps<SidebarPluginComponentProps>();
	const route = useRoute();

	interface SidebarPluginComponentProps {
		item: SidebarGroupItem;
	}
</script>

<template>
	<a
		class="flex gap-2 items-center h-7 text-sm transition-colors cursor-pointer text-neutral-400 hover:text-neutral-50"
	>
		<component class="size-5" :is="item.icon"/>
		{{ item.name }}
	</a>
</template>
