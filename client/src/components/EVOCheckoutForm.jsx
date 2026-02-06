import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

/**
 * EVOCheckoutForm Component
 * Integración con EVO Payments (Mastercard Payment Gateway)
 * Usa el modelo de sesión + orden para procesar pagos
 */
export default function EVOCheckoutForm({ 
    amount, 
    email, 
    nombre, 
    apellido, 
    productId, 
    productName,
    onSuccess,
    orderId,
    isRenewal = false,
    clienteId = null,
    membershipId = null
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [successIndicator, setSuccessIndicator] = useState(null);
    const [step, setStep] = useState('init'); // init, session-created, processing, success, error
    const [embedReady, setEmbedReady] = useState(false);

    /**
     * Inicializar Hosted Checkout con lightbox
     * (EVO no permite iframe embebido por seguridad)
     */
    const initializeHostedCheckout = (sessionData) => {
        const parseCheckoutError = (err) => {
            if (!err) return 'Error al procesar el pago';
            if (err.error?.explanation) return err.error.explanation;
            if (err.explanation) return err.explanation;
            if (typeof err === 'string') return err;
            return 'Error al procesar el pago';
        };

        setSuccessIndicator(sessionData.successIndicator || null);

        window.evoErrorCallback = (err) => {
            const message = parseCheckoutError(err);
            console.error('❌ EVO Checkout error:', err);
            setError(message);
            setStep('error');
        };

        window.evoCancelCallback = () => {
            setError('Pago cancelado por el usuario');
            setStep('error');
            setEmbedReady(false);
        };

        window.evoBeforeRedirect = () => {
            if (window.Checkout?.saveFormFields) {
                return window.Checkout.saveFormFields();
            }
            return null;
        };

        window.evoAfterRedirect = () => {
            if (window.Checkout?.restoreFormFields) {
                window.Checkout.restoreFormFields();
            }
        };

        window.evoCompleteCallback = async (resultIndicator) => {
            if (sessionData.successIndicator && resultIndicator === sessionData.successIndicator) {
                setStep('success');
                setEmbedReady(false);
                
                // Enviar datos al CRM y correo de confirmación
                try {
                    // Enviar al CRM
                    await fetch('/api/crm/create-client', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: email,
                            nombre: nombre,
                            apellido: apellido,
                            membershipType: productId,
                            amount: amount,
                            orderId: orderId,
                            esRenovacion: isRenewal,
                            clienteId: clienteId,
                            membershipId: membershipId
                        })
                    });
                    
                    // Enviar correo de confirmación
                    await fetch('/api/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            email: email,
                            plan: productName,
                            price: amount,
                            orderId: orderId,
                            esRenovacion: isRenewal,
                            clienteNombre: `${nombre} ${apellido}`.trim()
                        })
                    });
                    
                    console.log('✅ Confirmación enviada al CRM y por email');
                } catch (e) {
                    console.error('Error en proceso post-pago:', e);
                }
                
                if (onSuccess) {
                    onSuccess({
                        transactionId: resultIndicator,
                        orderId: orderId,
                        amount: amount
                    });
                }
                return;
            }

            setError('Pago rechazado por validación de riesgo. Intenta con otra tarjeta.');
            setStep('error');
            setEmbedReady(false);
        };

        const startCheckout = () => {
            // Esperar a que window.Checkout esté disponible
            if (!window.Checkout) {
                setTimeout(startCheckout, 100);
                return;
            }

            try {
                // Configure solo con session.id según documentación oficial v67+
                window.Checkout.configure({
                    session: {
                        id: sessionData.sessionId
                    }
                });

                // Mostrar la página embebida dentro del contenedor
                setEmbedReady(true);

                const waitForContainer = (attempt = 0) => {
                    const container = document.querySelector('#evo-embed-target');
                    if (container) {
                        window.Checkout.showEmbeddedPage('#evo-embed-target');
                        return;
                    }
                    if (attempt >= 20) {
                        setError('No se encontró el contenedor de pago');
                        setStep('error');
                        setEmbedReady(false);
                        return;
                    }
                    setTimeout(() => waitForContainer(attempt + 1), 50);
                };

                waitForContainer();
            } catch (err) {
                console.error('❌ Error al iniciar Hosted Checkout:', err);
                setError('Error al iniciar el checkout: ' + err.message);
                setStep('error');
                setEmbedReady(false);
            }
        };

        const existingScript = document.querySelector('script[data-evo-checkout="true"]');
        if (existingScript) {
            startCheckout();
            return;
        }

        const script = document.createElement('script');
        script.src = `${sessionData.baseUrl}/static/checkout/checkout.min.js?nocache=${Date.now()}`;
        script.setAttribute('data-error', 'evoErrorCallback');
        script.setAttribute('data-complete', 'evoCompleteCallback');
        script.setAttribute('data-cancel', 'evoCancelCallback');
        script.setAttribute('data-beforeRedirect', 'evoBeforeRedirect');
        script.setAttribute('data-afterRedirect', 'evoAfterRedirect');
        script.setAttribute('data-evo-checkout', 'true');
        script.onload = startCheckout;
        script.onerror = () => {
            setError('Error al cargar el módulo de pago');
            setStep('error');
            setEmbedReady(false);
        };
        document.body.appendChild(script);
    };

    /**
     * Paso 1: Crear sesión de pago en EVO
     */
    const createSession = async () => {
        try {
            setLoading(true);
            setError(null);
            setStep('init');

            const response = await fetch('/api/evo/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: Math.round(amount * 100) / 100, // EVO usa unidades, no centavos
                    orderId: orderId,
                    email: email,
                    nombre: nombre,
                    apellido: apellido,
                    productId: productId,
                    productName: productName,
                    isRenewal: isRenewal,
                    clienteId: clienteId,
                    membershipId: membershipId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error creando sesión de pago');
            }

            if (!data.sessionId) {
                throw new Error('Respuesta inválida del servidor');
            }

            console.log('✅ Sesión EVO creada:', data.sessionId);
            setSessionId(data.sessionId);
            setSuccessIndicator(data.successIndicator || null);
            if (data.orderId && data.successIndicator) {
                localStorage.setItem(
                    `evo:${data.orderId}`,
                    JSON.stringify({
                        orderId: data.orderId,
                        successIndicator: data.successIndicator,
                        plan: productName,
                        amount: amount,
                        email: email
                    })
                );
            }
            setStep('session-created');

            // Inicializar Hosted Checkout con JavaScript
            initializeHostedCheckout(data);

        } catch (err) {
            console.error('❌ Error creando sesión:', err);
            setError(err.message || 'Error al iniciar el pago');
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Paso 2: Procesar pago (solo si el usuario regresa con sessionId)
     * Normalmente EVO maneja esto automáticamente en su Hosted Checkout
     */
    const processPayment = async () => {
        if (!sessionId) {
            setError('ID de sesión no disponible');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setStep('processing');

            const response = await fetch('/api/evo/process-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: sessionId,
                    email: email,
                    nombre: nombre,
                    apellido: apellido,
                    orderId: orderId,
                    isRenewal: isRenewal,
                    clienteId: clienteId,
                    membershipId: membershipId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error procesando pago');
            }

            console.log('✅ Pago procesado:', data);
            setStep('success');
            
            // Llamar callback de éxito
            if (onSuccess) {
                onSuccess({
                    transactionId: data.transactionId,
                    orderId: orderId,
                    amount: amount
                });
            }

        } catch (err) {
            console.error('❌ Error procesando pago:', err);
            setError(err.message || 'Error al procesar el pago');
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Pagar con EVO Payments</h3>
                <p className="text-sm text-gray-400">
                    {productName} • ${amount.toFixed(2)} MXN
                </p>
            </div>

            {/* Estado: Inicial o Botón de inicio */}
            {step === 'init' && (
                <button
                    onClick={createSession}
                    disabled={loading}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors mb-4"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader className="w-4 h-4 animate-spin" />
                            Iniciando...
                        </span>
                    ) : (
                        'Pagar Ahora'
                    )}
                </button>
            )}

            {/* Estado: Sesión creada - formulario embebido */}
            {step === 'session-created' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                        <Loader className="w-4 h-4 animate-spin text-blue-400" />
                        <span className="text-sm text-blue-300">
                            Formulario de pago cargado. Completa tu pago en el formulario embebido.
                        </span>
                    </div>
                </div>
            )}

            {/* Estado: Procesando */}
            {step === 'processing' && (
                <div className="flex items-center justify-center gap-2 p-4 bg-blue-900/10 rounded-lg">
                    <Loader className="w-5 h-5 animate-spin text-yellow-500" />
                    <span className="text-gray-300">Procesando pago...</span>
                </div>
            )}

            {/* Estado: Éxito */}
            {step === 'success' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-green-300">
                            ¡Pago realizado exitosamente!
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        Transacción procesada. Recibirás un email de confirmación.
                    </p>
                </div>
            )}

            {/* Estado: Error */}
            {step === 'error' && (
                <div className="space-y-4">
                    <div className="flex gap-3 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-red-300 font-semibold">Error al procesar pago</p>
                            <p className="text-xs text-red-200 mt-1">{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setError(null);
                            setStep('init');
                        }}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            )}

            {/* Info de seguridad */}
            <div className="mt-6 pt-6 border-t border-neutral-700">
                <p className="text-xs text-gray-500 text-center">
                    🔒 Tus datos están protegidos por Mastercard Payment Gateway (PCI-DSS)
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                    <div className="text-[10px] font-bold text-gray-600 border border-gray-600 rounded px-2 py-1">
                        MASTERCARD
                    </div>
                    <span className="text-[10px] text-gray-600">Secure Payment</span>
                </div>
            </div>

            {/* Contenedor embebido de EVO */}
            {embedReady && (
                <div className="mt-6 p-6 bg-neutral-950/70 border border-neutral-800 rounded-2xl">
                    <div id="evo-embed-target" className="min-h-[640px]" />
                </div>
            )}
        </div>
    );
}
