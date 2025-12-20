import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 mb-8 font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        <h1 className="text-4xl font-black mb-8 text-yellow-500">Política de Devolución</h1>
        
        <div className="space-y-6 text-neutral-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">1. Período de Devolución</h2>
            <p>
              Fit Sanctuary ofrece un período de devolución de 7 días calendario a partir de la fecha de compra. Este período se aplica a membresías mensuales, paquetes y acceso a clases.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">2. Condiciones para Devolución</h2>
            <p>
              Para ser elegible para una devolución, debes cumplir con los siguientes requisitos:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Solicitar la devolución dentro de 7 días de la compra</li>
              <li>No haber utilizado más del 20% de las clases o servicios incluidos</li>
              <li>Proporcionar una razón válida para la devolución</li>
              <li>No tener deudas pendientes con Fit Sanctuary</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">3. Proceso de Solicitud de Devolución</h2>
            <p>
              Para solicitar una devolución:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Contacta a nuestro equipo de soporte por WhatsApp o correo electrónico</li>
              <li>Proporciona el número de orden de tu compra</li>
              <li>Explica el motivo de tu solicitud</li>
              <li>Nuestro equipo revisará tu solicitud en 5 días hábiles</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">4. Devoluciones No Reembolsables</h2>
            <p>
              Las siguientes compras NO son reembolsables:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Membresías que ya han sido utilizadas</li>
              <li>Paquetes completados o parcialmente utilizados</li>
              <li>Clases a las que ya has asistido</li>
              <li>Compras realizadas más de 7 días antes</li>
              <li>Compras realizadas con descuentos o promociones no estándar</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">5. Procesamiento de Devoluciones</h2>
            <p>
              Una vez aprobada tu solicitud de devolución:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Tu acceso a la membresía será cancelado inmediatamente</li>
              <li>El reembolso se procesará al método de pago original</li>
              <li>El tiempo de procesamiento es de 5-10 días hábiles</li>
              <li>Se descontarán las comisiones de procesamiento si aplica</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">6. Excepciones y Circunstancias Especiales</h2>
            <p>
              En casos especiales (problemas técnicos, servicios no prestados), Fit Sanctuary puede aprobar reembolsos fuera del período de 7 días. Contáctanos directamente para discutir tu situación.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">7. Cancelación de Membresía Recurrente</h2>
            <p>
              Si tu membresía se renueva automáticamente:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Puedes cancelarla en cualquier momento antes de la fecha de renovación</li>
              <li>No se cobrarán cargos futuros una vez cancelada</li>
              <li>Los pagos ya realizados no se reembolsan, solo se detiene la renovación</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">8. Cambios de Membresía</h2>
            <p>
              Puedes cambiar a una membresía diferente en cualquier momento. Si el nuevo plan es más caro, pagarás la diferencia. Si es más barato, recibirás un crédito en tu cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">9. Limitación de Responsabilidad</h2>
            <p>
              Fit Sanctuary no es responsable por problemas técnicos, errores de usuario o circunstancias fuera de nuestro control que afecten tu experiencia. Sin embargo, haremos nuestro mejor esfuerzo para resolver cualquier problema.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">10. Contacto para Devoluciones</h2>
            <p>
              Para solicitar una devolución o si tienes preguntas sobre esta política:
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
