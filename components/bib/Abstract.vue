<script lang="ts">

/**
 * Limite pour la troncature
 */
const maxWordLength = 60;
const maxLines = 4;

const crlfRegex = /\r\n|\r|\n/;

</script>

<script setup lang="ts">
import { useBibList, type BibActivityDetail } from "~/composables/bib/list";

const p = defineProps<{
    data: BibActivityDetail
}>()

const bibList = useBibList();

/**
 * Abstract tronqué:
 * - Si abstract_truncated est faux, on retourne abstract trimmé
 * - Si abstract_truncated est vrai, on tronque à partir du dernier espace ou du dernier retour à la ligne
 */
const strippedAbstract = computed(() => {
    let abstract = p.data.abstract;
    if (!p.data.abstract_truncated) return (abstract == null) ? '' : abstract.trim();
    if (abstract == null) return '';
    abstract = abstract.trim();
    const lastSpace = abstract.lastIndexOf(' ');
    const lastCr = abstract.lastIndexOf('\n');
    const i = Math.max(lastSpace, lastCr);
    if ((lastSpace > 0) && (abstract.length - lastSpace <= 60)) {
        abstract = abstract.substring(0, lastSpace).trimEnd();
    } else {
        abstract = abstract.trimEnd();
    }
    return abstract;
})

/**
 * Abstract tronqué par ligne
 */
const lineStrippedAbstract = ref<string>('');

/**
 * Indique si l'abstract a été tronqué ou non
 * Cela peut être par l'api et/ou par le nombre de lignes
 */
const stripped = ref<boolean>(false);

watchEffect(() => {
    const lines = strippedAbstract.value.split(crlfRegex);
    if (lines.length <= maxLines) {
        lineStrippedAbstract.value = strippedAbstract.value;
        stripped.value = p.data.abstract_truncated;
    } else {
        lineStrippedAbstract.value = lines.slice(0, maxLines).join('\n');
        stripped.value = true;
    }
})

/**
 * Indique si l'abstract complet doit être affiché
 */
const showFullAbstract = ref<boolean>(false);

/**
 * L'abstract à afficher
 */
const abstract = computed(() => {
    if (!stripped.value) return lineStrippedAbstract.value;
    if (!showFullAbstract.value) return lineStrippedAbstract.value;
    if (p.data.abstract_truncated) {
        const fa = bibList.getFullAbstract(p.data.nid);
        if (fa.status !== 'present') return lineStrippedAbstract.value;
        return (fa.fullAbstract == null) ? '' : fa.fullAbstract.trim();
    } else {
        return strippedAbstract.value;
    }
})

/**
 * Indique si le lien pour afficher l'abstract complet doit être affiché
 */
const showEllipsisLink = computed(() => {
    if (!stripped.value) return false;
    if (showFullAbstract.value) return false;
    return true;
})

/**
 * Indique si le lien pour réduire l'abstract complet doit être affiché
 */
const showCloseLink = computed(() => {
    if (!stripped.value) return false;
    if (!showFullAbstract.value) return false;
    return true;
})

function onShowFull() {
    if (!showEllipsisLink.value) return;
    showFullAbstract.value = true;
    bibList.loadFullAbstract(p.data.nid);
}

function onCloseFull() {
    showFullAbstract.value = false;
}

</script>

<template>
    <div @click.stop="onShowFull"
        v-tooltip.top="showEllipsisLink ? { value: 'Cliquer pour afficher l\'intégralité de la description', showDelay: 800, hideDelay: 300 } : null"
        :class="'whitespace-pre-wrap' + (showEllipsisLink ? ' cursor-pointer' : '')">{{ abstract }}<span
            v-if="showEllipsisLink" class="text-blue-500"> […]</span></div>
    <div v-if="showCloseLink"
            class="text-blue-500 cursor-pointer" @click.stop="onCloseFull">[réduire]</div>
</template>