<script setup lang="ts">
import { useBibMetaData } from '@/composables/bib/metaData';
const bibMetadata = useBibMetaData()

const model = defineModel<number[]>();
const expanded = ref<{ [id: number]: boolean }>({});
const autoExpanded: { [id: number]: boolean } = {};

type TreeNode = {
    key: string;
    label: string;
    id: number;
    children: TreeNode[];
    parent?: TreeNode;
}

const tree = ref<TreeNode[]>([]);
const treeIndex = ref<{ [id: number]: TreeNode }>({});

watchImmediate(
    [() => bibMetadata.themesCodes, () => bibMetadata.getThemeItem],
    ([codes, gti]) => {
        const index: { [key: number]: TreeNode } = {};
        for (let i = 0; i < codes.length; ++i) {
            const id = codes[i];
            const item = gti(id);
            if (item == null) continue;
            index[id] = { key: id.toString(), id, label: item.label, children: [] };
        }
        const root: TreeNode[] = [];
        for (let i = 0; i < codes.length; ++i) {
            const id = codes[i];
            const item = gti(id);
            if (item == null) continue;
            const node = index[id];
            if (item.parentId == null) {
                root.push(node);
            } else {
                const parent = index[item.parentId];
                if (parent == null) {
                    console.error(`Parent ${item.parentId} not found for ${id}`);
                    root.push(node);
                } else {
                    parent.children.push(node);
                    node.parent = parent;
                }
            }
        }
        tree.value = root;
        treeIndex.value = index;
    });

watchImmediate([model, treeIndex], ([m, ti]) => {
    if (m == null) return;
    for (let i = 0; i < m.length; i++) {
        const id = m[i];
        const node = ti[id];
        if (node != null) {
            let parent = node.parent;
            while (parent != null) {
                if (!autoExpanded[parent.id]) {
                    autoExpanded[parent.id] = true;
                    expanded.value[parent.id] = true;
                }
                parent = parent.parent;
            }
        }
    }
});

</script>

<template>
    <label for="themes" class="font-semibold w-6rem">Thèmes abordés</label>
    <Tree id="themes" v-model:expandedKeys="expanded" :value="tree" :filter="true" filterMode="lenient"
        class="w-full md:w-30rem with-padding">
        <template #default="sp">
            <Checkbox v-model="model" :inputId="sp.node.key" :value="sp.node.id" />
            <label class="ml-2" :for="sp.node.key">{{ sp.node.label }}</label>
        </template>
    </Tree>
</template>
