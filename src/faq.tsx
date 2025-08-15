export default function FAQ() {
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