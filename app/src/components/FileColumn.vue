<template>
	<div class="main-column">
	<!--<div v-for="file in dir.files" :style="file.style" class="main-item" v-on:dragstart="onDragStart"
		:data-path="file.path" :data-type="file.type" :data-start="file.start" :data-end="file.end" draggable="true">
		<div class="main-item-count" v-if="file.paths.length > 1">{{ file.paths.length }}</div>
	</div>-->
	</div>
</template>

<script>
	export default {
		props: ['files']
	}
</script>

