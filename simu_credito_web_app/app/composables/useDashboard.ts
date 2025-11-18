export const useDashboard = () => {
  const { apiFetch } = useApi()

  const getMetrics = async () => {
    try {
      const response = await apiFetch('/dashboard/metrics', {
        method: 'GET',
      })
      return response
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error)
      throw error
    }
  }

  const getRecentActivity = async (limit = 20) => {
    try {
      const response = await apiFetch(`/dashboard/recent-activity?limit=${limit}`, {
        method: 'GET',
      })
      return response
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      throw error
    }
  }

  return {
    getMetrics,
    getRecentActivity,
  }
}