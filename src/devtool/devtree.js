import Vue from 'vue';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import devtree from './devtree.vue';

Vue.use(ElementUI);
    new Vue({
        el: '#devtree',
        render: h => h(devtree)
});
