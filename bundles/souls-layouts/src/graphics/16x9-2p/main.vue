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
        left: '730px',
        bottom: '147px',
        width: '486px',
        height: '88px',
        fontSize: '12px',
      }"
      :use-small-padding="true"
    />
    <Game
      :style="{
        left: '440px',
        bottom: '147px',
        width: '376px',
        height: '92px',
      }"
      :size="42"
    />
    <Player
      :style="{
        left: '45px',
        bottom: '145px',
        width: '486px',
        height: '92px',
      }"
     :team="1"
     key="team1"
    />
   <Player
      :style="{
        left: '1400px',
        bottom: '145px',
        width: '486px',
        height: '92px',
      }"
     :team="2"
     key="team2"
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
