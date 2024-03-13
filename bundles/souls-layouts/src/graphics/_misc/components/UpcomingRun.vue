<template>
  <div :style="{ position: 'fixed' }">
    <transition name="fade">
      <div
        v-if="!runData"
        :key="'over'"
        class="Flex"
        :style="{ 'font-size': '3em' }"
      >
        It's Over 😔
      </div>
      <div
        v-else
        :key="runData.id"
        class="Flex"
        :style="{ flexDirection: 'column' }"
      >
        <div :style="{ 'font-size': '3em' }" id="game">
          {{runData.category}}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import fitty, { FittyInstance } from 'fitty';
  import { RunData } from '../../../../../nodecg-speedcontrol/src/types';
  import { onMounted, watch } from 'vue';

  interface Props {
    runData: RunData | null;
  }

  const props = defineProps<Props>();
  let $_fittyGame: FittyInstance[] | undefined;
  let $_fittyCategory: FittyInstance[] | undefined;

  watch(
    () => props.runData,
    () => {
      setTimeout(() => {
        fitText();
      }, 200);
    },
    { immediate: true }
  );

  onMounted(() => {
    setTimeout(() => {
      fitText();
    }, 200);
  });

  function fitText() {
    $_fittyGame = fitty('#game', { minSize: 1, maxSize: 48 });
  }
</script>
