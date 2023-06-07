<script setup>
import axios from 'axios'
const props = defineProps(['id'])
const holdings = ref([])
const getClients = async() => {
	let res = await axios.get('https://droplet.netserve.in/comp-holding?filter[ipoId][eq]='+props.id).then(r => r.data)
	console.log(res)
	holdings.value = res
}
getClients()
</script>
<template>
	 <h3 class="text-xl font-sans font-bold mt-4">Holdings</h3>
	 <pre>{{ holdings }}</pre>
</template>
