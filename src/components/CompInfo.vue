<script setup>
import axios from 'axios';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'flowbite-vue'
const props = defineProps(['id'])
const compInfo = ref()
const getInfo = async() => {
	let info = await axios.get('https://droplet.netserve.in/comp-info?filter[ipoId][eq]='+props.id).then(r => r.data)
	console.log(info)
	compInfo.value = info
}
getInfo()
const formatDate = (d) => {
	const date = new Date(d);
	//console.log(date)
                // Then specify how you want your dates to be formatted
    return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);
}
</script>
<template>
    <accordion-panel v-if="compInfo && compInfo[0]">
      <accordion-header class="text-base">Company Information</accordion-header>
      <accordion-content>
		<div class="grid grid-cols-1 md:grid-cols-3">
			<div>
				<div class="m-3 shadow-dark-300">
					<p class="font-bold" v-if="compInfo[0].date_of_inc">Date of Inc.: {{ formatDate(compInfo[0].date_of_inc) }}</p>
					<p class="font-bold" v-if="compInfo[0].reg_no">Reg. No.: {{ compInfo[0].reg_no }}</p>
					<p class="font-bold"><span v-if="compInfo[0].cin">CIN: {{ compInfo[0].cin }}</span></p>
				</div>
				<CompHistory :id="props.id" />
				<div class="m-3 shadow-dark-300">
					<h3 class="text-lg font-sans font-bold">Company Secretary</h3>
					<p class="font-bold">{{ compInfo[0].cs_name }}</p>
					<p><span v-if="compInfo[0].cs_phone">Phone: {{ compInfo[0].cs_phone }}</span></p>
					<p><span v-if="compInfo[0].cs_email">Email: {{ compInfo[0].cs_email }}</span></p>
				</div>
				<div class="m-3 shadow-dark-300">
					<h3 class="text-lg font-sans font-bold">Registered Office</h3>
					<p>{{ compInfo[0].reg_office_address }}</p>
					<p>{{ compInfo[0].reg_office_city }}<span v-if="compInfo[0].reg_office_pin"> - {{ compInfo[0].reg_office_pin }}</span></p>
					<p>{{ compInfo[0].reg_office_state }}</p>
					<p v-if="compInfo[0].phone1">Phone: {{ compInfo[0].phone1 }}</p>
					<p v-if="compInfo[0].phone2">Alt. Phone: {{ compInfo[0].phone2 }}</p>
					<p v-if="compInfo[0].email">Email: {{ compInfo[0].email }}</p>
				</div>
				<div v-if="compInfo[0].corp_office_city" class="m-3 shadow-dark-300">
					<h3 class="text-lg font-sans font-bold">Corporate Office</h3>
					<p>{{ compInfo[0].corp_office_address }}</p>
					<p>{{ compInfo[0].corp_office_city }}<span v-if="compInfo[0].corp_office_pin"> - {{ compInfo[0].reg_office_pin }}</span></p>
					<p>{{ compInfo[0].corp_office_state }}</p>
				</div>

			</div>
			<div class="col-span-2">
				<h3 class="text-xl font-sans font-bold">Brief Intro</h3>
				<div class="editor" v-html="compInfo[0].brief_intro_html" />
				<h3 class="text-xl font-sans font-bold mt-3" v-if="compInfo[0].business_info">Business</h3>
				<div class="editor" v-html="compInfo[0].business_info" />

				<CompClients :id="props.id" />
				<div v-if="compInfo[0].client_note">{{ compInfo[0].client_note }}</div>

				<CompHoldings :id="props.id" />
				<div v-if="compInfo[0].holding_note">{{ compInfo[0].holding_note }}</div>

				<CompProperties :id="props.id" :note="compInfo[0].property_note" />

				<CompLitigations :id="props.id" :note="compInfo[0].property_note" />
			</div>
		</div>
      </accordion-content>
    </accordion-panel>
</template>
<style>
.editor ol {
	list-style: inside decimal;
	@apply divide-blue-100 divide-y-2 gap-5;
}
.editor ul {
	list-style: outside disc;
}

</style>
