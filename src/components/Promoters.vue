<script setup>
import axios from 'axios';
const props = defineProps(['id'])
const promoters = ref([])
const holdings = ref([])
const getPromoters = async() => {
	let res = await axios.get('https://droplet.netserve.in/promoter?ipo_id='+props.id).then(r => r.data)
	if(res.length > 0) {
		var TotalpreOffer = 0
		var TotalprePercent = 0
		var TotalpostOffer = 0
		var TotalpostPercent = 0
		res.forEach(promoter => {
			TotalpreOffer += promoter.pre_offer_shares
			TotalprePercent += promoter.pre_offer_percentage
			TotalpostOffer += promoter.post_offer_shares
			TotalpostPercent += promoter.post_offer_percentage
			let pr = {name: promoter.name, type: promoter.type, photo: promoter.photo, description: promoter.description}
        	promoters.value.push(pr)

			if(promoter.pre_offer_shares > 0) {
            	let holding = {name: promoter.name, preOffer: promoter.pre_offer_shares, prePercent: promoter.pre_offer_percentage, postOffer: promoter.post_offer_shares, postPercent: promoter.post_offer_percentage}
            	holdings.value.push(holding)
        	}
		})

		if(holdings.value.length > 1) {
			holdings.value.push({name: 'Total', preOffer: TotalpreOffer, prePercent: TotalprePercent.toFixed(2), postOffer: TotalpostOffer, postPercent: TotalpostPercent.toFixed(2)})
		}
	}
}
getPromoters()

</script>
<template>
<div v-if="promoters && promoters.length > 0" class="bg-gradient-to-b from-orange-200  to-orange-100">
		<h1 class="text-2xl mx-5 font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
                    Promoters
		</h1>

		<div class="flex mx-auto my-2 pl-5">
			<span class="inline-block w-40 h-1 bg-blue-500 rounded-full"></span>
			<span class="inline-block w-3 h-1 mx-1 bg-blue-500 rounded-full"></span>
			<span class="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
		</div>
	<div v-if="promoters && promoters.length > 0" class="mx-5 flex flex-row flex-nowrap gap-2 overflow-x-auto scrollbar-hide">
		<div v-for="(promoter, i) in promoters" :key="i"
			class="w-[400px] flex-none rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 md:max-w-xl md:flex-row">
			<img
				class="h-48 p-4"
				:src="promoter.photo"
				alt="" />
			<div class="flex flex-col justify-start p-6">
				<p class="text-xs text-neutral-500 dark:text-neutral-300 text-right">
				{{ promoter.type }}
				</p>
				<h5
				class="mb-2 text-lg text-left font-medium text-neutral-800 dark:text-neutral-50">
				{{ promoter.name }}
				</h5>

				<div class="mb-4 text-sm text-neutral-600 dark:text-neutral-200 text-left editor" v-html="promoter.description">

				</div>

			</div>
		</div>
	</div>
	<div v-if="holdings.length > 0" class="text-xl font-bold m-5 mb-2" style="font-family: 'Josefin Sans', sans-serif;">Promoters Shareholding Pattern</div>
	<div v-if="holdings.length > 0" class="px-8">
		<table class="table-fixed w-full border">
                <thead class="bg-gray-200">
                <tr class="border border-gray-400">
                    <th rowspan="2" class="border border-gray-400">Name</th>
                    <th colspan="2" class="border border-gray-400 text-center">Pre Offer</th>
                    <th colspan="2" class="border border-gray-400 text-center">Post Offer</th>
                </tr>
                <tr class="tw-border tw-border-gray-400">
                    <th class="border border-gray-400">Eq. Shares</th>
                    <th class="border border-gray-400">Percent</th>
                    <th class="border border-gray-400">Eq. Shares</th>
                    <th class="border border-gray-400">Percent</th>
                </tr>
                </thead>
                <tbody class="">
                    <tr v-for="holding in holdings" :key="holding.name" class="border border-gray-400">
                        <td class="px-4 py-2 text-gray-900 border border-gray-400">{{holding.name}}</td>
                        <td class="px-4 py-2 text-gray-700 border border-gray-400">{{holding.preOffer}}</td>
                        <td class="px-4 py-2 text-gray-700 border border-gray-400">{{holding.prePercent}}</td>
                        <td class="px-4 py-2 text-gray-700 border border-gray-400">{{holding.postOffer}}</td>
                        <td class="px-4 py-2 text-gray-700 border border-gray-400">{{holding.postPercent}}</td>
                    </tr>
                </tbody>
            </table>
	</div>
</div>
</template>
