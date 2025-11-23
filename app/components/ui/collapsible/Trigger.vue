<script lang="ts" setup>
	const open = inject<Ref<boolean>>("collapsibleOpen");
	const toggle = inject<() => void>("toggleCollapsible");

	if (!(open && toggle)) {
		throw new Error("'CollapsibleTrigger' must be wrapped in a 'CollapsibleRoot' component");
	}
</script>

<template>
	<button class="h-5 cursor-pointer" @click="toggle">
		<slot :open="open"/>
	</button>
</template>
