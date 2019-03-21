<template>
	<div class="main" v-on:mousemove="onMousemove">
		<timeline v-if="directories.length > 0"></timeline>
		<file-column v-for="dir in fileColumns" :key="dir.id" :style="dir.style" v-bind:files="dir.files" :types="dir.types"></file-column>
	</div>
</template>

<script>
	import FileColumn from './FileColumn.vue';
	import Timeline from './Timeline.vue';

	import { COL_PADDING, COL_ITEM_WIDTH } from '../js/globals.js';

	import { data } from '../js/ui.js';

	export default {
		data () {
			return data;
		},
		computed: {
			fileColumns: function () {
				return data.directories.map(dir => {
					var col_width = Math.max(1, dir.types.length) * (COL_ITEM_WIDTH + COL_PADDING) + COL_PADDING;
					return {
						files: dir.files,
						types: dir.types,
						style: { width: col_width + 'px' }
					}
				});
			}
		},
		methods: {
			// save mouse position for scrolling
			onMousemove: (e) => {
				data.mouse_pos_y = e.offsetY / e.target.clientHeight;
			}
		},
		components: { FileColumn, Timeline }
	}	
</script>
