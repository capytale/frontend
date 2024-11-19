export interface Activity {
    nid: number;
    type: string;
    title: string;
    changed: number;
    isSa: boolean;
    whoami: string;
    tags: string[];
}