<template>
	<div class="main-item" v-on:dragstart="onDragStart"	:data-type="type" :data-start="start" :data-end="end" draggable="true">
		<div class="main-item-count" v-if="paths.length > 1">{{ paths.length }}</div>
	</div>
</template>

<script>
	
	import { data } from '../js/ui.js';

	export default {
		props: ['paths', 'type', 'start', 'end'],
		data () {
			return data;
		},
		methods: {
			onDragStart: e => {
				e.preventDefault();
			}
		}
	}
</script>
