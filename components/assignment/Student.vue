<script setup>
const props = defineProps({
  data: Object,
  required: true
})
const my = useMyStore()
const visible = ref(false);

const st = ref()
if (my.mathalea) st.value = my.mathalea.students.find(s => s.uid == props.data.sa_uid).evaluations

const getStyle = function (score, scoreMax) {
  // Couleurs de  ff0000 -> ffff00 -> 00ff00
  // pour Score/scoreMax de 
  //              0      -> 0.5    -> 1
  const r = Math.min(255, 510 - parseInt(510 * score / scoreMax));
  const g = Math.min(255, parseInt(510 * score / scoreMax));
  const idle = ''
  if (score != null) return "background-color: #" + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + "00"
  return idle
}
</script>

<template>
  <div>
    <!-- <a :href="data.player" class="clickable"> -->
    <!--     {{ data.fullname }} -->
    <!-- </a> -->
    <span @click.exact.stop="visible = true" v-on:click.ctrl="console.log('youpi')" class="clickable"> {{ data.fullname }} </span>
    <FullIframe v-model="visible" :url="data.player" :position="'top'" />
    <div v-if="my.mathalea.totalScoreMax && false" class="flex flex-row gap-2">
      <Tag v-for="(e, idx) in my.mathalea.evaluations" :key="e.label" :style="getStyle(st[idx].score, e.scoreMax)">
        <span>{{ st[idx].score }} / {{ e.scoreMax }}</span>
      </Tag>
    </div>
  </div>
</template>
