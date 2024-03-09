<template>
  <div :style="{ position: 'fixed' }">
    <div
      v-if="activeRun && activeRun.data"
      :key="`${activeRun.data.game}${activeRun.data.category}`"
      class="Flex"
      :style="{ position: 'absolute', 'flex-direction': 'row', 'flex-wrap': 'wrap' }"
    >
      <div
        v-if="activeRun && activeRun.data"
        :style="{ 'white-space': 'normal', fontSize: '2em' }"
        ref="game"
        id="game"
      >
        {{ activeRun.data.category }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, watch } from 'vue';
  import { $ref } from 'vue/macros';
  import { RunDataActiveRun } from '../../../../../nodecg-speedcontrol/src/types';
  import { useReplicant } from 'nodecg-vue-composable';
  import fitty, { FittyInstance } from 'fitty';

  interface Props {
    scale: number;
    size: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    scale: 1,
    size: 56,
  });

  const activeRun = useReplicant<RunDataActiveRun>(
    'runDataActiveRun',
    'nodecg-speedcontrol'
  );
  const game = $ref<HTMLDivElement | null>(null);
  let gameFitty: FittyInstance | undefined = undefined;

  watch(
    () => activeRun?.data,
    () => {
      setTimeout(() => {
        if (game) {
          gameFitty = fitty(game, {
            maxSize: props.size,
            minSize: 1,
            multiLine: true,
          });
        }
      }, 500);
    },
    { immediate: true }
  );

  onMounted(() => {
    setTimeout(() => {
      if (game) {
        gameFitty = fitty(game, {
          maxSize: props.size,
          minSize: 1,
          multiLine: true,
        });
      }
    }, 500);
  });
</script>
