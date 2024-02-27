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
        left: '130px',
        bottom: '243px',
        width: '486px',
        height: '88px',
        fontSize: '12px',
      }"
      :use-small-padding="true"
    />
    <Game
      :style="{
        left: '205px',
        bottom: '133px',
        width: '376px',
        height: '92px',
      }"
      :size="42"
    />
    <Player
      :style="{
        left: '495px',
        bottom: '342px',
        width: '486px',
        height: '92px',
      }"
     :team="1"
     key="team1"
    />
   <Player
      :style="{
        left: '495px',
        bottom: '239px',
        width: '486px',
        height: '92px',
      }"
     :team="2"
     key="team2"
    />
   <Player
      :style="{
        left: '495px',
        bottom: '130px',
        width: '486px',
        height: '92px',
      }"
     :team="3"
     key="team3"
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
