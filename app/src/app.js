import Vue from 'vue';

import TitleBar from './components/TitleBar.vue';
import HeaderView from './components/HeaderView.vue';
import FileView from './components/FileView.vue';

import { data, setWindow, setRange } from './js/ui.js';


var start = Date.parse('2019-03-21');
var end = Date.parse('2019-03-22');

setRange(start, end);
setWindow(start, end);

data.directories.push({
	name: 'test-long-dir-name',
	types: [],
	files: {},
	state: 'loading'
});


new Vue({
	el: '#app',
	data: {
		appName: 'chronargos'
	},
	components: { TitleBar, HeaderView, FileView }
});

