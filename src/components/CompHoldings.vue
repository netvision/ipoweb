<script setup>
import axios from 'axios'
const props = defineProps(['id'])
const holdings = ref([])
onMounted(async() => {
	let res = await axios.get('https://droplet.netserve.in/comp-holding?filter[ipoId][eq]='+props.id).then(r => r.data)
	holdings.value = res.reduce((group, item) => {
		const key = item.holding_type;
		if(!group[key]){
			group[key] = []
		}
		group[key].push(item)
		return group
	}, {})

	console.log(holdings.value)
})
</script>
<template>
	 <div v-if="Object.keys(holdings).length > 0">
	 <h3 class="text-xl font-sans font-bold mt-4 mb-2">Holdings</h3>
		<div class="mb-12 md:mb-0" v-for="(item, k) in holdings" :key="k">
			<h4 class="text-lg font-sans mt-2 font-bold">{{ k }}</h4>
			<ul v-if="item.length > 0" class="list-disc list-inside">
				<li v-for="it in item" class="w-full border-b-1 border-neutral-100 border-opacity-100 py-2 dark:border-opacity-50 ml-5">{{ it.name }}</li>
			</ul>
		</div>
	</div>
</template>
