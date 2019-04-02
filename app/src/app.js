import Vue from 'vue';

import TitleBar from './components/TitleBar.vue';
import HeaderView from './components/HeaderView.vue';
import FileView from './components/FileView.vue';
import FooterView from './components/FooterView.vue';
import SettingsOverlay from './components/SettingsOverlay.vue';

import { data, setWindow, setRange } from './js/ui.js';

new Vue({
	el: '#app',
	data: {
		appName: 'chronargos'
	},
	components: { TitleBar, HeaderView, FileView, FooterView, SettingsOverlay },
});

