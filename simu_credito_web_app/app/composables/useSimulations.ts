import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Estado global para compartir datos entre la vista de resultados y el simulador
const simulationDraft = ref(null)

export const useSimulations = () => {
  const { apiFetch } = useApi()

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

  // --- NUEVO: Obtener historial del usuario ---
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
      const doc = new jsPDF()

      // Title
      doc.setFontSize(20)
      doc.text('Simulación de Crédito Hipotecario', 20, 30)

      // Client and Property Info
      doc.setFontSize(12)
      doc.text(`Cliente: ${simulationData.clientInfo?.name || 'N/A'}`, 20, 50)
      doc.text(`Propiedad: ${simulationData.propertyInfo?.name || 'N/A'}`, 20, 60)
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-PE')}`, 20, 70)

      // Summary Section
      doc.setFontSize(16)
      doc.text('Resumen de la Operación', 20, 90)

      const summaryData = [
        ['Valor Inmueble', `S/ ${simulationData.summary?.propertyValue?.toLocaleString() || '0'}`],
        ['Aporte del Estado', `S/ ${simulationData.summary?.stateContribution?.toLocaleString() || '0'}`],
        ['Cuota Inicial', `S/ ${simulationData.summary?.initialPayment?.toLocaleString() || '0'}`],
        ['Monto Financiado', `S/ ${simulationData.summary?.financingAmount?.toLocaleString() || '0'}`]
      ]

      autoTable(doc, {
        startY: 100,
        head: [['Concepto', 'Monto']],
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [79, 70, 229] }
      })

      // Key Indicators Section
      const indicatorsY = (doc as any).lastAutoTable.finalY + 20
      doc.setFontSize(16)
      doc.text('Indicadores Clave', 20, indicatorsY)

      const indicatorsData = [
        ['Cuota Mensual Total', `S/ ${simulationData.keyIndicators?.monthlyPayment ? simulationData.keyIndicators.monthlyPayment.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}`],
        ['TCEA', `${simulationData.keyIndicators?.tcea ? simulationData.keyIndicators.tcea.toFixed(2) : '0.00'}%`],
        ['COK', `${simulationData.keyIndicators?.cok ? simulationData.keyIndicators.cok.toFixed(2) : '0.00'}%`],
        ['VAN', `S/ ${simulationData.keyIndicators?.van?.toLocaleString() || '0'}`],
        ['TIR', `${simulationData.keyIndicators?.tir ? simulationData.keyIndicators.tir.toFixed(2) : '0.00'}%`],
        ['Total Intereses', `S/ ${simulationData.keyIndicators?.totalInterest?.toLocaleString() || '0'}`]
      ]

      autoTable(doc, {
        startY: indicatorsY + 10,
        head: [['Indicador', 'Valor']],
        body: indicatorsData,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [79, 70, 229] }
      })

      // Amortization Table
      const tableY = (doc as any).lastAutoTable.finalY + 20
      doc.setFontSize(16)
      doc.text('Tabla de Amortización', 20, tableY)

      // Get all payments for the table

      const allPayments = simulationData.amortizationSchedule?.payments || []

      const tableData = allPayments.map((payment: any) => [
        payment.paymentNumber,
        `${(payment.tem * 100).toFixed(4)}%`,
        // CAMBIO: Usar la descripción o fallback a 'Sin gracia'
        payment.gracePeriodDescription || 'Sin gracia',
        `S/ ${payment.initialBalance.toLocaleString()}`,
        `S/ ${payment.interest.toLocaleString()}`,
        `S/ ${payment.payment.toLocaleString()}`,
        `S/ ${payment.principal.toLocaleString()}`,
        `S/ ${payment.lifeInsurance.toLocaleString()}`,
        `S/ ${payment.propertyInsurance.toLocaleString()}`,
        `S/ ${payment.commissions.toLocaleString()}`,
        `S/ ${payment.adminCosts.toLocaleString()}`,
        `S/ ${payment.deliveryCosts.toLocaleString()}`,
        `S/ ${payment.finalBalance.toLocaleString()}`,
        `S/ ${payment.cashFlow.toLocaleString()}`
      ])

      autoTable(doc, {
        startY: tableY + 10,
        head: [['N° Cuota', 'TEM', 'Plazo de Gracia', 'Saldo Inicial', 'Interés', 'Cuota', 'Amortización', 'Seguro Desgrav.', 'Seguro Riesgo', 'Comisiones', 'Gastos Adm.', 'Portes', 'Saldo Final', 'Flujo']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [79, 70, 229] },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 15 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 25 },
          7: { cellWidth: 25 },
          8: { cellWidth: 25 },
          9: { cellWidth: 20 },
          10: { cellWidth: 20 },
          11: { cellWidth: 15 },
          12: { cellWidth: 25 },
          13: { cellWidth: 20 }
        }
      })

      // Footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.text(`Página ${i} de ${pageCount}`, 20, doc.internal.pageSize.height - 10)
        doc.text('Cálculos basados en el método francés vencido ordinario con meses de 30 días.', 20, doc.internal.pageSize.height - 20)
      }

      // Save the PDF
      doc.save(`simulacion-credito-${simulationData.clientInfo?.name || 'cliente'}-${new Date().toISOString().split('T')[0]}.pdf`)

    } catch (error) {
      console.error('Error exporting to PDF:', error)
      throw error
    }
  }

  // --- NUEVO: Helpers para Editar/Recalcular ---
  const setSimulationDraft = (data: any) => {
    simulationDraft.value = data
  }

  const getSimulationDraft = () => {
    const data = simulationDraft.value
    simulationDraft.value = null // Limpiar después de leer
    return data
  }

  return {
    createSimulation,
    listUserSimulations, // Exportado
    getSimulationById,
    getAmortizationSchedule,
    exportSimulationToPDF,
    setSimulationDraft, // Exportado
    getSimulationDraft  // Exportado
  }
}