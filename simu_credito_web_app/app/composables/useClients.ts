export const useClients = () => {
  const { apiFetch } = useApi()

  const listClients = async () => {
    try {
      const response = await apiFetch('/clients', {
        method: 'GET',
      })
      return response
    } catch (error) {
      console.error('Error fetching clients:', error)
      throw error
    }
  }

  const getClient = async (id) => {
    try {
      const response = await apiFetch(`/clients/${id}`, {
        method: 'GET',
      })
      return response
    } catch (error) {
      console.error('Error fetching client:', error)
      throw error
    }
  }

  const createClient = async (clientData) => {
    try {
      const response = await apiFetch('/clients', {
        method: 'POST',
        body: JSON.stringify(clientData),
      })
      return response
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  }

  const updateClient = async (id, clientData) => {
    try {
      const response = await apiFetch(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(clientData),
      })
      return response
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  }

  const deleteClient = async (id) => {
    try {
      await apiFetch(`/clients/${id}`, {
        method: 'DELETE',
      })
      return true
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  }

    const checkPreQualification = async (qualificationData) => {
        try {
            const response = await apiFetch('/clients/pre-qualification', {
                method: 'POST',
                body: JSON.stringify(qualificationData),
            })

            console.log(qualificationData)
            return response
        } catch (error) {
            console.error('Error pre-qualifying client:', error)
            throw error
        }
    }

    return {
        listClients,
        getClient,
        createClient,
        updateClient,
        deleteClient,
        checkPreQualification,
    }
}