import entbk from '@capytale/activity.js/backend/capytale/ent'

export const useEnts = () => {
  const tmp:Ref<EntType[]> = useState('EntList')

      const getItems = async () => {
        const data = await entbk.getList()
        tmp.value = data
        // console.log("actiprof loaded from server");        
      }
      getItems()
  return tmp
}