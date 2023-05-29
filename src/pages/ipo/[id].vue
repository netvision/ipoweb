<script setup>
import axios from 'axios';
import Topbar from '@/components/Topbar.vue';
import { useRoute } from 'vue-router'
const route = useRoute();
const ipoId = ref(route.params.id.split('-')[0]);
const ipo = ref({})
const title = ref(route.params.id.split('-')[1])
useHead({
	title: title.value
})
onMounted(async() => {
	ipo.value = await axios.get('https://droplet.netserve.in/ipos/'+ipoId.value).then(r => r.data)
})
</script>
<template>
	<div class="bg-orange-100 h-screen">
    	<Topbar />
		<div class="w-full h-80 relative bg-contain" :style="'background-image: url('+ipo.header_img+')'">
			<div class="absolute inset-0 flex items-center justify-center">
				<img :src="ipo.company_logo" class="h-20 object-contain bg-white drop-shadow-lg" />
			</div>
		</div>
		<pre>{{ ipo }}</pre>
 	</div>
</template>
