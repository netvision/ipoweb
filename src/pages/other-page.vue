<script setup>
import axios from "axios"

useHead({
	title: 'Other Pages',
});
const data = ref([])

const update = async(d) => {
	const res = await axios.patch('https://api.ipoinbox.com/ipos/'+d.ipo_id, {anchors_pdf: d.new_anchor})
	if(res.status === 200){
		data.value.splice(data.value.findIndex(obj => obj.ipo_id === d.ipo_id), 1);
	}
}

onMounted(async() =>{
	const res = await axios.get('https://api.ipoinbox.com/ipos?fields=ipo_id,anchors_pdf').then(r => r.data)
	data.value = res.filter(obj => obj.anchors_pdf !== null && obj.anchors_pdf.includes('https://')).map(obj => {

		return {
			...obj,
			new_anchor: obj.anchors_pdf.replace('https://droplet.netserve.in/','')
		}
	})
})
</script>

<template>
	<div>
	<ul>
	{{ data.length }}
		<li v-for="d in data" class="mb-2 border-b-blue-800 border-b-2">
			<pre>{{ d }}</pre>
			<button @click="update(d)">Save</button>
		</li>
	</ul>
	</div>
</template>

<style scoped></style>

<route lang="yaml">
name: other-page
</route>
