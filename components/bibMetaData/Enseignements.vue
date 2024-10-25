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
    <MetaDataCheckBoxes title="Enseignement(s)" v-model="model" :invalid="p.invalid"
        :codes="bibMetadata.enseignementCodes" :get-label="bibMetadata.getEnseignementLabel" />
</template>