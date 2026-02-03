import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { ShieldCheck, Lock, CheckCircle, ChevronRight, CreditCard, Mail } from 'lucide-react';

const cleanKey = (key) => (key || "").replace(/[\n\r\s]/g, "").trim();
const STRIPE_KEY = cleanKey(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const MP_KEY = cleanKey(import.meta.env.VITE_MP_PUBLIC_KEY);

const stripePromise = STRIPE_KEY && !STRIPE_KEY.includes('TU_CLAVE') ? loadStripe(STRIPE_KEY) : null;
if (MP_KEY && !MP_KEY.includes('TU_CLAVE')) { 
    initMercadoPago(MP_KEY, { locale: 'es-MX' }); 
}

// Catálogo de planes con soporte para paquetes contractuales
const PLANS = {
    'estudiante': { name: 'Mensualidad Estudiantes', price: 519, contractual: false },
    'general': { name: 'Mensualidad General', price: 579, contractual: false },
    'trimestral': { name: 'Paquete 3 Meses', price: 1449, contractual: true },
    'semestral': { name: 'Paquete 6 Meses', price: 2799, contractual: true },
    'anual': { name: 'Paquete 12 Meses', price: 5299, contractual: true },
    'paquete01': { name: 'Paquete 01 (Todo Incluido)', price: 1549, contractual: true },
    'paquete02': { name: 'Paquete 02 (Todo Incluido)', price: 1699, contractual: true },
    'pilates': { name: 'Pack Pilates', price: 1149, contractual: false },
    'pilates_2x': { name: 'Pack Pilates 2x', price: 840, contractual: false },
    'hyrox': { name: 'Pack Hyrox', price: 579, contractual: false },
    'clase_pilates': { name: 'Clase de Pilates', price: 160, contractual: false },
    'grupal_3m': { name: 'Plan Grupal 3 Meses', price: 1249, contractual: false }
};

const StripeForm = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setLoading(true);
        const { error: submitError } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: `${window.location.origin}/renewal-success` },
            redirect: "if_required",
        });
        if (submitError) {
            setError(submitError.message);
            setLoading(false);
        } else {
            onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {error && <div className="text-red-500 text-xs">{error}</div>}
            <button 
                disabled={!stripe || loading} 
                className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
                {loading ? 'Procesando...' : 'Confirmar Renovación'}
            </button>
        </form>
    );
};

export default function RenewalPage() {
    const [renewalData, setRenewalData] = useState(null);
    const [plan, setPlan] = useState(null);
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stripeClientSecret, setStripeClientSecret] = useState(null);
    const [mpPreferenceId, setMpPreferenceId] = useState(null);
    const [mpError, setMpError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [previousMembership, setPreviousMembership] = useState(null);
    const [priceToApply, setPriceToApply] = useState(null);

    // Obtener membresía anterior para decidir si conservar precio
    const fetchPreviousMembership = async (membershipId) => {
        if (!membershipId || membershipId === 'null') return null;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/memberships/${membershipId}`);
            if (response.ok) {
                const membership = await response.json();
                setPreviousMembership(membership);
                console.log('✓ Membresía anterior obtenida:', membership);
                return membership;
            }
        } catch (error) {
            console.warn('⚠️ No se pudo obtener membresía anterior:', error);
        }
        return null;
    };

    // Calcular precio inteligente: conservar si es paquete contractual en renovación
    const calculatePrice = (planId, previousMembership) => {
        const planInfo = PLANS[planId];
        if (!planInfo) return null;

        // Si es paquete contractual y hay membresía anterior del mismo tipo con precio anterior, conservar
        if (planInfo.contractual && previousMembership && previousMembership.tipo === planId && previousMembership.monto) {
            console.log(`💰 Conservando precio contractual: $${previousMembership.monto}`);
            return previousMembership.monto;
        }

        // Si no, usar precio actual
        console.log(`💰 Aplicando precio actual: $${planInfo.price}`);
        return planInfo.price;
    };

    useEffect(() => {
        // Extraer parámetros de la URL
        const params = new URLSearchParams(window.location.search);
        const planId = params.get('plan');
        const clienteId = params.get('clienteId');
        const clienteNombre = params.get('clienteNombre');
        const membershipId = params.get('membershipId');
        const isRenovacion = params.get('renovacion') === 'true';

        console.log('🔄 Página de Renovación cargada:', { planId, clienteId, clienteNombre, membershipId, isRenovacion });

        if (isRenovacion && planId && clienteId) {
            const planInfo = PLANS[planId];
            if (planInfo) {
                setPlan({ id: planId, ...planInfo });
                setRenewalData({
                    clienteId,
                    clienteNombre: decodeURIComponent(clienteNombre || ''),
                    membershipId,
                    isRenovacion: true
                });
                setOrderId(`RENEW-${Date.now()}`);
                console.log('✅ Plan de renovación identificado:', planInfo.name);

                // Obtener membresía anterior para lógica de precios
                if (membershipId && membershipId !== 'null') {
                    fetchPreviousMembership(membershipId).then((prev) => {
                        const price = calculatePrice(planId, prev);
                        setPriceToApply(price);
                    });
                } else {
                    // Si no hay membresía anterior, usar precio actual
                    setPriceToApply(planInfo.price);
                }
            } else {
                console.error('❌ Plan no encontrado:', planId);
            }
        } else {
            console.error('❌ Parámetros de renovación faltantes');
        }
    }, []);

    const getFee = (price) => Math.round(price * 0.05);
    const getTotal = (price) => price + getFee(price);

    const initStripePayment = async () => {
        if (!email || !email.includes('@')) {
            alert('Por favor ingresa un email válido');
            return;
        }

        setLoading(true);
        try {
            const price = priceToApply || plan.price;  // Use intelligent price
            const total = getTotal(price);
            const res = await fetch('/api/stripe/create-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    amount: total,
                    email: email,
                    nombre: renewalData.clienteNombre,
                    apellido: '',
                    productId: plan.id,
                    productName: plan.name,
                    isRenewal: true,
                    clienteId: renewalData.clienteId,
                    membershipId: renewalData.membershipId,
                    esRenovacion: true,
                    montoOriginal: price  // Pass the intelligent price
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setStripeClientSecret(data.clientSecret);
            setPaymentMethod('stripe');
        } catch (e) {
            console.error('Error iniciando pago Stripe:', e);
            alert("Error al iniciar pago: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const initMPPayment = async () => {
        if (!email || !email.includes('@')) {
            alert('Por favor ingresa un email válido');
            return;
        }

        setLoading(true);
        setMpError(null);
        try {
            const price = priceToApply || plan.price;  // Use intelligent price
            const total = getTotal(price);
            const res = await fetch('/api/mp/create-preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title: `Renovación - ${plan.name}`,
                    price: total,
                    orderId: orderId,
                    userEmail: email,
                    montoOriginal: price,  // Pass the intelligent price
                    esRenovacion: true,
                    metadata: {
                        isRenewal: true,
                        clienteId: renewalData.clienteId,
                        membershipId: renewalData.membershipId,
                        planId: plan.id,
                        montoOriginal: price
                    }
                })
            });
            
            if (!res.ok) throw new Error(`Error ${res.status}`);
            
            const data = await res.json();
            if (!data.id) throw new Error("No se recibió ID de preferencia");
            
            console.log('✓ Preferencia MP creada:', data.id);
            setMpPreferenceId(data.id);
            setPaymentMethod('mp');
        } catch (error) {
            setMpError(error.message || 'Error al iniciar pago');
            console.error('Error iniciando pago MP:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = async () => {
        setSuccess(true);
        
        // Enviar confirmación al servidor
        try {
            await fetch('/api/crm/create-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    nombre: renewalData.clienteNombre.split(' ')[0] || '',
                    apellido: renewalData.clienteNombre.split(' ').slice(1).join(' ') || '',
                    membershipType: plan.id,
                    amount: getTotal(plan.price),
                    orderId: orderId,
                    esRenovacion: true,
                    clienteId: renewalData.clienteId,
                    membershipId: renewalData.membershipId
                })
            });
            
            await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email,
                    plan: plan.name,
                    price: getTotal(plan.price),
                    orderId: orderId,
                    esRenovacion: true,
                    clienteNombre: renewalData.clienteNombre
                })
            });
            
            console.log('✅ Renovación procesada exitosamente');
        } catch (e) {
            console.error('Error en proceso post-pago:', e);
        }
    };

    if (!plan || !renewalData) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando información de renovación...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">¡Renovación Exitosa!</h1>
                    <p className="text-gray-400 mb-6">
                        Tu membresía ha sido renovada correctamente. Recibirás un correo de confirmación en {email}.
                    </p>
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                        <p className="text-sm text-gray-500 mb-1">Plan</p>
                        <p className="text-white font-semibold">{plan.name}</p>
                        <p className="text-sm text-gray-500 mt-3 mb-1">Total Pagado</p>
                        <p className="text-2xl text-yellow-400 font-bold">${getTotal(priceToApply || plan.price)}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white">
            <div className="max-w-2xl mx-auto p-6 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-yellow-600/10 flex items-center justify-center border border-yellow-600/30 mx-auto mb-4">
                        <img src="/assets/icono.png" alt="FS" className="w-full h-full object-cover rounded-full" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Renovar Membresía</h1>
                    <p className="text-gray-400">Renovación para {renewalData.clienteNombre}</p>
                </div>

                {/* Plan Info */}
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-500 mb-1">Plan Seleccionado</p>
                            <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Total a Pagar</p>
                            <p className="text-4xl font-bold text-yellow-400">${getTotal(priceToApply || plan.price)}</p>
                            <p className="text-xs text-gray-500">Incluye comisión de ${getFee(priceToApply || plan.price)}</p>
                        </div>
                    </div>
                </div>

                {/* Email Input */}
                <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Confirma tu Email para recibir comprobante
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="tu@email.com" 
                            className="w-full bg-[#181818] border border-gray-700 rounded-lg py-4 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                        />
                    </div>
                </div>

                {/* Payment Methods */}
                {!paymentMethod ? (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Selecciona Método de Pago</h3>
                        
                        <button 
                            onClick={initStripePayment}
                            disabled={loading}
                            className="w-full bg-white text-black p-5 rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="text-left">
                                <CreditCard className="w-5 h-5 mb-1" />
                                <span className="block font-bold text-base">Tarjeta Crédito/Débito</span>
                                <span className="text-xs text-gray-600">Procesado vía Stripe</span>
                            </div>
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        <button 
                            onClick={initMPPayment}
                            disabled={loading}
                            className="w-full bg-[#009EE3] text-white p-5 rounded-xl flex items-center justify-between hover:bg-[#008bd0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="text-left">
                                <span className="block font-bold text-base">Mercado Pago</span>
                                <span className="text-xs opacity-90">Tarjetas, Transferencia, Oxxo</span>
                            </div>
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        {mpError && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                                {mpError}
                            </div>
                        )}
                    </div>
                ) : paymentMethod === 'stripe' && stripeClientSecret ? (
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                        <h3 className="text-lg font-bold text-white mb-4">Completa tu Pago</h3>
                        <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
                            <StripeForm onSuccess={handleSuccess} />
                        </Elements>
                    </div>
                ) : paymentMethod === 'mp' && mpPreferenceId ? (
                    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                        <h3 className="text-lg font-bold text-white mb-4">Completa tu Pago con Mercado Pago</h3>
                        <Wallet initialization={{ preferenceId: mpPreferenceId }} />
                    </div>
                ) : null}

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-8">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pago seguro y encriptado</span>
                    <Lock className="w-4 h-4 ml-2" />
                </div>
            </div>
        </div>
    );
}
