<script setup>
import axios from 'axios';

import { useRoute } from 'vue-router'

import { Accordion } from 'flowbite-vue';
const route = useRoute();
const ipoId = ref(route.params.id.split('-')[0]);
const ipo = ref({})
const title = ref(route.params.id.split('-')[1])
const events = ref([])
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
	console.log(ipo.value)
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
		<div class="bg-orange-300 p-3 align-middle">
			<h2 class="text-4xl font-bold text-orange-700 dark:text-white">{{ ipo.company_name }}
				<span class="text-base"><sub>{{ (ipo.ipo_type == 'SME') ? 'SME' : 'IPO' }}</sub></span>
				<span class="mb-2 p-2"><a :href="ipo.company_url" target="_blank"><svg class="inline" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30">
<path d="M 25.980469 2.9902344 A 1.0001 1.0001 0 0 0 25.869141 3 L 20 3 A 1.0001 1.0001 0 1 0 20 5 L 23.585938 5 L 13.292969 15.292969 A 1.0001 1.0001 0 1 0 14.707031 16.707031 L 25 6.4140625 L 25 10 A 1.0001 1.0001 0 1 0 27 10 L 27 4.1269531 A 1.0001 1.0001 0 0 0 25.980469 2.9902344 z M 6 7 C 4.9069372 7 4 7.9069372 4 9 L 4 24 C 4 25.093063 4.9069372 26 6 26 L 21 26 C 22.093063 26 23 25.093063 23 24 L 23 14 L 23 11.421875 L 21 13.421875 L 21 16 L 21 24 L 6 24 L 6 9 L 14 9 L 16 9 L 16.578125 9 L 18.578125 7 L 16 7 L 14 7 L 6 7 z"></path>
</svg></a></span>
			</h2>
		</div>
		<div class="bg-orange-200 pl-4">
			<h3><span v-if="ipo.registrar">Registrar: <a :href="ipo.registrar.url" target="_blank">{{ ipo.registrar.name }}</a></span><span class="border-r-2 border-orange-600 mx-2"></span><a :href="ipo.rhp_url" target="_blank">Offer Document</a><span v-if="ipo.bse_url"><span class="border-r-2 border-orange-600 mx-2"></span><a :href="ipo.bse_url" target="_blank">BSE</a></span><span v-if="ipo.nse_url"><span class="border-r-2 border-orange-600 mx-2"></span><a :href="ipo.nse_url" target="_blank">NSE</a></span></h3>
		</div>
		<div class="p-2 m-3">
			<h3 class="text-xl p-3">Issue Overview</h3>
			<div class="grid grid-cols-1 md:grid-cols-3 md:gap-4">
				<div class="border-r md:border-r-0 bg-orange-200 p-3">
					<ul class="divide-y divide-dashed">
						<li v-if="ipo.price_band_low" class="border-b-1 border-orange-400 py-2">
							<h4>Price Band</h4>
							<p>&#8377; {{ ipo.price_band_low }} - {{ ipo.price_band_high }}</p>
						</li>
						<li v-else class="border-b-1 border-orange-400 py-2">
							<h4>Price</h4>
							<p>&#8377; {{ ipo.price_band_high }}</p>
						</li>
						<li class="border-b-1 border-orange-400 py-2" v-if="ipo.open_date">
							<h4>Issue/Bids Opens</h4>
							<p>{{ formatDate(ipo.open_date) }}</p>
						</li>
						<li class="border-b-1 border-orange-400 py-2" v-if="ipo.close_date">
							<h4>Issue/Bids Closes</h4>
							<p>{{ formatDate(ipo.close_date) }}</p>
						</li>
						<li class="border-b-1 border-orange-400 py-2">
							<h4>Lot Size and Amount</h4>
							<p>{{ ipo.lot_size }} Shares @ &#8377;{{ ipo.price_band_high * ipo.lot_size }}</p>
						</li>
					</ul>
				</div>
				<div class="border-r md:border-r-0 bg-orange-200 p-3">
					<ul class="divide-y divide-dashed">
						<li v-if="ipo.issue_size" class="border-b-1 border-orange-400 py-2">
							<h4>Issue Size</h4>
							<p>&#8377; {{ ipo.issue_size }} Cr.</p>
						</li>
						<li v-if="ipo.fresh_issue" class="border-b-1 border-orange-400 py-2">
							<h4>Fresh Issue</h4>
							<p>{{ ipo.fresh_issue }} Shares (&#8377; {{ amtInCr(ipo.fresh_issue * ipo.price_band_high) }} Cr.)</p>
						</li>
						<li v-if="ipo.offer_for_sale" class="border-b-1 border-orange-400 py-2">
							<h4>Offer for Sale</h4>
							<p>{{ ipo.offer_for_sale }} Shares (&#8377; {{ amtInCr(ipo.offer_for_sale * ipo.price_band_high) }} Cr.)</p>
						</li>
						<li v-if="ipo.no_of_total_shares" class="border-b-1 border-orange-400 py-2">
							<h4>Market Cap at the time of IPO</h4>
							<p>&#8377; {{ amtInCr(ipo.no_of_total_shares * ipo.price_band_high) }} Cr.</p>
						</li>
					</ul>
				</div>
				<div class="bg-orange-200 p-3">
					<div v-if="minInvstment.length > 0">
						<h3 class="font-semibold text-lg m-2">Minimum Investment</h3>
						<ul class="divide-y divide-dashed">
							<li v-for="(inv, i) in minInvstment" :key="i" class="border-b-1 border-orange-400 py-2">
								<h4 class="font-semibold mt-2">{{ inv.category }}</h4>
								<p>{{ inv.lots }} Lots ({{ inv.shares }} Shares) @ &#8377;{{ inv.amt }}</p>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
 	</div>
	<div v-if="ipo.about_html">
		<div class="wp-style p-2 m-3" v-html="ipo.about_html"></div>
	</div>
	<div v-else>
	<Accordion>
		<CompInfo :id="ipoId" />
		<Promoters :id="ipoId" />
		<CompFinancials :content="JSON.parse(ipo.financials)" v-if="ipo.financials" />
		<CompPeers :content="JSON.parse(ipo.peers)" v-if="ipo.peers" />
		<compSwot :content="JSON.parse(ipo.swot)" v-if="ipo.swot" />
	</Accordion>
	</div>
</template>
<style scoped>
h3{
    position: relative;
	padding: 0;
    margin: 0;
    font-family: "Raleway", sans-serif;
    font-weight: 300;
    font-size: 26px;
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
