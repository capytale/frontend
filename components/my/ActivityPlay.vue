<script setup>
const value = ref(null);
</script>


<template>
  <Card class="flex-2">
    <template #title>
      <h2 style="margin:0px">Jouer une activité</h2>
    </template>
    <template #content>

      <form action="/web/my" method="post" id="capytale">
        <div class="flex flex-col gap-2">
          <label for="code">Saisir le code de partage</label>
          <div class="flex flex-wrap align-items-center gap-2">
            <InputText id="code" v-model="value" aria-describedby="code-help" placeholder="a12b-345678" />
            <Button type="submit" label="Go !" />
          </div>
        </div>
      </form>
    </template>
  </Card>
</template>

