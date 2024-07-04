<script setup>
import axios from 'axios'
const props = defineProps(['id'])
const clients = ref([])
const getClients = async() => {
	let res = await axios.get('https://api.ipoinbox.com/comp-client?filter[ipoId][eq]='+props.id).then(r => r.data)
	console.log(res)
	clients.value = res
}
getClients()

</script>
<template>
	<div v-if="clients.length > 0">
	<h3 class="text-xl font-bold mt-4 font-['Lugrasimo'] text-orange-800">Clientele</h3>
	<div class="grid gap-4 text-center md:grid-cols-4 items-end lg:gap-12" v-if="clients.length > 0">
		<div class="mb-12 md:mb-0" v-for="client in clients" :key="client.id">
			<div class="mb-6 flex justify-center">
			<img v-if="client.logo"
				:src="client.logo"
				class="w-32 shadow-lg dark:shadow-black/30" />
			</div>
			<h5 class="mb-4 text-xl font-semibold">{{ client.name }}</h5>
		</div>
	</div>
	</div>
</template>
