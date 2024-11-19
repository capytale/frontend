
export interface Assignment {
  changed: string,
  sa_nid: string,
  sa_uid: string,
  nom: string,
  prenom: string,
  classe: string | null,
  etab: string | null,
  status: "0" | "1",
  workflow: "100" | "200" | "300",
  appreciation: string,
  evaluation: string,
  player: string,
  tags: string[],
}

export interface Assignments {
  icon: string,
  status: string,
  status_clonable: string,
  access_tr_mode: string,
  type: string,
  is_in_time_range: boolean,
  dt_deb: number,
  dt_end: number,
  title: string,
  nid: string,
  tab: Assignment[];
}