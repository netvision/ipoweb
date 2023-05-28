<script setup>
import Topbar from '@/components/Topbar.vue';
import { useRoute } from 'vue-router'
const route = useRoute();
const userId = ref(route.params.id);
console.log(userId.value);
</script>
<template>
	<Topbar />
	<div>Hello, {{ $route.params.id }}</div>
</template>
