import { useState } from '#app'
import { useApi } from '~/composables/useApi'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const useSimulations = () => {
    const { apiFetch } = useApi()

    // Estado compartido para el borrador de simulación
    const simulationDraft = useState<any>('simulationDraft', () => null)

    const createSimulation = async (simulationData: any) => {
        try {
            const response = await apiFetch('/simulations', {
                method: 'POST',
                body: JSON.stringify(simulationData),
            })
            return response
        } catch (error) {
            console.error('Error creating simulation:', error)
            throw error
        }
    }

    const listUserSimulations = async () => {
        try {
            const response = await apiFetch('/simulations', {
                method: 'GET',
            })
            return response
        } catch (error) {
            console.error('Error fetching user simulations:', error)
            throw error
        }
    }

    const getSimulationById = async (simulationId: string) => {
        try {
            const response = await apiFetch(`/simulations/${simulationId}`, {
                method: 'GET',
            })
            return response
        } catch (error) {
            console.error('Error fetching simulation by ID:', error)
            throw error
        }
    }

    const getAmortizationSchedule = async (simulationId: string, page: number = 0, size: number = 10) => {
        try {
            const response = await apiFetch(`/simulations/${simulationId}/amortization?page=${page}&size=${size}`, {
                method: 'GET',
            })
            return response
        } catch (error) {
            console.error('Error fetching amortization schedule:', error)
            throw error
        }
    }

    const exportSimulationToPDF = async (simulationData: any) => {
        try {
            // 1. Usar LANDSCAPE ('l') para tener más ancho para la tabla grande
            const doc = new jsPDF('l', 'mm', 'a4')
            const currencySymbol = simulationData.inputs?.currency === 'USD' ? '$' : 'S/'

            // Helper para formatear moneda
            const fmtMoney = (val: number | undefined) => {
                if (val === undefined || val === null) return `${currencySymbol} 0.00`;
                return `${currencySymbol} ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            }

            // --- HEADER ---
            doc.setFontSize(22)
            doc.setTextColor(40, 40, 40)
            doc.text('Simulación de Crédito Hipotecario', 15, 20)

            doc.setFontSize(10)
            doc.setTextColor(100, 100, 100)
            doc.text(`Generado el: ${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE')}`, 200, 20)

            // --- INFO CLIENTE ---
            doc.setFontSize(11)
            doc.setTextColor(0, 0, 0)
            doc.text(`Cliente: ${simulationData.clientInfo?.name || 'N/A'}`, 15, 35)
            doc.text(`Propiedad: ${simulationData.propertyInfo?.name || 'N/A'}`, 15, 42)
            if (simulationData.inputs?.currency === 'USD') {
                doc.setTextColor(0, 80, 200)
                doc.text(`Moneda: Dólares (TC Ref: S/ ${simulationData.inputs?.usdValue})`, 150, 35)
                doc.setTextColor(0, 0, 0)
            }

            let finalY = 45

            // --- 1. RESUMEN Y INDICADORES (Lado a Lado) ---

            // Tabla Resumen (Izquierda)
            autoTable(doc, {
                startY: finalY,
                head: [['Resumen de Operación', 'Monto']],
                body: [
                    ['Valor Inmueble', fmtMoney(simulationData.summary?.propertyValue)],
                    ['Aporte Estado', fmtMoney(simulationData.summary?.stateContribution)],
                    ['Cuota Inicial', fmtMoney(simulationData.summary?.initialPayment)],
                    ['Monto Financiado', fmtMoney(simulationData.summary?.financingAmount)]
                ],
                theme: 'grid',
                styles: { fontSize: 9, cellPadding: 2 },
                headStyles: { fillColor: [63, 81, 181] },
                margin: { left: 15 },
                tableWidth: 120
            })

            // Tabla Indicadores (Derecha) - Misma altura Y
            autoTable(doc, {
                startY: finalY,
                head: [['Indicadores Clave', 'Valor']],
                body: [
                    ['Cuota Mensual Total', fmtMoney(simulationData.keyIndicators?.monthlyPayment)],
                    ['TCEA', `${simulationData.keyIndicators?.tcea?.toFixed(2)}%`],
                    ['COK (Mensual)', `${simulationData.keyIndicators?.cok?.toFixed(4)}%`],
                    ['VAN', fmtMoney(simulationData.keyIndicators?.van)],
                    ['TIR (Mensual)', `${simulationData.keyIndicators?.tir?.toFixed(4)}%`]
                ],
                theme: 'grid',
                styles: { fontSize: 9, cellPadding: 2 },
                headStyles: { fillColor: [63, 81, 181] },
                margin: { left: 145 }, // Desplazado a la derecha
                tableWidth: 135
            })

            finalY = (doc as any).lastAutoTable.finalY + 10

            // --- 2. RESULTADOS TOTALES ---
            doc.setFontSize(12)
            doc.text('Resultados Totales Acumulados', 15, finalY)

            autoTable(doc, {
                startY: finalY + 3,
                head: [['Total Intereses', 'Amort. Capital', 'Seg. Desgravamen', 'Seg. Riesgo', 'Comisiones', 'Gastos Adm.']],
                body: [[
                    fmtMoney(simulationData.totalResults?.totalInterest),
                    fmtMoney(simulationData.totalResults?.totalCapitalAmortization),
                    fmtMoney(simulationData.totalResults?.totalDesgravamen),
                    fmtMoney(simulationData.totalResults?.totalRiskInsurance),
                    fmtMoney(simulationData.totalResults?.totalCommissions),
                    fmtMoney(simulationData.totalResults?.totalAdminExpenses)
                ]],
                theme: 'striped',
                styles: { fontSize: 9, halign: 'center' },
                headStyles: { fillColor: [50, 50, 50] }
            })

            finalY = (doc as any).lastAutoTable.finalY + 10

            // --- 3. PARÁMETROS DE ENTRADA ---
            doc.setFontSize(12)
            doc.text('Parámetros del Préstamo', 15, finalY)

            const inputs = simulationData.inputs || {}

            autoTable(doc, {
                startY: finalY + 3,
                head: [['Concepto', 'Detalle', 'Concepto', 'Detalle']],
                body: [
                    [
                        'Plazo', `${inputs.termYears} años (${inputs.termYears * 12} meses)`,
                        'Tasa Interés', `${inputs.interestRate}% ${inputs.interestRateType}`
                    ],
                    [
                        'Periodo Gracia', `${inputs.gracePeriodDurationMonths} meses (${inputs.gracePeriodType})`,
                        'COK', `${inputs.opportunityCostRate}% ${inputs.opportunityCostType}`
                    ],
                    [
                        'Seg. Desgravamen', inputs.desgravamenEnabled ? `Sí (${inputs.desgravamenRate}%)` : 'No',
                        'Seg. Inmueble', inputs.propertyInsuranceEnabled ? `Sí (${inputs.propertyInsuranceRate}%)` : 'No'
                    ],
                    [
                        'Comisión Fija', fmtMoney(inputs.monthlyCommissions),
                        'Gastos Adm.', fmtMoney(inputs.administrationCosts)
                    ]
                ],
                theme: 'plain',
                styles: { fontSize: 8, cellPadding: 1 },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 30 },
                    2: { fontStyle: 'bold', cellWidth: 30 }
                }
            })

            finalY = (doc as any).lastAutoTable.finalY + 15

            // --- 4. TABLA DE AMORTIZACIÓN ---
            // Nueva página si falta espacio, sino continuar
            if (finalY > 150) {
                doc.addPage()
                finalY = 20
            }

            doc.setFontSize(14)
            doc.setTextColor(0,0,0)
            doc.text('Tabla de Amortización', 15, finalY)

            const allPayments = simulationData.amortizationSchedule?.payments || []

            const tableData = allPayments.map((payment: any) => [
                payment.paymentNumber,
                `${(payment.tem * 100).toFixed(4)}%`,
                payment.gracePeriodDescription === 'Sin gracia' ? '-' : payment.gracePeriodDescription,
                fmtMoney(payment.initialBalance),
                fmtMoney(payment.interest),
                fmtMoney(payment.payment), // Esta es la "Cuota Total" en el PDF visual, o scheduledPayment según lógica. Usamos payment (total)
                fmtMoney(payment.principal),
                fmtMoney(payment.lifeInsurance),
                fmtMoney(payment.propertyInsurance),
                fmtMoney(payment.commissions),
                fmtMoney(payment.adminCosts), // Gastos Adm
                fmtMoney(payment.deliveryCosts), // Portes
                fmtMoney(payment.finalBalance),
                fmtMoney(payment.cashFlow)
            ])

            autoTable(doc, {
                startY: finalY + 5,
                head: [[
                    'N°', 'TEM', 'Gracia', 'Saldo Ini', 'Interés', 'Cuota Total', 'Amort.',
                    'Desgrav.', 'Riesgo', 'Comis.', 'Adm.', 'Portes', 'Saldo Fin', 'Flujo'
                ]],
                body: tableData,
                theme: 'grid',
                // FUENTE MÁS PEQUEÑA PARA QUE QUEPAN 14 COLUMNAS
                styles: { fontSize: 7, cellPadding: 1, halign: 'right' },
                headStyles: { fillColor: [63, 81, 181], halign: 'center', fontSize: 7 },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 8 },  // N°
                    1: { cellWidth: 12 }, // TEM
                    2: { cellWidth: 15 }, // Gracia
                    // Las columnas de dinero se ajustan solas, pero podemos dar pesos
                }
            })

            // --- FOOTER ---
            const pageCount = doc.getNumberOfPages()
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i)
                doc.setFontSize(8)
                doc.setTextColor(150, 150, 150)
                doc.text(`Página ${i} de ${pageCount}`, 280, 200, { align: 'right' }) // Ajustado para landscape
                doc.text('Simulador de Crédito Hipotecario - Método Francés Ordinario', 15, 200)
            }

            const fileName = `simulacion-${simulationData.clientInfo?.name?.replace(/\s+/g, '_') || 'credito'}-${new Date().toISOString().split('T')[0]}.pdf`
            doc.save(fileName)

        } catch (error) {
            console.error('Error exporting to PDF:', error)
            throw error
        }
    }

    const setSimulationDraft = (data: any) => {
        simulationDraft.value = data
    }

    const getSimulationDraft = () => {
        const data = simulationDraft.value
        simulationDraft.value = null
        return data
    }

    return {
        createSimulation,
        listUserSimulations,
        getSimulationById,
        getAmortizationSchedule,
        exportSimulationToPDF,
        setSimulationDraft,
        getSimulationDraft
    }
}