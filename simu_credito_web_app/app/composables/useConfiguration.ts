// app/composables/useConfiguration.ts
import type {
    FinancialEntity,
    BonusParameter,
    GlobalValue,
} from '~/types/configuration' // Asegúrate que este archivo exista y tenga los tipos correctos

export const useConfiguration = () => {
    const { apiFetch } = useApi()
    const config = useRuntimeConfig()
    const token = useCookie('auth_token')

    // --- Financial Entities ---

    const listFinancialEntities = () => {
        // La API GET /financial-entities devuelve un array directamente
        return apiFetch<FinancialEntity[]>('/configuration/financial-entities', {
            method: 'GET',
        })
    }

    // POST usa JSON estándar para crear la entidad
    const createFinancialEntity = (entityData: Omit<FinancialEntity, 'id' | 'createdAt' | 'updatedAt' | 'photoUrl'>) => {
        return apiFetch<FinancialEntity>('/configuration/financial-entities', {
            method: 'POST',
            body: JSON.stringify(entityData),
        })
    }

    // Nueva función para subir foto primero (antes de crear entidad)
    const uploadFinancialEntityPhoto = (photoFile: File): Promise<string> => {
        console.log('uploadFinancialEntityPhoto called with file:', photoFile.name, 'Size:', photoFile.size, 'Type:', photoFile.type)

        const formData = new FormData()
        formData.append('files', photoFile) // El backend espera 'files' según el curl

        console.log('FormData created, sending request to:', `${config.public.apiBase}/configuration/financial-entities/upload-photos`)

        // Usamos $fetch directamente para FormData, inyectando el token manualmente
        return $fetch(`${config.public.apiBase}/configuration/financial-entities/upload-photos`, {
            method: 'POST', // Mantener POST según el curl correcto
            body: formData,
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'accept': 'application/json',
                // 'Content-Type' es manejado automáticamente por el navegador para FormData
            },
        }).then((response: any) => {
            console.log('Photo upload response:', response)
            // El backend devuelve un objeto con photos array, necesitamos extraer la URL
            if (response && response.photos && response.photos.length > 0) {
                return response.photos[0].firebaseUrl || response.photos[0].url || ''
            }
            return ''
        }).catch(error => {
            console.error('Photo upload error:', error)
            throw error
        })
    }

    // PUT usa application/json
    const updateFinancialEntity = (id: number, data: Partial<FinancialEntity>) => {
        // Excluimos campos que no deberían enviarse en la actualización si es necesario
        const { id: entityId, createdAt, updatedAt, ...updateData } = data
        return apiFetch<FinancialEntity>(`/configuration/financial-entities/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updateData), // Enviar solo los campos actualizables
        })
    }

    const deleteFinancialEntity = (id: number) => {
        return apiFetch(`/configuration/financial-entities/${id}`, {
            method: 'DELETE',
        })
    }

    // --- Bonus Parameters ---

    const listBonusParameters = () => {
        // GET devuelve un array de BonusParameter
        return apiFetch<BonusParameter[]>('/configuration/bonus-parameters', {
            method: 'GET',
        })
    }

    // La API usa PUT con ID para actualizar UN parámetro específico
    const updateBonusParameter = (id: number, data: Partial<BonusParameter>) => {
        // Para PUT, necesitamos enviar el objeto completo según el ejemplo del curl
        const fullData = {
            id: id,
            bonusType: data.bonusType || 'BBP',
            bonusSubtype: data.bonusSubtype,
            minPropertyValue: data.minPropertyValue,
            maxPropertyValue: data.maxPropertyValue,
            bonusPercentage: data.bonusPercentage || 0,
            bonusAmount: data.bonusAmount,
            isSustainableRequired: data.isSustainableRequired,
            isActive: data.isActive !== undefined ? data.isActive : true,
            validFrom: data.validFrom,
            validUntil: data.validUntil,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }
        return apiFetch<BonusParameter>(`/configuration/bonus-parameters/${id}`, {
            method: 'PUT',
            body: JSON.stringify(fullData),
        })
    }
    // DELETE /bonus-parameters/{id} - Podríamos añadirla si fuera necesario
    const deleteBonusParameter = (id: number) => {
        return apiFetch(`/configuration/bonus-parameters/${id}`, {
            method: 'DELETE',
        });
    }

    // --- Global Values (UIT, Exchange Rate) ---

    const listGlobalValues = () => {
        // GET devuelve un array de GlobalValue
        return apiFetch<GlobalValue[]>('/configuration/global-values', {
            method: 'GET',
        })
    }

    // POST para crear un nuevo valor global
    const createGlobalValue = (data: Omit<GlobalValue, 'id' | 'createdAt' | 'updatedAt'>) => {
        // Excluir campos que no deberían enviarse en la creación
        const { id, createdAt, updatedAt, ...createData } = data
        return apiFetch<GlobalValue>('/configuration/global-values', {
            method: 'POST',
            body: JSON.stringify(createData),
        })
    }

    // PUT usa ID para actualizar UN valor global específico
    const updateGlobalValue = (id: number, data: Partial<GlobalValue>) => {
        // Para PUT, necesitamos enviar el objeto completo según el ejemplo del curl
        const fullData = {
            id: id,
            valueKey: data.valueKey,
            valueName: data.valueName,
            numericValue: data.numericValue === '' ? null : data.numericValue,
            stringValue: data.stringValue === '' ? null : data.stringValue,
            valueType: data.valueType,
            unit: data.unit,
            isActive: data.isActive !== undefined ? data.isActive : true,
            validFrom: data.validFrom,
            validUntil: data.validUntil,
            description: data.description,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        }

        return apiFetch<GlobalValue>(`/configuration/global-values/${id}`, {
            method: 'PUT',
            body: JSON.stringify(fullData),
        })
    }

    // --- Techo Propio Parameters (from Global Values) ---

    const getTechoPropioParameters = async () => {
        const globalValues = await listGlobalValues()
        return {
            bfh_avn: globalValues.find(v => v.valueKey === 'BFH_AVN_AMOUNT') || null,
            ifm_max: globalValues.find(v => v.valueKey === 'BFH_MAX_MONTHLY_INCOME') || null,
            viv_max: globalValues.find(v => v.valueKey === 'BFH_MAX_PROPERTY_VALUE') || null,
        }
    }

    const getCurrentExchangeRate = async () => {
        try {
            // Llamada al nuevo endpoint del backend
            const response = await apiFetch('/configuration/exchange-rate/current', {
                method: 'GET',
            })
            return response
        } catch (error) {
            console.error('Error fetching exchange rate:', error)
            // Retornar null o valores por defecto en caso de error
            return { sellPrice: 3.75, buyPrice: 3.74, date: new Date().toISOString() }
        }
    }


    return {
        listFinancialEntities,
        createFinancialEntity,
        uploadFinancialEntityPhoto,
        updateFinancialEntity,
        deleteFinancialEntity,
        listBonusParameters,
        updateBonusParameter,
        // deleteBonusParameter
        listGlobalValues,
        createGlobalValue,
        updateGlobalValue,
        getTechoPropioParameters,
        getCurrentExchangeRate,
    }
}