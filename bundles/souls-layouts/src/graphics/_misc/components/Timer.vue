<template>
  <div
    class="Flex"
    :style="{
      position: 'fixed',
      'justify-content': 'center',
      flexDirection: 'column',
      lineHeight: props.useSmallPadding ? '35px' : 'normal',
    }"
  >
    <div
      id="Time"
      v-if="timer && timer.data"
      :class="timer.data.state"
      :style="{
        'font-size': '4.5em',
        transition: '1s',
      }"
    >
      <span>
        {{ timer.data.time }}
      </span>
    </div>
    <div
      v-if="runDataActiveRun"
      :style="{
        'font-size': '2.5em',
        display: 'flex',
        'flex-direction': 'row',
        'justify-content': 'center',
      }"
    >
      EST:
      <div
        :style="{ 'margin-left': '10px', width: estimateWidth }"
        v-if="runDataActiveRun && runDataActiveRun.data"
      >
        <div
          id="Estimate"
          ref="Estimate"
          :key="`${runDataActiveRun.data.id}${runDataActiveRun.data.estimate}`"
        >
          <span>
            {{ runDataActiveRun.data.estimate }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { watch } from 'vue';
  import { $ref } from 'vue/macros';
  import {
    RunDataActiveRun,
    Timer,
  } from '../../../../../nodecg-speedcontrol/src/types';
  import { useReplicant } from 'nodecg-vue-composable';

  interface Props {
    useSmallPadding?: boolean;
  }

  const props = defineProps<Props>();

  const runDataActiveRun = useReplicant<RunDataActiveRun>(
    'runDataActiveRun',
    'nodecg-speedcontrol'
  );
  const timer = useReplicant<Timer>('timer', 'nodecg-speedcontrol');
  const estimate = $ref<HTMLDivElement | null>(null);
  let estimateWidth = '0px';
  watch(
    () => runDataActiveRun?.data,
    () => {
      estimateWidth = `${estimate?.clientWidth}px` || '0px';
    }
  );
</script>

<style scoped>
  .Flex {
    flex-direction: column;
  }

  /* Each character in the timer is in a span; setting width so the numbers appear monospaced. */
  #Time > span,
  #Estimate > span {
    display: inline-block;
    width: 100%;
  }
  #Time > .Colon,
  #Estimate > .Colon {
    width: 0.22em;
  }

  .stopped {
    color: #8d8d8d;
  }
  .running {
    color: #00ff82;
  }
  .paused {
    color: #fad7a7;
  }
  .finished {
    color: #00ff82;
  }
</style>
