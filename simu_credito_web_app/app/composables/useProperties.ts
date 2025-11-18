export const useProperties = () => {
    const { apiFetch } = useApi()

    const listProperties = async () => {
        try {
            const response = await apiFetch('/properties', {
                method: 'GET',
            })
            return Array.isArray(response) ? response : []
        } catch (error) {
            console.error('Error fetching properties:', error)
            return []
            // Or re-throw if you want the component to handle the error explicitly
            // throw error;
        }
    }

    const getProperty = async (id: string | number) => {
        try {
            const response = await apiFetch(`/properties/${id}`, {
                method: 'GET',
            })
            return response
        } catch (error) {
            console.error(`Error fetching property with ID ${id}:`, error)
            throw error // Re-throw for the page component to handle (e.g., show not found)
        }
    }

    // POST /api/properties - Create a new property
    const createProperty = async (propertyData: any) => {
        // We expect propertyData to match the structure needed by the API
        try {
            const response = await apiFetch('/properties', {
                method: 'POST',
                body: JSON.stringify(propertyData),
            })
            return response // Return the created property object with its new ID
        } catch (error) {
            console.error('Error creating property:', error)
            throw error
        }
    }

    // PUT /api/properties/{propertyId} - Update an existing property
    const updateProperty = async (id: string | number, propertyData: any) => {
        try {
            const response = await apiFetch(`/properties/${id}`, {
                method: 'PUT',
                body: JSON.stringify(propertyData),
            })
            return response // Return the updated property object
        } catch (error) {
            console.error(`Error updating property with ID ${id}:`, error)
            throw error
        }
    }

    // DELETE /api/properties/{propertyId} - Delete a property
    const deleteProperty = async (id: string | number) => {
        try {
            // DELETE usually returns 204 No Content on success, no response body
            await apiFetch(`/properties/${id}`, {
                method: 'DELETE',
            })
            return true // Indicate success
        } catch (error) {
            console.error(`Error deleting property with ID ${id}:`, error)
            throw error
        }
    }

    // POST /api/properties/upload-photos - Upload photos (if needed separately)
    // Note: Handling file uploads often requires FormData, not JSON.
    // The API spec shows query parameters, which is unusual for file uploads.
    // This might need adjustment based on how the backend actually expects the files.
    const uploadPhotos = async (files: FileList | File[]) => {
        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]) // Standard way to append files
        }

        try {
            // Adjust fetch options for FormData
            const response = await $fetch(
                `${useRuntimeConfig().public.apiBase}/properties/upload-photos`,
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        // Let the browser set the Content-Type for FormData
                        // 'Content-Type': 'multipart/form-data', <--- Remove this
                        Authorization: `Bearer ${useCookie('auth_token').value}`,
                    },
                    // Consider adding query params if the API truly expects them, though unusual
                    // params: { files: /* How to represent multiple files in query? Needs clarification */ }
                }
            )
            return response // Returns { photos: [...], message: "...", expiryTime: "..." }
        } catch (error) {
            console.error('Error uploading photos:', error)
            throw error
        }
    }

    return {
        listProperties,
        getProperty,
        createProperty,
        updateProperty,
        deleteProperty,
        uploadPhotos, // Add this if you intend to use the separate upload endpoint
    }
}