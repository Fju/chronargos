<template>
	<div class="footer">
		<div class="footer-button" id="open-dir" v-on:click="onOpenDirClick">
			<i class="fas fa-folder-open"></i> Open dir
		</div>
		<div class="footer-button">
			<i class="fas fa-cog"></i>
		</div>
	</div>
</template>

<script>
	import { data, loadDirectory } from '../js/ui.js';
		
	export default {
		methods: {
			onOpenDirClick: loadDirectory
		}
	}
</script>
