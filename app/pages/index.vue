<template>
	<main class="flex justify-center items-center w-full h-dvh">
		<div class="flex flex-col gap-4 p-8 rounded-lg border min-w-100 border-neutral-800 bg-neutral-900">
			<h1 class="text-3xl font-extrabold text-center">Overseer</h1>
			<UiSeparator/>
			<div class="flex flex-col gap-4">
				<UiButton href="/dashboard" is="a" variant="secondary">Go to Dashboard</UiButton>
				<UiButton variant="destructive">Logout</UiButton>
			</div>
		</div>
	</main>
</template>
