<script setup>
import axios from 'axios';
import slider from "vue3-slider"
import { useRoute } from 'vue-router'
import { Tabs, Tab, Modal } from 'flowbite-vue';
const route = useRoute();
const ipoId = ref(route.params.id.split('-')[0]);
const ipo = ref({})
const title = ref(route.params.id.split('-')[1])
const totalOffer = ref(0)
const quotas = ref([])
const subscriptions = ref([])
const today = new Date()
const listing_data = ref({})
const activeTab = ref()
const minInvCat = ref()
const activeExch = ref()
const anchorModal = ref(false)
const showAnchors = () => anchorModal.value = "true"
const hideAnchors = () => anchorModal.value = "false"
useHead({
	title: title.value
})

const formatDate = (d) => {
	const date = new Date(d);
    return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
}

const minInvstment = ref({})

const amtInCr = (amt) => {
	const croresValue = amt / 10000000;

  // Round to 2 decimal places
  const roundedValue = Math.round(croresValue * 100) / 100;

  return roundedValue;
}

onMounted(async() => {
	ipo.value = await axios.get('https://droplet.netserve.in/ipos/'+ipoId.value+'?expand=registrar,sector,listings').then(r => r.data)

	let total = Number(ipo.value.fresh_issue) + Number(ipo.value.offer_for_sale)
	totalOffer.value = total
	let res = await axios.get('https://droplet.netserve.in/ipo-cat-quotas?expand=cat&ipo_id='+ipoId.value).then(r => r.data)
  	let net = res.reduce((acc, r) => {
       return ([4,5,7].includes(r.cat_id)) ? acc - r.quota : acc
    }, total)

	if(res.length > 0) {
	res.sort((a,b) => a.cat.cat_order - b.cat.cat_order)
    quotas.value = res.filter(qt => qt.quota > 0).map(cat => {
      let perc = (![4,5,7].includes(cat.cat_id) && net > 0) ? cat.quota * 100 / net: 0
		return{
			...cat,
			perc: (perc > 0) ? perc.toFixed(2)+'%' : ''
			}
    	})
  	}
	console.log(quotas.value)

	  if(quotas.value.length > 0) {
		let amt = ipo.value.lot_size * ipo.value.price_band_high
		if(ipo.value.ipo_type != 'SME'){
			minInvstment.value = [
				{
					category: 'Retail',
					lots: 1,
					shares: ipo.value.lot_size,
					amt: amt,
					app: Math.round(quotas.value.filter(cat => cat.cat_id === 3)[0].quota / ipo.value.lot_size)
				},
				{
					category: 'Small HNI',
					lots: Math.ceil(200000 / amt),
					shares: Math.ceil(200000 / amt) * ipo.value.lot_size,
					amt:  Math.ceil(200000 / amt) * amt,
					app: Math.round(quotas.value.filter(cat => cat.cat_id === 8)[0].quota / (Math.ceil(200000 / amt) * ipo.value.lot_size))
				},
				{
					category: 'Big HNI',
					lots: Math.ceil(1000000 / amt),
					shares: Math.ceil(1000000 / amt) * ipo.value.lot_size,
					amt:  Math.ceil(1000000 / amt) * amt,
					app: Math.round(quotas.value.filter(cat => cat.cat_id === 2)[0].quota / (Math.ceil(1000000 / amt) * ipo.value.lot_size))
				}
			]
		}
		else{
			minInvstment.value = [
				{
					category: 'Retail',
					lots: 1,
					shares: ipo.value.lot_size,
					amt: amt,
					app: Math.round(quotas.value.filter(cat => cat.cat_id === 3)[0].quota / ipo.value.lot_size)
				},
				{
					category: 'HNI',
					lots: Math.ceil(200000 / amt),
					shares: Math.ceil(200000 / amt) * ipo.value.lot_size,
					amt:  Math.ceil(200000 / amt) * amt,
					app: Math.round(quotas.value.filter(cat => cat.cat_id === 2)[0].quota / (Math.ceil(200000 / amt) * ipo.value.lot_size))
				},
			]
		}
		minInvCat.value = 'Retail'
	}

	  if(today >= new Date(ipo.value.open_date)){
		let logs = await axios.get('https://droplet.netserve.in/ipo-subscription-logs?ipo_id='+ipoId.value+'&expand=cat').then(r=>r.data)
		if(logs.length > 0){
			let subs = logs.reduce((group, item) => {
			const key = item.day;
			if(!group[key]){
				group[key] = {
					items: [],
					totalSubscriptions: 0
				};
			}
			let quota = quotas.value.filter(q => q.cat_id == item.cat_id)
			group[key].items.push({...item, quota: quota[0].quota})
			group[key].totalSubscriptions += item.subscription;
			return group
		}, {})
		activeTab.value = formatDate(Object.keys(subs).slice(-1))
		Object.values(subs).forEach(v => {
			if(v.items.filter(u => u.subscription > 0).length > 0){
				let items = v.items.sort((a,b) => a.cat.cat_order - b.cat.cat_order)
				subscriptions.value.push({items: items, totalsubs: v.totalSubscriptions})
			}
		})
		}
	  }
	  else console.log("Issue is not open yet")

	  if(ipo.value.listings.length > 0 && ipo.value.listings[0].listing_date){
		listing_data.value.bse = ipo.value.listings.filter(x => x.exchange === "BSE")[0]
		listing_data.value.nse = ipo.value.listings.filter(x => x.exchange === "NSE")[0]
		activeExch.value = (listing_data.value.nse) ? 'NSE' : 'BSE'
		if(listing_data.value.nse?.scrip_code != null){
			listing_data.value.nse.live = await axios.get('https://stockapi.ipoinbox.com/quote?symbol='+listing_data.value.nse.scrip_code.trim()).then(r => r.data)
		}
		if(listing_data.value.bse?.scrip_code != null){
			listing_data.value.bse.live = await axios.get('https://api.bseindia.com/BseIndiaAPI/api/getScripHeaderData/w?Debtflag=&seriesid=&scripcode='+listing_data.value.bse.scrip_code.trim()).then(r => r.data)
		}
		console.log(listing_data.value)
	  }
	  else console.log("the issue is not listed yet")

})
</script>
<template>
	<div class="bg-orange-100">
    	<Topbar />
		<div class="w-full h-80 relative bg-contain" :style="'background-image: url('+ipo.header_img+')'">
			<div class="absolute inset-0 flex items-center justify-center">
				<img :src="ipo.company_logo" class="h-20 object-contain bg-white drop-shadow-lg" />
			</div>
		</div>
		<div class="bg-orange-300 p-4 align-middle">
			<h2 class="text-4xl font-bold text-orange-700 dark:text-white">{{ ipo.company_name }}
				<span class="text-base"><sub>{{ (ipo.ipo_type == 'SME') ? 'SME' : 'IPO' }}</sub></span>
				<span class="mb-2 p-2"><a :href="ipo.company_url" target="_blank"><svg class="inline" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
<path d="M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z"></path>
</svg></a></span><span v-if="listing_data.nse && listing_data.nse.scrip_code != null">&#8377; {{ listing_data.nse?.live?.priceInfo.lastPrice }}</span><span v-else-if="listing_data.bse && listing_data.bse.scrip_code != null">&#8377; {{ listing_data.bse?.live?.CurrRate.LTP }}</span>
			</h2>
		</div>
		<div class="bg-orange-200 p-2 pl-4">
			<h3 class="text-base"><span v-if="ipo.registrar">Registrar: <a :href="ipo.registrar.url" target="_blank">{{ ipo.registrar.name }}</a></span><span class="border-r-2 border-orange-600 mx-2"></span><a :href="ipo.rhp_url" target="_blank">Offer Document</a><span v-if="listing_data.bse"><span class="border-r-2 border-orange-600 mx-2"></span><a :href="listing_data.bse?.url" target="_blank">BSE</a></span><span v-if="listing_data.nse"><span class="border-r-2 border-orange-600 mx-2"></span><a :href="listing_data.nse.url" target="_blank">NSE</a></span></h3>
		</div>
		<div class="bg-orange-300 p-2 pl-4 rounded-lg m-2">
			<ul class="divide-x divide-solid flex ">
						<li class="border-b-1 border-orange-400 p-2" v-if="ipo.open_date">
							<h4 class="italic">Issue/Bids Opens</h4>
							<p class="font-semibold">{{ formatDate(ipo.open_date) }}</p>
						</li>
						<li class="border-b-1 border-orange-400 p-2" v-if="ipo.close_date">
							<h4 class="italic">Issue/Bids Closes</h4>
							<p class="font-semibold">{{ formatDate(ipo.close_date) }}</p>
						</li>
						<li v-if="ipo.price_band_low" class="border-b-1 border-orange-400 p-2">
							<h4 class="italic">Price Band</h4>
							<p class="font-semibold">&#8377;{{ ipo.price_band_low }} - &#8377;{{ ipo.price_band_high }}</p>
						</li>
						<li v-else class="border-b-1 border-orange-400 p-2">
							<h4 class="italic">Price</h4>
							<p class="font-semibold">&#8377; {{ ipo.price_band_high }}</p>
						</li>
						<li class="border-b-1 border-orange-400 p-2">
							<h4 class="italic">Lot Size and Amount</h4>
							<p class="font-semibold">{{ ipo.lot_size }} Shares @ &#8377;{{ ipo.price_band_high * ipo.lot_size }}</p>
						</li>
						<li v-if="ipo.issue_size" class="border-b-1 border-orange-400 p-2">
							<h4 class="italic">Issue Size: <span>&#8377; {{ ipo.issue_size }} Cr.</span></h4>
							<p class="font-semibold"><span v-if="ipo.fresh_issue">Fresh: {{ ipo.fresh_issue }} Shares (&#8377; {{ amtInCr(ipo.fresh_issue * ipo.price_band_high) }} Cr.)</span></p>
							<p class="font-semibold"><span v-if="ipo.offer_for_sale">OFS: {{ ipo.offer_for_sale }} Shares (&#8377; {{ amtInCr(ipo.offer_for_sale * ipo.price_band_high) }} Cr.)</span></p>
						</li>
					</ul>
		</div>

	 <div class="grid grid-cols-1 md:flex md:gap-4 m-3">
		<div v-if="subscriptions.length > 0" class="border-r md:border-r-0 bg-orange-200 p-3 rounded-lg">
			<h3 class="text-xl font-semibold bg-gradient-to-r from-orange-600 to-blue-400 text-transparent bg-clip-text">Minimum Investment</h3>
			<Tabs variant="underline" v-model="minInvCat" class="p-5">
				<Tab v-for="(min, i) in minInvstment" :key="i" :name="min.category" :title="min.category">
					<table class="table-fixed">
						<tr class="border border-gray-100">
							<td class="p-2">No. of Lots:</td><td class="p-2">{{ min.lots }}</td>
						</tr>
						<tr class="border border-gray-100">
							<td class="p-2">No. of Shares:</td><td class="p-2">{{ min.shares }}</td>
						</tr>
						<tr class="border border-gray-100">
							<td class="p-2">Amount:</td><td class="p-2">&#8377;{{ min.amt }}</td>
						</tr>
						<tr class="border border-gray-100">
							<td class="p-2">Available Applications:</td><td class="p-2">{{ min.app }}</td>
						</tr>
					</table>
				</Tab>
			</Tabs>
		</div>

		<div class="border-r md:border-r-0 bg-orange-200 p-3 rounded-lg flex-1">
			<h3 class="text-xl font-semibold bg-gradient-to-r from-orange-600 to-blue-400 text-transparent bg-clip-text">Categories Quota and Discount</h3>
			<table class="table-fixed w-full border">
				<thead class="bg-orange-200">
					<tr class="border border-gray-100">
						<th class="border border-gray-100 text-left p-2">Category</th>
						<th class="border border-gray-100 p-2">Quota</th>
						<th class="border border-gray-100 p-2">Amount</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="quota in quotas" :key="quota.id">
						<td class="border border-gray-100 p-2">
							{{ quota.cat.short_name }}
							<button @click="showAnchors" v-if="quota.cat.id === 6" type="button" class="font-medium rounded-lg text-sm px-5 py-2.5 text-center">
								<svg class="w-4 h-4 text-gray-800 dark:text-white hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
									<path d="M17 0h-5.768a1 1 0 1 0 0 2h3.354L8.4 8.182A1.003 1.003 0 1 0 9.818 9.6L16 3.414v3.354a1 1 0 0 0 2 0V1a1 1 0 0 0-1-1Z"/>
									<path d="m14.258 7.985-3.025 3.025A3 3 0 1 1 6.99 6.768l3.026-3.026A3.01 3.01 0 0 1 8.411 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V9.589a3.011 3.011 0 0 1-1.742-1.604Z"/>
								</svg>
							</button>
							<Modal v-if="anchorModal && quota.cat.id === 6" size="3xl" @close="() => anchorModal = false" :escapable="true">

								<template #body>
									<Anchors :ipo_id="ipoId" :quota="quota.quota" />
								</template>
							</Modal>
						</td>
						<td class="border border-gray-100 p-2">{{ quota.quota }} <span class="block text-sm italic" v-if="quota.perc">({{ quota.perc }})</span><span class="block text-sm italic" v-if="quota.discount">Discount: &#8377;{{ quota.discount }}</span></td>
						<td class="border border-gray-100 p-2">&#8377; {{ amtInCr(quota.quota * (ipo.price_band_high - +quota.discount)) }} Cr.</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="border-r md:border-r-0 bg-orange-200 p-3 rounded-lg flex-1">
			<h3 class="text-xl font-semibold bg-gradient-to-r from-orange-500 to-purple-500 text-transparent bg-clip-text">Tentative Schedule</h3>
			<ul class="divide-y divide-dashed">
				<li class="border-b-1 border-orange-400 py-2">
					<h4 class="font-semibold mt-2">Finalisation of Basis of Allotment</h4>
					<p v-if="ipo.t_finalisation_of_basis">{{ formatDate(ipo.t_finalisation_of_basis) }}</p>
				</li>
				<li class="border-b-1 border-orange-400 py-2">
					<h4 class="font-semibold mt-2">Unblocking of Funds</h4>
					<p v-if="ipo.t_initiation_of_refunds">{{ formatDate(ipo.t_initiation_of_refunds) }}</p>
				</li>
				<li class="border-b-1 border-orange-400 py-2">
					<h4 class="font-semibold mt-2">Credit of Equity Shares to Allottees</h4>
					<p v-if="ipo.t_credit_of_equity_shares">{{ formatDate(ipo.t_credit_of_equity_shares) }}</p>
				</li>
				<li class="border-b-1 border-orange-400 py-2">
					<h4 class="font-semibold mt-2">Commencement of Trading</h4>
					<p v-if="ipo.t_commencement">{{ formatDate(ipo.t_commencement) }}</p>
				</li>
				<li class="border-b-1 border-orange-400 py-2" v-if="ipo.t_anchor_unblocking">
					<h4 class="font-semibold mt-2">Anchors Unblocking</h4>
					<p>{{ formatDate(ipo.t_anchor_unblocking) }}</p>
				</li>
				<li class="border-b-1 border-orange-400 py-2" v-if="ipo.t_anchor_unblocking_long">
					<h4 class="font-semibold mt-2">Anchor Unblocking(3 Months)</h4>
					<p>{{ formatDate(ipo.t_anchor_unblocking_long) }}</p>
				</li>
			</ul>
		</div>

	</div>

	<div class="grid grid-flow-col auto-cols-fr md:gap-4 m-3">
		<div v-if="subscriptions.length > 0" class="border-r md:border-r-0 bg-orange-200 p-3 rounded-lg">
			<h3 class="text-xl text-gray-800 animate-typing font-[Comfortaa]">Subscriptions</h3>
			<Tabs variant="underline" v-model="activeTab" class="p-5">
				<Tab v-for="(subs, i) in subscriptions" :key="i" :name="formatDate(subs.items[0].day)" :title="formatDate(subs.items[0].day)">
					<table class="table-fixed w-full border">
					<thead class="bg-orange-200">
						<tr class="border border-gray-400">
							<th class="border border-gray-400 text-left p-2">Category</th>
							<th class="border border-gray-400 p-2">Subscription</th>
							<th class="border border-gray-400 p-2">Times</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in subs.items" :key="item.id">
							<td class="border border-gray-400 p-2">{{ item.cat.short_name }}</td>
							<td class="border border-gray-400 p-2">{{ item.subscription }} </td>
							<td class="border border-gray-400 p-2">{{ (item.subscription / item.quota).toFixed(2) }}x</td>
						</tr>
						<tr>
							<td class="border border-gray-400 p-2 font-bold">Total</td>
							<td class="border border-gray-400 p-2 font-bold">{{ subs.totalsubs }}</td>
							<td class="border border-gray-400 p-2 font-bold">{{ (subs.totalsubs / totalOffer).toFixed(2) }}x</td>
						</tr>
					</tbody>
				</table>
				</Tab>
			</Tabs>
		</div>
		<div class="border-r md:border-r-0 bg-orange-200 p-3 rounded-lg" v-if="listing_data.nse || listing_data.bse">
			<h3 class="mb-3 text-xl text-gray-800 animate-typing font-[Comfortaa]">Listing Day Data</h3>
			<Tabs variant="underline" v-model="activeExch" class="py-2">
				<Tab v-if="listing_data.nse" name="NSE" title="NSE">
					<div class="bg-orange-100 p-4 rounded-md">
         				<div class="flex justify-between border-b-2 border-gray-200 p-2">
         						<div>
         							<p class="text-gray-600">Listed on</p>
         							<p class="text-base font-bold">{{ listing_data.nse?.listing_date }}</p>
         						</div>
         						<div>
         							<p class="text-gray-600">Listing Price</p>
         							<p class="text-base font-bold">&#8377;{{ listing_data.nse?.listing_price }}</p>
         						</div>
         					</div>
         					<div class="flex justify-between mt-4 mb-2">
         						<div>
         						<p class="text-base">Low: &#8377;{{ listing_data.nse?.low }}</p>
         						</div>
         						<div>
         						<p class="text-base">High: &#8377;{{ listing_data.nse?.high }}</p>
         						</div>
         					</div>
         					<div class="px-6">
								<slider v-model="listing_data.nse.close" :min="listing_data.nse.low" :max="listing_data.nse.high" color="#FB278D" track-color="#FEFEFE" tooltip :circleOffset='5' :circleGap='5' />
         						<!-- <Slider v-model="listing_data.nse.close" :min="listing_data.nse.low" :max="listing_data.nse.high" tooltipPosition="bottom" :format="{prefix: 'Close: '}" disabled /> -->
         					</div>
         					<div class="flex justify-between mt-8 pt-2 mb-2">
         						<div>
         							<p class="text-base">Pre-open Volume</p>
         							<p class="text-base font-semibold">{{ listing_data.nse?.preopen_volume ?? 'NA' }}</p>
         						</div>
         						<div>
         							<p class="text-base">Volume</p>
         							<p class="text-base font-semibold">{{ listing_data.nse?.volume ?? 'NA' }}</p>
         						</div>
         					</div>
         					<div class="flex justify-between mt-2 pt-2 mb-2">
         						<div>
         							<p class="text-base">Delivery</p>
         							<p class="text-base font-semibold">{{ listing_data.nse?.delivery ?? 'NA' }}</p>
         						</div>
         						<div>
         							<p class="text-base">Free Float</p>
         							<p class="text-base font-semibold">{{ listing_data.nse?.free_float ?? 'NA' }}</p>
         						</div>
         					</div>
     </div>
				</Tab>
				<Tab v-if="listing_data.bse" name="BSE" title="BSE">
					<div class="bg-orange-100 p-4 rounded-md">
         					<div class="flex justify-between border-b border-gray-200 p-2">
         						<div>
         							<p class="text-gray-600">Listed on</p>
         							<p class="text-base font-bold">{{ listing_data.bse?.listing_date }}</p>
         						</div>
         						<div>
         							<p class="text-gray-600">Listing Price</p>
         							<p class="text-base font-bold">&#8377;{{ listing_data.bse?.listing_price }}</p>
         						</div>
         					</div>
         					<div class="flex justify-between mt-4 mb-2">
         						<div>
         						<p class="text-base">Low: &#8377;{{ listing_data.bse?.low }}</p>
         						</div>
         						<div>
         						<p class="text-base">High: &#8377;{{ listing_data.bse?.high }}</p>
         						</div>
         					</div>
         					<div class="px-6">
								<slider v-model="listing_data.bse.close" :min="listing_data.bse.low" :max="listing_data.bse.high" color="#FB278D" track-color="#FEFEFE" tooltip :circleOffset='5' :circleGap='5' />
         						<!-- <Slider v-model="listing_data.bse.close" :min="listing_data.bse.low" :max="listing_data.bse.high" tooltipPosition="bottom" :format="{prefix: 'Close: '}" disabled /> -->
         					</div>
         					<div class="flex justify-between mt-8 pt-2 mb-2">
         						<div>
         							<p class="text-base">Pre-open Volume</p>
         							<p class="text-base font-semibold">{{ listing_data.bse?.preopen_volume ?? 'NA' }}</p>
         						</div>
         						<div>
         							<p class="text-base">Volume</p>
         							<p class="text-base font-semibold">{{ listing_data.bse?.volume ?? 'NA' }}</p>
         						</div>
         					</div>
         					<div class="flex justify-between mt-2 pt-2 mb-2">
         						<div>
         							<p class="text-base">Delivery</p>
         							<p class="text-base font-semibold">{{ listing_data.bse?.delivery ?? 'NA' }}</p>
         						</div>
         						<div>
         							<p class="text-base">Free Float</p>
         							<p class="text-base font-semibold">{{ listing_data.bse?.free_float ?? 'NA' }}</p>
         						</div>
         					</div>
     					</div>
				</Tab>
			</Tabs>
		</div>
		<div class="border-r md:border-r-0 bg-orange-200 p-3 rounded-lg" v-if="listing_data.nse || listing_data.bse">
			<h3 class="mb-3 text-xl text-gray-800 animate-typing font-[Comfortaa]">Current Status</h3>
			<Tabs variant="underline" v-model="activeExch" class="py-2">
				<Tab v-if="listing_data.nse" name="NSE" title="NSE">
					<div class="bg-orange-100 p-4 rounded-md">
         				<div class="flex justify-between border-b-2 border-gray-200 p-2">
         						<div>
         							<p class="text-gray-600">As on</p>
         							<p class="text-base font-bold">{{ listing_data.nse?.live?.metadata.lastUpdateTime }}</p>
         						</div>
         						<div>
         							<p class="text-gray-600">Price</p>
         							<p class="text-base font-bold">&#8377;{{ listing_data.nse?.live?.priceInfo.lastPrice }}</p>
         						</div>
         					</div>
							<div class="mt-4 font-[Satisfy] italic text-green-500">Days Low and High</div>
         					<div class="flex justify-between mb-2">
         						<div>
         						<p class="text-base">&#8377;{{ listing_data.nse?.live?.priceInfo.intraDayHighLow.min }}</p>
         						</div>
         						<div>
         						<p class="text-base">&#8377;{{ listing_data.nse?.live?.priceInfo.intraDayHighLow.max }}</p>
         						</div>
         					</div>
         					<div class="px-6 mb-4" v-if="listing_data.nse?.live?.priceInfo.intraDayHighLow.min">
								<slider v-model="listing_data.nse.live.priceInfo.lastPrice" :min="+listing_data.nse.live.priceInfo.intraDayHighLow.min" :max="+listing_data.nse.live.priceInfo.intraDayHighLow.max" color="#FB278D" track-color="#FEFEFE" tooltip :circleOffset='5' :circleGap='5' />
								<!-- <Slider v-model="listing_data.nse.live.priceInfo.lastPrice" :min="+listing_data.nse.live.priceInfo.intraDayHighLow.min" :max="+listing_data.nse.live.priceInfo.intraDayHighLow.max" tooltipPosition="bottom" :format="{prefix: 'current: '}" disabled showTooltip="focus" /> -->
         					</div>
							 <div class="mt-11 border-t-2 border-gray-100 font-[Satisfy] italic text-green-500">52 Weeks Low and High</div>
         					<div class="flex justify-between mb-2">
         						<div>
         						<p class="text-base">&#8377;{{ listing_data.nse?.live?.priceInfo.weekHighLow.min }}</p>
								<p class="text-base font-[Satisfy] italic">{{ listing_data.nse?.live?.priceInfo.weekHighLow.minDate }}</p>
         						</div>
         						<div>
								<p class="text-base">&#8377;{{ listing_data.nse?.live?.priceInfo.weekHighLow.max }}</p>
								<p class="text-base font-[Satisfy] italic">{{ listing_data.nse?.live?.priceInfo.weekHighLow.maxDate }}</p>
         						</div>
         					</div>
         					<div class="px-6" v-if="listing_data.nse?.live?.priceInfo.weekHighLow.min">
								<slider v-model="listing_data.nse.live.priceInfo.lastPrice" :min="+listing_data.nse.live.priceInfo.weekHighLow.min" :max="+listing_data.nse.live.priceInfo.weekHighLow.max" color="#FB278D" track-color="#FEFEFE" tooltip :circleOffset='5' :circleGap='5' />
								<!-- <Slider v-model="listing_data.nse.live.priceInfo.lastPrice" :min="+listing_data.nse.live.priceInfo.weekHighLow.min" :max="+listing_data.nse.live.priceInfo.weekHighLow.max" tooltipPosition="bottom" :format="{prefix: 'current: '}" disabled showTooltip="focus" /> -->
         					</div>
						</div>
				</Tab>
				<Tab v-if="listing_data.bse" name="BSE" title="BSE">
					<div class="bg-orange-100 p-4 rounded-md">
         				<div class="flex justify-between border-b-2 border-gray-200 p-2">
         						<div>
         							<p class="text-gray-600">As on</p>
         							<p class="text-base font-bold">{{ listing_data.bse?.live?.Header.Ason }}</p>
         						</div>
         						<div>
         							<p class="text-gray-600">Price</p>
         							<p class="text-base font-bold">&#8377;{{ listing_data.bse?.live?.Header.LTP }}</p>
         						</div>
         					</div>
							<div class="mt-4 font-[Satisfy] italic text-green-500">Days Low and High</div>
         					<div class="flex justify-between mb-2">
         						<div>
         						<p class="text-base">&#8377;{{ listing_data.bse?.live?.Header.Low }}</p>
         						</div>
         						<div>
         						<p class="text-base">&#8377;{{ listing_data.bse?.live?.Header.High }}</p>
         						</div>
         					</div>
         					<div class="px-6 mb-4" v-if="listing_data.bse?.live?.Header">
								<slider v-model="listing_data.bse.live.Header.LTP" :min="+listing_data.bse.live.Header.Low" :max="+listing_data.bse.live.Header.High" color="#FB278D" track-color="#FEFEFE" tooltip :circleOffset='5' :circleGap='5' />
								<!-- <Slider v-model="listing_data.bse.live.Header.LTP" :min="+listing_data.bse.live.Header.Low" :max="+listing_data.bse.live.Header.High" tooltipPosition="bottom" :format="{prefix: 'current: '}" disabled showTooltip="focus" /> -->
         					</div>

						</div>
				</Tab>
			</Tabs>
		</div>
		<div class="border-r md:border-r-0 bg-orange-200 p-3 rounded-lg" v-else-if="new Date(ipo.close_date) < today">
			<h3 class="mb-3 text-xl text-gray-800 animate-typing font-[Comfortaa]">Basis of Allotment</h3>
		</div>
	</div>

		<div v-if="ipo.about_html">
			<h1 class="mt-5 ml-5 text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
                    About Company
		</h1>

		<div class="flex mx-auto ml-5 mt-2 mb-5">
			<span class="inline-block w-40 h-1 bg-blue-500 rounded-full"></span>
			<span class="inline-block w-3 h-1 mx-1 bg-blue-500 rounded-full"></span>
			<span class="inline-block w-1 h-1 bg-blue-500 rounded-full"></span>
		</div>
			<div  class="wp-style p-2 m-3" v-html="ipo.about_html"></div>
		</div>
	  	<CompInfo :id="ipoId" v-else />
		<Promoters :id="ipoId" />
		<CompFinancials :content="JSON.parse(ipo.financials)" v-if="ipo.financials" />
		<CompPeers :content="JSON.parse(ipo.peers)" v-if="ipo.peers" />
		<compSwot :content="JSON.parse(ipo.swot)" v-if="ipo.swot" />


</div>
</template>
<style>
.wp-style{
  color: #222;
  font-family: 'Open Sans', sans-serif;
  font-size: 15px; font-weight: 400;
  line-height: 24px;
  text-align:justify;
}

.wp-style h3{
  font-family: 'Josefin Sans', sans-serif;
  font-size: 21px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1.5em;
  padding-top: 15px;
  position: relative;
  text-transform: uppercase;
}

.wp-style h3:before{
   position: absolute;
  left: 0;
  bottom: 0;
  width: 60px;
  height: 2px;
  content: "";
  background-color: #c50000;
}

.wp-style ul{
  list-style: disc inside;
}

.wp-style ul ul{
  margin-left:4vw;
  list-style: circle inside;
}

.wp-style ul ol{
    margin-left:4vw;
    list-style: lower-roman inside;
}

.wp-style .contact{
  display: flex;
  justify-content: space-between;
  margin-top:10px;
}
.contact strong{
  border-bottom: 1px solid #333;
  padding-bottom:2px;
  margin-bottom:5px;
  text-transform: uppercase;
}

.wp-style table {
  border-spacing: 1;
  border-collapse: collapse;
  border-color: rgb(202, 193, 193);
  border-width: 1px;
  border-radius:6px;
  overflow:hidden;
  max-width:800px;
  width:100%;
  margin:0 10px;
  position:relative;
}
.wp-style td, .wp-style th{
  border: 1px solid rgb(202, 193, 193);
  padding: 5px;
  text-align: left;
}
</style>
