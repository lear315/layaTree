import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import devtree from './devtree.vue';
import node2dproperty from './node2dproperty.vue';
import node3dproperty from './node3dproperty.vue';
import uiprop from '../comp/uiprop.vue';
import VueResource from 'vue-resource';

Vue.component('uiprop', uiprop);
Vue.component('node2dproperty', node2dproperty);
Vue.component('node3dproperty', node3dproperty);

Vue.use(VueResource);
Vue.use(ElementUI);
new Vue({
    el: '#devtree',
    render: h => h(devtree)
});
