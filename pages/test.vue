<script setup lang="ts">

// TODO: supprimer ce fichier de test

import { getStyle } from "~/utils/getStyle";
const scores: {s:number|null, sm:number}[] = [];
scores.push({s: null, sm: 20});
for (let index = 0; index <= 20; index++) {
    scores.push({s: index, sm: 20});
}
</script>

<template #content>
    <div style="width: 100%; padding: 100px; background: var(--p-content-background);">
        <div>
            <Tag v-for="s of scores" :style="getStyle(s.s, s.sm)" class="mr-1">
                <span>{{ s.s == null ? '-' : s.s }} / {{ s.sm }}</span>
            </Tag>
        </div>
    </div>
</template>
