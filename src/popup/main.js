import Vue from 'vue';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import popup from './popup.vue';
Vue.use(ElementUI);

new Vue({
  el: '#popup',
  render: h => h(popup)
});
