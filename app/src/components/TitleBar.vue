<template>
	<div class="window-title-bar">
		<span class="window-title">{{ appName }}</span>
		<div class="window-button-group">
			<div class="window-button window-close" v-on:click="onCloseClick">
				<i class="fas fa-times"></i>
			</div>
			<div class="window-button window-minimize" v-on:click="onMinimizeClick">
				<i class="fas fa-window-minimize"></i>
			</div>

			<div class="window-button window-maximize" v-on:click="onMaximizeClick">
				<i class="fas fa-plus"></i>
			</div>
		</div>
	</div>
</template>

<script>
	import { remote } from 'electron';
	
	let win = remote.getCurrentWindow();

	export default {
		props: ['appName'],
		methods: {
			onCloseClick: () => {
				remote.app.quit();
			},
			onMaximizeClick: () => {
				if (win.isMaximized()) win.unmaximize();
				else win.maximize();
			},
			onMinimizeClick: () => {
				win.minimize();
			}
		}
	}
</script>

