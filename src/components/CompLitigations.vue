<script setup>
	import axios from 'axios'
	const props = defineProps(['id', 'note'])
	const litigations = ref([])
	const getLitigations = async() => {
		let res = await axios.get('https://api.ipoinbox.com/comp-litigation?expand=type&filter[ipoId][eq]='+props.id).then(r => r.data)
		console.log(res)
		litigations.value = res.reduce((group, item) => {
		const key = item.type.title;
		if(!group[key]){
			group[key] = []
		}
		group[key].push(item)
		return group
	}, {})
	}
	getLitigations()
</script>
<template>
	<div v-if="Object.keys(litigations).length > 0">
	<h3 class="text-xl font-['Lugrasimo'] text-orange-800 font-bold mt-4 mb-2">Litigations</h3>
	<div class="mb-12 md:mb-0" v-for="(item, k) in litigations" :key="k">
		<h4 class="text-lg font-sans mt-2 font-bold">{{ k }}</h4>
		<ul v-if="item.length > 0" class="list-disc list-inside">
			<li v-for="it in item" class="w-full border-b-1 border-neutral-100 border-opacity-100 py-2 dark:border-opacity-50 ml-5">{{ it.details }}  <span class="block">Amount Involved: &#8377;{{it.amount_involved}}</span> </li>
		</ul>
	</div>
	</div>
</template>
