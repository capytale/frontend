<template>
<DataTable :value="products" paginator :rows="10">
  <template #header>
    <Toolbar>
      <template #start>
        <div class="titre">Mes activités</div>
      </template>
      <template #end>
        <div class="flex justify-content-end">
          <Skeleton width="20rem" height="3rem"></Skeleton>
          <Skeleton width="20rem" height="3rem"></Skeleton>
          <div class="flex items-center rech-avancee">
            <Skeleton width="20rem" height="3rem"></Skeleton>
          </div>
          <Button type="button" label="Annuler" class="invisible" />
        </div>
      </template>
    </Toolbar>
  </template>
  <Column header="" style="width:5rem">
    <template #body>
      <Skeleton width="3rem" height="3rem"></Skeleton>
    </template>
  </Column>
  <Column header="Titre">
    <template #body>
      <Skeleton width="15rem" class="mb-2"></Skeleton>
    </template>
  </Column>
  <Column header="Évaluation">
    <template #body>
      <Skeleton width="10rem" height="4rem"></Skeleton>
    </template>
  </Column>
  <Column header="Modifié">
    <template #body>
      <Skeleton width="5rem"></Skeleton>
    </template>
  </Column>
  <Column header="Partage">
    <template #body>
      <Skeleton width="10rem"></Skeleton>
    </template>
  </Column>
  <Column header="Bib.">
    <template #body>
      <Skeleton width="4rem"></Skeleton>
    </template>
  </Column>
  <Column header="Dernière modif." style="max-width:10rem" sortable>
    <template #body>
      <Skeleton width="5rem" class="mb-2"></Skeleton>
    </template>
  </Column>
</DataTable>
</template>

<script lang="ts" setup>
const products = ref(new Array(20));
</script>

<style>

</style>