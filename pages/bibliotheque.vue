<script setup>
import { useMyStore } from '@/stores/my'
const my = useMyStore()

my.getBib()

</script>

<template>
    <div>
        <h1>Bibliothèque</h1>
    </div>
</template>
