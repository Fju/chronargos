<template>
	<div class="settings-overlay" v-show="visible">
		<div class="settings-box">
			<h1>Settings</h1>
			<p>Will be implemented soon.</p>
			<button>Test</button>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				visible: false
			};
		},
		methods: {
			show: function() {
				this.visible = true;
			}
		}
	}
</script>
