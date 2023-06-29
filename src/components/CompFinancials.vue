<script setup>
	import { AccordionPanel, AccordionHeader, AccordionContent } from 'flowbite-vue'
	const props = defineProps(['content'])
</script>
<template>
	<accordion-panel>
      <accordion-header class="text-base">Company Financials</accordion-header>
      <accordion-content>
		<h3 class="text-2xl font-sans font-bold m-4 p-4">Company Financials</h3>
		<div class="grid gap-4 text-center md:grid-cols-2 items-stretch lg:gap-12 px-8">
			<div>
				<h3 class="text-xl text-left font-bold m-4 p-4" style="font-family: 'Josefin Sans', sans-serif;">Profit & Loss Statement</h3>
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
				<h3 class="text-xl text-left font-bold m-4 p-4" style="font-family: 'Josefin Sans', sans-serif;">Balance Sheet</h3>
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
		</accordion-content>
		</accordion-panel>
</template>
