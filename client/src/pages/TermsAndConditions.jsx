import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 mb-8 font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <h1 className="text-4xl font-black mb-8 text-yellow-500">Términos y Condiciones</h1>
        
        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">1. Aceptación de Términos</h2>
            <p>
              Al acceder y utilizar la plataforma de pagos de Fit Sanctuary, aceptas estar vinculado por estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, por favor no utilices nuestro servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">2. Descripción del Servicio</h2>
            <p>
              Fit Sanctuary ofrece una plataforma de pagos en línea para membresías, paquetes y clases. El pago se realiza a través de Mercado Pago, Stripe, PayPal o transferencia bancaria directa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">3. Cuenta de Usuario</h2>
            <p>
              Eres responsable de mantener la confidencialidad de tu información personal. Eres completamente responsable de toda la actividad que ocurra bajo tu cuenta. Debes informarnos de inmediato sobre cualquier uso no autorizado de tu cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">4. Pagos y Facturación</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Todos los precios se muestran en Pesos Mexicanos (MXN)</li>
              <li>Se pueden aplicar comisiones según el método de pago elegido</li>
              <li>Los pagos son no reembolsables excepto en casos especificados en nuestra Política de Devolución</li>
              <li>Las membresías son renovables automáticamente a menos que canceles antes de la fecha de renovación</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">5. Uso de la Plataforma</h2>
            <p>
              Aceptas utilizar esta plataforma solo para propósitos legales y de acuerdo con estos términos. No debes:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Realizar transacciones fraudulentas</li>
              <li>Intentar acceder a sistemas de seguridad</li>
              <li>Transmitir virus o malware</li>
              <li>Usar la plataforma de manera que interfiera con su operación normal</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">6. Limitación de Responsabilidad</h2>
            <p>
              Fit Sanctuary no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos resultantes del uso o incapacidad de usar el servicio, incluso si hemos sido informados de la posibilidad de tales daños.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">7. Modificaciones de Términos</h2>
            <p>
              Fit Sanctuary se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán efectivos inmediatamente después de su publicación. Tu uso continuado de la plataforma constituye tu aceptación de los términos modificados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">8. Terminación</h2>
            <p>
              Podemos terminar o suspender tu acceso inmediatamente, sin previo aviso ni responsabilidad, por cualquier razón, incluyendo si violamos estos términos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">9. Ley Aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de México. Cualquier disputa relacionada con estos términos se resolverá exclusivamente en los tribunales competentes de la Ciudad de México.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">10. Contacto</h2>
            <p>
              Si tienes preguntas sobre estos términos, contáctanos a través de:
            </p>
            <p className="mt-2">
              📞 WhatsApp: <a href="https://wa.me/525533727291" className="text-yellow-500 hover:text-yellow-400">+52 55 3372 7291</a><br />
              📧 Email: <a href="mailto:soporte@fitsanctuary.com" className="text-yellow-500 hover:text-yellow-400">soporte@fitsanctuary.com</a>
            </p>
          </section>

          <p className="text-neutral-500 text-sm mt-8">
            Última actualización: Diciembre 2025
          </p>
        </div>
      </div>
    </div>
  );
}
