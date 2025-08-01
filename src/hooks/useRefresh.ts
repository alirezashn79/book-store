import { QueryKey, useQueryClient } from '@tanstack/react-query'

export function useRefresh(keys: QueryKey | QueryKey[]) {
  const queryClient = useQueryClient()

  return async () => {
    const keyArray = Array.isArray(keys) ? keys : [keys]

    await Promise.all(
      keyArray.map((key) =>
        queryClient.refetchQueries({
          queryKey: key,
          type: 'all',
        })
      )
    )
  }
}
