/*
 * informaticaymoviles.com - Buscador de presupuestos de hardware y móviles.
 * Copyright (C) 2026  InformaticaYMoviles Team
 * Licencia: GNU GPLv3
 */

// Datos de respaldo (Fallback) en caso de que el archivo precios.json no esté disponible
const fallbackDatabase = {
    pc: [
        { budgetMin: 300, budgetMax: 500, title: "PC Ofimática / Multimedia Económico", parts: [
            { name: "CPU: AMD Ryzen 5 5600G (Gráficos Integrados)", price: 120, store: "PcComponentes" },
            { name: "Placa Base: Gigabyte B450M", price: 75, store: "Amazon ES" },
            { name: "RAM: 16GB DDR4 3200MHz", price: 45, store: "Coolmod" },
            { name: "SSD: 1TB NVMe M.2", price: 65, store: "Neobyte" },
            { name: "Fuente + Torre: 500W Básica", price: 60, store: "Amazon ES" }
        ]},
        { budgetMin: 501, budgetMax: 900, title: "PC Gaming Calidad/Precio 1080p", parts: [
            { name: "CPU: AMD Ryzen 5 5600X", price: 135, store: "Coolmod" },
            { name: "GPU: AMD Radeon RX 6650 XT 8GB", price: 260, store: "PcComponentes" },
            { name: "Placa Base: MSI B550M PRO", price: 90, store: "Amazon ES" },
            { name: "RAM: 16GB DDR4 3600MHz", price: 50, store: "Neobyte" },
            { name: "SSD: 1TB NVMe Crucial", price: 70, store: "PcComponentes" },
            { name: "Fuente: Corsair CX650 M", price: 75, store: "Amazon ES" },
            { name: "Torre: MSI Forge 100M", price: 60, store: "Coolmod" }
        ]},
        { budgetMin: 901, budgetMax: 1500, title: "PC Gaming / Streaming Avanzado 1440p", parts: [
            { name: "CPU: AMD Ryzen 5 7600", price: 200, store: "Neobyte" },
            { name: "GPU: NVIDIA RTX 4060 Ti 16GB", price: 450, store: "PcComponentes" },
            { name: "Placa Base: Gigabyte B650M", price: 130, store: "Amazon ES" },
            { name: "RAM: 32GB DDR5 6000MHz", price: 110, store: "Coolmod" },
            { name: "SSD: 2TB Kingston NV2", price: 120, store: "Amazon ES" },
            { name: "Fuente: Gigabyte UD750GM Gold", price: 95, store: "PcComponentes" },
            { name: "Torre + Refrigeración", price: 140, store: "Coolmod" }
        ]}
    ],
    mobile: [
        { budgetMin: 150, budgetMax: 250, name: "Xiaomi Redmi Note 13 / Samsung Galaxy A15", desc: "El rey de la gama de entrada. Pantalla AMOLED y buena batería.", approxPrice: 190, bestStore: "Amazon ES / Carrefour" },
        { budgetMin: 251, budgetMax: 400, name: "POCO X6 Pro 5G / Nothing Phone (2a)", desc: "Rendimiento brutal, ideal para juegos y fluidez total a precio contenido.", approxPrice: 340, bestStore: "PcComponentes" },
        { budgetMin: 401, budgetMax: 650, name: "Google Pixel 8a / OnePlus 12R", desc: "La mejor cámara del mercado en este rango de precio y software limpio.", approxPrice: 510, bestStore: "Amazon ES / El Corte Inglés" },
        { budgetMin: 651, budgetMax: 1200, name: "iPhone 15 (Reacondicionado) / Samsung Galaxy S24", desc: "Gama alta premium. Rendimiento top, materiales excelentes.", approxPrice: 820, bestStore: "BackMarket / MediaMarkt" }
    ]
};

// Escuchador del evento de clic en el botón principal de calcular
document.getElementById('btnSearch').addEventListener('click', async () => {
    const type = document.getElementById('searchType').value;
    const budget = parseFloat(document.getElementById('budget').value);
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');
    const storesList = document.getElementById('storesList');

    // Limpiar resultados de búsquedas anteriores
    resultsGrid.innerHTML = '<p class="text-gray-400 text-center col-span-3 py-4">Buscando y optimizando precios en tiendas de España...</p>';
    resultsContainer.classList.remove('hidden');

    let dataSource = fallbackDatabase;
    let usandoDatosReales = false;
    let fechaActualizacion = "Estimación en tiempo real";

    // 1. Intentar obtener el archivo JSON generado por el scraper del backend
    try {
        const response = await fetch('precios.json');
        if (response.ok) {
            const scrapperData = await response.json();
            // Transformamos el JSON del scraper al formato de layouts de la web
            if (scrapperData.componentes && scrapperData.componentes.pc) {
                dataSource = scrapperData;
                usandoDatosReales = true;
                if (scrapperData.ultima_actualizacion) {
                    const fecha = new Date(scrapperData.ultima_actualizacion);
                    fechaActualizacion = `Precios reales actualizados el: ${fecha.toLocaleDateString()} a las ${fecha.toLocaleTimeString()}`;
                }
            }
        }
    } catch (err) {
        console.warn("No se pudo acceder a precios.json (Es normal si estás en local sin backend). Usando base de datos interna por defecto.");
    }

    // Limpiar el mensaje de carga
    resultsGrid.innerHTML = '';

    // LOGICA DE PROCESAMIENTO - HARDWARE PC
    if (type === 'pc') {
        storesList.innerText = "PcComponentes, MediaMarkt, Coolmod, Neobyte, Amazon España";
        
        // Buscar la configuración predefinida que encaje en el rango del presupuesto del usuario
        const config = dataSource.pc.find(item => budget >= item.budgetMin && budget <= item.budgetMax);
        
        if (config) {
            // Calcular el coste total sumando las piezas
            let totalConfigPrice = config.parts.reduce((sum, p) => sum + p.price, 0);
            
            let cardHtml = `
                <div class="bg-gray-800 p-6 rounded-xl border border-gray-750 shadow-md md:col-span-3">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                        <div>
                            <h3 class="text-xl font-bold text-blue-400">${config.title}</h3>
                            <p class="text-xs text-gray-500 mt-1">${fechaActualizacion}</p>
                        </div>
                        <div class="bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-600 text-right">
                            <span class="text-xs block text-gray-400">Coste Total del Setup:</span>
                            <span class="text-2xl font-black text-emerald-400">${totalConfigPrice.toFixed(2)}€</span>
                        </div>
                    </div>
                    
                    <p class="text-sm text-gray-400 mb-4">Esta es la combinación óptima de componentes para tu presupuesto máximo de <strong class="text-white">${budget}€</strong>:</p>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-gray-300">
                            <thead class="text-xs uppercase bg-gray-700 text-gray-400">
                                <tr>
                                    <th class="p-3">Componente Recomendado</th>
                                    <th class="p-3 text-center">Precio Ref.</th>
                                    <th class="p-3 text-right">Mejor Tienda en España</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            // Inyectar de manera dinámica cada una de las filas de componentes
            config.parts.forEach(part => {
                cardHtml += `
                    <tr class="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                        <td class="p-3 font-medium text-white flex items-center gap-2">
                            <svg class="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                            ${part.name}
                        </td>
                        <td class="p-3 text-center font-mono">${part.price.toFixed(2)}€</td>
                        <td class="p-3 text-right">
                            <span class="inline-block bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-1 rounded text-xs border border-emerald-500/20">
                                ${part.store}
                            </span>
                        </td>
                    </tr>
                `;
            });
            
            cardHtml += `
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-4 text-xs text-amber-400/80 bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                        💡 <strong>Consejo de montaje:</strong> Asegúrate de revisar las ofertas puntuales de las tiendas. Si te sobran unos euros de tu presupuesto, inviértelos en mejorar el almacenamiento SSD o la eficiencia de la fuente de alimentación.
                    </div>
                </div>
            `;
            resultsGrid.innerHTML = cardHtml;
        } else {
            resultsGrid.innerHTML = `
                <div class="col-span-3 text-center py-8">
                    <p class="text-amber-400 font-semibold">No tenemos un presupuesto optimizado para esa cantidad exacta de dinero.</p>
                    <p class="text-gray-500 text-sm mt-1">Nuestros rangos actuales de hardware van desde los 300€ hasta los 1500€. Intenta introducir valores como 450, 750 o 1200.</p>
                </div>
            `;
        }

    // LOGICA DE PROCESAMIENTO - MÓVILES
    } else if (type === 'mobile') {
        storesList.innerText = "Amazon España, BackMarket, PcComponentes, El Corte Inglés, Carrefour";
        
        // Filtrar todos los terminales recomendados que el usuario pueda costearse
        const mobilesDisponibles = dataSource.mobile.filter(m => budget >= m.approxPrice);
        
        if (mobilesDisponibles.length > 0) {
            mobilesDisponibles.forEach(m => {
                const cardHtml = `
                    <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col justify-between shadow-md hover:border-blue-500/50 transition-all duration-300">
                        <div>
                            <div class="flex justify-between items-start">
                                <span class="text-xs bg-blue-500/10 text-blue-400 font-mono px-2 py-0.5 rounded border border-blue-500/20 font-semibold">Calidad/Precio</span>
                                <span class="text-xs text-gray-500 font-mono">${usandoDatosReales ? 'Precio Scraper' : 'Precio Estimado'}</span>
                            </div>
                            <h3 class="text-lg font-bold mt-3 mb-2 text-white">${m.name}</h3>
                            <p class="text-sm text-gray-400 line-clamp-3">${m.desc}</p>
                        </div>
                        <div class="border-t border-gray-700 pt-4 mt-6">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-xs text-gray-400">Precio de referencia</span>
                                <span class="text-2xl font-black text-emerald-400">${m.approxPrice.toFixed(2)}€</span>
                            </div>
                            <div class="text-xs text-gray-400 bg-gray-900/40 p-2 rounded border border-gray-700/50">
                                🛒 Compra recomendada en: <span class="text-blue-400 font-semibold block mt-0.5">${m.bestStore}</span>
                            </div>
                        </div>
                    </div>
                `;
                resultsGrid.innerHTML += cardHtml;
            });
        } else {
            resultsGrid.innerHTML = `
                <div class="col-span-3 text-center py-8">
                    <p class="text-amber-400 font-semibold">Presupuesto insuficiente para un smartphone recomendado.</p>
                    <p class="text-gray-500 text-sm mt-1">El rango mínimo óptimo para un smartphone de calidad actual en España empieza en los 150€.</p>
                </div>
            `;
        }
    }
});
                                                      
