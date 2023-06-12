<script setup>
import axios from 'axios';

const props = defineProps(['id'])

const objects = ref()

const getObjects = async() => {
	let res = await axios.get('https://droplet.netserve.in/ipo-object?filter[ipoId][eq]='+props.id).then(r => r.data)
	console.log(res)
}
getObjects()
</script>
<template>
	<h3 class="text-2xl font-sans font-bold m-4 p-4">Objects of the IPO</h3>
</template>
