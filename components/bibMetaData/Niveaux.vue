<script setup lang="ts">
import MetaDataCheckBoxes from './MetaDataCheckBoxes.vue'
import { useBibMetaData } from '@/composables/bib/metaData';
const bibMetadata = useBibMetaData()
const model = defineModel<string[]>();
const p = defineProps<{
    invalid: boolean;
}>();

</script>

<template>
    <MetaDataCheckBoxes title="Niveau(x)" v-model="model" :invalid="p.invalid" :codes="bibMetadata.niveauCodes"
        :get-label="bibMetadata.getNiveauLabel" />
</template>