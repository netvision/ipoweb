<script setup>
import axios from 'axios';

const props = defineProps(['id'])

const promoters = ref()

const getPromoters = async() => {
	let res = await axios.get('https://droplet.netserve.in/promoter?ipo_id='+props.id).then(r => r.data)
	console.log(res)
}
getPromoters()
</script>
<template>
	<h3 class="text-2xl font-sans font-bold m-4 p-4">Promoters</h3>
</template>
