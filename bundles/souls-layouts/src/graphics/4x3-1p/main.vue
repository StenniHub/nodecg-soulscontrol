<style>
  @import url('../_misc/common.css');
  @import url('../_misc/Fade.css');
  @import url('../_misc/Flex.css');
</style>

<script setup lang="ts">
  import Game from '../_misc/components/Game.vue';
  import Player from '../_misc/components/Player.vue';
  import Timer from '../_misc/components/Timer.vue';
</script>

<template>
  <div>
    <img src="./background.png" />
    <Game
      :style="{
        left: '43px',
        top: '236px',
        width: '495px',
        height: '144px',
      }"
    />
    <Player
      :style="{
        left: '43px',
        top: '444px',
        width: '495px',
        height: '144px',
      }"
    />
    <Timer
      :style="{
        left: '23px',
        top: '654px',
        width: '535px',
        height: '144px',
      }"
    />
  </div>
</template>
