<script setup>
import axios from 'axios';
import { Tabs, Tab } from 'flowbite-vue';
const props = defineProps(['ipo_id', 'quota'])
const anchors = ref([])
const prefHolders = ref([])
const activeTab = ref()
console.log(props.quota)
onMounted(() =>{
	axios.get("https://droplet.netserve.in/ipo-anchor?ipo_id="+props.ipo_id+"&expand=anchor").then(r => {
		anchors.value = r.data.map(a => ({
			...a,
			perc: (a.no_of_equity_shares * 100 / props.quota).toFixed(2) + '%'
		})).sort((a, b) => b.no_of_equity_shares - a.no_of_equity_shares)
	})

	axios.get("https://droplet.netserve.in/ipo-pref-allotment?ipo_id="+props.ipo_id+"&expand=allotee").then(r => {
		prefHolders.value = r.data.sort((a, b) => b.qty_of_shares - a.qty_of_shares)
	})
	activeTab.value = 'anchors'
})
</script>
<template>
	<div>
		<Tabs variant="underline" v-model="activeTab" class="p-5 max-h-96 overflow-scroll scroll-m-1">
			<Tab name="anchors" title="Anchors">
				<table class="table-fixed w-full border" v-if="anchors.length > 0">
					<thead class="bg-orange-200">
						<tr class="border border-gray-100">
							<th class="border border-gray-100 text-left p-2">Name</th>
							<th class="border border-gray-100 p-2">No. of Equity Shares</th>
							<th class="border border-gray-100 p-2">Percent of Quota</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="anc in anchors" :key="anc.id">
							<td class="border border-gray-100 p-2">{{ anc.anchor.name }}</td>
							<td class="border border-gray-100 p-2">{{ anc.no_of_equity_shares }}</td>
							<td class="border border-gray-100 p-2">{{ anc.perc }}</td>
						</tr>
					</tbody>
				</table>
				<div v-else>No Data</div>
			</Tab>
			<Tab name="prefHolders" title="Prefrential Share Holders">

				<table class="table-fixed w-full border" v-if="prefHolders.length > 0">
					<thead class="bg-orange-200">
						<tr class="border border-gray-100">
							<th class="border border-gray-100 text-left p-2">Name</th>
							<th class="border border-gray-100 text-left p-2">Type</th>
							<th class="border border-gray-100 p-2">No. of Equity Shares</th>
							<th class="border border-gray-100 p-2">Price</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="pref in prefHolders" :key="pref.id">
							<td class="border border-gray-100 p-2">{{ pref.allotee.name }}</td>
							<td class="border border-gray-100 p-2">{{ pref.category }}</td>
							<td class="border border-gray-100 p-2">{{ pref.qty_of_shares }}</td>
							<td class="border border-gray-100 p-2">&#8377;{{ pref.issued_price }}</td>
						</tr>
					</tbody>
				</table>
				<div v-else>No Data</div>
			</Tab>
		</Tabs>

	</div>
</template>
