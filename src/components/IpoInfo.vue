<script setup>
	import axios from 'axios'
	const props = defineProps(['id'])
	const ipo = ref({})

	onMounted(async() => {
		ipo.value = await axios.get('https://droplet.netserve.in/ipos/'+props.id).then(r => r.data)
	})
</script>
<template>
	<div class="bg-orange-200"><pre>{{ ipo }}</pre></div>
</template>
