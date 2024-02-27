<template>
  <div
    :style="{
      'font-size': '3em',
      color: 'black',
      backgroundColor: '#00ff82',
      display: 'flex',
      alignItems: 'center',
      float: 'right',
    }"
  >
    <div
      id="Total"
      ref="total"
      :style="{ marginLeft: '20px', marginRight: '20px' }"
    >
      $0
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import gsap from 'gsap';
  import { DonationTotal as DonationTotalType } from '@souls-layouts/types/schemas';
  import { $ref } from 'vue/macros';
  const donationTotal = nodecg.Replicant<DonationTotalType>(
    'donationTotal',
    'souls-layouts'
  );

  const data = { total: 0 };

  onMounted(() => {
    donationTotal.on('change', (newVal, oldVal) => {
      gsap.to(data, {
        duration: 2,
        total: newVal,
        roundProps: 'total',
        ease: 'power4',
        onUpdate: () => {
          total!.innerHTML =
            '$' +
            data.total.toLocaleString('en-US', {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            });
        },
      });
    });
  });

  const total = $ref<HTMLDivElement | null>(null);
</script>
