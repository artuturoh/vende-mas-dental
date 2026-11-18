import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, Calendar, CreditCard, Sparkles, Clock, CheckCircle2, 
  ChevronRight, Phone, MapPin, Star, Lock, ArrowRight, Calculator, 
  Users, MessageSquare, Camera, TrendingUp, Copy, Check, EyeOff, Eye
} from 'lucide-react';

const TABULADOR = {
  particular: {
    nombre: "Sin Seguro / Particular",
    descuento: "Precio de Lista",
    cobertura: 0,
    color: "bg-slate-600"
  },
  dentegra: {
    nombre: "Dentegra Seguros",
    descuento: "Red Preferente (-45% a -60%)",
    cobertura: 0.55,
    color: "bg-blue-600"
  },
  centauro: {
    nombre: "Seguros Centauro",
    descuento: "Convenio Platino (-50%)",
    cobertura: 0.50,
    color: "bg-emerald-600"
  },
  dentalia: {
    nombre: "Red Dentalia / MetLife",
    descuento: "Cobertura Copago (-40%)",
    cobertura: 0.40,
    color: "bg-indigo-600"
  }
};

const TRATAMIENTOS = [
  { id: 'limpieza', nombre: 'Limpieza Ultrasónica + Profilaxis', precioBase: 900, tiempo: '45 min', tag: 'Preventivo' },
  { id: 'resina', nombre: 'Resina Estética de Alta Resistencia', precioBase: 1400, tiempo: '60 min', tag: 'Conservador' },
  { id: 'blanqueamiento', nombre: 'Blanqueamiento Láser LED Clínico', precioBase: 3800, tiempo: '90 min', tag: 'Estética' },
  { id: 'endodoncia', nombre: 'Endodoncia Molar (Sin Dolor)', precioBase: 4600, tiempo: '90 min', tag: 'Especialidad' },
  { id: 'corona', nombre: 'Corona de Zirconia Estética CAD/CAM', precioBase: 6800, tiempo: '2 sesiones', tag: 'Rehabilitación' },
  { id: 'implante', nombre: 'Implante Dental de Titanio Completo', precioBase: 16500, tiempo: 'Quirúrgico', tag: 'Alto Valor' }
];

export default function App() {
  // 1. Leer parámetros de la URL (?clinica=Nombre&zona=Zapopan)
  const [clinicaNombre, setClinicaNombre] = useState('Clínica Dental Sonrisa');
  const [zonaNombre, setZonaNombre] = useState('Guadalajara & Zapopan');
  const [showAdminBar, setShowAdminBar] = useState(true);
  const [copied, setCopied] = useState(false);

  // Estados del Cotizador y Agenda
  const [aseguradora, setAseguradora] = useState('dentegra');
  const [tratamientoId, setTratamientoId] = useState('endodoncia');
  const [plazoMsi, setPlazoMsi] = useState(6);
  const [polizaInput, setPolizaInput] = useState('');
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [pacienteWhatsApp, setPacienteWhatsApp] = useState('');
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('Mañana 10:00 AM');
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  // Estado de Calculadora ROI B2B (Sección para el Doctor)
  const [pacientesInactivos, setPacientesInactivos] = useState(350);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clinicaParam = params.get('clinica');
    const zonaParam = params.get('zona');
    if (clinicaParam) setClinicaNombre(clinicaParam.replace(/\+/g, ' '));
    if (zonaParam) setZonaNombre(zonaParam.replace(/\+/g, ' '));
  }, []);

  // Cálculos dinámicos del cotizador
  const tratamientoActual = useMemo(() => 
    TRATAMIENTOS.find(t => t.id === tratamientoId) || TRATAMIENTOS[0]
  , [tratamientoId]);

  const seguroActual = TABULADOR[aseguradora];
  const copagoFinal = Math.round(tratamientoActual.precioBase * (1 - seguroActual.cobertura));
  const ahorro = tratamientoActual.precioBase - copagoFinal;
  const aplicaMsi = copagoFinal >= 1500;
  const pagoMensual = aplicaMsi ? Math.round(copagoFinal / plazoMsi) : copagoFinal;

  // Cálculo ROI Reactivación WhatsApp
  const pacientesReactivadosMes = Math.round(pacientesInactivos * 0.045); // 4.5% conversión conservadora
  const ingresoRecuperadoMes = pacientesReactivadosMes * 1250; // Ticket promedio limpieza + revisión

  const copiarLinkPersonalizado = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('clinica', clinicaNombre);
    url.searchParams.set('zona', zonaNombre);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReservar = (e) => {
    e.preventDefault();
    setReservaConfirmada(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* BARRA SUPERIOR DE SIMULACIÓN PARA GUSTAVO */}
      {showAdminBar ? (
        <div className="bg-slate-900 text-white px-4 py-2.5 text-xs border-b border-slate-700 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-semibold">
                Modo Demo Vende+ Digital
              </span>
              <span className="text-slate-300 hidden sm:inline">
                Prueba cómo se personaliza con el CSV:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={clinicaNombre}
                onChange={(e) => setClinicaNombre(e.target.value)}
                placeholder="Nombre de la clínica..."
                className="bg-slate-800 border border-slate-700 rounded px-2.5 py-1 text-white text-xs focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={() => setClinicaNombre('Dental Providencia')}
                className="bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 transition"
              >
                Ej. Providencia
              </button>
              <button
                onClick={() => setClinicaNombre('Odontología Avanzada Chapalita')}
                className="bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 transition"
              >
                Ej. Chapalita
              </button>
              <button
                onClick={copiarLinkPersonalizado}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded font-medium flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5"/> : <Copy className="w-3.5 h-3.5"/>}
                {copied ? '¡Link Copiado!' : 'Copiar Link para Correo'}
              </button>
              <button
                onClick={() => setShowAdminBar(false)}
                className="text-slate-400 hover:text-white ml-2 flex items-center gap-1"
                title="Ocultar barra de ingeniero"
              >
                <EyeOff className="w-3.5 h-3.5"/>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdminBar(true)}
          className="fixed bottom-4 right-4 z-50 bg-slate-900/90 text-white px-3 py-2 rounded-full text-xs shadow-lg flex items-center gap-1.5 hover:bg-slate-800"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-400"/> Personalizar Demo
        </button>
      )}

      {/* NAVBAR DE LA CLÍNICA */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {clinicaNombre.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                {clinicaNombre}
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-600"/> Especialistas en {zonaNombre}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Agenda 24/7 Activa
            </span>
            <a
              href="#cotizador"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              Cotizar con mi Seguro
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION DE LA CLÍNICA */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-100 pt-10 pb-16 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5"/> Tecnología Dental Sin Dolor • Convenios Directos con Aseguradoras
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Conoce el costo exacto de tu tratamiento en <span className="text-blue-600">{clinicaNombre}</span> y agenda en 60 segundos.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Sin llamadas incómodas ni costos sorpresa. Selecciona tu seguro dental (Dentegra, Centauro, Dentalia) o modalidad particular, aprovecha meses sin intereses con promociones bancarias y bloquea tu cita hoy mismo, incluso de noche.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#cotizador"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition"
              >
                Calcular mi Copago Ahora <ArrowRight className="w-4 h-4"/>
              </a>
              <a
                href="#propuesta-doctor"
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-5 py-3.5 rounded-xl flex items-center gap-2 transition"
              >
                ¿Eres el dueño de la clínica? Ver ROI
              </a>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs sm:text-sm">
              <div>
                <p className="font-bold text-slate-900">100% Transparente</p>
                <p className="text-slate-500">Tabulador oficial 2026</p>
              </div>
              <div>
                <p className="font-bold text-slate-900">3, 6 y 12 MSI</p>
                <p className="text-slate-500">Con tarjetas participantes</p>
              </div>
              <div>
                <p className="font-bold text-slate-900">Confirmación Inmediata</p>
                <p className="text-slate-500">Sincronizado a WhatsApp</p>
              </div>
            </div>
          </div>

          {/* TARJETA VISUAL DE CONFIANZA */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Experiencia Premium</span>
                <h3 className="font-bold text-lg text-slate-900">{clinicaNombre}</h3>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400"/> 4.9 (180+ reseñas)
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"/>
                <div>
                  <p className="font-semibold text-slate-900">Validación de Póliza Express</p>
                  <p className="text-slate-500 text-xs">Deja tus datos de Dentegra o Centauro al agendar y nosotros tramitamos tu autorización antes de que llegues.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5"/>
                <div>
                  <p className="font-semibold text-slate-900">Reserva Viernes 11:00 PM o Domingo</p>
                  <p className="text-slate-500 text-xs">No esperes al lunes a que abran recepción. Elige tu horario disponible en tiempo real.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                <CreditCard className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5"/>
                <div>
                  <p className="font-semibold text-slate-900">Promociones Bancarias y Buen Fin</p>
                  <p className="text-slate-500 text-xs">Paga en línea aprovechando bonificaciones y Meses Sin Intereses de tu banco sin afectar a la clínica.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN ESTRELLA: COTIZADOR INTERACTIVO + AGENDA 24/7 */}
      <section id="cotizador" className="py-16 max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Simulador Interactivo para Pacientes
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Cotizador Transparente de Tratamientos y Seguros
          </h3>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Selecciona tu aseguradora y el tratamiento que buscas para ver tu copago estimado y agendar tu cita al instante.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* COLUMNA IZQUIERDA: SELECCIÓN DE SEGURO Y TRATAMIENTO */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 space-y-8">
            {/* Paso 1: Elegir Seguro */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">
                1. Selecciona tu Aseguradora o Convenio:
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(TABULADOR).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAseguradora(key)}
                    className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      aseguradora === key
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{item.nombre}</span>
                      {aseguradora === key && <CheckCircle2 className="w-4 h-4 text-blue-600"/>}
                    </div>
                    <span className="text-xs text-blue-600 font-medium mt-1">{item.descuento}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paso 2: Elegir Tratamiento */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-3">
                2. ¿Qué tratamiento necesitas cotizar?
              </label>
              <div className="space-y-2.5">
                {TRATAMIENTOS.map((trat) => {
                  const precioConSeguro = Math.round(trat.precioBase * (1 - seguroActual.cobertura));
                  const seleccionado = tratamientoId === trat.id;
                  return (
                    <button
                      key={trat.id}
                      type="button"
                      onClick={() => setTratamientoId(trat.id)}
                      className={`w-full p-4 rounded-xl border text-left transition flex items-center justify-between gap-4 ${
                        seleccionado
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm sm:text-base">{trat.nombre}</span>
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                            {trat.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Duración aprox: {trat.tiempo}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {seguroActual.cobertura > 0 && (
                          <p className="text-xs text-slate-400 line-through">
                            ${trat.precioBase.toLocaleString()} MXN
                          </p>
                        )}
                        <p className="text-base sm:text-lg font-extrabold text-blue-600">
                          ${precioConSeguro.toLocaleString()} <span className="text-xs font-normal">MXN</span>
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paso 3: Simulador de Meses Sin Intereses */}
            {aplicaMsi && (
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase text-indigo-700 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5"/> Promoción Bancaria Activa (Buen Fin / MSI)
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Difiere tu tratamiento con tarjetas participantes sin cargos ocultos:
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {[3, 6, 12].map((meses) => (
                    <button
                      key={meses}
                      type="button"
                      onClick={() => setPlazoMsi(meses)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        plazoMsi === meses
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-300'
                      }`}
                    >
                      {meses} MSI
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: RESUMEN DE PAGO Y AGENDA NOCTURNA 24/7 */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 sticky top-24">
            {!reservaConfirmada ? (
              <form onSubmit={handleReservar} className="space-y-5">
                <div className="border-b border-slate-200 pb-4">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Resumen de tu Cotización en {clinicaNombre}
                  </span>
                  <h4 className="font-extrabold text-xl text-slate-900 mt-1">{tratamientoActual.nombre}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Modalidad: {seguroActual.nombre}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Precio Regular de Lista:</span>
                    <span>${tratamientoActual.precioBase.toLocaleString()} MXN</span>
                  </div>
                  {ahorro > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                      <span>Cobertura Estimada de tu Seguro:</span>
                      <span>- ${ahorro.toLocaleString()} MXN</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                    <span className="font-bold text-sm text-slate-900">Tu Copago Total:</span>
                    <span className="text-2xl font-extrabold text-blue-600">
                      ${copagoFinal.toLocaleString()} MXN
                    </span>
                  </div>
                  {aplicaMsi && (
                    <p className="text-right text-xs font-semibold text-indigo-600">
                      O {plazoMsi} pagos de ${pagoMensual.toLocaleString()} MXN sin intereses
                    </p>
                  )}
                </div>

                {/* Datos de Póliza y Agenda */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tu Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={pacienteNombre}
                      onChange={(e) => setPacienteNombre(e.target.value)}
                      placeholder="Ej. Carlos Ramírez"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={pacienteWhatsApp}
                        onChange={(e) => setPacienteWhatsApp(e.target.value)}
                        placeholder="33 1234 5678"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        No. Póliza / Membresía
                      </label>
                      <input
                        type="text"
                        value={polizaInput}
                        onChange={(e) => setPolizaInput(e.target.value)}
                        placeholder={aseguradora === 'particular' ? 'No aplica' : 'Ej. DTG-99412'}
                        disabled={aseguradora === 'particular'}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600 disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Selecciona Horario Disponible (Sincronizado en Vivo):
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Mañana 10:00 AM', 'Mañana 04:30 PM', 'Jueves 11:30 AM', 'Sábado 10:00 AM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setHorarioSeleccionado(slot)}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border transition ${
                            horarioSeleccionado === slot
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4"/> Agendar y Pre-Validar Seguro Ahora
                </button>
                <p className="text-[11px] text-center text-slate-500">
                  Recibirás confirmación automática en tu WhatsApp y recordatorio antes de tu cita.
                </p>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8"/>
                </div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  ¡Cita Bloqueada en {clinicaNombre}!
                </h4>
                <p className="text-sm text-slate-600">
                  Gracias <span className="font-semibold">{pacienteNombre}</span>. Hemos registrado tu solicitud para <span className="font-semibold">{tratamientoActual.nombre}</span> el <span className="font-semibold">{horarioSeleccionado}</span>.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left space-y-1.5">
                  <p><strong>Aseguradora:</strong> {seguroActual.nombre} {polizaInput && `(${polizaInput})`}</p>
                  <p><strong>Copago bloqueado:</strong> ${copagoFinal.toLocaleString()} MXN {aplicaMsi && `(Disponible a ${plazoMsi} MSI)`}</p>
                  <p><strong>Notificación:</strong> Enviada automáticamente por WhatsApp Cloud API.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReservaConfirmada(false)}
                  className="text-xs text-blue-600 font-semibold hover:underline pt-2"
                >
                  ← Hacer otra prueba en el cotizador
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECCIÓN B2B PARA EL DENTISTA: CALCULADORA DE REACTIVACIÓN Y PAQUETES */}
      <section id="propuesta-doctor" className="bg-slate-900 text-white py-20 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Propuesta Tecnológica para {clinicaNombre}
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Así es como este sistema se paga solo cada mes en tu clínica
            </h3>
            <p className="text-slate-300 text-base">
              Además de captar pacientes nocturnos con el cotizador de seguros, nuestro motor en Node.js + WhatsApp Oficial reactiva automáticamente a los pacientes que llevan más de 6 meses sin visitarte.
            </p>
          </div>

          {/* CALCULADORA DE REACTIVACIÓN DE BASE DE DATOS */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                <MessageSquare className="w-4 h-4"/> Motor de Reactivación por WhatsApp
              </div>
              <h4 className="text-2xl font-bold">
                ¿Cuántos números de pacientes antiguos tienes hoy guardados en libretas o Excel?
              </h4>
              <p className="text-slate-300 text-sm">
                Mueve la barra para simular cuántos pacientes volverían cada mes con nuestros recordatorios semestrales automatizados de limpieza y promociones:
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>Expedientes / Contactos guardados:</span>
                  <span className="text-blue-400 text-lg">{pacientesInactivos} pacientes</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="50"
                  value={pacientesInactivos}
                  onChange={(e) => setPacientesInactivos(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>100 contactos</span>
                  <span>750 contactos</span>
                  <span>1,500+ contactos</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-4">
              <p className="text-xs text-slate-400 uppercase font-bold">Retorno Mensual Estimado (Conservador 4.5%):</p>
              <div className="flex items-baseline justify-between border-b border-slate-800 pb-3">
                <span className="text-sm text-slate-300">Pacientes que regresan al mes:</span>
                <span className="text-2xl font-extrabold text-white">{pacientesReactivadosMes} citas nuevas</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-slate-300">Ingresos recuperados al mes:</span>
                <span className="text-3xl font-extrabold text-emerald-400">
                  +${ingresoRecuperadoMes.toLocaleString()} MXN
                </span>
              </div>
              <p className="text-xs text-slate-400 pt-2">
                *Con solo 4 o 5 pacientes que regresen al mes por el recordatorio automático de WhatsApp, la iguala del sistema queda cubierta al 100%.
              </p>
            </div>
          </div>

          {/* TABLA DE LOS 3 PAQUETES DE VENDE+ DIGITAL */}
          <div className="space-y-6">
            {/* BANNER PRECIO FUNDADOR */}
            <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Sparkles className="w-5 h-5"/>
                </span>
                <div>
                  <h5 className="font-bold text-white text-sm sm:text-base flex flex-wrap items-center gap-2">
                    Lanzamiento Oficial: Programa "Precio Fundador"
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-semibold">
                      Limitado a las primeras 5 clínicas
                    </span>
                  </h5>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Tarifa preferencial especial a cambio de testimonio en video, caso de éxito en portafolio y reseña en Google.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Paquete Básico */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-400">1. Paquete Básico</span>
                    <span className="text-[10px] bg-slate-700 text-emerald-300 px-2 py-0.5 rounded font-semibold">Precio Fundador</span>
                  </div>
                  <h4 className="text-xl font-bold">Presencia y Agenda</h4>
                  <p className="text-xs text-slate-300">Ideal para modernizar la recepción digital de la clínica.</p>
                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-extrabold text-white">$5,000 <span className="text-xs font-normal text-slate-400">MXN Setup</span></p>
                      <span className="text-xs text-slate-400 line-through">Reg. $9,000</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1.5 text-xs text-emerald-400 font-semibold">
                      <span>+ $950 MXN / mes</span>
                      <span className="text-slate-400 line-through font-normal">(Reg. $1,990/mes)</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-300 pt-3">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0"/> Landing Page Premium personalizada</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0"/> Agenda automatizada 24/7</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0"/> Posicionamiento local en Google Maps</li>
                  </ul>
                </div>
              </div>

              {/* Paquete Intermedio (Estrella) */}
              <div className="bg-gradient-to-b from-blue-900/60 to-slate-800 border-2 border-blue-500 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl">
                <span className="absolute -top-3 right-6 bg-blue-500 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md">
                  MÁS ELEGIDO EN ZMG
                </span>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-blue-300">2. Paquete Máquina de Ventas</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-semibold">Precio Fundador</span>
                  </div>
                  <h4 className="text-xl font-bold">Cotizador + WhatsApp CRM + Ads</h4>
                  <p className="text-xs text-slate-300">El sistema completo que estás probando en esta página.</p>
                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-extrabold text-white">$12,000 <span className="text-xs font-normal text-slate-300">MXN Setup</span></p>
                      <span className="text-xs text-slate-400 line-through">Reg. $20,000</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1.5 text-xs text-emerald-400 font-semibold">
                      <span>+ $3,500 MXN / mes</span>
                      <span className="text-slate-400 line-through font-normal">(Reg. $8,900/mes)</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-200 pt-3">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0"/> <strong>Cotizador interactivo de Seguros</strong> (Dentegra, Centauro)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0"/> Pasarela de pagos con MSI bancarios</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0"/> <strong>Base de datos + Reactivación WhatsApp</strong></li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0"/> Gestión mensual de campañas en Google/Meta Ads</li>
                  </ul>
                </div>
              </div>

              {/* Paquete Premium */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-amber-400">3. Paquete Dominio Total</span>
                    <span className="text-[10px] bg-slate-700 text-emerald-300 px-2 py-0.5 rounded font-semibold">Precio Fundador</span>
                  </div>
                  <h4 className="text-xl font-bold">Dominio Total y Producción Visual</h4>
                  <p className="text-xs text-slate-300">Para clínicas que buscan ser el referente visual #1 de su zona.</p>
                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-extrabold text-white">$19,000 <span className="text-xs font-normal text-slate-400">MXN Setup</span></p>
                      <span className="text-xs text-slate-400 line-through">Reg. $35,000</span>
                    </div>
                    <div className="mt-1 flex items-baseline gap-1.5 text-xs text-emerald-400 font-semibold">
                      <span>+ $4,500 MXN / mes</span>
                      <span className="text-slate-400 line-through font-normal">(Reg. $9,900/mes)</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-300 pt-3">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0"/> Todo lo incluido en Máquina de Ventas</li>
                    <li className="flex items-center gap-2"><Camera className="w-4 h-4 text-amber-400 shrink-0"/> <strong>Sesión presencial de foto y video DSLR</strong> en tu clínica</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0"/> Creativos publicitarios con tu equipo real</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* NOTA DISCRETA AL PIE DE LA TABLA */}
            <div className="text-center p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-400 max-w-4xl mx-auto leading-relaxed">
              Precios + IVA • Anticipo 50% al iniciar y 50% a la entrega • Igualas con mínimo de 3 meses • La pauta publicitaria se paga directo a Meta/Google • Permisos COFEPRIS no incluidos.
            </div>
          </div>

          <div className="text-center pt-4 text-xs text-slate-400">
            Desarrollado por <strong>Ing. Gustavo Horta</strong> • Vende+ Digital • Sistemas de Automatización y Adquisición de Pacientes en Jalisco
          </div>
        </div>
      </section>
    </div>
  );
}
