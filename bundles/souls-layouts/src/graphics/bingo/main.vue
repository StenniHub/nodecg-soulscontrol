<template>
  <div>
    <img src="./background.png" />
    <Timer
      :style="{
        left: '804px',
        bottom: '867px',
        width: '313px',
        height: '85px',
        fontSize: '12px',
      }"
      :use-small-padding="true"
    />
    <Game
      :style="{
        left: '804px',
        bottom: '751px',
        width: '313px',
        height: '85px',
      }"
      :size=36
    />
    <Player
      :style="{
        left: '543px',
        bottom: '977px',
        width: '207px',
        height: '62px',
      }"
     :team="1"
     key="team1"
     :size=32
    />
   <Player
      :style="{
        left: '543px',
        bottom: '525px',
        width: '207px',
        height: '62px',
      }"
     :team="2"
     key="team2"
     :size=32
    />
 <Player
      :style="{
        left: '1695px',
        bottom: '525px',
        width: '207px',
        height: '62px',
      }"
    :team="3"
    key="team3"
    :size=32
    />
    <Player
      :style="{
        left: '1695px',
        bottom: '977px',
        width: '207px',
        height: '62px',
      }"
    :team="4"
    key="team4"
    :size=32
    />
    <Player
      :style="{
        left: '804px',
        bottom: '635px',
        width: '313px',
        height: '62px',
      }"
    :team="5"
    key="team5"
    :size=26
    />
    <UpcomingRun
      :run-data="onDeck"
      :style="{
        left: '768px',
        bottom: '35px',
        width: '1077px',
        height: '100px',
      }"
    />
    <UpcomingRun
      :run-data="nextRun"
      :style="{
        left: '102px',
        bottom: '35px',
        width: '600px',
        height: '100px',
      }"
    />
  </div>
</template>

<script setup lang="ts">
  import Game from '../_misc/components/Game.vue';
  import Player from '../_misc/components/Player.vue';
  import Timer from '../_misc/components/Timer.vue';
  import UpcomingRun from '../_misc/components/UpcomingRun.vue';
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
    console.log("test");
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

<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>