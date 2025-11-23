<script lang="ts" setup>
	const open = inject<Ref<boolean>>("collapsibleOpen");

	if (!open) {
		throw new Error("'CollapsibleContent' must be wrapped in a 'CollapsibleRoot' component");
	}
</script>

<template>
	<div v-if="open">
		<slot/>
	</div>
</template>
