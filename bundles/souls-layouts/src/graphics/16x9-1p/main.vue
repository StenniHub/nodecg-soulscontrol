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
    <Timer
      :style="{
        left: '10px',
        bottom: '143px',
        width: '486px',
        height: '88px',
        fontSize: '12px',
      }"
      :use-small-padding="true"
    />
    <Game
      :style="{
        left: '-90px',
        bottom: '445px',
        width: '676px',
        height: '92px',
      }"
      :size="42"
    />
    <Player
      :style="{
        left: '0px',
        bottom: '582px',
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
