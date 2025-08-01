import { QueryKey, useQueryClient } from '@tanstack/react-query'

export function useRefresh(keys: QueryKey | QueryKey[]) {
  const queryClient = useQueryClient()

  return async () => {
    const keyArray = Array.isArray(keys[0]) ? (keys as QueryKey[]) : [keys as QueryKey]

    for (const key of keyArray) {
      await queryClient.invalidateQueries({ queryKey: key })
    }
  }
}
