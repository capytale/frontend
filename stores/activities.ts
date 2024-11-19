import httpClient from '@capytale/activity.js/backend/capytale/http'
import { fetchActivities } from '~/api/activities'
import type { Activity, ActivityMetadata } from '~/types/activities'
import type { Status } from '~/types/store'


// Definit le endpoint de l'API
const myActivitiesApiEp = "/web/c-hdls/api/my-activities"

function metaDataEp(nid: number | string) {
  return `/web/c-hdls/api/metadata/${nid}`
}



export const useActivitiesStore = defineStore('activities', () => {
  const activities = ref<Activity[]>([])
  const status = ref<Status>("idle")

  const getActivities = async () => {
    status.value = "loading"
    try {
      activities.value = await fetchActivities()
      status.value = "success"
    } catch (e) {
      status.value = "error"
    }
  }

  const getMetadata = (nid: number | string) => {
    return httpClient.getJsonAsync<ActivityMetadata>(metaDataEp(nid));
  }

  const putMetaData = async (
    nid: number | string,
    data: ActivityMetadata
  ) => {
    const act = activities.value.find((a) => a.nid == nid);
    let currentShared: boolean | undefined;
    let currentWeb: boolean | undefined;
    if (act != null) {
      // optimistic update
      currentShared = act.status_shared;
      currentWeb = act.status_web;
      act.status_shared = data.status_shared;
      act.status_web = data.status_web;
    }
    try {
      await httpClient.putJsonAsync(
        metaDataEp(nid),
        data
      );
    } catch (e) {
      // Rollback
      if (act != null) {
        act.status_shared = currentShared!;
        act.status_web = currentWeb!;
      }
      throw e;
    }
  }

  const getActivity = (nid: number | string) => {
    return activities.value.find((a) => a.nid == nid)
  }

  const getAllDetails = (activity: any) => {
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
  }

  const refreshDetails = (activity: any) => {
    if (activity.refreshRequested) return;
    activity.refreshRequested = true;
    httpClient.getJsonAsync("/web/c-hdls/api/refresh-details/" + activity.nid).then((details: any) => {
      delete activity.refreshRequested
      for (const key in details) activity[key] = details[key]
      activity.extra = true
    })
    if (!activity.isSa) {
      activities.value.forEach((a) => {
        if ((a.isSa) && (a.activityId == activity.nid)) {
          refreshDetails(a)
        }
      })
    }
  }

  const deleteActivity = async (nids: Array<number[]>) => {
    const { deleted, notDeleted } = await httpClient.postGetJsonAsync<{ deleted: number[], notDeleted: number[] }>(
      myActivitiesApiEp,
      { action: "delete", nids }
    );
    for (let nid of deleted) {
      activities.value = activities.value.filter((item) => item.nid !== nid);
    }
    return notDeleted
  }

  const cloneActivity = async (nid: number | string, title?: string) => {
    let r
    if (title === undefined) {
      title = ""
    }
    try {
      r = await httpClient.postGetJsonAsync<any>(
        myActivitiesApiEp,
        { action: "clone", nid, title }
      )
    } catch (e) {
      // console.log("error", e)
    }
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
    r.tags = r.tags.map((tag) => tag.target_id) // il faut modifier un peu
    r.views_hidden = 0
    r.views_total = 0
    r.whoami = "cr"
    r.workflow = "0"
    activities.value.push(r)
    return r
  }

  const lockMode = async (activity: any) => {
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
  }

  const unlockMode = async (activity: any) => {
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
  }

  const moveActivities = async (pxyNids: array, tid: number) => {
    for (let item of pxyNids) {
      activities.value = activities.value.map(el => el.nid == item.nid ? { ...el, tags: [tid] } : el);
    }
    let nids = [...pxyNids.map((o) => o.nid)];
    await httpClient.postJsonAsync(
      myActivitiesApiEp,
      { action: "moveFolder", nids, tid }
    );
  }

  const untagActivity = async (nid: number, tid: number) => {
    let obj = activities.value.find(el => el.nid == nid);
    let arrayTids = obj.tags;
    arrayTids = arrayTids.filter(item => item !== tid);
    activities.value = activities.value.map(el => el.nid == nid ? { ...el, tags: arrayTids } : el);
    await httpClient.postJsonAsync(
      myActivitiesApiEp,
      { action: "untag", nid, tid }
    );
  }

  const changeMyVueCount = (nid: number, a, b, c, d) => {
    activities.value = activities.value.map(el => el.nid == nid ? { ...el, viewsDetails: { 100: a, 200: b, 300: c, visible: d } } : el);
  }

  const bulkArchive = async (nids: number, corbeilleTid: number) => {
    for (let nid of nids) {
      activities.value = activities.value.map(el => el.nid == nid ? { ...el, viewsDetails: { 100: 0, 200: 0, 300: 0, visible: 0 } } : el);
      await httpClient.postJsonAsync(
        myActivitiesApiEp,
        { action: "bulkArchive", nid, corbeilleTid }
      );
    }
  }

  const replaceTags = async (nids: any[], tids: any[]) => {
    await httpClient.postJsonAsync(
      myActivitiesApiEp,
      { action: "replaceTags", nids, tids }
    );
  }

  return {
    activities,
    status,
    getActivities,
    getMetadata,
    putMetaData,
    getActivity,
    getAllDetails,
    refreshDetails,
    deleteActivity,
    cloneActivity,
    lockMode,
    unlockMode,
    moveActivities,
    untagActivity,
    changeMyVueCount,
    bulkArchive,
    replaceTags,
  }
})

// TODO : peaufiner la gestion de la récupération des favoris : pour l'instant, c'est géré dans les composants.
// Il faudrait peut-être gérer ça ici.
