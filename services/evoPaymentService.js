const request = require('request');
const { v4: uuidv4 } = require('uuid');

/**
 * EVOPaymentService - Wrapper para Mastercard Gateway / EVO Payments
 * Proporciona métodos para:
 * - Crear sesiones de pago
 * - Procesar pagos (PAY operation)
 * - Autorización y captura (AUTHORIZE/CAPTURE)
 * - Reembolsos (REFUND)
 * - Recuperar órdenes (RETRIEVE_ORDER)
 * - Validar webhooks
 */
class EVOPaymentService {
  constructor() {
    this.baseUrl = process.env.EVO_BASE_URL || 'https://test.payment-gateway.com';
    this.merchantId = process.env.EVO_MERCHANT_ID;
    this.apiVersion = process.env.EVO_API_VERSION || '53';
    this.username = process.env.EVO_USERNAME;
    this.password = process.env.EVO_PASSWORD;
    this.webhookSecret = process.env.EVO_WEBHOOK_SECRET;
    this.currency = process.env.EVO_CURRENCY || 'MXN';

    // Validar que tenemos las credenciales necesarias
    if (!this.merchantId || !this.username || !this.password) {
      console.warn('⚠️ EVO Payments: Credenciales incompletas. Verifica variables de entorno.');
    }
  }

  /**
   * Construye la URL base para llamadas API
   * @param {string} orderId - ID de la orden
   * @param {string} transactionId - ID de la transacción (opcional)
   * @returns {string} URL completa
   */
  getRequestUrl(orderId, transactionId = null) {
    let url = `${this.baseUrl}/api/rest/version/${this.apiVersion}/merchant/${this.merchantId}/order/${orderId}`;
    if (transactionId) {
      url += `/transaction/${transactionId}`;
    }
    return url;
  }

  /**
   * Configura opciones de autenticación HTTP Basic
   * @param {object} options - Opciones de request
   * @returns {object} Opciones con autenticación configurada
   */
  setAuthentication(options) {
    options.auth = {
      user: this.username,
      pass: this.password
    };
    return options;
  }

  /**
   * Crear una sesión de pago
   * @param {number} amount - Monto en unidades (no centavos)
   * @param {string} orderId - ID único de la orden (opcional, se genera si no existe)
   * @returns {Promise<object>} Respuesta con sessionId
   */
  async createSession(amount, orderId = null) {
    return new Promise((resolve, reject) => {
      const sessionOrderId = orderId || `ORD-${uuidv4()}`;
      const sessionUrl = `${this.baseUrl}/api/rest/version/${this.apiVersion}/merchant/${this.merchantId}/session`;

      const requestData = {
        apiOperation: 'CREATE_CHECKOUT_SESSION',
        order: {
          id: sessionOrderId,
          currency: this.currency
        }
      };

      let options = {
        url: sessionUrl,
        method: 'POST',
        json: requestData,
        timeout: 30000
      };

      options = this.setAuthentication(options);

      request(options, (error, response, body) => {
        if (error) {
          return reject({
            code: 'EVO_SESSION_ERROR',
            message: `Error creando sesión: ${error.message}`,
            error
          });
        }

        if (body && body.session && body.session.id) {
          return resolve({
            orderId: sessionOrderId,
            sessionId: body.session.id,
            updateStatus: body.session.updateStatus,
            version: body.session.version,
            timestamp: new Date().toISOString()
          });
        }

        reject({
          code: 'EVO_SESSION_INVALID',
          message: 'EVO no devolvió sessionId válido',
          response: body
        });
      });
    });
  }

  /**
   * Procesar un pago (PAY operation)
   * @param {object} paymentData - Datos del pago
   * @returns {Promise<object>} Resultado del pago
   */
  async processPay(paymentData) {
    return new Promise((resolve, reject) => {
      const {
        orderId,
        transactionId = `TXN-${uuidv4()}`,
        amount,
        sessionId,
        description = 'Membresía Fit Sanctuary'
      } = paymentData;

      if (!orderId || !amount || !sessionId) {
        return reject({
          code: 'EVO_INVALID_PARAMS',
          message: 'Parámetros requeridos: orderId, amount, sessionId'
        });
      }

      const url = this.getRequestUrl(orderId, transactionId);

      const requestBody = {
        apiOperation: 'PAY',
        order: {
          id: orderId,
          amount: parseFloat(amount).toFixed(2),
          currency: this.currency,
          description: description
        },
        transaction: {
          id: transactionId
        },
        session: {
          id: sessionId
        },
        sourceOfFunds: {
          type: 'CARD'
        }
      };

      let options = {
        url,
        method: 'PUT',
        json: requestBody,
        timeout: 30000
      };

      options = this.setAuthentication(options);

      request(options, (error, response, body) => {
        if (error) {
          return reject({
            code: 'EVO_PAY_ERROR',
            message: `Error procesando pago: ${error.message}`,
            error
          });
        }

        resolve({
          orderId,
          transactionId,
          result: body.result,
          status: body.transaction?.status,
          amount,
          currency: this.currency,
          timestamp: new Date().toISOString(),
          rawResponse: body
        });
      });
    });
  }

  /**
   * Procesar una autorización (AUTHORIZE operation)
   * @param {object} authData - Datos de autorización
   * @returns {Promise<object>} Resultado de autorización
   */
  async processAuthorize(authData) {
    return new Promise((resolve, reject) => {
      const {
        orderId,
        transactionId = `TXN-${uuidv4()}`,
        amount,
        sessionId
      } = authData;

      if (!orderId || !amount || !sessionId) {
        return reject({
          code: 'EVO_INVALID_PARAMS',
          message: 'Parámetros requeridos: orderId, amount, sessionId'
        });
      }

      const url = this.getRequestUrl(orderId, transactionId);

      const requestBody = {
        apiOperation: 'AUTHORIZE',
        order: {
          id: orderId,
          amount: parseFloat(amount).toFixed(2),
          currency: this.currency
        },
        transaction: {
          id: transactionId
        },
        session: {
          id: sessionId
        },
        sourceOfFunds: {
          type: 'CARD'
        }
      };

      let options = {
        url,
        method: 'PUT',
        json: requestBody,
        timeout: 30000
      };

      options = this.setAuthentication(options);

      request(options, (error, response, body) => {
        if (error) {
          return reject({
            code: 'EVO_AUTHORIZE_ERROR',
            message: `Error autorizando pago: ${error.message}`,
            error
          });
        }

        resolve({
          orderId,
          transactionId,
          result: body.result,
          status: body.transaction?.status,
          amount,
          currency: this.currency,
          timestamp: new Date().toISOString(),
          rawResponse: body
        });
      });
    });
  }

  /**
   * Capturar una autorización previa (CAPTURE operation)
   * @param {object} captureData - Datos de captura
   * @returns {Promise<object>} Resultado de captura
   */
  async processCapture(captureData) {
    return new Promise((resolve, reject) => {
      const {
        orderId,
        transactionId,
        amount
      } = captureData;

      if (!orderId || !transactionId || !amount) {
        return reject({
          code: 'EVO_INVALID_PARAMS',
          message: 'Parámetros requeridos: orderId, transactionId, amount'
        });
      }

      const url = this.getRequestUrl(orderId, transactionId);

      const requestBody = {
        apiOperation: 'CAPTURE',
        order: {
          id: orderId,
          amount: parseFloat(amount).toFixed(2),
          currency: this.currency
        }
      };

      let options = {
        url,
        method: 'PUT',
        json: requestBody,
        timeout: 30000
      };

      options = this.setAuthentication(options);

      request(options, (error, response, body) => {
        if (error) {
          return reject({
            code: 'EVO_CAPTURE_ERROR',
            message: `Error capturando pago: ${error.message}`,
            error
          });
        }

        resolve({
          orderId,
          transactionId,
          result: body.result,
          status: body.transaction?.status,
          amount,
          currency: this.currency,
          timestamp: new Date().toISOString(),
          rawResponse: body
        });
      });
    });
  }

  /**
   * Procesar un reembolso (REFUND operation)
   * @param {object} refundData - Datos de reembolso
   * @returns {Promise<object>} Resultado de reembolso
   */
  async processRefund(refundData) {
    return new Promise((resolve, reject) => {
      const {
        orderId,
        transactionId,
        amount,
        reason = 'Customer requested refund'
      } = refundData;

      if (!orderId || !transactionId || !amount) {
        return reject({
          code: 'EVO_INVALID_PARAMS',
          message: 'Parámetros requeridos: orderId, transactionId, amount'
        });
      }

      const url = this.getRequestUrl(orderId, transactionId);

      const requestBody = {
        apiOperation: 'REFUND',
        order: {
          id: orderId,
          amount: parseFloat(amount).toFixed(2),
          currency: this.currency
        },
        transaction: {
          id: transactionId
        }
      };

      let options = {
        url,
        method: 'PUT',
        json: requestBody,
        timeout: 30000
      };

      options = this.setAuthentication(options);

      request(options, (error, response, body) => {
        if (error) {
          return reject({
            code: 'EVO_REFUND_ERROR',
            message: `Error reembolsando: ${error.message}`,
            error
          });
        }

        resolve({
          orderId,
          transactionId,
          result: body.result,
          status: body.transaction?.status,
          amount,
          refundReason: reason,
          currency: this.currency,
          timestamp: new Date().toISOString(),
          rawResponse: body
        });
      });
    });
  }

  /**
   * Anular una transacción (VOID operation)
   * @param {object} voidData - Datos para anular
   * @returns {Promise<object>} Resultado de anulación
   */
  async voidTransaction(voidData) {
    return new Promise((resolve, reject) => {
      const {
        orderId,
        transactionId
      } = voidData;

      if (!orderId || !transactionId) {
        return reject({
          code: 'EVO_INVALID_PARAMS',
          message: 'Parámetros requeridos: orderId, transactionId'
        });
      }

      const url = this.getRequestUrl(orderId, transactionId);

      const requestBody = {
        apiOperation: 'VOID'
      };

      let options = {
        url,
        method: 'PUT',
        json: requestBody,
        timeout: 30000
      };

      options = this.setAuthentication(options);

      request(options, (error, response, body) => {
        if (error) {
          return reject({
            code: 'EVO_VOID_ERROR',
            message: `Error anulando transacción: ${error.message}`,
            error
          });
        }

        resolve({
          orderId,
          transactionId,
          result: body.result,
          status: body.transaction?.status,
          timestamp: new Date().toISOString(),
          rawResponse: body
        });
      });
    });
  }

  /**
   * Recuperar información de una orden
   * @param {string} orderId - ID de la orden
   * @returns {Promise<object>} Datos de la orden
   */
  async retrieveOrder(orderId) {
    return new Promise((resolve, reject) => {
      if (!orderId) {
        return reject({
          code: 'EVO_INVALID_PARAMS',
          message: 'Parámetro requerido: orderId'
        });
      }

      const url = this.getRequestUrl(orderId);

      let options = {
        url,
        method: 'GET',
        timeout: 30000
      };

      options = this.setAuthentication(options);

      request(options, (error, response, body) => {
        if (error) {
          return reject({
            code: 'EVO_RETRIEVE_ERROR',
            message: `Error recuperando orden: ${error.message}`,
            error
          });
        }

        const bodyParsed = typeof body === 'string' ? JSON.parse(body) : body;

        resolve({
          orderId,
          order: bodyParsed.order,
          transaction: bodyParsed.transaction,
          timestamp: new Date().toISOString(),
          rawResponse: bodyParsed
        });
      });
    });
  }

  /**
   * Validar firma de webhook de EVO
   * @param {string} signature - Signature del header X-Notification-Secret
   * @returns {boolean} True si la firma es válida
   */
  validateWebhookSignature(signature) {
    if (!this.webhookSecret) {
      console.warn('⚠️ EVO_WEBHOOK_SECRET no configurado');
      return false;
    }
    return signature === this.webhookSecret;
  }

  /**
   * Procesar un webhook de EVO
   * @param {object} payload - Cuerpo del webhook
   * @returns {object} Datos extraídos del webhook
   */
  processWebhookPayload(payload) {
    if (!payload || !payload.order || !payload.transaction) {
      throw new Error('Webhook payload inválido: falta order o transaction');
    }

    return {
      orderId: payload.order.id,
      orderStatus: payload.order.status,
      orderAmount: payload.order.amount,
      orderCurrency: payload.order.currency,
      transactionId: payload.transaction.id,
      transactionStatus: payload.transaction.status,
      transactionResult: payload.transaction.result,
      timestamp: new Date().toISOString(),
      rawPayload: payload
    };
  }

  /**
   * Mapear resultado de EVO a un objeto estándar
   * @param {object} evoResponse - Respuesta de EVO
   * @returns {object} Objeto estándar
   */
  mapResponse(evoResponse) {
    return {
      success: evoResponse.result === 'SUCCESS',
      orderId: evoResponse.orderId,
      transactionId: evoResponse.transactionId,
      amount: evoResponse.amount,
      currency: evoResponse.currency,
      status: evoResponse.status,
      result: evoResponse.result,
      timestamp: evoResponse.timestamp,
      raw: evoResponse.rawResponse
    };
  }

  /**
   * Convertir centavos de Stripe a unidades de EVO
   * @param {number} cents - Monto en centavos
   * @returns {number} Monto en unidades
   */
  static convertFromCents(cents) {
    return cents / 100;
  }

  /**
   * Convertir unidades de EVO a centavos de Stripe
   * @param {number} units - Monto en unidades
   * @returns {number} Monto en centavos
   */
  static convertToCents(units) {
    return units * 100;
  }
}

module.exports = new EVOPaymentService();
