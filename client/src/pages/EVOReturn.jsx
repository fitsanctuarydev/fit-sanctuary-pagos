import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * Página de retorno de EVO Payments
 * Esta página solo se usa como fallback si el lightbox falla
 * Normalmente los callbacks JavaScript manejan el flujo
 */
export default function EVOReturn() {
    const [status, setStatus] = useState('processing');
    const [orderData, setOrderData] = useState(null);

    const query = useMemo(() => new URLSearchParams(window.location.search), []);
    const orderId = query.get('orderId');
    const resultIndicator = query.get('resultIndicator');

    useEffect(() => {
        if (orderId && resultIndicator) {
            const cached = localStorage.getItem(`evo:${orderId}`);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (parsed.successIndicator === resultIndicator) {
                        setStatus('success');
                        setOrderData(parsed);
                    } else {
                        setStatus('error');
                    }
                } catch {
                    setStatus('error');
                }
            } else {
                setStatus('error');
            }
        }

        // Intentar cerrar la ventana/iframe si es posible
        if (window.opener) {
            window.opener.postMessage({ type: 'evo-return' }, '*');
            setTimeout(() => window.close(), 1000);
        }
    }, [orderId, resultIndicator]);

    if (status === 'processing') {
        return (
            <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Procesando pago...</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center">
                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Error en el Pago</h1>
                    <p className="text-gray-400 mb-6">
                        No se pudo validar tu pago. Por favor contacta a soporte si el cargo fue realizado.
                    </p>
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                        <p className="text-sm text-gray-500">Orden: {orderId}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">¡Pago Exitoso!</h1>
                <p className="text-gray-400 mb-6">
                    Tu pago ha sido procesado correctamente. Recibirás un correo de confirmación.
                </p>
                {orderData && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                        {orderData.plan && (
                            <>
                                <p className="text-sm text-gray-500 mb-1">Plan</p>
                                <p className="text-white font-semibold">{orderData.plan}</p>
                            </>
                        )}
                        {orderData.amount && (
                            <>
                                <p className="text-sm text-gray-500 mt-3 mb-1">Total Pagado</p>
                                <p className="text-2xl text-yellow-400 font-bold">${orderData.amount}</p>
                            </>
                        )}
                        <p className="text-sm text-gray-500 mt-3">Orden: {orderId}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
