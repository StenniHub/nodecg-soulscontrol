<template>
  <div :style="{ position: 'fixed' }">
    <div v-if="name" :key="name" class="Flex" :style="{ position: 'absolute' }">
      <div
        :style="{
          'line-height': '12px',
          'margin-top': '15px',
        }"
      >
        <div ref="player">
          {{ name }}
          <span v-if="finishTime" :style="{ 'font-size': '0.75em' }">
            {{ finishTime }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, watch } from 'vue';
  import { $ref } from 'vue/macros';
  import {
    RunDataActiveRun,
    Timer,
  } from '../../../../../nodecg-speedcontrol/src/types';
  import { useReplicant } from 'nodecg-vue-composable';
  import fitty, { FittyInstance } from 'fitty';

  interface Props {
    size: number;
    team: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 56,
    team: 1,
  });

  const activeRun = useReplicant<RunDataActiveRun>(
    'runDataActiveRun',
    'nodecg-speedcontrol'
  );
  const timer = useReplicant<Timer>('timer', 'nodecg-speedcontrol');

  let timeout = 0;
  let teamI = 0;
  let index = 0;
  let name = $ref<string | null>(null);
  let playerFitty: FittyInstance | undefined = undefined;
  const player = $ref<HTMLDivElement | null>(null);

  const finishTime = computed<string | undefined>((): string | undefined => {
    if (activeRun && timer) {
      if (!activeRun.data || activeRun.data.teams.length <= 1) {
        return undefined;
      } else if (activeRun.data && timer.data) {
        const teamFinishTime =
          timer.data.teamFinishTimes[activeRun.data.teams[teamI].id];
        if (teamFinishTime) {
          if (teamFinishTime.state === 'completed') {
            return timer.data.teamFinishTimes[activeRun.data.teams[teamI].id]
              .time;
          } else if (teamFinishTime.state === 'forfeit') {
            return '';
          }
        }
      }
      return undefined;
    } else {
      return undefined;
    }
  });

  watch(
    () => activeRun?.data,
    (newValue) => {
      window.clearTimeout(timeout);
      teamI = props.team - 1;
      index = 0;
      name = null;
      const coop = !!(
        newValue &&
        newValue.teams.length === 1 &&
        newValue.teams[0].players.length >= 2
      );

      if (newValue) {
        if (coop && newValue.teams[0].players[teamI]) {
          name = newValue.teams[0].players[teamI].name;
        } else if (
          !coop &&
          newValue.teams[teamI] &&
          newValue.teams[teamI].players.length
        ) {
          showNextName();
        }
      }

      setTimeout(() => {
        if (player) {
          playerFitty = fitty(player, {
            maxSize: props.size,
            minSize: 48,
            multiLine: true,
          });
        }
      }, 300);
    },
    { immediate: true }
  );

  function showNextName(): void {
    if (activeRun) {
      if (!activeRun.data) {
        return;
      }
      const { players } = activeRun.data.teams[teamI];
      name = players[index].name;
      timeout = window.setTimeout(() => showNextName(), 30 * 1000);
      index = players.length <= index + 1 ? 0 : index + 1;
    }
  }

  onMounted(() => {
    setTimeout(() => {
      if (player) {
        playerFitty = fitty(player, {
          maxSize: props.size,
          minSize: 48,
          multiLine: true,
        });
      }
    }, 300);
  });
</script>
