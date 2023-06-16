<script setup>
	const props = defineProps(['content'])
</script>
<template>
	<div>
		<h3 class="text-2xl font-sans font-bold m-4 p-4">SWOT</h3>
		<div class="grid gap-4 text-center md:grid-cols-4 items-stretch lg:gap-12 px-8">
			<div class="p-4 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
				<h3 class="text-xl font-bold text-left">Strengths<span class="text-green-300 px-8">{{ props.content.strengths_score }}</span></h3>
				<div v-html="props.content.strengths_html" class="editor text-left"></div>
			</div>
			<div class="p-4 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
				<h3 class="text-xl font-bold text-left">Weaknesses<span class="text-red-300 px-8">{{ props.content.weaknesses_score }}</span></h3>
				<div v-html="props.content.weaknesses_html" class="editor text-left"></div>
			</div>
			<div class="p-4 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
				<h3 class="text-xl font-bold text-left">Opportunities<span class="text-green-300 px-8">{{ props.content.opportunities_score }}</span></h3>
				<div v-html="props.content.opportunities_html" class="editor text-left"></div>
			</div>
			<div class="p-4 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
				<h3 class="text-xl font-bold text-left">Threats<span class="text-red-300 px-8">{{ props.content.threats_score }}</span></h3>
				<div v-html="props.content.threats_html" class="editor text-left"></div>
			</div>
		</div>
	</div>
</template>
