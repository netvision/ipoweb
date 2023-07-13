<script setup>
	import { AccordionPanel, AccordionHeader, AccordionContent } from 'flowbite-vue'
	const props = defineProps(['content'])
</script>
<template>

		<h3 class="mb-3 mt-5 text-2xl text-gray-800 animate">Company Financials</h3>
		<div class="grid gap-4 text-center md:grid-cols-2 items-stretch lg:gap-12 px-4">
			<div>
				<h3 class="text-xl text-left font-bold my-4 font-[Comfortaa]" >Profit &amp; Loss Statement</h3>
				<table class="table-fixed w-full border" v-if="props.content">
                	<thead class="bg-gray-200">
                		<tr class="border border-gray-400">
							<th class="border border-gray-400" v-for="(col, i) in props.content.pl.columns" :key="i">{{ col.label }}</th>
						</tr>
					</thead>
					<tbody>
						<tr class="border border-gray-400" v-for="(row, i) in props.content.pl.rows" :key="i">
							<td class="border border-gray-400" v-for="(key, i) in row" :key="i">{{ key }}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div>
				<h3 class="text-xl text-left font-bold my-4 font-[Comfortaa]">Balance Sheet</h3>
				<table class="table-fixed w-full border" v-if="props.content">
                	<thead class="bg-gray-200">
                		<tr class="border border-gray-400">
							<th class="border border-gray-400" v-for="(col, i) in props.content.bs.columns" :key="i">{{ col.label }}</th>
						</tr>
					</thead>
					<tbody>
						<tr class="border border-gray-400" v-for="(row, i) in props.content.bs.rows" :key="i">
							<td class="border border-gray-400" v-for="(key, i) in row" :key="i">{{ key }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div v-if="props.content" class="editor" v-html="props.content.html_note"></div>

</template>
