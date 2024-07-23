import httpClient from '@capytale/activity.js/backend/capytale/http'

// Definit le endpoint de l'API
const myActivitiesApiEp = "/web/c-hdls/api/my-activities"
import TypeApi from '@capytale/activity.js/backend/capytale/activityType'
import type { ActivityType, ActivityGroups } from "@capytale/activity.js/activity/activityType/activityType";



export const useMyStore = defineStore('my', {
  state: () => ({
    assignments: [],
    favorites: [] as string[],
    types: [] as ActivityType[],
    groups: {} as ActivityGroups,
    actiSelView: "groups",
  }),
  actions: {
    async getAssignments(nid: string) {
      this.loadingAssignments = true
      this.assignments = await httpClient.getJsonAsync<any>("/web/c-hdls/api/assignments/" + nid)
      this.loadingAssignments = false
    },
    async getActivities() {
      this.activities = await fetchMyActivities()
      // TODO : pas besoin de renvoyer un objet pour les tags : la liste csv des tids suffit. 
    },
    async getTypes() {
      this.types = await TypeApi.getList()
    },
    async getGroups() {
      this.groups = await TypeApi.getGroups()
    },
    async getFavorites() {
      this.favorites = await TypeApi.getFavorites(true)
    },
    async addFavorite(type: string) {
      this.favorites = await TypeApi.addFavorite(type)
    },
    async removeFavorite(type: string) {
      this.favorites = await TypeApi.removeFavorite(type)
    },
    async saveAppr(nid, appr: any) {
      console.log("saveAppr", nid, appr._rawValue)
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "saveAppr", nid, appr: appr._rawValue }
      );
    },
    async saveEval(nid, evalu: any) {
      console.log("saveEval", nid, evalu)
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "saveEval", nid, evalu: evalu._rawValue }
      );
    },
    async changeSaWf(sa_nid: string | Array, newWorkflow: string) {
      console.log("saveSaWf0", sa_nid, newWorkflow)
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
      console.log("saveSaWf", nids, newWorkflow)
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "saveSaWf", nids, newWorkflow }
      );
    },
  },
})