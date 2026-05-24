import { toast } from 'vue-sonner'
import { formatWorkspaceError } from '@/lib/workspace/format-workspace-error'

export const runStoreAction = async (
  setLoading: (value: boolean) => void,
  action: () => Promise<void>,
): Promise<void> => {
  setLoading(true)
  try {
    await action()
  } catch (error) {
    toast.error(formatWorkspaceError(error))
  } finally {
    setLoading(false)
  }
}
