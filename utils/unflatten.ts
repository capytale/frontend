/**
* Convert a flat array of objects with id/parentid properties to a nested hierarchy.
* @param  {Array} array   The flat array to convert.
* [
*   { "key": "1799", "label": "Histoire", "id": "1799", "parentid": ""},
*   { "key": "1876", "label": "Histoire des Mathématiques", "id": "1876", "parentid": "1799" },
*   { "key": "3926", "label": "Histoire de l'Informatique", "id": "3936", "parentid": "1799" }
* ]
* @return {Array}         The array of objects with children property.
* [
*   { "key": "1799", "label": "Histoire", "id": "1799", "parentid": "",
*     "children": [
*       { "key": "1876", "label": "Histoire des Mathématiques", "id": "1876", "parentid": "1799" },
*       { "key": "3926", "label": "Histoire de l'Informatique", "id": "3936", "parentid": "1799" }
*     ]
*   }
* ]
*/
export function unflatten(array: any[], parent?: any, tree?: any) {
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
