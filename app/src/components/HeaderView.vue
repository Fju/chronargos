<template>
	<div class="header">
		<div class="header-item" v-for="(dir, index) in directories" :style="getHeaderItemStyle(dir)">
			<div class="header-button-group">
				<div class="header-button" v-on:click="onHeaderSettingsClick"><i class="fas fa-cog"></i></div>
				<div class="header-button header-button-close" v-on:click="onHeaderCloseClick(index)"><i class="fas fa-times"></i></div>
			</div>
			<div class="header-title">{{ dir.name }}</div>
			<div class="header-state">
				<div class="header-state-loader" :data-state="dir.state"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import { directories, COL_PADDING, COL_ITEM_WIDTH } from '../js/globals.js';
	
	export default {
		data () {
			return {
				directories: directories
			}
		},
		methods: {
			getHeaderItemStyle: dir => {
				var width = Math.max(1, dir.types.length) * (COL_ITEM_WIDTH + COL_PADDING) + COL_PADDING;				
				return { width: width + 'px' }
			},
			onHeaderSettingsClick: e => {
				console.log('open settings');
			},
			onHeaderCloseClick: idx => {
				console.log(idx);
			}
		}
	}
</script>

