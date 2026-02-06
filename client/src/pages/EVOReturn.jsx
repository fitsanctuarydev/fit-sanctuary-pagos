import { useEffect } from 'react';

/**
 * Página de retorno de EVO Payments
 * Esta página solo se usa como fallback si el lightbox falla
 * Normalmente los callbacks JavaScript manejan el flujo
 */
export default function EVOReturn() {
    useEffect(() => {
        // Intentar cerrar la ventana/iframe si es posible
        if (window.opener) {
            window.opener.postMessage({ type: 'evo-return' }, '*');
            setTimeout(() => window.close(), 1000);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md text-center">
                <div className="text-6xl mb-4">⏳</div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    Procesando pago...
                </h1>
                <p className="text-gray-300 mb-4">
                    Por favor espera mientras verificamos tu transacción.
                </p>
                <p className="text-sm text-gray-400">
                    Esta ventana se cerrará automáticamente.
                </p>
            </div>
        </div>
    );
}
