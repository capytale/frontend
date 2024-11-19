import httpClient from '@capytale/activity.js/backend/capytale/http'
import type { Tag } from '~/types/tags'

export function fetchPrivateTags(): Promise<Tag[]> {
    return httpClient.getJsonAsync<Tag[]>("/web/c-hdls/api/get-private-tags-flat-list") as Promise<Tag[]>
}

export function createTag(label: string, parentId: number | string): Promise<number> {
    return httpClient.postGetJsonAsync<number>("/web/c-hdls/api/private-tags", { action: "create", tagValues: label, parentId })
}