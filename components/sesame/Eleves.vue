<script setup>

const props = defineProps({
  usersList: Object,
  authenticated: Boolean,
})

console.log(props.usersList)
</script>

<template>
  <template v-if="!props.authenticated">
    <div class="vip">Vous devez être connecté avec le rôle enseignant pour voir la liste des codes Sésame valides.</div>
  </template>
  <template v-else>
    <p>
      Vous pouvez modifier les nom, prénom et classe de vos élèves dans le tableau ci-dessous.
      Vous pouvez aussi modifier le mot de passe pour les élèves qui n'ont pas saisi d'adresse
      email à la création de leur compte.

    </p>
    <DataTable :value="props.usersList" tableStyle="min-width: 50rem">
      <Column field="lastname" header="nom">
        <template #body="p">
          <SesameLastname :data="p.data" />
        </template>
      </Column>
      <Column field="firstname" header="prenom">
        <template #body="p">
          <SesameFirstname :data="p.data" />
        </template>
      </Column>
      <Column field="classe" sortable header="Classe"> </Column>
      <Column field="username" sortable header="Nom d'utilisateur"></Column>
      <Column field="uid">
        <template #body="p">
          <i @click="delCode(p.data.uid)" class="pi pi-trash text-red-500 cursor-pointer" />
        </template>
      </Column>
    </DataTable>
  </template>
</template>

<style>
.myclass {
  vertical-align: inherit !important;
}

.eleves .py-4 {
  padding-bottom: 0px;
  padding-top: 0px;
}
</style>
