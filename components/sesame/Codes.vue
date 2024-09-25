<script setup>
// import sesame from "@capytale/activity.js/backend/capytale/sesame";
const props = defineProps({
  codelist: Object,
  authenticated: Boolean,
})

// useListen('delCodeEvent', (code) => {
//   //console.log("del:", code)
//   var idx = codelist.value.findIndex((x) => { return x.code === code })
//   codelist.value.splice(idx, 1)
//   isEmpty.value = (codelist.value.length == 0) ? true : false;
// })
//
// useListen('createCodeEvent', (code) => {
//   code.code = code.code.slice(0, 3) + " " + code.code.slice(3, 6) + " " + code.code.slice(6, 9),
//     code.count = code.max_count - code.count + "/" + code.max_count;
//   code.exp = code.exp.toLocaleString('fr-FR')
//   code.require_mail = code.require_mail ? '📧' : ''
//   codelist.value.push(code);
//   isEmpty.value = (codelist.length == 0) ? true : false;
//   const element = document.getElementById("anchor");
//   element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
// });

console.log('codelist2:', props.codelist)
console.log('authenticated2:', props.authenticated)
const delCode = (code) => {
  console.log("code to delete :", code)
}
</script>

<template>
  <template v-if="!props.authenticated">
    <div class="vip">Vous devez être connecté avec le rôle enseignant pour voir la liste des codes Sésame valides.</div>
  </template>
  <template v-else>
    <DataTable :value="props.codelist" tableStyle="min-width: 50rem">
      <Column field="code" header="Code Sésame"></Column>
      <Column field="require_mail" header=""></Column>
      <Column field="classe" header="Classe"></Column>
      <Column field="count" header="Comptes disponibles"></Column>
      <Column field="exp" header="Expire"></Column>
      <Column field="code">
        <template #body="p">
          <i @click="delCode(p.data.code)" class="text-red-500 cursor-pointer">X</i>
        </template>
      </Column>
    </DataTable>
  </template>
</template>
