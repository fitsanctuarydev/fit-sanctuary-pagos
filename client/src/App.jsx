import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ShieldCheck, Lock, ArrowLeft, CheckCircle, Clock, MapPin, ChevronRight, UploadCloud, MessageCircle, Banknote, CreditCard, Mail, AlertCircle, ExternalLink } from 'lucide-react';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';

const cleanKey = (key) => (key || "").replace(/[\n\r\s]/g, "").trim();
const STRIPE_KEY = cleanKey(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const MP_KEY = cleanKey(import.meta.env.VITE_MP_PUBLIC_KEY);
const PAYPAL_ID = cleanKey(import.meta.env.VITE_PAYPAL_CLIENT_ID);

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
    const [currentPage, setCurrentPage] = useState('shop'); // 'shop', 'terms', 'privacy', 'refund'
    const [fileUploaded, setFileUploaded] = useState(false);
    const [email, setEmail] = useState('');
    const [orderId, setOrderId] = useState(null);
    
    // Client information states
    const [clientInfo, setClientInfo] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        fechaNacimiento: '',
        genero: '',
        calle: '',
        ciudad: '',
        estado: '',
        codigoPostal: '',
        contactoEmergencia: '',
        telefonoEmergencia: '',
        aceptaTerminos: false
    });
    
    // Estados API
    const [stripeClientSecret, setStripeClientSecret] = useState(null);
    const [mpPreferenceId, setMpPreferenceId] = useState(null);
    const [mpAmount, setMpAmount] = useState(null);
    const [mpError, setMpError] = useState(null);
    const [mpLoading, setMpLoading] = useState(false);

    const getFee = (price) => Math.round(price * 0.05);
    const getTotal = (price) => price + getFee(price);

    const generateOrderId = () => `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setPaymentMethod(null);
        setFileUploaded(false);
        setMpPreferenceId(null);
        setStripeClientSecret(null);
        setEmail('');
        setMpError(null);
        setMpLoading(false);
        setOrderId(generateOrderId());
        setClientInfo({
            nombre: '',
            apellido: '',
            telefono: '',
            fechaNacimiento: '',
            genero: '',
            calle: '',
            ciudad: '',
            estado: '',
            codigoPostal: '',
            contactoEmergencia: '',
            telefonoEmergencia: '',
            aceptaTerminos: false
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setView('checkout');
    };

    // Detect returns from Mercado Pago (or other providers) and show success view
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const path = window.location.pathname || '/';

            const extRef = params.get('external_reference') || params.get('external-reference');
            const collectionId = params.get('collection_id') || params.get('collection-id');
            const collectionStatus = params.get('collection_status') || params.get('collection-status') || params.get('status');

            if (extRef) setOrderId(extRef);

            // Only show success if Mercado Pago explicitly approved the payment
            if ((collectionId && collectionStatus && collectionStatus.toLowerCase() === 'approved') || path.includes('/success')) {
                console.log('✅ Pago confirmado por Mercado Pago, mostrando pantalla de éxito');
                setView('success');
                // Trigger email send if we have order details
                if (selectedPlan && email) {
                    handleSuccess(extRef || orderId);
                }
                return;
            }

            // If the user is on a dedicated checkout path, keep checkout view
            if (path.includes('/checkout')) {
                setView('checkout');
                return;
            }
        } catch (err) {
            // ignore and keep default view
            console.debug('URL parse error', err);
        }
    }, []);

    const handleSuccess = async (paymentId = 'N/A') => {
        setView('success');
        try {
            console.log(`📧 Creando cliente en CRM y enviando confirmación para orden: ${paymentId}`);
            
            // Create client in CRM
            const clientData = {
                nombre: clientInfo.nombre,
                apellido: clientInfo.apellido,
                email: email,
                telefono: clientInfo.telefono,
                fechaNacimiento: clientInfo.fechaNacimiento,
                genero: clientInfo.genero,
                direccion: {
                    calle: clientInfo.calle,
                    ciudad: clientInfo.ciudad,
                    estado: clientInfo.estado,
                    codigoPostal: clientInfo.codigoPostal
                },
                contactoEmergencia: clientInfo.contactoEmergencia,
                telefonoEmergencia: clientInfo.telefonoEmergencia,
                membershipType: selectedPlan.id,
                amount: getTotal(selectedPlan.price),
                orderId: paymentId
            };
            
            const crmResponse = await fetch('/api/crm/create-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData)
            });
            
            if (!crmResponse.ok) {
                console.error('Error creando cliente en CRM:', await crmResponse.text());
            }
            
            const emailResponse = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email, 
                    plan: selectedPlan.name, 
                    price: getTotal(selectedPlan.price),
                    orderId: paymentId !== 'N/A' ? paymentId : Math.floor(Math.random()*10000)
                })
            });
            
            const emailData = await emailResponse.json();
            
            if (emailData.success) {
                console.log('✅ Email de confirmación enviado correctamente');
            } else {
                console.warn('⚠️ Problema al enviar email:', emailData.warning || emailData.message);
            }
        } catch (e) { 
            console.error("⚠️ Error enviando correo (no crítico, pago confirmado):", e);
        }
    };

    const initPayment = async (method, plan) => {
        if (!email || !email.includes('@')) {
            alert("Por favor ingresa un correo válido.");
            return;
        }
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
                // Limpiar estados previos
                setMpPreferenceId(null);
                setMpError(null);
                setMpLoading(true);
                
                const res = await fetch('/api/mp/create-preference', {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        title: plan.name, 
                        price: total,
                        orderId: orderId,
                        userEmail: email
                    })
                });
                
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error || `Error ${res.status}`);
                }
                
                const data = await res.json();
                if(!data.id) throw new Error("No se recibió ID de preferencia");
                
                console.log('✓ Preferencia MP creada:', data.id);
                setMpPreferenceId(data.id);
                setMpAmount(data.amount || total);
                setMpLoading(false);
            }
        } catch (e) {
            console.error('Error iniciando pago:', e);
            if (method === 'mp') {
                setMpError(e.message);
                setMpLoading(false);
            } else {
                alert("Error iniciando pago: " + e.message);
                setPaymentMethod(null);
            }
        }
    };

    const handleTransfer = () => {
        if (!email || !email.includes('@')) { alert("Ingresa un correo válido"); return; }
        setLoading(true);
        setTimeout(() => { setLoading(false); handleSuccess(); }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white font-sans pb-20 selection:bg-yellow-500 selection:text-black">
            {/* Render pages based on currentPage state */}
            {currentPage === 'terms' && <TermsAndConditions />}
            {currentPage === 'privacy' && <PrivacyPolicy />}
            {currentPage === 'refund' && <RefundPolicy />}

            {currentPage === 'shop' && (<>

            <header className="fixed top-0 w-full z-50 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('shop')}>
                        <div className="w-8 h-8 rounded-full bg-yellow-600/10 flex items-center justify-center border border-yellow-600/30 overflow-hidden">
                            <img src="/assets/icono.png" alt="FS" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                        <span className="font-bold uppercase tracking-wider text-sm">Fit Sanctuary</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-green-500 bg-green-900/20 px-2 py-1 rounded-full border border-green-500/20"><Lock className="w-3 h-3" /><span>Pago Seguro</span></div>
                </div>
            </header>

            <main className="pt-24 px-4 max-w-xl mx-auto relative z-10">
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
                                        <div key={plan.id} onClick={() => handleSelectPlan(plan)} className={`relative p-5 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${plan.highlight ? 'bg-gradient-to-r from-neutral-900 to-[#151515] border-yellow-500/40 shadow-lg' : 'bg-[#181818] border-neutral-800'}`}>
                                            {plan.tag && <div className="absolute top-0 right-0 bg-yellow-600 text-black text-[9px] font-bold px-2 py-1 rounded-bl-lg uppercase">{plan.tag}</div>}
                                            <div className="flex justify-between items-start">
                                                <div className="pr-4"><h3 className="font-bold uppercase text-sm text-white">{plan.name}</h3><p className="text-[10px] text-neutral-500 mt-1">{plan.desc}</p></div>
                                                <div className="text-lg font-bold text-yellow-500">${plan.price}</div>
                                            </div>
                                            <div className="mt-3 flex items-center text-[10px] font-bold text-neutral-400 group-hover:text-yellow-500">Seleccionar <ChevronRight className="w-3 h-3 ml-1" /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {view === 'checkout' && selectedPlan && (
                    <div className="animate-fade-in">
                        <button onClick={() => { setView('shop'); setPaymentMethod(null); }} className="text-xs text-neutral-500 mb-6 hover:text-white flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Volver</button>
                        
                        <div className="bg-[#181818] border border-neutral-800 rounded-xl p-5 mb-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
                            <h2 className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2">Resumen</h2>
                            <h3 className="text-lg font-bold text-white mb-4">{selectedPlan.name}</h3>
                            <div className="border-t border-dashed border-neutral-700 pt-3 space-y-2 text-xs">
                                <div className="flex justify-between text-neutral-400"><span>Membresía</span><span>${selectedPlan.price}</span></div>
                                <div className="flex justify-between text-neutral-400"><span>Comisión (5%)</span><span>${getFee(selectedPlan.price)}</span></div>
                                <div className="flex justify-between items-center pt-2 text-yellow-500 font-bold text-base border-t border-neutral-700 mt-2"><span>Total</span><span>${getTotal(selectedPlan.price)}</span></div>
                            </div>
                        </div>

                        {/* CLIENT INFORMATION FORM */}
                        <div className="mb-8 space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-[1px] bg-neutral-800 flex-1"></div>
                                <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Información Personal</h3>
                                <div className="h-[1px] bg-neutral-800 flex-1"></div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2 ml-1">Correo Electrónico *</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="ejemplo@correo.com" 
                                        required
                                        className="w-full bg-[#181818] border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                                    />
                                </div>
                            </div>

                            {/* Nombre y Apellido */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2 ml-1">Nombre *</label>
                                    <input 
                                        type="text" 
                                        value={clientInfo.nombre} 
                                        onChange={(e) => setClientInfo({...clientInfo, nombre: e.target.value})} 
                                        placeholder="Juan" 
                                        required
                                        className="w-full bg-[#181818] border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2 ml-1">Apellido *</label>
                                    <input 
                                        type="text" 
                                        value={clientInfo.apellido} 
                                        onChange={(e) => setClientInfo({...clientInfo, apellido: e.target.value})} 
                                        placeholder="Pérez" 
                                        required
                                        className="w-full bg-[#181818] border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                                    />
                                </div>
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2 ml-1">Teléfono *</label>
                                <input 
                                    type="tel" 
                                    value={clientInfo.telefono} 
                                    onChange={(e) => setClientInfo({...clientInfo, telefono: e.target.value})} 
                                    placeholder="5512345678" 
                                    required
                                    className="w-full bg-[#181818] border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                                />
                            </div>

                            {/* Fecha de Nacimiento y Género */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2 ml-1">Fecha de Nacimiento *</label>
                                    <input 
                                        type="date" 
                                        value={clientInfo.fechaNacimiento} 
                                        onChange={(e) => setClientInfo({...clientInfo, fechaNacimiento: e.target.value})} 
                                        required
                                        className="w-full bg-[#181818] border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2 ml-1">Género *</label>
                                    <select 
                                        value={clientInfo.genero} 
                                        onChange={(e) => setClientInfo({...clientInfo, genero: e.target.value})} 
                                        required
                                        className="w-full bg-[#181818] border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                    >
                                        <option value="">Selecciona</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Dirección (Opcional) */}
                            <div className="flex items-center gap-3 mb-2 mt-6">
                                <div className="h-[1px] bg-neutral-800 flex-1"></div>
                                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Dirección (Opcional)</h3>
                                <div className="h-[1px] bg-neutral-800 flex-1"></div>
                            </div>

                            <div>
                                <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2 ml-1">Calle y Número</label>
                                <input 
                                    type="text" 
                                    value={clientInfo.calle} 
                                    onChange={(e) => setClientInfo({...clientInfo, calle: e.target.value})} 
                                    placeholder="Av. Principal 123" 
                                    className="w-full bg-[#181818] border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2 ml-1">Ciudad</label>
                                    <input 
                                        type="text" 
                                        value={clientInfo.ciudad} 
                                        onChange={(e) => setClientInfo({...clientInfo, ciudad: e.target.value})} 
                                        placeholder="CDMX" 
                                        className="w-full bg-[#181818] border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2 ml-1">Estado</label>
                                    <input 
                                        type="text" 
                                        value={clientInfo.estado} 
                                        onChange={(e) => setClientInfo({...clientInfo, estado: e.target.value})} 
                                        placeholder="CDMX" 
                                        className="w-full bg-[#181818] border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2 ml-1">C.P.</label>
                                    <input 
                                        type="text" 
                                        value={clientInfo.codigoPostal} 
                                        onChange={(e) => setClientInfo({...clientInfo, codigoPostal: e.target.value})} 
                                        placeholder="01000" 
                                        className="w-full bg-[#181818] border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                                    />
                                </div>
                            </div>

                            {/* Contacto de Emergencia */}
                            <div className="flex items-center gap-3 mb-2 mt-6">
                                <div className="h-[1px] bg-neutral-800 flex-1"></div>
                                <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest">Contacto de Emergencia</h3>
                                <div className="h-[1px] bg-neutral-800 flex-1"></div>
                            </div>

                            <div>
                                <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2 ml-1">Nombre del Contacto *</label>
                                <input 
                                    type="text" 
                                    value={clientInfo.contactoEmergencia} 
                                    onChange={(e) => setClientInfo({...clientInfo, contactoEmergencia: e.target.value})} 
                                    placeholder="María Pérez" 
                                    required
                                    className="w-full bg-[#181818] border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2 ml-1">Teléfono de Emergencia *</label>
                                <input 
                                    type="tel" 
                                    value={clientInfo.telefonoEmergencia} 
                                    onChange={(e) => setClientInfo({...clientInfo, telefonoEmergencia: e.target.value})} 
                                    placeholder="5598765432" 
                                    required
                                    className="w-full bg-[#181818] border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors" 
                                />
                            </div>

                            {/* Términos y Condiciones */}
                            <div className="bg-yellow-900/10 border border-yellow-600/30 rounded-xl p-4 mt-6">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={clientInfo.aceptaTerminos} 
                                        onChange={(e) => setClientInfo({...clientInfo, aceptaTerminos: e.target.checked})} 
                                        required
                                        className="mt-1 w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-yellow-500 focus:ring-yellow-500"
                                    />
                                    <span className="text-xs text-neutral-300">
                                        Acepto los <button type="button" onClick={() => setCurrentPage('terms')} className="text-yellow-500 underline">Términos y Condiciones</button> y el <button type="button" onClick={() => setCurrentPage('privacy')} className="text-yellow-500 underline">Aviso de Privacidad</button> de Fit Sanctuary
                                    </span>
                                </label>
                            </div>
                        </div>

                        {!paymentMethod ? (
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Selecciona método de pago</h3>
                                <button 
                                    onClick={() => {
                                        if (!email || !clientInfo.nombre || !clientInfo.apellido || !clientInfo.telefono || !clientInfo.fechaNacimiento || !clientInfo.genero || !clientInfo.contactoEmergencia || !clientInfo.telefonoEmergencia || !clientInfo.aceptaTerminos) {
                                            alert('Por favor completa todos los campos obligatorios (*)');
                                            return;
                                        }
                                        initPayment('stripe', selectedPlan);
                                    }} 
                                    className="w-full bg-white text-black p-4 rounded-xl flex items-center justify-between hover:bg-neutral-200 transition-colors"
                                >
                                    <div className="text-left"><span className="block font-bold text-sm">Tarjeta Crédito/Débito</span><span className="text-[10px] text-neutral-600">Vía Stripe</span></div><ChevronRight className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => {
                                        if (!email || !clientInfo.nombre || !clientInfo.apellido || !clientInfo.telefono || !clientInfo.fechaNacimiento || !clientInfo.genero || !clientInfo.contactoEmergencia || !clientInfo.telefonoEmergencia || !clientInfo.aceptaTerminos) {
                                            alert('Por favor completa todos los campos obligatorios (*)');
                                            return;
                                        }
                                        initPayment('mp', selectedPlan);
                                    }} 
                                    className="w-full bg-[#009EE3] text-white p-4 rounded-xl flex items-center justify-between hover:bg-[#008bd0] transition-colors"
                                >
                                    <div className="text-left"><span className="block font-bold text-sm">Mercado Pago</span><span className="text-[10px] opacity-90">Tarjetas, Transferencia, Oxxo</span></div><ChevronRight className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => {
                                        if (!email || !clientInfo.nombre || !clientInfo.apellido || !clientInfo.telefono || !clientInfo.fechaNacimiento || !clientInfo.genero || !clientInfo.contactoEmergencia || !clientInfo.telefonoEmergencia || !clientInfo.aceptaTerminos) {
                                            alert('Por favor completa todos los campos obligatorios (*)');
                                            return;
                                        }
                                        initPayment('paypal', selectedPlan);
                                    }} 
                                    className="w-full bg-[#003087] text-white p-4 rounded-xl flex items-center justify-between hover:bg-[#00256b] transition-colors"
                                >
                                    <div className="text-left"><span className="block font-bold text-sm italic">PayPal</span><span className="text-[10px] opacity-80">Pago seguro internacional</span></div><ChevronRight className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => {
                                        if (!email || !clientInfo.nombre || !clientInfo.apellido || !clientInfo.telefono || !clientInfo.fechaNacimiento || !clientInfo.genero || !clientInfo.contactoEmergencia || !clientInfo.telefonoEmergencia || !clientInfo.aceptaTerminos) {
                                            alert('Por favor completa todos los campos obligatorios (*)');
                                            return;
                                        }
                                        setPaymentMethod('transfer');
                                    }} 
                                    className="w-full bg-[#1a1a1a] border border-neutral-800 text-white p-4 rounded-xl flex items-center justify-between hover:border-yellow-500/50 transition-colors"
                                >
                                    <div className="text-left"><span className="block font-bold text-sm text-green-500">Transferencia Directa</span><span className="text-[10px] text-neutral-500">Sin comisiones extra</span></div><ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                {paymentMethod === 'stripe' && stripeClientSecret && (
                                    <Elements key={stripeClientSecret} stripe={stripePromise} options={{ clientSecret: stripeClientSecret, appearance: { theme: 'night', labels: 'floating' } }}>
                                        <StripeForm onSuccess={handleSuccess} />
                                    </Elements>
                                )}
                                
                                {/* MERCADO PAGO - CORREGIDO */}
                                {paymentMethod === 'mp' && (
                                    <div className="space-y-4">
                                        {mpLoading && (
                                            <div className="bg-white rounded-lg p-8 flex flex-col items-center justify-center">
                                                <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
                                                <p className="text-sm text-gray-600">Preparando pago seguro...</p>
                                            </div>
                                        )}
                                        
                                        {mpError && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-bold text-red-900 text-sm mb-1">Error al cargar Mercado Pago</h4>
                                                        <p className="text-sm text-red-700 mb-3">{mpError}</p>
                                                        <button 
                                                            onClick={() => initPayment('mp', selectedPlan)}
                                                            className="text-sm text-red-600 hover:text-red-800 underline font-medium"
                                                        >
                                                            Intentar nuevamente
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {mpPreferenceId && !mpLoading && !mpError && (
                                            <div className="bg-white rounded-lg p-4">
                                                <Wallet 
                                                    initialization={{ 
                                                        preferenceId: mpPreferenceId
                                                    }}
                                                    onError={(error) => {
                                                        console.error('❌ Error en Mercado Pago:', error);
                                                        setMpError('Error al cargar el formulario de pago. Por favor intenta de nuevo o usa otro método.');
                                                    }}
                                                />
                                                
                                                {/* Fallback para navegadores con problemas */}
                                                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                                                    <p className="text-xs text-gray-600 mb-2">¿No ves el formulario de pago?</p>
                                                    <a
                                                        href={`https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=${mpPreferenceId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Pagar en nueva ventana
                                                    </a>
                                                </div>
                                            </div>
                                        )}
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
                                                    handleSuccess();
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
                                            <p className="mb-1 flex justify-between"><span>Cuenta:</span> <strong className="text-white font-mono select-all">1722152339</strong></p>
                                        </div>
                                        
                                        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                                            <div className="flex gap-3 text-xs">
                                                <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-yellow-200 font-bold mb-1">Importante</p>
                                                    <p className="text-yellow-100/80">Después de transferir, sube el comprobante para confirmar tu pago.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2 ml-1">Comprobante de Transferencia</label>
                                            <label className="w-full border-2 border-dashed border-neutral-700 rounded-xl p-6 cursor-pointer hover:border-yellow-500/50 transition-colors flex flex-col items-center justify-center">
                                                <UploadCloud className="w-6 h-6 text-neutral-500 mb-2" />
                                                <span className="text-xs text-neutral-400 font-bold">Haz clic para subir</span>
                                                <span className="text-[10px] text-neutral-600 mt-1">PNG, JPG o PDF</span>
                                                <input type="file" accept="image/*,.pdf" onChange={() => setFileUploaded(true)} className="hidden" />
                                            </label>
                                            {fileUploaded && <div className="mt-2 flex items-center gap-2 text-xs text-green-500"><CheckCircle className="w-4 h-4" /> Comprobante cargado</div>}
                                        </div>

                                        <button onClick={handleTransfer} disabled={!fileUploaded || loading} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            {loading ? 'Procesando...' : 'Confirmar Transferencia'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {view === 'success' && (
                    <div className="animate-fade-in text-center py-12">
                        <div className="inline-block bg-green-900/20 border border-green-500/30 rounded-full p-4 mb-6">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-black uppercase mb-2">¡Pago Confirmado!</h1>
                        <p className="text-neutral-400 text-sm mb-6">Revisa tu correo para más detalles de tu membresía.</p>
                        <button onClick={() => setView('shop')} className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors">
                            Volver al Shop
                        </button>
                    </div>
                )}
            </main>

            <footer className="mt-12 text-center text-xs text-neutral-400">
                <div className="max-w-xl mx-auto space-x-3">
                    <button onClick={() => setCurrentPage('privacy')} className="underline hover:text-yellow-500">Aviso de Privacidad</button>
                    <span className="text-neutral-600">•</span>
                    <button onClick={() => setCurrentPage('terms')} className="underline hover:text-yellow-500">Términos y Condiciones</button>
                    <span className="text-neutral-600">•</span>
                    <button onClick={() => setCurrentPage('refund')} className="underline hover:text-yellow-500">Política de Devolución</button>
                </div>
            </footer>

            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-in; }
            `}</style>
            </>)}
        </div>
    );
}

export default App;