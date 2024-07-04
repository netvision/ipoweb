<script setup>
import axios from 'axios';
import { Tabs, Tab } from 'flowbite-vue';
const props = defineProps(['ipo_id', 'quota', 'price'])
const anchors = ref([])
const activeTab = ref()
const amtInCr = (amt) => {
	const croresValue = amt / 10000000;

  // Round to 2 decimal places
  const roundedValue = Math.round(croresValue * 100) / 100;

  return roundedValue;
}
onMounted(() =>{
	axios.get("https://api.ipoinbox.com/ipo-anchor?ipo_id="+props.ipo_id+"&expand=anchor").then(r => {
		anchors.value = r.data.map(a => ({
			...a,
			perc: (a.no_of_equity_shares * 100 / props.quota).toFixed(2) + '%',
			amt: amtInCr(a.no_of_equity_shares * props.price)
		})).sort((a, b) => b.no_of_equity_shares - a.no_of_equity_shares)
	})
	activeTab.value = 'anchors'
	console.log(anchors.value)
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
							<th class="border border-gray-100 p-2">Amt in Cr</th>
							<th class="border border-gray-100 p-2">Percent of Quota</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="anc in anchors" :key="anc.id">
							<td class="border border-gray-100 p-2">{{ anc.anchor.name }}</td>
							<td class="border border-gray-100 p-2">{{ anc.no_of_equity_shares }}</td>
							<td class="border border-gray-100 p-2">{{ anc.amt }}</td>
							<td class="border border-gray-100 p-2">{{ anc.perc }}</td>
						</tr>
					</tbody>
				</table>
				<div v-else>No Data</div>
			</Tab>

		</Tabs>

	</div>
</template>
