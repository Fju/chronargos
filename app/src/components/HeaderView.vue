<template>
	<div class="header">
		<div class="header-item" v-for="(dir, index) in directories" :style="getHeaderItemStyle(dir)">
			<div class="header-button-group">
				<div class="header-button" v-on:click="onHeaderSettingsClick"><i class="fas fa-cog"></i></div>
				<div class="header-button header-button-close" v-on:click="onHeaderCloseClick(index)"><i class="fas fa-times"></i></div>
			</div>
			<div class="header-title" v-on:click="showTitleInput(index)">
				<input type="text" ref="titleInput" v-model="dir.name" v-on:blur="hideTitleInput(index)" v-on:keypress.enter="hideTitleInput(index)" style="display: none"/>
				<span v-show="!dir.edit">{{ dir.name }}</span>
			</div>
			<div class="header-state">
				<div class="header-state-loader" :data-state="dir.state"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import { COL_PADDING, COL_ITEM_WIDTH } from '../js/globals.js';
	import { data } from '../js/ui.js';
	
	export default {
		data () {
			return data;
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
				data.directories.splice(idx, 1);
			},
			showTitleInput: function(idx) {
				this.directories[idx].edit = true;
				var input = this.$refs.titleInput[idx];
				input.removeAttribute('style');
				input.focus();
			},
			hideTitleInput: function(idx) {
				this.directories[idx].edit = false;
				this.$refs.titleInput[idx].setAttribute('style', 'display: none');				
			}
		}
	}
</script>

