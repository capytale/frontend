import { TreeNode } from "primevue/treenode";

export interface Tag {
    id: number;
    key: number;
    label: string;
    parentid: number;
    color: string;
  }

export interface TagTreeNode extends Tag {
    children?: TagTreeNode[];
  }