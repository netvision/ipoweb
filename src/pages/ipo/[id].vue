<script setup>
import axios from 'axios';

import { useRoute } from 'vue-router'

import { Accordion, AccordionPanel, AccordionHeader, AccordionContent, Tabs, Tab } from 'flowbite-vue';
const route = useRoute();
const ipoId = ref(route.params.id.split('-')[0]);
const ipo = ref({})
const title = ref(route.params.id.split('-')[1])
const total = ref(0)
const quotas = ref([])
const subscriptions = ref([])
const today = new Date()
const listing_data = ref({})
const activeTab = ref()
useHead({
	title: title.value
})

const formatDate = (d) => {
	const date = new Date(d);
	//console.log(date)
                // Then specify how you want your dates to be formatted
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
	activeTab.value = formatDate(ipo.value.open_date)
	if(ipo.value.ipo_type != 'SME'){
		let amt = ipo.value.lot_size * ipo.value.price_band_high
		minInvstment.value = [
			{
				category: 'Retail',
				lots: 1,
				shares: ipo.value.lot_size,
				amt: amt
			},
			{
				category: 'sHNI',
				lots: Math.ceil(200000 / amt),
				shares: Math.ceil(200000 / amt) * ipo.value.lot_size,
				amt:  Math.ceil(200000 / amt) * amt,
			},
			{
				category: 'bHNI',
				lots: Math.ceil(1000000 / amt),
				shares: Math.ceil(1000000 / amt) * ipo.value.lot_size,
				amt:  Math.ceil(1000000 / amt) * amt,
			}
		]
	}
	let total = Number(ipo.value.fresh_issue) + Number(ipo.value.offer_for_sale)

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

	  if(today >= new Date(ipo.value.open_date)){
		let logs = await axios.get('https://droplet.netserve.in/ipo-subscription-logs?ipo_id='+ipoId.value+'&expand=cat').then(r=>r.data)
		let subs = logs.reduce((group, item) => {
			const key = item.day;
			if(!group[key]){
				group[key] = []
			}
			let quota = quotas.value.filter(q => q.cat_id == item.cat_id)
			group[key].push({...item, quota: quota[0].quota})
			return group
		}, {})

		Object.values(subs).forEach(v => {
			if(v.filter(u => u.subscription > 0).length > 0){
				subscriptions.value.push(v.sort((a,b) => a.cat.cat_order - b.cat.cat_order))
			}
		})
	  }
	  else console.log("Issue is not open yet")

	  if(ipo.value.listings.length > 0 && ipo.value.listings[0].listing_date){
		listing_data.value.bse = ipo.value.listings.filter(x => x.exchange === "BSE")[0]
		listing_data.value.nse = ipo.value.listings.filter(x => x.exchange === "NSE")[0]
		if(listing_data.value.nse.scrip_code != null){
			listing_data.value.nse.live = await axios.get('https://stockapi.ipoinbox.com/quote?symbol='+listing_data.value.nse.scrip_code.trim()).then(r => r.data.priceInfo)
		}
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
</svg></a></span><span v-if="listing_data.nse && listing_data.nse.scrip_code != null">&#8377; {{ listing_data.nse?.live?.lastPrice }}</span>
			</h2>
		</div>
		<div class="bg-orange-200 p-2 pl-4">
			<h3 class="text-base"><span v-if="ipo.registrar">Registrar: <a :href="ipo.registrar.url" target="_blank">{{ ipo.registrar.name }}</a></span><span class="border-r-2 border-orange-600 mx-2"></span><a :href="ipo.rhp_url" target="_blank">Offer Document</a><span v-if="ipo.bse_url"><span class="border-r-2 border-orange-600 mx-2"></span><a :href="ipo.bse_url" target="_blank">BSE</a></span><span v-if="ipo.nse_url"><span class="border-r-2 border-orange-600 mx-2"></span><a :href="ipo.nse_url" target="_blank">NSE</a></span></h3>
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
							<p class="font-semibold">&#8377; {{ ipo.price_band_low }} - {{ ipo.price_band_high }}</p>
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

	 <div class="grid grid-cols-1 md:grid-cols-3 md:gap-4 m-3">
		<div class="border-r md:border-r-0 bg-orange-200 p-3 rounded-lg">
			<IpoObjects :id="ipoId" />
		</div>
		<div class="border-r md:border-r-0 bg-orange-200 p-3 rounded-lg">
			<h3 class="text-xl">Tentative Schedule</h3>
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
		<div class="border-r md:border-r-0 bg-orange-200 p-3">
			<h3 class="text-xl">Categories Quota and Discount</h3>
			<table class="table-fixed w-full border">
				<thead class="bg-orange-200">
					<tr class="border border-gray-400">
						<th class="border border-gray-400 text-left p-2">Category</th>
						<th class="border border-gray-400 p-2">Quota</th>
						<th class="border border-gray-400 p-2">Amount</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="quota in quotas" :key="quota.id">
						<td class="border border-gray-400 p-2">{{ quota.cat.short_name }}</td>
						<td class="border border-gray-400 p-2">{{ quota.quota }} <span class="block text-sm italic" v-if="quota.perc">({{ quota.perc }})</span><span class="block text-sm italic" v-if="quota.discount">Discount: {{ quota.discount }}</span></td>
						<td class="border border-gray-400 p-2">&#8377; {{ amtInCr(quota.quota * ipo.price_band_high) }} Cr.</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</div>
	<div class="grid grid-cols-1 md:grid-cols-2 md:gap-4 m-3">
		<div v-if="subscriptions.length > 0" class="border-r md:border-r-0 bg-orange-100 p-3">
			<h3 class="text-xl">Subscriptions</h3>
			<Tabs variant="underline" v-model="activeTab" class="p-5">
				<Tab v-for="(subs, i) in subscriptions" :key="i" :name="formatDate(subs[0].day)" :title="formatDate(subs[0].day)">
					<table class="table-fixed w-full border">
					<thead class="bg-orange-200">
						<tr class="border border-gray-400">
							<th class="border border-gray-400 text-left p-2">Category</th>
							<th class="border border-gray-400 p-2">Subscription</th>
							<th class="border border-gray-400 p-2">Times</th>
							<th class="border border-gray-400 p-2">Applications</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="item in subs" :key="subs.id">
							<td class="border border-gray-400 p-2">{{ item.cat.short_name }}</td>
							<td class="border border-gray-400 p-2">{{ item.subscription }} </td>
							<td class="border border-gray-400 p-2">{{ (item.subscription / item.quota).toFixed(2) }}x</td>
							<td class="border border-gray-400 p-2">{{ item.applications ?? 'NA' }}</td>
						</tr>
					</tbody>
				</table>
				</Tab>
			</Tabs>
		</div>
		<div class="border-r md:border-r-0 bg-orange-100 p-3">
			<h3 class="text-xl">Listing Day Data</h3>
			<div class="flex flex-row items-center justify-between mb-4">
			<button class="text-gray-600 hover:text-gray-900 focus:outline-none" id="prevButton">
				<svg class="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
				</svg>
			</button>
			<div class="flex overflow-x-auto space-x-4">
				<!-- Scrollable container for cards -->
				<div class="flex-shrink-0">
				<!-- Card 1 -->
				<div class="rounded-lg shadow-md p-4" style="width: 300px;">
					<pre>{{ listing_data.nse }}</pre>
				</div>
				</div>
				<div class="flex-shrink-0">
				<!-- Card 2 -->
				<div class=" rounded-lg shadow-md p-4" style="width: 300px;">
					<pre>{{ listing_data.bse }}</pre>
				</div>
				</div>
				<!-- Add more cards as needed -->
			</div>
			<button class="text-gray-600 hover:text-gray-900 focus:outline-none" id="nextButton">
				<svg class="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
				</svg>
			</button>
			</div>
		</div>

	</div>
	<Accordion>
		<accordion-panel v-if="ipo.about_html">
      		<accordion-header class="text-xl">About Company</accordion-header>
      		<accordion-content>
				<div  class="wp-style p-2 m-3" v-html="ipo.about_html"></div>
	  		</accordion-content>
	  	</accordion-panel>
		<CompInfo :id="ipoId" v-else />
		<Promoters :id="ipoId" />
		<CompFinancials :content="JSON.parse(ipo.financials)" v-if="ipo.financials" />
		<CompPeers :content="JSON.parse(ipo.peers)" v-if="ipo.peers" />
		<compSwot :content="JSON.parse(ipo.swot)" v-if="ipo.swot" />
	</Accordion>

</template>
<style scoped>
h3{
    position: relative;
	padding: 0;
    margin: 0;
    font-family: "Raleway", sans-serif;
    font-weight: 300;
    color: #080808;
    -webkit-transition: all 0.4s ease 0s;
    -o-transition: all 0.4s ease 0s;
    transition: all 0.4s ease 0s;
}
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
