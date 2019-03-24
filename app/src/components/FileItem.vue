<template>
	<div class="main-item" v-on:dragstart="onDragStart"	v-on:dblclick="onDoubleClick" :data-type="type" draggable="true">
		<div class="main-item-count" v-if="paths.length > 1">{{ paths.length }}</div>
	</div>
</template>

<script>
	import { data, doubleClickZoom } from '../js/ui.js';

	export default {
		props: ['paths', 'type', 'start', 'end'],
		data () {
			return data;
		},
		methods: {
			onDragStart: function(e) {
				e.preventDefault();
				e.dataTransfer.effectAllowed = 'copy';

				console.log('drag', this.paths);
			},
			onDoubleClick: function(e) {
				doubleClickZoom(this);
			}
		}
	}
</script>
