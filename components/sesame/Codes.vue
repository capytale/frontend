<script setup lang="ts">
import sesame from "@capytale/activity.js/backend/capytale/sesame";

const columns = [
  { key: 'code', label: 'Code Sésame' },
  { key: 'require_mail', label: '' },
  { key: 'classe', label: 'Classe', sortable: true },
  { key: 'count', label: 'Comptes disponibles' },
  { key: 'exp', label: 'Expire', sortable: true },
  { key: 'del', label: '' },
];
const codelist = ref<any[]>([]);
const authenticated = ref(false);
const isEmpty = ref(true);

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
//
//
const getDataFromApi = async function () {
  try {
    const list = await sesame.listCodes()
    // console.log(list.length)
    const myList = list.map(obj => {
      return {
        ...obj,
        code: obj.code.slice(0, 3) + " " + obj.code.slice(3, 6) + " " + obj.code.slice(6, 9),
        count: obj.max_count - obj.count + "/" + obj.max_count,
        exp: obj.exp.toLocaleString('fr-FR'),
        require_mail: obj.require_mail ? '📧' : ''
      };
    });
    authenticated.value = true;
    codelist.value = myList;
    isEmpty.value = (list.length == 0) ? true : false;
  } catch {
    authenticated.value = false;
  }
}

getDataFromApi();


const delCode = (code) => {
  console.log("code to delete :", code)
}
</script>

<template>
  <template v-if="!authenticated">
    <div class="vip">Vous devez être connecté avec le rôle enseignant pour voir la liste des codes Sésame valides.</div>
  </template>
  <template v-else>
    <DataTable :value="codelist" tableStyle="min-width: 50rem">
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
