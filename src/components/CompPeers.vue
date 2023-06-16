<script setup>
	const props = defineProps(['content'])


</script>
<template>
	<div class="pr-4">
		<h3 class="text-2xl font-sans font-bold m-4 p-4">Peers Comparision</h3>
		<table class="peers table-fixed w-auto border mx-8" v-if="props.content && props.content.row.length > 0">
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
