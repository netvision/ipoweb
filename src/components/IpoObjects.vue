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
	//console.log(objects.value)
}
getObjects()
</script>
<template>

	<div v-if="objects.length > 0" class="border-r md:border-r-0 bg-orange-200 p-3 rounded-lg flex-1">
	<h3 class="text-lg font-['Lugrasimo'] text-orange-800 font-bold">Objects of the IPO</h3>
	<ol class="list-decimal pl-5">
		<li v-for="obj in objects" :key="obj.id" class="border-b">
			<div class="flex gap-2 m-2"><span class="px-5">{{ obj.title?.title }}<span class="block text-sm italic">{{ obj.details }}</span></span><span v-if="obj.amount && obj.amount > 0" class="font-bold flex-grow justify-end text-right">&#8377;{{ amtInCr(obj.amount) }}Cr.</span></div>
		</li>
	</ol>

	</div>

</template>
