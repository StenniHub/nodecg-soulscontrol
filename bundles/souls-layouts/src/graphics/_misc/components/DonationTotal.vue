<template>
  <div class="Flex" :style="{ 'font-size': '3em', position: 'fixed' }">
    <div id="Total">
      <span
        v-for="char in total.split('')"
        :key="`${Math.random()}${char}`"
        :class="char === ',' ? 'Comma' : undefined"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useReplicant } from 'nodecg-vue-composable';
  import { computed, watch } from 'vue';
  import gsap from 'gsap';
  import { DonationTotal as DonationTotalType } from '@souls-layouts/types/schemas';
  const donationTotal = useReplicant<DonationTotalType>(
    'donationTotal',
    'souls-layouts'
  );

  let tweened = 0;

  watch(
    () => donationTotal?.data,
    (newVal, oldVal) => {
      if (newVal != undefined && oldVal != undefined) {
        const data = { total: oldVal };
        gsap.to(data, {
          duration: 1,
          total: newVal,
          ease: 'none',
          onUpdate: () => {
            tweened = data.total;
          },
        });
      }
    }
  );

  const total = computed(() => {
    return `$${tweened.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })}`;
  });
</script>
