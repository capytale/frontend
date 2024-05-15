import { defineStore } from 'pinia'
import httpClient from '@capytale/activity.js/backend/capytale/http'

export const useBibIndexingStore = defineStore('bibIndexing', {
  state: () => ({
    data: [{}],
  }),
  actions: {
    async getIndexingElements() {
      const mydata = await httpClient.getJsonAsync<any>("/web/c-ui/api/my-bib-form-indexing-elements")
      mydata.themes = unflatten(mydata.themes)
      this.data = mydata
    },
  }
})

// const ORI = [
// { "key": "1799", "label": "Histoire", "id": "1799", "parentid": ""},
// { "key": "1876", "label": "Histoire des Mathématiques", "id": "1876", "parentid": "1799" },
// { "key": "3926", "label": "Histoire de l'Informatique", "id": "3936", "parentid": "1799" }
// ]
// const NEW = unflatten(ORI)
// const NEW = [
//   { "key": "1799", "label": "Histoire", "id": "1799", "parentid": "",
//     "children": [
//       { "key": "1876", "label": "Histoire des Mathématiques", "id": "1876", "parentid": "1799" },
//       { "key": "3926", "label": "Histoire de l'Informatique", "id": "3936", "parentid": "1799" }
//     ]
//   }
// ]


const unflatten = function(array: any[], parent?: any, tree?: any) {
  tree = typeof tree !== 'undefined' ? tree : [];
  parent = typeof parent !== 'undefined' ? parent : { id: 0 };
  var children = array.filter(function(child: any) { return child.parentid == parent.id; });
  if (children.length > 0) {
    if (parent.id == 0) {
      tree = children;
    } else {
      parent['children'] = children
    }
    children.forEach(function(child: any) { unflatten(array, child) });
  }
  return tree;
}
