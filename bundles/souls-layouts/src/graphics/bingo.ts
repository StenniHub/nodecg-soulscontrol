import { createHead } from '@vueuse/head';
import { createApp } from 'vue';
import App from './bingo/main.vue';
import 'animate.css';

const app = createApp(App);
const head = createHead();
app.use(head);
app.mount('#app');
