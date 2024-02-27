import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import App from './4x3-1p/main.vue';
import 'animate.css';

const app = createApp(App);
const head = createHead();
app.use(head);
app.mount('#app');
