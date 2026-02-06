import { useEffect, useMemo, useState } from 'react';

/**
 * Página de retorno de EVO Payments
 * Esta página solo se usa como fallback si el lightbox falla
 * Normalmente los callbacks JavaScript manejan el flujo
 */
export default function EVOReturn() {
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Procesando pago...');

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
                        setMessage('Pago confirmado. ¡Gracias!');
                    } else {
                        setStatus('error');
                        setMessage('No se pudo validar el pago.');
                    }
                } catch {
                    setStatus('error');
                    setMessage('No se pudo validar el pago.');
                }
            }
        }

        // Intentar cerrar la ventana/iframe si es posible
        if (window.opener) {
            window.opener.postMessage({ type: 'evo-return' }, '*');
            setTimeout(() => window.close(), 1000);
        }
    }, [orderId, resultIndicator]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md text-center">
                <div className="text-6xl mb-4">
                    {status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳'}
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    {message}
                </h1>
                <p className="text-gray-300 mb-4">
                    {status === 'processing'
                        ? 'Por favor espera mientras verificamos tu transacción.'
                        : 'Puedes cerrar esta ventana.'}
                </p>
                <p className="text-sm text-gray-400">
                    Esta ventana se cerrará automáticamente.
                </p>
            </div>
        </div>
    );
}
