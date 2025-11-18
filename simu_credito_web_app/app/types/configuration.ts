// app/types/configuration.ts

/**
 * Representa una Entidad Financiera.
 * Basado en el schema GET /api/configuration/financial-entities/{id}
 */
export interface FinancialEntity {
    id: number;
    entityName: string;
    entityCode: string;
    isActive: boolean;
    maxLoanAmount: number | null;
    minLoanAmount: number | null;
    maxTermMonths: number | null;
    minTermMonths: number | null;
    interestRateTea: number;
    interestRateTna: number | null;
    capitalizationPeriod: string | null;
    processingFeePercentage: number | null;
    lifeInsurancePercentage: number | null;
    propertyInsurancePercentage: number | null;
    periodoGracia: number | null;
    photoUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Representa un Parámetro de Bono (BBP, Techo Propio).
 * Basado en el schema GET /api/configuration/bonus-parameters
 */
export interface BonusParameter {
    id: number;
    bonusType: string;         // E.g., "BBP", "TECHO_PROPIO"
    bonusSubtype: string | null; // E.g., "TRADICIONAL", "SOSTENIBLE", "INTEGRADOR", "AVN"
    minPropertyValue: number | null;
    maxPropertyValue: number | null;
    bonusPercentage: number | null;
    bonusAmount: number;
    isSustainableRequired: boolean;
    isActive: boolean;
    validFrom: string | null;
    validUntil: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Representa un Valor Global (UIT, Tipo de Cambio).
 * Basado en el schema GET /api/configuration/global-values
 */
export interface GlobalValue {
    id: number;
    valueKey: string;     // E.g., "UIT", "EXCHANGE_RATE_USD"
    valueName: string;    // E.g., "Unidad Impositiva Tributaria", "Tipo de Cambio USD a PEN"
    numericValue: number | null;
    stringValue: string | null;
    valueType: string;    // "NUMERIC" | "STRING" | "DATE"
    unit: string | null;  // "PEN", "USD", "%"
    isActive: boolean;
    validFrom: string | null;
    validUntil: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}