<script setup>
import axios from "axios"

useHead({
	title: 'Other Pages',
});
const data = ref([])

const update = async(d) => {
	const res = await axios.patch('https://api.ipoinbox.com/promoters/'+d.id, {photo: d.new_photo})
	console.log(res.data)
	if(res.status === 200){
		data.value.splice(data.value.findIndex(obj => obj.ipo_id === d.ipo_id), 1);
	}
}

onMounted(async() =>{
	const res = await axios.get('https://api.ipoinbox.com/promoters?fields=id,photo').then(r => r.data)
	data.value = res.filter(obj => obj.photo !== null && obj.photo.includes('https://')).map(obj => {

		return {
			...obj,
			new_photo: obj.photo.replace('https://droplet.netserve.in/','https://api.ipoinbox.com/')
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
