<script setup>
	//import { useStore } from '@/store';
	import Topbar from '@/components/Topbar.vue';
	import axios from 'axios'
	import { useRouter } from 'vue-router';
	import { Button } from 'flowbite-vue'
	useHead({
		title: 'IPO Inbox | Unboxing the treasure of IPOs',
	});
	const router = useRouter()
	const ipos = ref([])
	const search = ref('')
	const searchedItems = ref()
	const bhav = ref()
	const doSearch = async() => {
		if(search.value.length > 1){
			try {
				let res = await axios.get('https://api.ipoinbox.com/ipos?fields=ipo_id,company_name&filter[company_name][like]='+search.value).then(r => r.data)
				searchedItems.value = res
			}
			catch(e){
				console.log(e)
			}
		}
	}

	const goTo = (ipo) => {
		router.push('ipo/'+ipo.ipo_id+'-'+encodeURIComponent(ipo.company_name))
	}
	onMounted(async () => {
		ipos.value = await axios.get('https://api.ipoinbox.com/ipos?fields=ipo_id,company_name,ipo_type,company_logo&sort=-open_date&per-page=10').then(r => r.data)
		let data = await axios.get('https://api.ipoinbox.com/ipo/getbhav').then(r => r.data)
		if(data) bhav.value = data[0]
	})
</script>

<template>
	<div class="bg-orange-100 flex flex-col min-h-screen">
     <Topbar />
     	<div class="flex-grow">
          <div class="flex justify-center mt-8">
               		<div class="flex flex-wrap w-3/4">
               			<div v-for="ipo in ipos" :key="ipo.ipo_id">
               				<button class="bg-gray-200 rounded-lg shadow-md p-2 m-2" @click="goTo(ipo)">
               					{{ ipo.company_name }}
               				</button>
               			</div>
               		</div>
               	</div>
               	<div class="flex justify-center mt-6">
               		<div class="w-3/4">
               			<div class="relative">
               				<input type="text" v-model="search" class="w-3/4 p-4 px-12 border border-gray-300 rounded-md shadow-sm" placeholder="Search more..." @keyup="doSearch()" />
               				<div class="absolute inset-y-0 left-0 flex items-center pl-3">
               					<svg class="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
               					<path fill-rule="evenodd" d="M8 2a6 6 0 100 12A6 6 0 008 2zm7.707 6.293a1 1 0 00-1.414-1.414l-2.5 2.5a1 1 0 000 1.414l2.5 2.5a1 1 0 101.414-1.414L15.414 11H18a1 1 0 100-2h-2.586l1.293-1.293z" clip-rule="evenodd" />
               					</svg>
               				</div>
               				<div class="absolute top-15 left-3 p-3 z-10 w-1/2" v-if="searchedItems">
               					<div class="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
               						<div  v-for="item in searchedItems" :key="item.ipo_id">
               							<a :href="'ipo/'+item.ipo_id+'-'+encodeURIComponent(item.company_name)" aria-current="true" class="block w-full px-4 py-2 m-2 text-gray-900 border-b border-gray-200 rounded-t-lg cursor-pointer dark:bg-gray-800 dark:border-gray-600">
                       						{{ item.company_name }}
                   						</a>
               						</div>
               					</div>
               				</div>
               			</div>
               			<div class="mt-2 text-left">
               				<a href="/archive" class="text-gray-500 text-sm underline">or checkout our IPO Archive</a>
               			</div>
               		</div>
               	</div>
      </div>
		<Footer />
 </div>

</template>

<route lang="yaml">
name: home
</route>
