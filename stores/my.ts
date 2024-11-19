import httpClient from '@capytale/activity.js/backend/capytale/http'
import evalApi from "@capytale/activity.js/backend/capytale/evaluation"
import type { EvaluationList } from "@capytale/activity.js/activity/evaluation/evaluation"
import type { Assignments } from "~/types/assignments"

// Definit le endpoint de l'API
const myActivitiesApiEp = "/web/c-hdls/api/my-activities"
const assignmentsApiEp = "/web/c-hdls/api/assignments"

export const useMyStore = defineStore('my', () => {
  const assignments = ref<Assignments>()
  const mathalea = ref<EvaluationList>()
  const loadingAssignments = ref(false)

  const getAssignments = async (nid: string) => {
    mathalea.value = undefined
    loadingAssignments.value = true
    assignments.value = (await httpClient.getJsonAsync<Assignments>("/web/c-hdls/api/assignments/" + nid))!
    if (assignments.value.icon.includes('mathalea')) {
      mathalea.value = await evalApi.listEvals(nid as any) // TODO ça ira mieux bientôt...
    }
    loadingAssignments.value = false
  }

  const saveAppr = async (nid: string, appr: string) => {
    console.log("saveAppr", nid, appr)
    await httpClient.postJsonAsync(
      myActivitiesApiEp,
      { action: "saveAppr", nid, appr: appr }
    );
  }

  const saveEval = async (nid: string, evalu: string) => {
    // console.log("saveEval", nid, evalu)
    await httpClient.postJsonAsync(
      myActivitiesApiEp,
      { action: "saveEval", nid, evalu: evalu }
    );
  }

  const changeSaWf = async (sa_nid: string | string[], newWorkflow: "100" | "200" | "300") => {
    // console.log("saveSaWf0", sa_nid, newWorkflow)
    let nids
    if (Array.isArray(sa_nid)) {
      nids = [...sa_nid.map((o) => o.sa_nid)]

      for (let o of sa_nid) {
        assignments.value!.tab.find(el => el.sa_nid == o)!.workflow = newWorkflow
      }
    } else {
      nids = sa_nid.split()
      assignments.value.tab = assignments.value.tab.map(el => el.sa_nid == sa_nid ? { ...el, workflow: newWorkflow } : el);
    }
    // console.log("saveSaWf", nids, newWorkflow)
    await httpClient.postJsonAsync(
      myActivitiesApiEp,
      { action: "saveSaWf", nids, newWorkflow }
    );
  }
  const unHide = async (sa_nid: number, corbeilleTid: number) => {
    assignments.value.tab = assignments.value.tab.map(el => el.sa_nid == sa_nid ? { ...el, tags: [] } : el);
    await httpClient.postJsonAsync(
      assignmentsApiEp,
      { action: "unHide", sa_nid, corbeilleTid }
    );
  }
  const hide = async (sa_nid: number, corbeilleTid: number) => {
    assignments.value.tab = assignments.value.tab.map(el => el.sa_nid == sa_nid ? { ...el, tags: [corbeilleTid] } : el);
    await httpClient.postJsonAsync(
      assignmentsApiEp,
      { action: "hide", sa_nid, corbeilleTid }
    );
  }
  const archive = async (sa_nids: number, corbeilleTid: number) => {
    // console.log("archive", sa_nids, corbeilleTid)
    for (let sa_nid of sa_nids) {
      assignments.value.tab = assignments.value.tab.map(el => el.sa_nid == sa_nid ? { ...el, tags: [corbeilleTid] } : el);
    }
    await httpClient.postJsonAsync(
      assignmentsApiEp,
      { action: "archive", sa_nids, corbeilleTid }
    );
  }
  const unArchive = async (sa_nids: number, corbeilleTid: number) => {
    for (let sa_nid of sa_nids) {
      assignments.value.tab = assignments.value.tab.map(el => el.sa_nid == sa_nid ? { ...el, tags: [] } : el);
    }
    await httpClient.postJsonAsync(
      assignmentsApiEp,
      { action: "unArchive", sa_nids, corbeilleTid }
    );
  }
  return {
    assignments,
    mathalea,
    loadingAssignments,
    getAssignments,
    saveAppr,
    saveEval,
    changeSaWf,
    unHide,
    hide,
    archive,
    unArchive,
  }
}
)