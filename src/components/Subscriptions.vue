<script setup>
import axios from "axios";
const props = defineProps(['id'])
</script>
<template>
	<div>{{ props.id }}</div>
</template>
