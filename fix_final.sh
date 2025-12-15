#!/bin/bash

echo "🔧 Aplicando correcciones finales a PayPal y Mercado Pago..."

# 1. ACTUALIZAR APP.JSX (Frontend)
# Correcciones: .trim() en claves y 'amount' en MP Brick
cat > client/src/App.jsx <<'EOF'
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ShieldCheck, Lock, ArrowLeft, CheckCircle, Clock, MapPin, ChevronRight, UploadCloud, MessageCircle, Banknote, CreditCard } from 'lucide-react';

// --- LIMPIEZA DE CLAVES ---
// Quitamos espacios y saltos de línea que causan errores
const cleanKey = (key) => (key || "").replace(/[\n\r\s]/g, "").trim();

const STRIPE_KEY = cleanKey(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const MP_KEY = cleanKey(import.meta.env.VITE_MP_PUBLIC_KEY);
const PAYPAL_ID = cleanKey(import.meta.env.VITE_PAYPAL_CLIENT_ID);

// Inicializar SDKs
const stripePromise = STRIPE_KEY && !STRIPE_KEY.includes('TU_CLAVE') ? loadStripe(STRIPE_KEY) : null;
if (MP_KEY && !MP_KEY.includes('TU_CLAVE')) {
    initMercadoPago(MP_KEY, { locale: 'es-MX' });
}

const products = [
    { id: 'm_est', name: 'Mensualidad Estudiantes', price: 449, category: 'Mensualidad', desc: 'Requiere credencial vigente. Incluye: Cardio y Pesas.' },
    { id: 'm_gen', name: 'Mensualidad General', price: 499, category: 'Mensualidad', desc: 'Incluye: Cardio, Pesas, Zumba y Funcional.' },
    { id: 'p_tri', name: 'Paquete 3 Meses', price: 1250, category: 'Paquetes', desc: 'Preventa. Incluye: Cardio, Pesas, Zumba y Funcional.', tag: 'Ahorro' },
    { id: 'p_sem', name: 'Paquete 6 Meses', price: 2400, category: 'Paquetes', desc: 'Preventa. Incluye: Cardio, Pesas, Zumba y Funcional.', tag: 'Popular', highlight: true },
    { id: 'p_anu', name: 'Paquete 12 Meses', price: 4600, category: 'Paquetes', desc: 'Preventa. Incluye: Cardio, Pesas, Zumba y Funcional.', tag: 'Mejor Valor' },
    { id: 'ai_01', name: 'Paquete 01 (Todo Incluido)', price: 1350, category: 'All Inclusive', desc: 'Base + 2 clases/semana opcionales (Pilates/Hyrox). Costo mensual.' },
    { id: 'ai_02', name: 'Paquete 02 (Todo Incluido)', price: 1500, category: 'All Inclusive', desc: 'Base + 3 clases/semana opcionales (Pilates/Hyrox). Costo mensual.', highlight: true },
    { id: 'c_pil', name: 'Pack Pilates', price: 1000, category: 'Clases', desc: '3 clases a la semana.' },
    { id: 'c_hyr', name: 'Pack Hyrox', price: 499, category: 'Clases', desc: '4 clases a la semana.' },
];

const Logos = {
    Visa: () => <svg viewBox="0 0 48 32" className="h-6"><path fill="#fff" d="M18.5 4h5.1l-3.2 19.3h-5.1zm15.4 19.1c.6-.4 4.5-2.3 4.5-6.8 0-5.8-8-6.1-7.9-1.9 0 1.9 1.8 2.9 3.2 3.6 1.4.7 1.9 1.1 1.9 1.7 0 .9-1.1 1.3-2.1 1.3-1.4 0-2.2-.2-3.4-.7l-.5-.2-.5 3c.9.4 2.5.7 4.2.7 3.9.1 6.6-2 6.6-5.1-.1-1.7-1-3-3.2-4-1.3-.6-2.1-1-2.1-1.6 0-.6.6-1.1 2-1.1 1.3 0 2.2.2 2.9.5l.3.2.4-2.8c-.7-.3-1.6-.5-2.7-.5-2.8 0-4.8 1.5-4.8 3.6 0 3.3 4.5 3.5 4.5 5.5 0 .9-1.1 1.5-2.4 1.5-2 0-3.1-.9-4.8-1.8l-.8 3.5zM7.2 4H3.6L.1 23.3h5.2zm40.2 0h-4c-1.2 0-2.2.4-2.7 1.6l-7.7 18.2h5.4l.8-2.2h6.5l.6 2.7h4.8l-6.2-16.3zm-4.7 10.9 2.5-6.8 1.4 6.8h-3.9z" fillOpacity=".9"/></svg>,
    Mastercard: () => <svg viewBox="0 0 48 32" className="h-6"><g fill="none" fillRule="evenodd"><rect fill="#252525" width="48" height="32" rx="2"/><circle fill="#EB001B" cx="15" cy="16" r="10"/><circle fill="#F79E1B" cx="33" cy="16" r="10"/><path fill="#FF5F00" d="M24 8.4c-2.3 2-3.8 5-3.8 8.1s1.5 6.1 3.8 8.1c2.3-2 3.8-5 3.8-8.1s-1.5-6.1-3.8-8.1z"/></g></svg>,
    Amex: () => <svg viewBox="0 0 48 32" className="h-6"><path fill="#006FCF" d="M4 4h40v24H4z"/><path fill="#FFF" d="M8 22h8l-1.5-3.5h-5L8 22zm16.5 0h4.5l-2.5-6-2 6zm-7-14 3.5 8 1 2.5H23L27 8h-6.5l-1 3.5L18 8h-6l5 12-1 2H9l-2-5H6l2 7h24l6-14H10.5z"/></svg>,
    PCI: () => <div className="border border-neutral-600 rounded px-1 py-0.5 text-[8px] font-bold text-neutral-400 bg-black">PCI-DSS COMPLIANT</div>
};

// Componente Stripe Form
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
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });
    if (submitError) setError(submitError.message);
    else onSuccess();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <div className="text-red-500 text-xs">{error}</div>}
      <button disabled={!stripe || loading} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors">
        {loading ? 'Procesando...' : 'Pagar Ahora'}
      </button>
    </form>
  );
};

function App() {
    const [view, setView] = useState('shop');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);
    
    // Estados API
    const [stripeClientSecret, setStripeClientSecret] = useState(null);
    const [mpPreferenceId, setMpPreferenceId] = useState(null);

    const getFee = (price) => Math.round(price * 0.05);
    const getTotal = (price) => price + getFee(price);

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setPaymentMethod(null);
        setFileUploaded(false);
        setMpPreferenceId(null);
        setStripeClientSecret(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setView('checkout');
    };

    const initPayment = async (method, plan) => {
        setPaymentMethod(method);
        const total = getTotal(plan.price);

        try {
            if (method === 'stripe') {
                const res = await fetch('/api/stripe/create-intent', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: total })
                });
                const data = await res.json();
                if(data.error) throw new Error(data.error);
                setStripeClientSecret(data.clientSecret);
            }
            
            if (method === 'mp') {
                const res = await fetch('/api/mp/create-preference', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: plan.name, price: total })
                });
                const data = await res.json();
                if(data.error) throw new Error(data.error);
                setMpPreferenceId(data.id);
            }
        } catch (e) {
            console.error(e);
            alert("Error iniciando pago: " + e.message);
            setPaymentMethod(null);
        }
    };

    const handleTransfer = () => {
        setLoading(true);
        setTimeout(() => { setLoading(false); setView('success'); }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-yellow-500 selection:text-black pb-20">
            <div className="fixed inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}></div>

            <header className="fixed top-0 w-full z-50 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3" onClick={() => setView('shop')}>
                        <div className="w-8 h-8 rounded-full bg-yellow-600/10 flex items-center justify-center border border-yellow-600/30 overflow-hidden">
                            <img src="/assets/icono.png" alt="Icono" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                            <span className="font-bold text-yellow-500 text-xs absolute" style={{zIndex: -1}}>FS</span>
                        </div>
                        <span className="font-bold uppercase tracking-wider text-sm">Fit Sanctuary</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-green-500 bg-green-900/20 px-2 py-1 rounded-full border border-green-500/20">
                        <Lock className="w-3 h-3" /><span>Pago Seguro</span>
                    </div>
                </div>
            </header>

            <main className="pt-24 px-4 max-w-xl mx-auto relative z-10">
                {/* VISTA: TIENDA */}
                {view === 'shop' && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-8">
                            <div className="inline-block bg-yellow-500 text-black font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider mb-2">Del 05 al 20 Dic 2025</div>
                            <h1 className="text-2xl font-black uppercase text-white mb-2">Preventa Exclusiva</h1>
                            <p className="text-neutral-400 text-xs max-w-xs mx-auto">Precios especiales por apertura.</p>
                        </div>
                        {['Mensualidad', 'Paquetes', 'All Inclusive', 'Clases'].map(category => (
                            <div key={category} className="mb-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-[1px] bg-neutral-800 flex-1"></div>
                                    <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest">{category}</h3>
                                    <div className="h-[1px] bg-neutral-800 flex-1"></div>
                                </div>
                                <div className="space-y-3">
                                    {products.filter(p => p.category === category).map(plan => (
                                        <div key={plan.id} onClick={() => handleSelectPlan(plan)} className={`relative p-5 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${plan.highlight ? 'bg-gradient-to-r from-neutral-900 to-[#151515] border-yellow-500/40 shadow-lg shadow-yellow-900/10' : 'bg-[#181818] border-neutral-800'}`}>
                                            {plan.tag && <div className="absolute top-0 right-0 bg-yellow-600 text-black text-[9px] font-bold px-2 py-1 rounded-bl-lg uppercase">{plan.tag}</div>}
                                            <div className="flex justify-between items-start">
                                                <div className="pr-4"><h3 className={`font-bold uppercase text-sm ${plan.highlight ? 'text-yellow-100' : 'text-neutral-200'}`}>{plan.name}</h3><p className="text-[10px] text-neutral-500 mt-1">{plan.desc}</p></div>
                                                <div className="text-right"><div className="text-lg font-bold text-yellow-500">${plan.price}</div></div>
                                            </div>
                                            <div className="mt-3 flex items-center text-[10px] font-bold text-neutral-400 group-hover:text-yellow-500">Seleccionar <ChevronRight className="w-3 h-3 ml-1" /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* VISTA: CHECKOUT */}
                {view === 'checkout' && selectedPlan && (
                    <div className="animate-fade-in">
                        <button onClick={() => setView('shop')} className="text-xs text-neutral-500 mb-6 hover:text-white flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Cambiar plan</button>
                        
                        <div className="bg-[#181818] border border-neutral-800 rounded-xl p-5 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
                            <h2 className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Resumen</h2>
                            <div className="flex justify-between items-start mb-4"><h3 className="text-lg font-bold text-white max-w-[70%]">{selectedPlan.name}</h3><div className="text-right"><div className="text-lg font-bold text-white">${selectedPlan.price}</div></div></div>
                            <div className="border-t border-dashed border-neutral-700 pt-3 space-y-2 text-xs">
                                <div className="flex justify-between text-neutral-400"><span>Membresía</span><span>${selectedPlan.price}</span></div>
                                <div className="flex justify-between text-neutral-400"><span>Comisión (5%)</span><span>${getFee(selectedPlan.price)}</span></div>
                                <div className="flex justify-between items-center pt-2 text-yellow-500 font-bold text-base border-t border-neutral-700 mt-2"><span>Total</span><span>${getTotal(selectedPlan.price)}</span></div>
                            </div>
                        </div>

                        {!paymentMethod ? (
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Selecciona método de pago</h3>
                                <button onClick={() => initPayment('stripe', selectedPlan)} className="w-full bg-white text-black p-4 rounded-xl flex items-center justify-between hover:bg-neutral-200 transition-colors">
                                    <div className="text-left"><span className="block font-bold text-sm">Tarjeta Crédito/Débito</span><span className="text-[10px] text-neutral-600">Vía Stripe</span></div><ChevronRight className="w-4 h-4" />
                                </button>
                                <button onClick={() => initPayment('mp', selectedPlan)} className="w-full bg-[#009EE3] text-white p-4 rounded-xl flex items-center justify-between hover:bg-[#008bd0] transition-colors">
                                    <div className="text-left"><span className="block font-bold text-sm">Mercado Pago</span><span className="text-[10px] opacity-90">Tarjetas, Transferencia, Oxxo</span></div><ChevronRight className="w-4 h-4" />
                                </button>
                                <button onClick={() => initPayment('paypal', selectedPlan)} className="w-full bg-[#003087] text-white p-4 rounded-xl flex items-center justify-between hover:bg-[#00256b] transition-colors">
                                    <div className="text-left"><span className="block font-bold text-sm italic">PayPal</span><span className="text-[10px] opacity-80">Pago seguro internacional</span></div><ChevronRight className="w-4 h-4" />
                                </button>
                                <button onClick={() => setPaymentMethod('transfer')} className="w-full bg-[#1a1a1a] border border-neutral-800 text-white p-4 rounded-xl flex items-center justify-between hover:border-yellow-500/50 transition-colors">
                                    <div className="text-left"><span className="block font-bold text-sm text-green-500">Transferencia Directa</span><span className="text-[10px] text-neutral-500">Sin comisiones extra</span></div><ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                {paymentMethod === 'stripe' && stripeClientSecret && (
                                    <Elements key={stripeClientSecret} stripe={stripePromise} options={{ clientSecret: stripeClientSecret, appearance: { theme: 'night', labels: 'floating' } }}>
                                        <StripeForm onSuccess={() => setView('success')} />
                                    </Elements>
                                )}
                                {paymentMethod === 'mp' && mpPreferenceId && (
                                    <div className="bg-white rounded-lg p-4">
                                        <Payment 
                                            initialization={{ 
                                                preferenceId: mpPreferenceId,
                                                amount: getTotal(selectedPlan.price) 
                                            }} 
                                            customization={{ visual: { style: { theme: 'default' } } }} 
                                            onSubmit={() => setView('success')} 
                                        />
                                    </div>
                                )}
                                {paymentMethod === 'paypal' && (
                                    <div className="bg-white rounded-lg p-4">
                                        <PayPalScriptProvider options={{ "client-id": PAYPAL_ID || "test", currency: "MXN" }}>
                                            <PayPalButtons 
                                                createOrder={async () => {
                                                    const res = await fetch("/api/paypal/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: getTotal(selectedPlan.price) }) });
                                                    const order = await res.json();
                                                    return order.id;
                                                }}
                                                onApprove={async (data) => {
                                                    await fetch("/api/paypal/capture-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderID: data.orderID }) });
                                                    setView('success');
                                                }}
                                            />
                                        </PayPalScriptProvider>
                                    </div>
                                )}
                                {paymentMethod === 'transfer' && (
                                    <div className="space-y-4">
                                        <div className="bg-neutral-900/50 p-4 rounded-lg text-xs text-neutral-300 border border-neutral-800">
                                            <p className="mb-1"><span className="text-neutral-500">Banco:</span> <strong className="text-white">BANAMEX</strong></p>
                                            <p className="mb-1"><span className="text-neutral-500">Titular:</span> <strong className="text-white">Luis Gael Bringas Olmos</strong></p>
                                            <div className="h-[1px] bg-neutral-700 my-2"></div>
                                            <p className="mb-1 flex justify-between"><span>CLABE:</span> <strong className="text-white font-mono select-all">002180702215233914</strong></p>
                                            <p className="mb-1 flex justify-between"><span>Cuenta:</span> <strong className="text-white font-mono select-all">70221523391</strong></p>
                                        </div>
                                        <div onClick={() => setFileUploaded(true)} className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${fileUploaded ? 'border-green-500 bg-green-500/5' : 'border-neutral-700 hover:border-yellow-500/50'}`}>
                                            {fileUploaded ? <div className="flex flex-col items-center text-green-500"><CheckCircle className="w-8 h-8 mb-2" /><span className="text-xs font-bold">Comprobante cargado</span></div> : <div className="flex flex-col items-center text-neutral-500"><UploadCloud className="w-8 h-8 mb-2" /><span className="text-xs">Toca para subir foto o PDF</span></div>}
                                        </div>
                                        <button onClick={handleTransfer} disabled={!fileUploaded || loading} className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-all mt-4 ${!fileUploaded ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' : 'bg-yellow-500 text-black hover:bg-yellow-400'}`}>{loading ? 'Verificando...' : 'Confirmar Transferencia'}</button>
                                        <div className="text-center"><a href={`https://wa.me/525533727291?text=Hola, adjunto comprobante para ${selectedPlan.name}`} target="_blank" className="text-xs text-green-500 hover:text-green-400 flex items-center justify-center gap-1"><MessageCircle className="w-3 h-3" /> Enviar Comprobante WA</a></div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* VISTA: EXITO */}
                {view === 'success' && (
                    <div className="animate-fade-in text-center py-20 px-6">
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30"><CheckCircle className="w-12 h-12 text-green-500" /></div>
                        <h1 className="text-3xl font-black uppercase text-white mb-2">¡Pago Recibido!</h1>
                        <p className="text-neutral-400 text-sm mb-8">Bienvenido a Fit Sanctuary. Tu membresía está activa.</p>
                        <button onClick={() => { setView('shop'); setPaymentMethod(null); }} className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform">Volver al Inicio</button>
                    </div>
                )}
            </main>
        </div>
    );
}
export default App;
EOF

# 2. CREAR PLANTILLA DE VARIABLES ENTORNO (Para que no fallen los scripts)
echo "🔑 Generando archivos .env seguros..."
# Para Frontend (Vite)
cat > client/.env <<EOF
VITE_STRIPE_PUBLIC_KEY=pk_test_TU_CLAVE_PUBLICA_AQUI
VITE_MP_PUBLIC_KEY=TEST-TU_CLAVE_PUBLICA_AQUI
VITE_PAYPAL_CLIENT_ID=test
EOF

# Para Backend (Node) - MOCK INICIAL
cat > .env <<EOF
STRIPE_SECRET_KEY=mock_sk
MP_ACCESS_TOKEN=mock_at
PAYPAL_CLIENT_ID=mock_id
PAYPAL_CLIENT_SECRET=mock_secret
EOF

echo "✅ Reparación completa."
echo "----------------------------------------------------------------"
echo "⚠️  ACCIÓN REQUERIDA:"
echo "1. Abre el archivo 'client/.env' y pega tus claves PÚBLICAS."
echo "2. Abre el archivo '.env' (en la raíz) y pega tus claves SECRETAS."
echo "3. Luego ejecuta: git add . && git commit -m 'Fixed payments' && git push origin main"
echo "----------------------------------------------------------------"