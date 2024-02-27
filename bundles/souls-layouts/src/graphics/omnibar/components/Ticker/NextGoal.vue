<template>
  <div id="NextGoal" :style="{ fontSize: '40px' }" v-html="msg"></div>
</template>

<script setup lang="ts">
  import { DonationGoals, DonationTotal } from '@souls-layouts/types/schemas';
  import { onMounted } from 'vue';
  import { $ref } from 'vue/macros';

  const donationTotal = nodecg.Replicant<DonationTotal>('donationTotal');
  const donationGoals = nodecg.Replicant<DonationGoals>('donationGoals');

  let msg = $ref('');
  const emit = defineEmits(['end']);

  function getNextGoal() {
    let goal = null;
    if (donationGoals.value && donationTotal.value) {
      for (let index = 0; index < donationGoals.value.length; index++) {
        if (donationTotal.value <= donationGoals.value[index].amount) {
          goal = donationGoals.value[index];
          break;
        }
      }
    }
    return goal;
  }

  onMounted(() => {
    setTimeout(() => {
      const nextGoal = getNextGoal();
      if (nextGoal) {
        msg = `Next goal: ${
          nextGoal.name
        } - <span class="highlight">$${donationTotal.value!.toLocaleString('en-US', {
          maximumFractionDigits: 0,
        })}/$${nextGoal.amount.toLocaleString('en-US', {
          maximumFractionDigits: 0,
        })}</span>`;
      } else {
        emit('end');
      }
    }, 200);

    console.log('NextGoal: Mounted');
    setTimeout(() => {
      emit('end');
      console.log('NextGoal: ended');
    }, 20 * 1000);
  });
</script>
