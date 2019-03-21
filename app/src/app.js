import Vue from 'vue';

import TitleBar from './components/TitleBar.vue';
import HeaderView from './components/HeaderView.vue';

import { directories } from './js/globals.js';

directories.push({
	name: 'test-long-dir-name',
	types: [],
	files: {},
	state: 'loading'
});

//console.log(directories);

new Vue({
	el: '#app',
	data: {
		appName: 'chronargos'
	},
	components: { TitleBar, HeaderView }
});

