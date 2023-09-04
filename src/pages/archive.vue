<script setup>
import axios from 'axios';
import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";
import Topbar from '@/components/Topbar.vue';
const ipos = ref([])
const perPage = ref(20)
const curPage = ref(1)
const totalCount = ref()
const totalPages = ref()

const getIpos = async(p) => {
	let res = await axios.get('https://droplet.netserve.in/ipos?fields=ipo_id,company_name,ipo_type&sort=-open_date&per-page='+perPage.value+'&page='+p)
	ipos.value = res.data
	totalCount.value = res.headers['x-pagination-total-count']
	perPage.value = res.headers['x-pagination-per-page']
	totalPages.value = +res.headers['x-pagination-page-count']
	curPage.value = +res.headers['x-pagination-current-page']
}
onMounted(() => {
	getIpos(1)
})
</script>
<template>
	<div class="bg-orange-100 flex flex-col min-h-screen">
		<Topbar />
		<div class="p-2 pl-4 rounded-lg m-2 w-3/4 self-center">
			<a
				v-for="ipo in ipos" :key="ipo.ipo_id"
				:href="'/ipo/'+ipo.ipo_id"
				class="block w-full cursor-pointer rounded-lg p-4 transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:focus:bg-neutral-600 dark:focus:text-neutral-200">
				{{ ipo.company_name }}
				<span class="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700">{{ ipo.ipo_type }}</span>
			</a>
			<v-pagination
				v-model="curPage"
				:pages="totalPages"
				:range-size="1"
				active-color="#DCEDFF"
				@update:modelValue="getIpos"
			/>
		</div>
	</div>


</template>
<style>
button.page{
	width: 30px;
	height: 30px;
	font-size: 16px;
	margin: 0 4px;
}
</style>
