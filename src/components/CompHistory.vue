<script setup>
import axios from 'axios'
const props = defineProps(['id'])
const events = ref([])
const getEvents = async() => {
	let res = await axios.get('https://api.ipoinbox.com/comp-history?filter[ipoId][eq]='+props.id).then(r => r.data)
	console.log(res)
	events.value = res.reduce((group, item) => {
		const key = item.year;
		if(!group[key]){
			group[key] = []
		}
		group[key].push(item)
		return group
	}, {})
	console.log(events.value)
}
getEvents()
</script>
<template>
	<div v-if="Object.keys(events).length > 0">
	<h3 class="text-lg font-['Lugrasimo'] font-bold italic text-orange-800">Historical Timeline</h3>
	<div class="p-3 h-auto max-h-80 scroll-my-2 overflow-y-auto custom-scroll">
		<ol class="border-l-2 border-info-100" v-if="events">
			<li v-for="(evt, k) in events" :key="k">
				<div class="flex-start md:flex">
					<div
						class="-ml-[13px] flex h-[25px] w-[25px] items-center justify-center rounded-full bg-info-100 text-info-700">
						<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="h-4 w-4">
						<path
							fill-rule="evenodd"
							d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
							clip-rule="evenodd" />
						</svg>
					</div>
					<div
						class="mb-2 ml-6 block max-w-md rounded-lg bg-orange-50 px-6 shadow-md shadow-black/5 dark:bg-neutral-700 dark:shadow-black/10">
						<div class="flex justify-between">
						<h3
							class="text-lg text-info transition duration-150 ease-in-out hover:text-info-600 focus:text-info-600 active:text-info-700"
							>{{ k }}</h3
						>

						</div>
						<ul v-if="evt.length > 0">
							<li v-for="item in evt" :key="item.id" class="list-disc list-outside p-1 px-2 text-base">
								{{ item.heading }}
                <div v-if="item.detail_html" v-html="item.detail_html" class="text-gray-700 text-sm font-thin italic" />
							</li>
						</ul>

					</div>
					</div>
			</li>
		</ol>
	</div>
	</div>
</template>
<style>
.custom-scroll{
	-ms-overflow-style: none;  /* IE and Edge */
	scrollbar-width: none;  /* Firefox */
}
.custom-scroll::-webkit-scrollbar { display: none;}
.custom-scroll:hover{
	scrollbar-width: 5px; /* Firefox */
	-ms-overflow-style: scrollbar;
}
.custom-scroll:hover::-webkit-scrollbar{
	display: block;
}
</style>
