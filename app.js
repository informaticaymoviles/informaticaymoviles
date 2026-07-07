/*
 * informaticaymoviles.com - v4.0 (Filtros completos para Portátiles)
 * Licencia: GNU GPLv3
 */

const fallbackDatabase = {
    pc: [
        {
            budgetMin: 300,
            budgetMax: 650,
            cpuBrand: "amd",
            purpose: "office",
            title: "PC Fijo Ofimática Avanzada AMD Ryzen (Gráficos Integrados)",
            parts: [
                { name: "CPU: AMD Ryzen 5 5600G (Gráficos Vega)", price: 119.90, store: "PcComponentes", url: "https://www.pccomponentes.com/" },
                { name: "Placa Base: Gigabyte B450M DS3H", price: 74.95, store: "Amazon ES", url: "https://www.amazon.es/" },
                { name: "RAM: 16GB DDR4 3200MHz Corsair", price: 45.00, store: "Coolmod", url: "https://www.coolmod.com/" },
                { name: "SSD: 1TB NVMe M.2 Kingston", price: 62.00, store: "Neobyte", url: "https://www.neobyte.es/" },
                { name: "Fuente + Caja: MicroATX 500W", price: 58.00, store: "Amazon ES", url: "https://www.amazon.es/" }
            ]
        },
        {
            budgetMin: 300,
            budgetMax: 650,
            cpuBrand: "intel",
            purpose: "office",
            title: "PC Fijo Multimedia Intel Core Essential (Gráficos Integrados)",
            parts: [
                { name: "CPU: Intel Core i3-12100 con Intel UHD", price: 105.00, store: "PcComponentes", url: "https://www.pccomponentes.com/" },
                { name: "Placa Base: ASUS Prime H610M", price: 82.00, store: "Neobyte", url: "https://www.neobyte.es/" },
                { name: "RAM: 16GB DDR4 3200MHz Crucial", price: 41.50, store: "Amazon ES", url: "https://www.amazon.es/" },
                { name: "SSD: 500GB NVMe M.2 Western Digital", price: 46.00, store: "Coolmod", url: "https://www.coolmod.com/" },
                { name: "Fuente + Caja: ATX Estándar 500W", price: 55.00, store: "Amazon ES", url: "https://www.amazon.es/" }
            ]
        }
    ],
    laptops: [
        { budgetMin: 300, budgetMax: 700, cpuBrand: "amd", purpose: "office", title: "Portátil Ofimática AMD Ryzen Económico", specs: "Lenovo IdeaPad Slim 3 | AMD Ryzen 5 7520U | 16GB RAM | 512GB SSD | 15.6\" FHD", approxPrice: 449.00, bestStore: "Amazon ES", url: "https://www.amazon.es/" },
        { budgetMin: 300, budgetMax: 700, cpuBrand: "intel", purpose: "office", title: "Portátil Ofimática Intel Core Ligero", specs: "ASUS Vivobook 15 | Intel Core i3-1215U | 16GB RAM | 512GB SSD | 15.6\" FHD", approxPrice: 399.00, bestStore: "PcComponentes", url: "https://www.pccomponentes.com/" },
        { budgetMin: 600, budgetMax: 2500, cpuBrand: "amd", purpose: "gaming", title: "Portátil Gaming Equilibrado AMD Ryzen + RTX", specs: "ASUS TUF Gaming A15 | AMD Ryzen 5 7535HS | 16GB RAM | 512GB SSD | NVIDIA RTX 3050 4GB", approxPrice: 699.00, bestStore: "PcComponentes", url: "https://www.pccomponentes.com/" },
        { budgetMin: 600, budgetMax: 2500, cpuBrand: "intel", purpose: "gaming", title: "Portátil Gaming Avanzado Intel Core + RTX Top", specs: "HP Victus 16 | Intel Core i7-13700H | 32GB RAM | 1TB SSD | NVIDIA RTX 4060 8GB", approxPrice: 1049.00, bestStore: "Coolmod", url: "https://www.coolmod.com/" }
    ],
    mobile: [
        { budgetMin: 150, budgetMax: 299, name: "POCO X6 Pro 5G / Redmi Note 13", desc: "Pantalla AMOLED fluida y autonomía excelente.", approxPrice: 189.00, bestStore: "Amazon ES", url: "https://www.amazon.es/" }
    ]
};

const searchTypeSelect = document.getElementById('searchType');
const pcFormatSelect = document.getElementById('pcFormat');
const formatFilter = document.getElementById('formatFilter');
const advancedComputerFilters = document.getElementById('advancedComputerFilters');

function ajustarVisibilidadFiltros() {
    const type = searchTypeSelect.value;
    if (type === 'pc') {
        formatFilter.classList.remove('hidden');
        advancedComputerFilters.classList.remove('hidden'); // Se muestra tanto para Torre como para Portátil
    } else {
        formatFilter.classList.add('hidden');
        advancedComputerFilters.classList.add('hidden'); // Se oculta para teléfonos móviles
    }
}

searchTypeSelect.addEventListener('change', ajustarVisibilidadFiltros);
pcFormatSelect.addEventListener('change', ajustarVisibilidadFiltros);
ajustarVisibilidadFiltros(); 

document.getElementById('btnSearch').addEventListener('click', async () => {
    const type = searchTypeSelect.value;
    const format = pcFormatSelect.value;
    const budget = parseFloat(document.getElementById('budget').value);
    const selectedCpu = document.getElementById('cpuBrand').value;
    const selectedPurpose = document.getElementById('purpose').value;
    
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');
    const storesList = document.getElementById('storesList');

    resultsGrid.innerHTML = '<p class="text-gray-400 text-center col-span-3 py-4">Buscando el mejor precio...</p>';
    resultsContainer.classList.remove('hidden');
    
    let dataSource = fallbackDatabase;
    try {
        const response = await fetch('precios.json');
        if (response.ok) dataSource = await response.json();
    } catch (e) { console.log("Cargando base de datos de respaldo."); }

    resultsGrid.innerHTML = '';

    // 1. FILTRADO PARA TORRE FIJA
    if (type === 'pc' && format === 'desktop') {
        storesList.innerText = "PcComponentes, Coolmod, Neobyte, Amazon España";
        const config = dataSource.pc.find(item => {
            return budget >= item.budgetMin && budget <= item.budgetMax &&
                   (selectedCpu === 'indiferente' || item.cpuBrand === selectedCpu) &&
                   item.purpose === selectedPurpose;
        });

        if (config) {
            let total = config.parts.reduce((sum, p) => sum + p.price, 0);
            let html = `
                <div class="bg-gray-800 p-6 rounded-xl border border-gray-750 shadow-md md:col-span-3">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                        <div>
                            <h3 class="text-xl font-bold text-blue-400">${config.title}</h3>
                            <p class="text-xs text-gray-500 mt-1">Haz clic en una pieza para ir directo a la oferta oficial</p>
                        </div>
                        <span class="text-2xl font-black text-emerald-400 bg-gray-900/50 px-4 py-2 rounded border border-gray-700">${total.toFixed(2)}€</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-gray-700 text-gray-400 text-xs uppercase">
                                <tr><th class="p-3">Componente</th><th class="p-3 text-center">Precio</th><th class="p-3 text-right">Tienda</th></tr>
                            </thead>
                            <tbody>
            `;
            config.parts.forEach(p => {
                html += `
                    <tr class="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                        <td class="p-3"><a href="${p.url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline flex items-center gap-2">
                            <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            ${p.name}
                        </a></td>
                        <td class="p-3 text-center font-mono">${p.price.toFixed(2)}€</td>
                        <td class="p-3 text-right"><span class="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded border border-emerald-500/20">${p.store}</span></td>
                    </tr>
                `;
            });
            html += `</tbody></table></div></div>`;
            resultsGrid.innerHTML = html;
        } else {
            resultsGrid.innerHTML = `<p class="text-amber-400 text-center col-span-3 py-4">No hay combinaciones para esa torre fija con esos filtros. Prueba a cambiar de procesador o ampliar presupuesto.</p>`;
        }

    // 2. FILTRADO PARA PORTÁTILES (NUEVO MULTI-CRITERIO)
    } else if (type === 'pc' && format === 'laptop') {
        storesList.innerText = "Amazon España, PcComponentes, Coolmod, MediaMarkt";
        
        const laptopsFiltrados = dataSource.laptops.filter(l => {
            const matchBudget = budget >= l.approxPrice;
            const matchCpu = (selectedCpu === 'indiferente') || (l.cpuBrand === selectedCpu);
            const matchPurpose = l.purpose === selectedPurpose;
            return matchBudget && matchCpu && matchPurpose;
        });

        if (laptopsFiltrados.length > 0) {
            laptopsFiltrados.forEach(l => {
                resultsGrid.innerHTML += `
                    <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col justify-between shadow-md hover:border-blue-500/50 transition-all duration-300">
                        <div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs bg-blue-500/10 text-blue-400 font-mono px-2 py-0.5 rounded border border-blue-500/20 font-semibold uppercase">${l.purpose}</span>
                                <span class="text-xs text-gray-500 font-semibold font-mono uppercase">${l.cpuBrand}</span>
                            </div>
                            <h3 class="text-lg font-bold mt-3 mb-1 text-white">${l.title}</h3>
                            <p class="text-xs text-gray-400 font-mono bg-gray-900/50 p-2.5 rounded border border-gray-700/50 mt-2">${l.specs}</p>
                        </div>
                        <div class="border-t border-gray-700 pt-4 mt-6">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-xs text-gray-400">Precio Ref.</span>
                                <span class="text-2xl font-black text-emerald-400">${l.approxPrice.toFixed(2)}€</span>
                            </div>
                            <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="block text-center w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded text-xs transition">
                                Ver Oferta en ${l.bestStore} ↗
                            </a>
                        </div>
                    </div>
                `;
            });
        } else {
            resultsGrid.innerHTML = `<p class="text-amber-400 text-center col-span-3 py-4">No se han encontrado portátiles recomendados con esa combinación exacta de filtros por debajo de tu presupuesto.</p>`;
        }

    // 3. FILTRADO PARA TELÉFONOS MÓVILES
    } else if (type === 'mobile') {
        storesList.innerText = "Amazon España, BackMarket, PcComponentes, El Corte Inglés, Carrefour";
        const mobilesDisponibles = dataSource.mobile.filter(m => budget >= m.approxPrice);

        if (mobilesDisponibles.length > 0) {
            mobilesDisponibles.forEach(m => {
                resultsGrid.innerHTML += `
                    <div class="bg-gray-800 p-6 rounded-xl border border-gray-750 flex flex-col justify-between shadow-md hover:border-emerald-500/30 transition-all duration-300">
                        <div>
                            <span class="text-xs bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">Smartphone</span>
                            <h3 class="text-lg font-bold mt-3 mb-2 text-white">${m.name}</h3>
                            <p class="text-sm text-gray-400 line-clamp-3">${m.desc}</p>
                        </div>
                        <div class="border-t border-gray-700 pt-4 mt-6">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-xs text-gray-400">Precio Ref.</span>
                                <span class="text-2xl font-black text-emerald-400">${m.approxPrice.toFixed(2)}€</span>
                            </div>
                            <a href="${m.url}" target="_blank" rel="noopener noreferrer" class="block text-center w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded text-xs transition">
                                Ver Oferta en ${m.bestStore} ↗
                            </a>
                        </div>
                    </div>
                `;
            });
        } else {
            resultsGrid.innerHTML = `<p class="text-amber-400 text-center col-span-3 py-4">Introduce un presupuesto mínimo de 150€ para mostrar smartphones viables.</p>`;
        }
    }
});
                                                
