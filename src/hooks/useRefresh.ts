import { QueryKey, useQueryClient } from '@tanstack/react-query'

export function useRefresh(keys: QueryKey | QueryKey[]) {
  const queryClient = useQueryClient()

  return async () => {
    const keyArray = Array.isArray(keys[0]) ? (keys as QueryKey[]) : [keys as QueryKey]

    await Promise.all(keyArray.map((key) => queryClient.invalidateQueries({ queryKey: key })))
  }
}
