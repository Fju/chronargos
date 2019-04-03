<template>
	<div class="settings-overlay" v-show="visible">
		<div class="settings-cancel-area" v-on:click="visible = false"></div>
		<div class="settings-box">
			<div class="settings-main">
				<h1>Preferences</h1>
				<p>
					<h2>Dock mode</h2>
					<multiple-choice-input :choices="dock_choices"></multiple-choice-input>
				</p>
				
				<p>
					<h2>Dock on display</h2>
					<multiple-choice-input :choices="display_choices"></multiple-choice-input>
				</p>
			</div>
			<div class="settings-button-group">
				<button v-on:click="onApplyClick">Apply changes</button>
				<button>Restore defaults</button>
			</div>
		</div>
	</div>
</template>
<script>
	import MultipleChoiceInput from './MultipleChoiceInput.vue';
	import dock from '../js/dock.js';

	export default {
		data() {
			return {
				dock_choices: dock.dock_choices,
				display_choices: dock.display_choices,
				visible: false
			};
		},
		methods: {
			show: function() {
				this.visible = true;
			},
			onApplyClick: function() {
				dock.setWindowLocation();
			}
		},
		components: { MultipleChoiceInput }
	}
</script>
