<template>
	<div class="settings-overlay" v-show="visible">
		<div class="settings-cancel-area" v-on:click="visible = false"></div>
		<div class="settings-box">
			<div class="settings-title">Preferences</div>
			<p>Will be implemented soon.</p>
			<multiple-choice-input :choices="choices"></multiple-choice-input>
			<button>Test</button>
		</div>
	</div>
</template>
<script>
	import MultipleChoiceInput from './MultipleChoiceInput.vue';

	export default {
		data() {
			return {
				choices: [
					{ title: 'Don\'t dock', desc: 'Position window manually where you want it to be' },
		   			{ title: 'Dock right', desc: 'Window is locked to the right side of the screen' }				
				],
				visible: false
			};
		},
		methods: {
			show: function() {
				this.visible = true;
			}
		},
		components: { MultipleChoiceInput }
	}
</script>
