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
	import { data } from '../js/ui.js';
	
	export default {
		methods: {
			onOpenDirClick: () => {
				var a = data.directories.push({
					name: 'test-long-dir-name',
					types: ['audio'],
					files: {},
					state: 'loading'
				});

				data.directories[a-1].files['audio'] = [
					{
						start: Date.parse('2019-03-21 08:00:00'),
						end: Date.parse('2019-03-21 15:00:00'),
						path: 'test'
					}
				];
			}
		}
	}
</script>
