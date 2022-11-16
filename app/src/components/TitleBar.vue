<script setup>
const props = defineProps({
	appName: String
});

function api(action) {
	window.api[action + 'Window']();
}
</script>
<template>
	<div class="window-title-bar">
		<span class="window-title">{{ appName }}</span>
		<div class="window-button-group">
			<div class="window-button window-close" @click="api('close')">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
					<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
				</svg>
			</div>
			<div class="window-button window-minimize" @click="api('minimize')">
				_
			</div>

			<div class="window-button window-maximize" @click="api('maximize')">
				+
			</div>
		</div>
	</div>
</template>
