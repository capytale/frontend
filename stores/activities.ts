import httpClient from '@capytale/activity.js/backend/capytale/http'

// Definit le endpoint de l'API
const myActivitiesApiEp = "/web/c-hdls/api/my-activities"

export const useActivitiesStore = defineStore('activities', {
  state: () => ({
    activities: [],
  }),
  actions: {
    async getActivities() {
      this.activities = await fetchMyActivities()
      // TODO : pas besoin de renvoyer un objet pour les tags : la liste csv des tids suffit. 
    },
    async getMetadata(nid) {
      // console.log("getMetadata", nid)
      // console.log("this.activities : ", this.activities.data[0])
      const metadata = await httpClient.getJsonAsync("/web/c-hdls/api/metadata/" + nid)
      this.activities.data = this.activities.data.map(el => el.nid == nid ? { ...el, ...metadata } : el);
    },

    async deleteActivity(nids: Array) {
      for (let nid of nids) {
        // console.log("deleteActivity", nid)
        this.activities.data = this.activities.data.filter((item) => item.nid !== nid);
      }
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "delete", nids }
      );
    },

    async cloneActivity(nid: number) {
      let r
      try {
        r = await httpClient.postGetJsonAsync(
          myActivitiesApiEp,
          { action: "clone", nid }
        )
      } catch (e) {
        console.log("error", e)
      }
      // console.log("le clone : ", r.changed, r.code, r.nid, r.title, r.type)
      // On ajoute le clone au store
      r.access_tr_mode = "none"
      r.aid = r.nid
      r.appreciation = ""
      r.bib = `${r.nid}:0`
      r.evaluation = ""
      r.last_access = `${r.changed}`
      r.mode = "N_O"
      r.own = 1
      r.own_aid = r.nid
      r.player = `/web/c-act/n/${r.nid}/play/create`
      r.row_id = `row-${r.nid}`
      r.sa = "0"
      r.status_clonable = 1
      r.status_shared = "0"
      r.status_web = "0"
      r.tags = []
      r.views_hidden = 0
      r.views_total = 0
      r.whoami = "cr"
      r.workflow = "0"
      this.activities.data.push(r)
    },

    async lockMode(nid: number) {
      this.activities.data = this.activities.data.map(el => el.nid == nid ? { ...el, mode: "N_X" } : el);
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "lockMode", nid }
      );
    },

    async unlockMode(nid: number) {
      this.activities.data = this.activities.data.map(el => el.nid == nid ? { ...el, mode: "N_O" } : el);
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "unlockMode", nid }
      );
    },

    async tagActivities(pxyNids: any[], tids: any[]) {
      const xunion = (a, b) => [...new Set([...a.split(","), ...b])].join(",");
      for (let item of pxyNids) {
        // this.activities.data = this.activities.data.map(el => el.nid == item.nid ? { ...el, tags: { tids: el.tags.tids + "," + tids.join(",") } } : el);
        this.activities.data = this.activities.data.map(el =>
          el.nid == item.nid ? { ...el, tags: { tids : xunion(el.tags.tids , tids) } } : el);
      }
      let nids = [...pxyNids.map((o) => o.nid)];
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "addTags", nids, tids }
      );
    },

    async moveActivities(pxyNids: array, tid: number) {
      for (let item of pxyNids) {
        // console.log("moveActivity", item.nid, tid)
        this.activities.data = this.activities.data.map(el => el.nid == item.nid ? { ...el, tags: { tids: tid } } : el);
      }
      let nids = [...pxyNids.map((o) => o.nid)];
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "moveFolder", nids, tid }
      );
    },

    async untagActivity(nid: number, tid: number) {
      let obj = this.activities.data.find(el => el.nid == nid);
      let arrayTids = obj.tags.tids.split(",");
      let index = arrayTids.indexOf(tid);
      if (index > -1) {
        arrayTids.splice(index, 1);
      }
      this.activities.data = this.activities.data.map(el => el.nid == nid ? { ...el, tags: { tids: arrayTids.join(",") } } : el);
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "untag", nid, tid }
      );
    },

    async bibIndexActivity( nid: number, 
      share: number, 
      web: number,
      resume: string,
      selEnseignements: any[],
      selNiveaux: any[],
      selModules: any[],
      selThemes: any[],
    ) {
      const indexElements = {nid, share, web, resume, selEnseignements, selNiveaux, selModules, selThemes}
      console.log("bibIndexActivity : ", indexElements)
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "bibIndex", indexElements }
      );
    },

  },
})

// TODO : peaufiner la gestion de la récupération des favoris : pour l'instant, c'est géré dans les composants.
// Il faudrait peut-être gérer ça ici.
