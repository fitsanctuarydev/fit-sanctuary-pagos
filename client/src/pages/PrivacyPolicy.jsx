import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 mb-8 font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <h1 className="text-4xl font-black mb-8 text-yellow-500">Aviso de Privacidad</h1>
        
        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">1. Responsable de los Datos</h2>
            <p>
              Fit Sanctuary Studio es responsable de la recopilación y uso de tus datos personales. Nuestro compromiso es proteger tu privacidad y usar tus datos de manera responsable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">2. Información que Recopilamos</h2>
            <p>
              Recopilamos información que voluntariamente nos proporciones, incluyendo:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Nombre completo</li>
              <li>Correo electrónico</li>
              <li>Número de teléfono (opcional)</li>
              <li>Información de pago</li>
              <li>Datos de membresía y preferencias</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">3. Cómo Usamos tu Información</h2>
            <p>
              Tu información personal se utiliza para:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Procesar tus pagos y membresías</li>
              <li>Enviarte confirmaciones y actualizaciones</li>
              <li>Mejorar nuestros servicios</li>
              <li>Comunicarnos contigo sobre cambios o promociones</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">4. Seguridad de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y administrativas para proteger tu información personal contra acceso no autorizado. Sin embargo, ningún método de transmisión por Internet es 100% seguro.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">5. Compartimiento de Información</h2>
            <p>
              No vendemos, alquilamos ni compartimos tu información personal con terceros sin tu consentimiento, excepto cuando es necesario para procesar tus pagos (a través de Mercado Pago, Stripe, PayPal) o cumplir con obligaciones legales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">6. Cookies y Tecnologías de Rastreo</h2>
            <p>
              Nuestro sitio puede utilizar cookies y tecnologías similares para mejorar tu experiencia. Puedes controlar el uso de cookies a través de la configuración de tu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">7. Tus Derechos</h2>
            <p>
              Tienes derecho a:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Acceder a tus datos personales</li>
              <li>Solicitar la corrección de datos inexactos</li>
              <li>Solicitar la eliminación de tus datos</li>
              <li>Optar por no recibir comunicaciones de marketing</li>
              <li>Solicitar una copia de tus datos en formato portátil</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">8. Retención de Datos</h2>
            <p>
              Retenemos tu información personal mientras tu membresía esté activa. Después de la cancelación, retenemos los datos necesarios para propósitos fiscales y legales de acuerdo con la ley aplicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">9. Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta política de privacidad periódicamente. Te notificaremos de cambios significativos mediante correo electrónico o un aviso prominente en nuestro sitio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">10. Contacto</h2>
            <p>
              Si tienes preguntas sobre nuestra política de privacidad o deseas ejercer tus derechos, contáctanos a través de:
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
