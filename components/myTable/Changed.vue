<script setup>
const props = defineProps({
  changed: String,
  required: true
})

function timeElapsed(ts) {
    var now = new Date().getTime();
    var difference = now - ts;
    var secondes = Math.floor(difference / 1000);
    var minutes = Math.floor(secondes / 60);
    var heures = Math.floor(minutes / 60);
    var jours = Math.floor(heures / 24);
    var mois = Math.floor(jours / 30);
    var ans = Math.floor(mois / 12);

    if (ans > 0) return ans + " ans"
    if (mois > 0) return mois + " mois"
    if (jours > 0) return jours + " jours"
    if (heures > 0) return heures + " heures"
    if (minutes > 0) return minutes + " minutes"
    if (secondes > 0) return secondes + " secondes"
}

</script>

<template>
  <!-- {{ ts2local(changed) }} -->
  Il y a {{ timeElapsed(changed *1000 ) }}
</template>

