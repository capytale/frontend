import httpClient from '@capytale/activity.js/backend/capytale/http'
import type { Activity } from '~/types/activities'

export function fetchActivities(): Promise<Activity[]> {
    // @ts-expect-error - typage getJsonAsync
    return httpClient.getJsonAsync<Activity[]>("/web/c-hdls/api/all-activities")
}