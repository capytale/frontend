<script setup>
const props = defineProps({
    data: Object,
})
const visible = ref(false);

const url = computed(() => {
    return `/web/c-act/n/${props.data.nid}/play/view`
})

const selectedCountry = ref();
const countries = ref([
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
]);
</script>

<template>
     <span @click="visible = true" class="clickable" >{{ props.data.title }}</span>

    <DialogIframe v-model="visible" :url="url">
    <template #header>
        <h2>Coucou le header !</h2>
    </template>
    <template #default>
        <p>Si tu mets des trucs dans le template #header il faut penser à la mise en forme parce que c'est comme d'habitude, la présence d'un template #header remplace l'intégralité des presets du header de Dialog.</p>
        <p>Si rien dans la prop "header" et rien dans le template #header, alors j'affiche un espace blanc pour caler les boutons de fermeture à droite. Sans ça ils sont à gauche.</p>
        <p>Tout ce qui se trouve à la racine du composant est affiché dans le slot default</p>
        <p>Ce qui signifie que tu peux aussi tout mettre dans un "template #default" si tu veux</p>
        <Button @click="visible = false" label="Bouton inutile" />
        <Listbox v-model="selectedCountry" :options="countries" optionLabel="name" class="w-full md:w-56" listStyle="max-height:250px">
            <template #option="slotProps">
                <div class="flex items-center">
                    <img :alt="slotProps.option.name" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${slotProps.option.code.toLowerCase()} mr-2`" style="width: 18px" />
                    <div>{{ slotProps.option.name }}</div>
                </div>
            </template>
        </Listbox>    
        <p><i class="pi pi-check"></i> Et ci-dessous l'iframe spécifiée dans le paramètre "url"</p>
    </template>
    </DialogIframe>
</template>

<style scoped>
.clickable {
  cursor: pointer;
  color: var(--p-sky-900);
  text-decoration: underline;
}
</style>
