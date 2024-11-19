export interface Activity {
    nid: number;
    type: string;
    title: string;
    changed: number;
    isSa: boolean;
    whoami: string;
    tags: string[];
}

export type ActivityMetadata = {
    status_shared: boolean;
    status_web: boolean;
    abstract: string;
    enseignements: string[];
    niveaux: string[];
    modules: number[];
    themes: number[];
  }