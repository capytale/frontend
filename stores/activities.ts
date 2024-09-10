import httpClient from '@capytale/activity.js/backend/capytale/http'

// Definit le endpoint de l'API
const myActivitiesApiEp = "/web/c-hdls/api/my-activities"

export const useActivitiesStore = defineStore('activities', {
  state: () => ({
    activities: [],
  }),
  actions: {
    async getActivities() {
      // await new Promise(resolve => setTimeout(resolve, 3000))
      this.activities = await fetchMyActivities()

    },
    async getMetadata(nid) {
      // console.log("getMetadata", nid)
      // console.log("this.activities : ", this.activities.data[0])
      const metadata = await httpClient.getJsonAsync("/web/c-hdls/api/metadata/" + nid)
      this.activities.data = this.activities.data.map(el => el.nid == nid ? { ...el, ...metadata } : el);
    },

    getAllDetails(activity: any) {
      if (activity.refreshRequested) return;
      if (activity.extra) return;
      if (activity.detailsRequested) return;
      activity.detailsRequested = true;
      httpClient.getJsonAsync("/web/c-hdls/api/all-details/" + activity.nid).then((details: any) => {
        delete activity.detailsRequested
        if (activity.refreshRequested) return
        for (const key in details) activity[key] = details[key]
        activity.extra = true
      })
    },

    /**
     * Mets à jour les champs de l'activité passée en paramètre
     * Si l'utilisateur a un studentAssignment lié à l'activité, il est mis à jour
     */
    refreshDetails(activity: any) {
      if (activity.refreshRequested) return;
      activity.refreshRequested = true;
      httpClient.getJsonAsync("/web/c-hdls/api/refresh-details/" + activity.nid).then((details: any) => {
        delete activity.refreshRequested
        for (const key in details) activity[key] = details[key]
        activity.extra = true
      })
      if (!activity.isSa) {
        this.activities.data.forEach((a) => {
          if ((a.isSa) && (a.activityId == activity.nid)) {
            this.refreshDetails(a)
          }
        })
      }
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

    async lockMode(activity: any) {
      // Optimistic update
      const oldMode = activity.mode
      activity.mode = "N_X"
      try {
        await httpClient.postJsonAsync(
          myActivitiesApiEp,
          { action: "lockMode", nid: activity.nid }
        );
      }
      catch (e) {
        // Rollback
        activity.mode = oldMode
        throw e
      }
    },

    async unlockMode(activity: any) {
      // Optimistic update
      const oldMode = activity.mode
      activity.mode = "N_O"
      try {
        await httpClient.postJsonAsync(
          myActivitiesApiEp,
          { action: "unlockMode", nid: activity.nid }
        );
      }
      catch (e) {
        // Rollback
        activity.mode = oldMode
        throw e
      }
    },

    async tagActivities(pxyNids: any[], tids: any[]) {
      const xunion = (a, b) => [...new Set([...a, ...b])];
      for (let item of pxyNids) {
        const wellFormedTids = tids.map(el => { return el })
        this.activities.data = this.activities.data.map(el => {
          return el.nid == item.nid ? { ...el, tags: xunion(el.tags ? el.tags : [], wellFormedTids) } : el
        });
      }
      let nids = [...pxyNids.map((o) => o.nid)];
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "addTags", nids, tids }
      );
    },

    async moveActivities(pxyNids: array, tid: number) {
      for (let item of pxyNids) {
        this.activities.data = this.activities.data.map(el => el.nid == item.nid ? { ...el, tags: [tid] } : el);
      }
      let nids = [...pxyNids.map((o) => o.nid)];
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "moveFolder", nids, tid }
      );
    },

    async untagActivity(nid: number, tid: number) {
      let obj = this.activities.data.find(el => el.nid == nid);
      let arrayTids = obj.tags;
      arrayTids = arrayTids.filter(item => item !== tid);
      this.activities.data = this.activities.data.map(el => el.nid == nid ? { ...el, tags: arrayTids } : el);
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "untag", nid, tid }
      );
    },

    async changeMyVueCount(nid: number, a, b, c, d) {
      console.log("archive", nid, a, b, c, d)
      this.activities.data = this.activities.data.map(el => el.nid == nid ? { ...el, viewsDetails: { 100: a, 200: b, 300: c, visible: d } } : el);
    },

    async bulkArchive(nids: number, corbeilleTid: number) {
      for (let nid of nids) {
        this.activities.data = this.activities.data.map(el => el.nid == nid ? { ...el, viewsDetails: { 100: 0, 200: 0, 300: 0, visible: 0 } } : el);
        await httpClient.postJsonAsync(
          myActivitiesApiEp,
          { action: "bulkArchive", nid, corbeilleTid }
        );
      }
    },

    async replaceTags(nids: any[], tids: any[]) {
      // console.log('replaceTags', nids, tids);
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "replaceTags", nids, tids }
      );
    },


    async bibIndexActivity(nid: number,
      share: number,
      web: number,
      resume: string,
      selEnseignements: any[],
      selNiveaux: any[],
      selModules: any[],
      selThemes: any[],
    ) {
      const indexElements = { nid, share, web, resume, selEnseignements, selNiveaux, selModules, selThemes }
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
