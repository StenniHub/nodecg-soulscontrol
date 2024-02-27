<template>
  <div
    id="Ticker"
    :style="{
      overflow: 'hidden',
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }"
  >
    <transition
      enter-active-class="animate__animated animate__slideInDown"
      leave-active-class="animate__animated animate__slideOutDown"
      mode="out-in"
      ><component
        :is="currentComponent.name"
        :key="timestamp"
        :data="currentComponent.data"
        @end="showNextMsg"
    /></transition>
  </div>
</template>

<script setup lang="ts">
  import { $ref } from 'vue/macros';
  import GenericMessage from './Ticker/GenericMessage.vue';
  import NextRun from './Ticker/NextRun.vue';
  import NextGoal from './Ticker/NextGoal.vue';
  import Donation from './Ticker/Donation.vue';
  import { Donation as DonationType } from '@souls-layouts/types';
  import { onMounted } from 'vue';
  import {
    Configschema,
    DonationGoals,
    DonationsShown,
    DonationsToShow,
  } from '@souls-layouts/types/schemas';
  import {
    RunDataActiveRun,
    RunDataArray,
  } from '../../../../../nodecg-speedcontrol/src/types';

  const runs = nodecg.Replicant<RunDataArray>(
    'runDataArray',
    'nodecg-speedcontrol'
  );
  const activeRun = nodecg.Replicant<RunDataActiveRun>(
    'runDataActiveRun',
    'nodecg-speedcontrol'
  );
  const donationGoals = nodecg.Replicant<DonationGoals>('donationGoals');
  const donationsToShow = nodecg.Replicant<DonationsToShow>('donationsToShow');
  const donationsShown = nodecg.Replicant<DonationsShown>('donationsShown');
  const currentOBSScene = nodecg.Replicant<string>('currentOBSScene');
  const intermission = (nodecg.bundleConfig as Configschema).obs.names.scenes
    .intermission;

  let currentComponent = $ref<{ name: any; data: Object }>({
    name: '',
    data: {},
  });
  let currentComponentIndex = 0;
  let timestamp = $ref(Date.now());
  let messageTypes: any[] = [];
  let intermissionMessageTypes: any[] = [];

  onMounted(() => {
    NodeCG.waitForReplicants(
      runs,
      activeRun,
      donationGoals,
      donationsShown,
      donationsToShow,
      currentOBSScene
    ).then(() => {
      messageTypes = [
        soulsPromo(),
        donatePromo(),
        schedulePromo(),
        subPromo(),
        nextRun(),
        nextGoal(),
      ];
      intermissionMessageTypes = [
        soulsPromo(),
        donatePromo(),
        schedulePromo(),
        subPromo(),
        nextGoal(),
      ];
      currentComponent = messageTypes[0];
    });
  });

  function showNextMsg() {
    console.log('SHOWING NEXT MESSAGE');
    if (currentOBSScene.value != intermission) {
      if (donationsToShow.value!.length > 0) {
        currentComponent = donation(donationsToShow.value![0]);
        donationsShown.value!.push(donationsToShow.value![0].id);
        donationsToShow.value!.shift();
      } else {
        currentComponentIndex += 1;
        if (currentComponentIndex >= messageTypes.length) {
          currentComponentIndex = 0;
        }
        currentComponent = messageTypes[currentComponentIndex];
      }
    } else {
      if (donationsToShow.value!.length > 0) {
        currentComponent = donation(donationsToShow.value![0]);
        donationsShown.value!.push(donationsToShow.value![0].id);
        donationsToShow.value!.shift();
      } else {
        currentComponentIndex += 1;
        if (currentComponentIndex >= intermissionMessageTypes.length) {
          currentComponentIndex = 0;
        }
        currentComponent = intermissionMessageTypes[currentComponentIndex];
      }
    }

    timestamp = Date.now();
  }

  function genericMsg(msg: string) {
    return {
      name: GenericMessage,
      data: {
        msg,
      },
    };
  }

  function soulsPromo() {
    return genericMsg(
      'Welcome to <span class="highlight">GTU 2023</span>! Enjoy the show!'
    );
  }

  function donatePromo() {
    return genericMsg(
      'We are raising money for <span class="highlight">Save The Children</span> - <span class="highlight">!donate</span> in chat to join the cause!'
    );
  }
  function schedulePromo() {
    return genericMsg(
      `Type <span class="highlight">!schedule</span> in the chat to see what's on next!`
    );
  }
  function subPromo() {
    return genericMsg(
      'All <span class="highlight">Twitch subs, Prime subs and bits</span> go straight to charity!'
    );
  }

  function nextRun() {
    return {
      name: NextRun,
    };
  }

  function donation(donation: DonationType) {
    const donationText = `New <b class="highlight">$${donation.amount.toLocaleString(
      'en-US',
      { maximumFractionDigits: 0 }
    )}</b> donation from <span class="highlight">${donation.name}</span>`;
    return {
      name: Donation,
      data: {
        msg: donationText,
      },
    };
  }

  function nextGoal() {
    return {
      name: NextGoal,
    };
  }
</script>
