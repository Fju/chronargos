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
				<button>Apply changes</button>
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
				dock_choices: [
					{ title: 'Don\'t dock', desc: 'Position window manually where you want it to be' },
		   			{ title: 'Dock right', desc: 'Window is locked to the right side of the screen' },
					{ title: 'Dock left', desc: 'Window is locked to the left side of the screen'}			
				],
				display_choices: [
					{ title: 'Display 0 (Primary)', desc: '' },
					{ title: 'Display 1', desc: '' }
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
