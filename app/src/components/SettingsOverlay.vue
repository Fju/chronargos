<template>
	<div class="settings-overlay" v-show="visible">
		<div class="settings-cancel-area" v-on:click="visible = false"></div>
		<div class="settings-box">
			<div class="settings-main">
				<h1>Preferences</h1>
				<p>
					<h2>Dock mode</h2>
					<multiple-choice-input :choices="dock_choices" ref="dock_choices"></multiple-choice-input>
				</p>
				
				<p>
					<h2>Dock on display</h2>
					<multiple-choice-input :choices="display_choices" ref="display_choices"></multiple-choice-input>
				</p>
				<p></p>
				<p>
					<h2>Other options</h2>
					<a href="" v-on:click.prevent="openLink('https://github.com/Fju/chronargos/issues')">Report bugs</a>
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
	import { shell } from 'electron';

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
				var new_dock_mode = this.$refs.dock_choices.getValue();
				var new_display_id = this.$refs.display_choices.getValue();

				if (new_dock_mode !== undefined) dock.dock_mode = new_dock_mode;
				if (new_display_id !== undefined) dock.display_id = new_display_id;

				dock.setWindowLocation();
			},
			openLink: function(href) {
				shell.openExternal(href);
			}
		},
		components: { MultipleChoiceInput }
	}
</script>
