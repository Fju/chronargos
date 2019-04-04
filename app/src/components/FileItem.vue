<template>
	<div class="main-item" v-on:dragstart="onDragStart"	v-on:dblclick="onDoubleClick" :data-type="type" draggable="true">
		<div class="main-item-count" v-if="paths.length > 1">{{ paths.length }}</div>
	</div>
</template>

<script>
	import { data, doubleClickZoom } from '../js/ui.js';
	import { ipcRenderer } from 'electron';

	export default {
		props: ['paths', 'type', 'start', 'end'],
		data () {
			return data;
		},
		methods: {
			onDragStart: function(e) {
				e.preventDefault();
				e.dataTransfer.effectAllowed = 'copy';

				//e.dataTransfer.setData('electron/file-paths', this.paths.join(path.delimiter));
				ipcRenderer.send('ondragstart', this.paths);
				//console.log('drag', this.paths);
			},
			onDoubleClick: function(e) {
				doubleClickZoom(this);
			}
		}
	}
</script>
