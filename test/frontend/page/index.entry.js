import './index.less';
import Vue from 'vue';
import App from './index.vue';

window.app = new Vue({
  el: '#app',
  render: h => h(App)
});
