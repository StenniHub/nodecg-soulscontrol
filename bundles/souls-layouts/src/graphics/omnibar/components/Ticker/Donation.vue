<template>
  <div id="Donation" :style="{ fontSize: '40px' }" v-html="data.msg"></div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  interface Props {
    data: { msg: string };
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['end']);

  onMounted(() => {
    console.log('Donation: Mounted');
    setTimeout(() => {
      emit('end');
      console.log('Donation: ended');
    }, 10 * 1000);
  });
</script>
