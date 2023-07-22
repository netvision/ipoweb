<script setup>
	const props = defineProps(['content'])
</script>
<template>

	<div class="bg-gradient-to-b from-orange-200  to-orange-100">
		<h1 class="mt-5 ml-5 text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
                    Company Financials
		</h1>

		<div class="flex mx-auto ml-5 my-2">
			<span class="inline-block w-40 h-1 bg-blue-500 rounded-full"></span>
			<span class="inline-block w-3 h-1 mx-1 bg-blue-500 rounded-full"></span>
			<span class="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
		</div>
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
</div>
</template>
