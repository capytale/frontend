import httpClient from '@capytale/activity.js/backend/capytale/http'
import evalApi from "@capytale/activity.js/backend/capytale/evaluation"

// Definit le endpoint de l'API
const myActivitiesApiEp = "/web/c-hdls/api/my-activities"
const assignmentsApiEp = "/web/c-hdls/api/assignments"



export const useMyStore = defineStore('my', {
  state: () => ({
    assignments: [],
    mathalea: false,
    loadingAssignments: false,
  }),
  getters: {
  },
  actions: {
    async getAssignments(nid: string) {
      this.mathalea = false
      this.loadingAssignments = true
      // console.log("A")
      // const rawAssignments = await fetch("/web/c-hdls/api/assignments/524040")
      // console.log("A'")
      // this.assignments = await rawAssignments.json()
      // console.log("B")
      this.assignments = await httpClient.getJsonAsync<any>("/web/c-hdls/api/assignments/" + nid)
      if (this.assignments.icon.includes('mathalea')) {
        this.mathalea = await evalApi.listEvals(nid)
      }
      // console.log("C")
      this.loadingAssignments = false
    },
    async saveAppr(nid, appr: any) {
      console.log("saveAppr", nid, appr)
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "saveAppr", nid, appr: appr }
      );
    },
    async saveEval(nid, evalu: any) {
      // console.log("saveEval", nid, evalu)
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "saveEval", nid, evalu: evalu }
      );
    },
    async changeSaWf(sa_nid: string | Array, newWorkflow: string) {
      // console.log("saveSaWf0", sa_nid, newWorkflow)
      let nids
      if (Array.isArray(sa_nid)) {
        nids = [...sa_nid.map((o) => o.sa_nid)]
        for (let o of sa_nid) {
          this.assignments.tab = this.assignments.tab.map(el => el.sa_nid == o.sa_nid ? { ...el, workflow: newWorkflow } : el);
        }
      } else {
        nids = sa_nid.split()
        this.assignments.tab = this.assignments.tab.map(el => el.sa_nid == sa_nid ? { ...el, workflow: newWorkflow } : el);
      }
      // console.log("saveSaWf", nids, newWorkflow)
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "saveSaWf", nids, newWorkflow }
      );
    },
    async unHide(sa_nid: number, corbeilleTid: number) {
      this.assignments.tab = this.assignments.tab.map(el => el.sa_nid == sa_nid ? { ...el, tags: [] } : el);
      await httpClient.postJsonAsync(
        assignmentsApiEp,
        { action: "unHide", sa_nid, corbeilleTid }
      );
    },

    async hide(sa_nid: number, corbeilleTid: number) {
      this.assignments.tab = this.assignments.tab.map(el => el.sa_nid == sa_nid ? { ...el, tags: [corbeilleTid] } : el);
      await httpClient.postJsonAsync(
        assignmentsApiEp,
        { action: "hide", sa_nid, corbeilleTid }
      );
    },

    async archive(sa_nids: number, corbeilleTid: number) {
      // console.log("archive", sa_nids, corbeilleTid)
      for (let sa_nid of sa_nids) {
        this.assignments.tab = this.assignments.tab.map(el => el.sa_nid == sa_nid ? { ...el, tags: [corbeilleTid] } : el);
      }
      await httpClient.postJsonAsync(
        assignmentsApiEp,
        { action: "archive", sa_nids, corbeilleTid }
      );
    },

    async unArchive(sa_nids: number, corbeilleTid: number) {
      for (let sa_nid of sa_nids) {
        this.assignments.tab = this.assignments.tab.map(el => el.sa_nid == sa_nid ? { ...el, tags: [] } : el);
      }
      await httpClient.postJsonAsync(
        assignmentsApiEp,
        { action: "unArchive", sa_nids, corbeilleTid }
      );
    },



  },
})
