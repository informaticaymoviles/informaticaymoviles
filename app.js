/*
 * informaticaymoviles.com - Buscador de presupuestos v2.0
 * Filtros por Marca de CPU, Propósito de uso y Enlaces directos hipervínculados.
 * Licencia: GNU GPLv3
 */

// Datos Locales Extendidos (Fallback si no encuentra o falla precios.json)
const fallbackDatabase = {
    pc: [
        {
            budgetMin: 300,
            budgetMax: 600,
            cpuBrand: "amd",
            purpose: "office",
            title: "PC Ofimática Avanzada AMD Ryzen (Gráficos Integrados)",
            parts: [
                { name: "CPU: AMD Ryzen 5 5600G", price: 119.90, store: "PcComponentes", url: "https://www.pccomponentes.com/" },
                { name: "Placa Base: Gigabyte B450M DS3H", price: 74.95, store: "Amazon ES", url: "https://www.amazon.es/" },
                { name: "RAM: 16GB DDR4 3200MHz Corsair", price: 45.00, store: "Coolmod", url: "https://www.coolmod.com/" },
                { name: "SSD: 1TB NVMe M.2 Kingston", price: 62.00, store: "Neobyte", url: "https://www.neobyte.es/" },
                { name: "Fuente + Caja: MicroATX 500W", price: 58.00, store: "Amazon ES", url: "https://www.amazon.es/" }
            ]
        },
        {
            budgetMin: 300,
            budgetMax: 600,
            cpuBrand: "intel",
            purpose: "office",
            title: "PC Multimedia Intel Core Essential (Gráficos Integrados)",
            parts: [
                { name: "CPU: Intel Core i3-12100 con Intel UHD", price: 105.00, store: "PcComponentes", url: "https://www.pccomponentes.com/" },
                { name: "Placa Base: ASUS Prime H610M", price: 82.00, store: "Neobyte", url: "https://www.neobyte.es/" },
                { name: "RAM: 16GB DDR4 3200MHz Crucial", price: 41.50, store: "Amazon ES", url: "https://www.amazon.es/" },
                { name: "SSD: 500GB NVMe M.2 Western Digital", price: 46.00, store: "Coolmod", url: "https://www.coolmod.com/" },
                { name: "Fuente + Caja: ATX Estándar 500W", price: 55.00, store: "Amazon ES", url: "https://www.amazon.es/" }
            ]
        },
        {
            budgetMin: 601,
            budgetMax: 1200,
            cpuBrand: "amd",
            purpose: "gaming",
            title: "PC Gaming Custom AMD Ryzen + Radeon RX Dedicada",
            parts: [
                { name: "CPU: AMD Ryzen 5 5600X", price: 135.00, store: "Coolmod", url: "https://www.coolmod.com/" },
                { name: "GPU: AMD Radeon RX 6650 XT 8GB", price: 259.99, store: "PcComponentes", url: "https://www.pccomponentes.com/" },
                { name: "Placa Base: MSI B550M PRO-VDH", price: 95.00, store: "Amazon ES", url: "https://www.amazon.es/" },
                { name: "RAM: 16GB DDR4 3600MHz Kingston", price: 48.00, store: "Neobyte", url: "https://www.neobyte.es/" },
                { name: "SSD: 1TB NVMe Crucial PCIe 4.0", price: 69.90, store: "PcComponentes", url: "https://www.pccomponentes.com/" },
                { name: "Fuente: Corsair CX650 80+ Bronze", price: 74.50, store: "Amazon ES", url: "https://www.amazon.es/" },
                { name: "Torre: MSI Forge RGB", price: 62.00, store: "Coolmod", url: "https://www.coolmod.com/" }
            ]
        },
        {
            budgetMin: 601,
            budgetMax: 1200,
            cpuBrand: "intel",
            purpose: "gaming",
            title: "PC Gaming Custom Intel Core + RTX Dedicada",
            parts: [
                { name: "CPU: Intel Core i5-12400F", price: 124.90, store: "PcComponentes", url: "https://www.pccomponentes.com/" },
                { name: "GPU: NVIDIA RTX 4060 8GB GDDR6", price: 310.00, store: "Coolmod", url: "https://www.coolmod.com/" },
                { name: "Placa Base: Gigabyte B760M DS3H", price: 109.00, store: "Amazon ES", url: "https://www.amazon.es/" },
                { name: "RAM: Corsair Vengeance 16GB DDR4", price: 46.00, store: "Neobyte", url: "https://www.neobyte.es/" },
                { name: "SSD: 1TB NVMe M.2 WD Black", price: 79.00, store: "Amazon ES", url: "https://www.amazon.es/" },
                { name: "Fuente: Gigabyte P650B Bronze", price: 59.90, store: "PcComponentes", url: "https://www.pccomponentes.com/" },
                { name: "Torre: Nox Hummer Nemesis", price: 65.00, store: "Coolmod", url: "https://www.coolmod.com/" }
            ]
        }
    ],
    mobile: [
        { budgetMin: 150, budgetMax: 299, name: "Xiaomi Redmi Note 13 / Samsung Galaxy A15", desc: "El rey de la gama de entrada. Excelente pantalla fluida y autonomía sobresaliente.", approxPrice: 189.00, bestStore: "Amazon ES / Carrefour", url: "https://www.amazon.es/" },
        { budgetMin: 300, budgetMax: 500, name: "POCO X6 Pro 5G / Nothing Phone (2a)", desc: "Potencia bruta para tareas exigentes o gaming móvil en un chasis moderno.", approxPrice: 339.00, bestStore: "PcComponentes", url: "https://www.pccomponentes.com/" },
        { budgetMin: 501, budgetMax: 1500, name: "Google Pixel 8a / iPhone 15 Reacondicionado", desc: "Fotografía y vídeo premium con un soporte de actualizaciones de largo recorrido.", approxPrice: 520.00, bestStore: "BackMarket / Amazon", url: "https://www.backmarket.es/" }
    ]
};

// Ocultar o mostrar filtros condicionales según el tipo de búsqueda
document.getElementById('searchType').addEventListener('change', (e) => {
    const pcFilters = document.getElementById('pcFilters');
    if (e.target.value === 'pc') {
        pcFilters.classList.remove('hidden');
    } else {
        pcFilters.classList.add('hidden');
    }
});

// Procesamiento principal al hacer click
document.getElementById('btnSearch').addEventListener('click', async () => {
    const type = document.getElementById('searchType').value;
    const budget = parseFloat(document.getElementById('budget').value);
    const selectedCpu = document.getElementById('cpuBrand') ? document.getElementById('cpuBrand').value : 'indiferente';
    const selectedPurpose = document.getElementById('purpose') ? document.getElementById('purpose').value : 'gaming';
    
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');
    const storesList = document.getElementById('storesList');

    resultsGrid.innerHTML = '<p class="text-gray-400 text-center col-span-3 py-4">Procesando filtros y ajustando presupuestos en España...</p>';
    resultsContainer.classList.remove('hidden');

    let dataSource = fallbackDatabase;

    // Intentar leer base de datos online del scraper
    try {
        const response = await fetch('precios.json');
        if (response.ok) {
            dataSource = await response.json();
        }
    } catch (err) {
        console.log("Usando base de datos interna local.");
    }

    resultsGrid.innerHTML = '';

    if (type === 'pc') {
        storesList.innerText = "PcComponentes, MediaMarkt, Coolmod, Neobyte, Amazon España";
        
        // Filtrado multicriterio avanzado
        const config = dataSource.pc.find(item => {
            const matchBudget = budget >= item.budgetMin && budget <= item.budgetMax;
            const matchCpu = (selectedCpu === 'indiferente') || (item.cpuBrand === selectedCpu);
            const matchPurpose = item.purpose === selectedPurpose;
            return matchBudget && matchCpu && matchPurpose;
        });

        if (config) {
            let totalConfigPrice = config.parts.reduce((sum, p) => sum + p.price, 0);
            
            let cardHtml = `
                <div class="bg-gray-800 p-6 rounded-xl border border-gray-750 shadow-md md:col-span-3">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                        <div>
                            <h3 class="text-xl font-bold text-blue-400">${config.title}</h3>
                            <p class="text-xs text-gray-500 mt-1">Pulsa sobre cualquier pieza para ver el artículo en la tienda de origen</p>
                        </div>
                        <div class="bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-600 text-right">
                            <span class="text-xs block text-gray-400">Total Componentes:</span>
                            <span class="text-2xl font-black text-emerald-400">${totalConfigPrice.toFixed(2)}€</span>
                        </div>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-gray-300">
                            <thead class="text-xs uppercase bg-gray-700 text-gray-400">
                                <tr>
                                    <th class="p-3">Componente Recomendado (Haz clic para ir)</th>
                                    <th class="p-3 text-center">Precio Ref.</th>
                                    <th class="p-3 text-right">Comercio</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            config.parts.forEach(part => {
                cardHtml += `
                    <tr class="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                        <td class="p-3 font-medium text-white">
                            <a href="${part.url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-2">
                                <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 2 0 00-2 2v10a2 2 2 0 002 2h10a2 2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                ${part.name}
                            </a>
                        </td>
                        <td class="p-3 text-center font-mono">${part.price.toFixed(2)}€</td>
                        <td class="p-3 text-right">
                            <span class="inline-block bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs border border-gray-600">
                                ${part.store}
                            </span>
                        </td>
                    </tr>
                `;
            });
            
            cardHtml += `</tbody></table></div></div>`;
            resultsGrid.innerHTML = cardHtml;
        } else {
            resultsGrid.innerHTML = `
                <div class="col-span-3 text-center py-8">
                    <p class="text-amber-400 font-semibold">No se ha encontrado una configuración exacta con esa combinación de filtros.</p>
                    <p class="text-gray-500 text-sm mt-1">Prueba a ampliar el presupuesto o cambiar la marca del procesador a 'Indiferente'.</p>
                </div>
            `;
        }

    } else if (type === 'mobile') {
        storesList.innerText = "Amazon España, BackMarket, PcComponentes, El Corte Inglés, Carrefour";
        const mobilesDisponibles = dataSource.mobile.filter(m => budget >= m.approxPrice);
        
        if (mobilesDisponibles.length > 0) {
            mobilesDisponibles.forEach(m => {
                const cardHtml = `
                    <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col justify-between shadow-md hover:border-emerald-500/30 transition-all duration-300">
                        <div>
                            <span class="text-xs bg-blue-500/10 text-blue-400 font-mono px-2 py-0.5 rounded border border-blue-500/20 font-semibold">Calidad/Precio</span>
                            <h3 class="text-lg font-bold mt-3 mb-2 text-white">${m.name}</h3>
                            <p class="text-sm text-gray-400 line-clamp-3">${m.desc}</p>
                        </div>
                        <div class="border-t border-gray-700 pt-4 mt-6">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-xs text-gray-400">Precio Ref.</span>
                                <span class="text-2xl font-black text-emerald-400">${m.approxPrice.toFixed(2)}€</span>
                            </div>
                            <a href="${m.url}" target="_blank" rel="noopener noreferrer" class="block text-center w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded text-xs transition duration-150">
                                Ir a la tienda (${m.bestStore})
                            </a>
                        </div>
                    </div>
                `;
                resultsGrid.innerHTML += cardHtml;
            });
        } else {
            resultsGrid.innerHTML = `<div class="col-span-3 text-center py-8 text-amber-400 font-semibold">Introduce un presupuesto mínimo de 150€ para mostrar smartphones viables.</div>`;
        }
    }
});
        
