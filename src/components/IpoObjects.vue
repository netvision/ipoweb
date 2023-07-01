<script setup>
import axios from 'axios';

const props = defineProps(['id'])

const objects = ref([])

const amtInCr = (amt) => {
	const croresValue = amt / 10000000;

  // Round to 2 decimal places
  const roundedValue = Math.round(croresValue * 100) / 100;

  return roundedValue;
}

const getObjects = async() => {
	objects.value = await axios.get('https://droplet.netserve.in/ipo-object?expand=title&filter[ipoId][eq]='+props.id).then(r => r.data)
	//console.log(res)
}
getObjects()
</script>
<template>

	<div v-if="objects.length > 0" class="border-r md:border-r-0 bg-orange-200 p-3 rounded-lg flex-1">
	<h3 class="text-xl font-semibold bg-gradient-to-r from-orange-500 to-purple-500 text-transparent bg-clip-text">Objects of the IPO</h3>

    <table class="table-fixed w-full border">
		<thead class="bg-orange-200">
		<tr class="border border-gray-100">
			<th class="border border-gray-100 text-left p-2" style="width:70%">Purpose</th>
			<th class="border border-gray-100 p-2">Amount</th>
		</tr>
		</thead>
		<tr v-for="obj in objects" :key="obj.id">
			<td class="border border-gray-100 p-2">{{ obj.title?.title }}<span class="block text-sm italic">{{ obj.details }}</span></td>
			<td class="border border-gray-100 p-2">&#8377;{{ amtInCr(obj.amount) }} Cr.</td>
		</tr>

    </table>
	</div>

</template>
