<script setup>
import axios from "axios";
const props = defineProps(['id', 'total'])
const quotas = ref([])
const getQuota = async() => {
	let res = await axios.get('https://droplet.netserve.in/ipo-cat-quotas?expand=cat&ipo_id='+props.id).then(r => r.data)
  	let net = res.reduce((acc, r) => {
       return ([4,5,7].includes(r.cat_id)) ? acc - r.quota : acc
    }, props.total)

	if(res.length > 0) {
    quotas.value = res.filter(qt => qt?.quota > 0).map(cat => {

      let perc = (![4,5,7].includes(cat?.cat_id) && net > 0) ? cat?.quota * 100 / net: 0

		return{
			...cat,
			perc: (perc > 0) ? perc.toFixed(2)+'%' : ''
			}

    })
  }
}
getQuota()

</script>
<template>
<div>
<h3 class="text-xl">Categories Quota and Discount</h3>
<table class="table-fixed w-full border">
	<thead class="bg-orange-200">
		<tr class="border border-gray-400">
			<th class="border border-gray-400 text-left p-2">Category</th>
			<th class="border border-gray-400 p-2">Quota</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="quota in quotas" :key="quota.id">
			<td class="border border-gray-400 p-2">{{ quota.cat.short_name }}</td>
			<td class="border border-gray-400 p-2">{{ quota.quota }} <span class="block text-sm italic" v-if="quota.perc">({{ quota.perc }})</span><span class="block text-sm italic" v-if="quota.discount">Discount: {{ quota.discount }}</span></td>
		</tr>
	</tbody>
</table>
</div>
</template>
