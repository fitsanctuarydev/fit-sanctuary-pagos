// membership-pricing-config.js - Configuración de precios y lógica de membresías

// Precios actuales (Feb 2026)
const CURRENT_PRICES = {
  'estudiante': 519,
  'general': 579,
  'trimestral': 1449,
  'semestral': 2799,
  'anual': 5299,
  'paquete01': 1299,
  'paquete02': 2499,
  'pilates': 349,
  'pilates_2x': 579,
  'hyrox': 599,
  'grupal_3m': 1249
};

// Duración en días por tipo
const MEMBERSHIP_DURATION = {
  'estudiante': 30,
  'general': 30,
  'trimestral': 90,
  'semestral': 180,
  'anual': 365,
  'paquete01': 30,
  'paquete02': 30,
  'pilates': 30,
  'pilates_2x': 30,
  'hyrox': 30,
  'grupal_3m': 90
};

// Tipos contractuales que conservan precio de preventa
const CONTRACTUAL_PACKAGES = ['trimestral', 'semestral', 'anual', 'paquete01', 'paquete02'];

/**
 * Determina si un tipo de membresía debe conservar su precio preventa en renovaciones
 * @param {string} membershipType - Tipo de membresía
 * @returns {boolean} - true si debe conservar precio, false si usa precio actual
 */
function isContractualPackage(membershipType) {
  return CONTRACTUAL_PACKAGES.includes(membershipType);
}

/**
 * Obtiene el precio a usar para una membresía
 * @param {string} membershipType - Tipo de membresía
 * @param {number} previousPrice - Precio anterior (si existe)
 * @param {boolean} isRenewal - Si es renovación
 * @returns {number} - Precio a utilizar
 */
function getPriceForMembership(membershipType, previousPrice = null, isRenewal = false) {
  // Si es renovación y es paquete contractual, conservar precio anterior
  if (isRenewal && isContractualPackage(membershipType) && previousPrice) {
    return previousPrice;
  }
  
  // Si es renovación y NO es paquete, usar precio actual
  if (isRenewal && !isContractualPackage(membershipType)) {
    return CURRENT_PRICES[membershipType] || 579;
  }
  
  // Si NO es renovación (primera compra), usar precio actual
  return CURRENT_PRICES[membershipType] || 579;
}

/**
 * Obtiene duración en días para un tipo de membresía
 * @param {string} membershipType - Tipo de membresía
 * @returns {number} - Duración en días
 */
function getDurationDays(membershipType) {
  return MEMBERSHIP_DURATION[membershipType] || 30;
}

/**
 * Mapea tipos de pago a tipos de membresía normalizados
 * @param {string} paymentType - Tipo de pago desde el sistema de pagos
 * @returns {string} - Tipo de membresía normalizado
 */
function mapPaymentTypeToMembership(paymentType) {
  const mapping = {
    'm_est': 'estudiante',
    'm_gen': 'general',
    'general': 'general',
    'estudiante': 'estudiante',
    'p_1m': 'general',
    'p_3m': 'trimestral',
    'p_tri': 'trimestral',
    'p_6m': 'semestral',
    'p_sem': 'semestral',
    'p_12m': 'anual',
    'p_anu': 'anual',
    'ai_01': 'paquete01',
    'ai_02': 'paquete02',
    'c_pil': 'pilates',
    'c_hyr': 'hyrox',
    'pilates': 'pilates',
    'pilates_2x': 'pilates_2x',
    'grupal_3m': 'grupal_3m',
    'grupal_trimestral': 'grupal_3m'
  };
  
  return mapping[paymentType] || 'general';
}

module.exports = {
  CURRENT_PRICES,
  MEMBERSHIP_DURATION,
  CONTRACTUAL_PACKAGES,
  isContractualPackage,
  getPriceForMembership,
  getDurationDays,
  mapPaymentTypeToMembership
};
