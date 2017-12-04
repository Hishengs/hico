import Vue from 'vue';
import App from './app.vue';

window.app = new Vue({
	el: '#app',
	render: h => h(App)
});
