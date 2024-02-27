<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>

<script setup lang="ts">
  import Game from '../_misc/components/Game.vue';
  import Player from '../_misc/components/Player.vue';
  import Timer from '../_misc/components/Timer.vue';

 import UpcomingRun from './components/UpcomingRun.vue';
  import { RunData } from '../../../../nodecg-speedcontrol/src/types';
  import {
    RunDataActiveRunSurrounding,
    RunDataArray,
  } from '../../../../nodecg-speedcontrol/src/types/schemas';
  import { useReplicant } from 'nodecg-vue-composable';
  import { onMounted } from 'vue';
  import { watch } from 'vue';
  import { $ref } from 'vue/macros';

  const runDataArray = useReplicant<RunDataArray>(
    'runDataArray',
    'nodecg-speedcontrol'
  );
  const runDataActiveRunSurrounding = useReplicant<RunDataActiveRunSurrounding>(
    'runDataActiveRunSurrounding',
    'nodecg-speedcontrol'
  );
  let nextRun: RunData | null = $ref(null);
  let onDeckArr: RunData[] = $ref([]);

  function updateNextRuns() {
    if (
      runDataArray &&
      runDataArray.data &&
      runDataActiveRunSurrounding &&
      runDataActiveRunSurrounding.data
    ) {
      let runIndex = runDataArray.data.findIndex(
        (run) => run.id === runDataActiveRunSurrounding.data!.current
      );
      nextRun = runDataArray.data[runIndex] || null;
      if (runDataActiveRunSurrounding.data!.next) {
        runIndex = runIndex < 0 ? 1 : runIndex + 1;
        onDeckArr = runDataArray.data!.slice(runIndex, runIndex + 3);
      } else {
        onDeckArr = [];
      }
    }
  }

  onMounted(() => {
    setTimeout(() => {
      updateNextRuns();
    }, 200);

    nodecg.listenFor('refreshIntermission', () => updateNextRuns());
  });

  // Update/cycle the "on deck" run when needed.
  let onDeck: RunData | null = $ref(null);
  let onDeckIndex = 0;
  let onDeckInterval = 0;
  watch(
    () => onDeckArr,
    () => {
      window.clearInterval(onDeckInterval);
      onDeckIndex = 0;
      if (onDeckArr.length) {
        cycleOnDeck();
        onDeckInterval = window.setInterval(cycleOnDeck, 10000);
      } else {
        onDeck = null;
      }
    },
    { immediate: true }
  );

  watch(
    () => runDataActiveRunSurrounding?.data?.current,
    () => {
      updateNextRuns();
    },
    { immediate: true }
  );

  function cycleOnDeck(): void {
    onDeck = onDeckArr[onDeckIndex];
    onDeckIndex += 1;
    if (onDeckIndex >= onDeckArr.length) {
      onDeckIndex = 0;
    }
  }
</script>

<template>
  <div>
    <img src="./background.png" />
    <Timer
      :style="{
        left: '740px',
        bottom: '487px',
        width: '486px',
        height: '88px',
        fontSize: '12px',
      }"
      :use-small-padding="true"
    />
   <UpcomingRun
      :run-data="onDeck"
      :style="{
        left: '450px',
        top: '935px',
        width: '1080px',
        height: '120px',
      }"
    />
    <Game
      :style="{
        left: '780px',
        bottom: '370px',
        width: '376px',
        height: '92px',
      }"
      :size="37"
    />
    <Player
      :style="{
        left: '730px',
        bottom: '620px',
        width: '486px',
        height: '92px',
      }"
    />
 <Commentator
      :style="{
        left: '0px',
        bottom: '382px',
        width: '486px',
        height: '92px',
      }"
    />
  </div>
</template>