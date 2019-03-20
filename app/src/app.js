import Vue from 'vue';

//import App from './App.vue';
import TitleBar from './components/TitleBar.vue';

new Vue({
	el: '#app',
	data: {
		appName: 'chronargos'
	},
	components: { TitleBar }
});

