<script setup>
const props = defineProps({
  changed: String,
  required: true
})

// const toTimestamp = (strDate) => {
//   const dt = Date.parse(strDate);
//   return dt;
// }

// const ts2local = function (ts) {
//   var options_old = {
//     year: "2-digit",
//     month: "short",
//     day: "numeric",
//   };
//   var options_recent = {
//     month: "short",
//     day: "numeric",
//     hour: 'numeric',
//     minute: '2-digit'
//   };
//   var options_very_old = {
//     year: "numeric",
//     month: "short",
//   };
//   let now = new Date()
//   if (now.getTime() / 1000 - ts < 60 * 60 * 24) {
//     return new Date(ts * 1000).toLocaleString('fr-FR', options_recent)
//   }
//   if (now.getFullYear == Date(ts * 1000).getFullYear) {
//     return new Date(ts * 1000).toLocaleString('fr-FR', options_old)
//   }
//   return new Date(ts * 1000).toLocaleString('fr-FR', options_very_old)
// }

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

    // var resultat = ans + " ans " 
    //  + mois % 12 + " mois " 
    //  + jours % 30 + " jours, " 
    //  + heures % 24 + " heures, " 
    //  + minutes % 60 + " minutes et " 
    //  + secondes % 60 + " secondes.";
    // return resultat;
}

</script>

<template>
  <!-- {{ ts2local(changed) }} -->
  Il y a {{ timeElapsed(changed *1000 ) }}
</template>

