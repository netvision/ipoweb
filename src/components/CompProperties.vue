<script setup>
	import axios from 'axios'
	const props = defineProps(['id', 'note'])
	const properties = ref([])
	const getProperties = async() => {
		let res = await axios.get('https://droplet.netserve.in/comp-property?expand=type0&filter[ipoId][eq]='+props.id).then(r => r.data)
		console.log(res)
		properties.value = res.reduce((group, item) => {
		const key = item.type0.title;
		if(!group[key]){
			group[key] = []
		}
		group[key].push(item)
		return group
	}, {})
	}
	getProperties()
</script>
<template>
	<h3 class="text-xl font-sans font-bold mt-4 mb-2">Properties</h3>
	<div class="mb-12 md:mb-0" v-for="(item, k) in properties" :key="k">
		<h4 class="text-lg font-sans mt-2 font-bold">{{ k }}</h4>
		<ul v-if="item.length > 0" class="list-disc list-inside">
			<li v-for="it in item" class="w-full border-b-1 border-neutral-100 border-opacity-100 py-2 dark:border-opacity-50 ml-5"><span class="font-bold">{{ it.title }}</span><span v-if="it.location && it.location != 'NA'"><br />{{it.location}}<br /></span><span v-if="it.city && it.city != 'NA'">{{it.city}}, </span><span v-if="it.state && it.state != 'NA'">{{it.state}}</span></li>
		</ul>
	</div>
</template>
