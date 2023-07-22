<script setup>
	const props = defineProps(['content'])
</script>
<template>
	<div class="bg-gradient-to-b from-orange-200  to-orange-100">
		<h1 class="mt-5 ml-5 text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
                    Peers Comparision
		</h1>

		<div class="flex mx-auto ml-5 mt-2 mb-5">
			<span class="inline-block w-40 h-1 bg-blue-500 rounded-full"></span>
			<span class="inline-block w-3 h-1 mx-1 bg-blue-500 rounded-full"></span>
			<span class="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
		</div>
		<table class="peers table-fixed w-auto border mx-4" v-if="props.content && props.content.row.length > 0">
			<thead class="bg-gray-200">
				<tr class="border border-gray-400">
					<th class="border border-gray-400 p-2" v-for="(col, i) in props.content.col" :key="i">{{ col.label }}</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border border-gray-400" v-for="(r, i) in props.content.row" :key="i">
					<td class="border border-gray-400 p-2" v-for="(key, i) in r" :key="i">{{ key }}</td>
				</tr>
			</tbody>
		</table>
		<div class="editor" v-html="props.content.htmlNotes" />
	</div>

</template>
<style>

table.peers thead tr th{
	width:auto
}
table.peers thead tr th:first-child{
	width: 25%;
}
</style>
