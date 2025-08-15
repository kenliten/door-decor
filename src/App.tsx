import { useMemo, useRef, useState, useEffect } from "react";

// Demo images (libres en Unsplash). Puedes cambiar por tus diseños reales.
const SAMPLE_IMAGES = [
  '/1.png',
  '/2.png',
  '/3.png',
  '/4.png',
  '/5.png',
];

const PRICE_PER_SQFT = 99; // RD$ por pie cuadrado

function formatRD(amount: number) {
  try {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `RD$ ${amount.toLocaleString("es-DO")}`;
  }
}

function convertToFeet(value: number, unit: string) {
  const v = parseFloat(`${value || 0}`);
  if (!Number.isFinite(v)) return 0;
  switch (unit) {
    case "in":
      return v / 12; // pulgadas a pies
    case "cm":
      return v / 30.48; // centímetros a pies
    case "ft":
    default:
      return v; // ya en pies
  }
}

// Componente principal
export default function DoorVinylShop() {
  const [unit, setUnit] = useState("in"); // in, cm, ft
  const [width, setWidth] = useState(36); // ancho de la puerta (por defecto 36 in ~ 91.44 cm)
  const [height, setHeight] = useState(74); // alto de la puerta (80 in ~ 203.2 cm)
  const [quantity, setQuantity] = useState(1);

  const [selectedSrc, setSelectedSrc] = useState(SAMPLE_IMAGES[0]);
  const [uploadedSrc, setUploadedSrc] = useState(null as string | null);

  const [designScale, setDesignScale] = useState(100); // %
  const [designOffsetX, setDesignOffsetX] = useState(50); // % center
  const [designOffsetY, setDesignOffsetY] = useState(50); // % center
  const [designOpacity, setDesignOpacity] = useState(100); // %

  const doorWidthFt = useMemo(() => convertToFeet(width, unit), [width, unit]);
  const doorHeightFt = useMemo(() => convertToFeet(height, unit), [height, unit]);

  const sqft = useMemo(() => {
    const area = Math.max(doorWidthFt, 0) * Math.max(doorHeightFt, 0);
    return isFinite(area) ? area : 0;
  }, [doorWidthFt, doorHeightFt]);

  const total = useMemo(() => Math.ceil(sqft * PRICE_PER_SQFT * Math.max(quantity, 1)), [sqft, quantity]);

  const activeDesign = uploadedSrc || selectedSrc;

  const onUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedSrc(String(ev.target?.result));
    reader.readAsDataURL(file);
  };

  // Para el drag del diseño dentro de la puerta
  const dragRef = useRef(null as any);
  const [dragging, setDragging] = useState(false);
  const onPointerDown = (e: any) => {
    setDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: designOffsetX, baseY: designOffsetY };
  };
  const onPointerMove = (e: any) => {
    if (!dragging || !dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    // convertir movimiento de px a % aproximado según el tamaño del contenedor
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const pxToPctX = 100 / rect.width;
    const pxToPctY = 100 / rect.height;
    setDesignOffsetX(Math.max(0, Math.min(100, dragRef.current.baseX + dx * pxToPctX)));
    setDesignOffsetY(Math.max(0, Math.min(100, dragRef.current.baseY + dy * pxToPctY)));
  };
  const onPointerUp = () => setDragging(false);

  // evitar seleccionar texto mientras se arrastra
  useEffect(() => {
    const prevent = (e: Event) => dragging && e.preventDefault();
    document.addEventListener("selectstart", prevent, { passive: false });
    return () => document.removeEventListener("selectstart", prevent);
  }, [dragging]);

  const aspectRatio = useMemo(() => {
    const w = Math.max(doorWidthFt, 0.1);
    const h = Math.max(doorHeightFt, 0.1);
    return w / h;
  }, [doorWidthFt, doorHeightFt]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white grid place-items-center font-bold">DV</div>
            <div>
              <h1 className="text-xl font-semibold leading-tight">DecoraPuertas</h1>
              <p className="text-sm text-neutral-500 -mt-1">Vinil adhesivo a la medida — RD$ {PRICE_PER_SQFT}/ft²</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 transition">Contactar</button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Config / Form */}
        <section className="space-y-6">
          <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
            <h2 className="text-lg font-semibold mb-4">Dimensiones de tu puerta</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Unidad</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full border rounded-xl px-3 py-2">
                  <option value="in">Pulgadas (in)</option>
                  <option value="cm">Centímetros (cm)</option>
                  <option value="ft">Pies (ft)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Ancho</label>
                <input type="number" min={0} value={width} onChange={(e: any) => setWidth(e.target.value)} className="w-full border rounded-xl px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Alto</label>
                <input type="number" min={0} value={height} onChange={(e: any) => setHeight(e.target.value)} className="w-full border rounded-xl px-3 py-2" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Cantidad</label>
                <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value || "1"))} className="w-full border rounded-xl px-3 py-2" />
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-neutral-100">
                  <p className="text-xs text-neutral-500">Área estimada</p>
                  <p className="text-base font-semibold">{sqft.toFixed(2)} ft²</p>
                </div>
                <div className="p-3 rounded-xl bg-neutral-100">
                  <p className="text-xs text-neutral-500">Precio total</p>
                  <p className="text-base font-semibold">{formatRD(total)}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-3">* El precio se calcula a {formatRD(PRICE_PER_SQFT)} por pie cuadrado. El acabado no incluye instalación.</p>
          </div>

          <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
            <h2 className="text-lg font-semibold mb-4">Elige un diseño o sube el tuyo</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SAMPLE_IMAGES.map((src, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedSrc(src); setUploadedSrc(null); }}
                  className={`relative border rounded-xl overflow-hidden group ${selectedSrc === src && !uploadedSrc ? "ring-2 ring-neutral-900" : ""}`}
                >
                  <img src={src} alt={`Muestra ${i + 1}`} className="w-full h-28 object-cover transition group-hover:scale-105" />
                </button>
              ))}

              {/* Card para subida */}
              <label className={`cursor-pointer border-dashed border-2 rounded-xl grid place-items-center p-4 text-center min-h-28 ${uploadedSrc ? "ring-2 ring-neutral-900" : ""}`}>
                <div>
                  <p className="text-sm font-medium">Subir tu diseño</p>
                  <p className="text-xs text-neutral-500">PNG / JPG</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
              </label>
            </div>

            {uploadedSrc && (
              <div className="mt-3 text-xs text-neutral-500">Usando tu diseño cargado.</div>
            )}
          </div>

          <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
            <h2 className="text-lg font-semibold mb-4">Ajustes del diseño en la puerta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Escala ({designScale}%)</label>
                <input type="range" min={50} max={200} value={designScale} onChange={(e) => setDesignScale(parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Opacidad ({designOpacity}%)</label>
                <input type="range" min={50} max={100} value={designOpacity} onChange={(e) => setDesignOpacity(parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Posición X ({designOffsetX.toFixed(0)}%)</label>
                <input type="range" min={0} max={100} value={designOffsetX} onChange={(e) => setDesignOffsetX(parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Posición Y ({designOffsetY.toFixed(0)}%)</label>
                <input type="range" min={0} max={100} value={designOffsetY} onChange={(e) => setDesignOffsetY(parseInt(e.target.value))} className="w-full" />
              </div>
            </div>
            <p className="text-xs text-neutral-500 mt-3">Tip: también puedes arrastrar el diseño directamente sobre la puerta en el preview.</p>
          </div>

          <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-neutral-600">Total estimado</p>
              <p className="text-2xl font-semibold">{formatRD(total)}</p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-3 rounded-2xl bg-neutral-900 text-white hover:bg-neutral-800 transition">Agregar al carrito</button>
              <button className="px-5 py-3 rounded-2xl border border-neutral-300 hover:bg-neutral-100 transition">Solicitar instalación</button>
            </div>
          </div>
        </section>

        {/* Preview */}
        <section className="space-y-6">
          <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
            <h2 className="text-lg font-semibold mb-4">Preview en tu puerta</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Puerta */}
              <div className="w-full">
                <div
                  className="mx-auto bg-neutral-200 rounded-xl shadow-inner border border-neutral-300 overflow-hidden"
                  style={{
                    aspectRatio: `${Math.max(aspectRatio, 0.3)}`,
                    maxWidth: "420px",
                  }}
                >
                  {/* Marco */}
                  <div className="w-full h-full p-2 md:p-3 bg-neutral-300">
                    <div className="w-full h-full rounded-md bg-neutral-50 border-4 border-neutral-400 relative overflow-hidden">
                      {/* Manubrio simple */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-12 bg-neutral-400 rounded-full" />

                      {/* Superficie del vinil */}
                      <div
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerLeave={onPointerUp}
                        className="absolute inset-0 cursor-grab active:cursor-grabbing"
                        style={{
                          backgroundImage: activeDesign ? `url(${activeDesign})` : undefined,
                          backgroundRepeat: "no-repeat",
                          backgroundSize: `${designScale}% auto`,
                          backgroundPosition: `${designOffsetX}% ${designOffsetY}%`,
                          opacity: designOpacity / 100,
                          transition: dragging ? "none" : "background-size 0.1s, background-position 0.1s, opacity 0.1s",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-2">La proporción del preview se ajusta automáticamente a las dimensiones que ingreses.</p>
              </div>

              {/* Resumen */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-neutral-100">
                    <p className="text-xs text-neutral-500">Ancho</p>
                    <p className="text-base font-semibold">{width} {unit}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-100">
                    <p className="text-xs text-neutral-500">Alto</p>
                    <p className="text-base font-semibold">{height} {unit}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-100">
                    <p className="text-xs text-neutral-500">Área</p>
                    <p className="text-base font-semibold">{sqft.toFixed(2)} ft²</p>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-100">
                    <p className="text-xs text-neutral-500">Precio</p>
                    <p className="text-base font-semibold">{formatRD(sqft * PRICE_PER_SQFT)}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-700 text-white">
                  <p className="text-sm opacity-80">¿Listo para ordenar?</p>
                  <p className="text-xl font-semibold">Total: {formatRD(total)}</p>
                  <p className="text-xs opacity-80 mt-1">Incluye {quantity} unidad(es). Impuestos/aplicaciones adicionales se calculan al finalizar la compra.</p>
                  <div className="mt-3 flex gap-3 justify-center">
                    <button className="px-4 py-2 rounded-2xl bg-white text-neutral-900 hover:bg-neutral-100 transition">Continuar compra</button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border">
                  <h3 className="font-medium mb-2">Especificaciones</h3>
                  <ul className="text-sm list-disc pl-5 space-y-1 text-neutral-600">
                    <li>Vinil adhesivo premium, acabado mate o brillante.</li>
                    <li>Fácil instalación, sin herramientas especiales.</li>
                    <li>Corte a la medida de tu puerta.</li>
                    <li>Resistente a humedad interior. Uso exterior opcional.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <FAQ />
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-10 text-sm text-neutral-500">
        <p>© {new Date().getFullYear()} DecoraPuertas. Todos los derechos reservados. Hecho con ❤ en RD.</p>
      </footer>
    </div>
  );
}

function FAQ() {
  return (
    <div className="p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-neutral-200">
      <h2 className="text-lg font-semibold mb-4">Preguntas frecuentes</h2>
      <div className="space-y-4">
        <details className="group border rounded-xl p-4">
          <summary className="cursor-pointer font-medium">¿Cómo tomo las medidas de mi puerta?</summary>
          <div className="text-sm text-neutral-600 mt-2">Mide el ancho y alto del panel que cubrirá el vinil. Puedes usar pulgadas (in), centímetros (cm) o pies (ft). Nosotros convertimos automáticamente.</div>
        </details>
        <details className="group border rounded-xl p-4">
          <summary className="cursor-pointer font-medium">¿El precio incluye instalación?</summary>
          <div className="text-sm text-neutral-600 mt-2">No. El precio mostrado corresponde al material impreso. Ofrecemos instalación con costo adicional según ubicación.</div>
        </details>
        <details className="group border rounded-xl p-4">
          <summary className="cursor-pointer font-medium">¿Puedo enviar mi propio diseño?</summary>
          <div className="text-sm text-neutral-600 mt-2">¡Sí! Sube tu archivo en PNG o JPG con buena resolución. Recomendamos mínimo 150 DPI a tamaño real.</div>
        </details>
        <details className="group border rounded-xl p-4">
          <summary className="cursor-pointer font-medium">¿En cuánto tiempo lo recibo?</summary>
          <div className="text-sm text-neutral-600 mt-2">La producción suele tardar 2–4 días hábiles. Envío/retirada según tu preferencia.</div>
        </details>
      </div>
    </div>
  );
}
