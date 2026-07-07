/*
 * informaticaymoviles.com - v3.0 (Soporte para Portátiles e Interfaz Dinámica)
 * Licencia: GNU GPLv3
 */

// Base de datos integrada de respaldo (Fallback) en caso de ausencia de red
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
        },
        {
            budgetMin: 651,
            budgetMax: 1300,
            cpuBrand: "amd",
            purpose: "gaming",
            title: "PC Fijo Gaming Custom AMD Ryzen + Radeon RX Dedicada",
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
            budgetMin: 651,
            budgetMax: 1300,
            cpuBrand: "intel",
            purpose: "gaming",
            title: "PC Fijo Gaming Custom Intel Core + RTX Dedicada",
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
    laptops: [
        { budgetMin: 300, budgetMax: 599, title: "Portátil Estudiantes / Teletrabajo Económico", specs: "Lenovo IdeaPad Slim 3 | AMD Ryzen 5 7520U | 16GB RAM | 512GB SSD | 15.6\" FHD", approxPrice: 449.00, bestStore: "Amazon ES", url: "https://www.amazon.es/" },
        { budgetMin: 600, budgetMax: 999, title: "Portátil Gaming Esencial / Rendimiento", specs: "ASUS TUF Gaming A15 | AMD Ryzen 5 7535HS | 16GB RAM | 512GB SSD | NVIDIA RTX 3050", approxPrice: 699.00, bestStore: "PcComponentes", url: "https://www.pccomponentes.com/" },
        { budgetMin: 1000, budgetMax: 2500, title: "Portátil Gama Alta / Diseñadores y Gaming", specs: "HP Victus 16 | Intel Core i7-13700H | 32GB RAM | 1TB SSD | NVIDIA RTX 4060", approxPrice: 1049.00, bestStore: "Coolmod", url: "https://www.coolmod.com/" }
    ],
    mobile: [
        { budgetMin: 150, budgetMax: 299, name: "POCO X6 Pro 5G / Redmi Note 13", desc: "Pantalla AMOLED fluida y autonomía sobresaliente para el día a día.", approxPrice: 189.00, bestStore: "Amazon ES / Carrefour", url: "https://www.amazon.es/" },
        { budgetMin: 300, budgetMax: 549, name: "Nothing Phone (2a) / POCO F6", desc: "Potencia bruta para tareas exigentes, diseño disruptivo y carga rápida.", approxPrice: 339.00, bestStore: "PcComponentes", url: "https://www.pccomponentes.com/" },
        { budgetMin: 550, budgetMax: 2000, name: "Google Pixel 8a / iPhone 15 Reacondicionado", desc: "Fotografía de nivel profesional con IA y un soporte de actualizaciones muy extenso.", approxPrice: 520.00, bestStore: "BackMarket", url: "https://www.backmarket.es/" }
    ]
};

const searchTypeSelect = document.getElementById('searchType');
const pcFormatSelect = document.getElementById('pcFormat');
const formatFilter = document.getElementById('formatFilter');
const desktopFilters = document.getElementById('desktopFilters');

// Manejo de la reactividad del formulario en base a las opciones del usuario
function ajustarVisibilidadFiltros() {
    const type = searchTypeSelect.value;
    const format = pcFormatSelect.value;

    if (type === 'pc') {
        formatFilter.classList.remove('hidden');
        if (format === 'desktop') {
            desktopFilters.classList.remove('hidden');
        } else {
            desktopFilters.classList.add('hidden');
        }
    } else {
        formatFilter.classList.add('hidden');
        desktopFilters.classList.add('hidden');
    }
}

searchTypeSelect.addEventListener('change', ajustarVisibilidadFiltros);
pcFormatSelect.addEventListener('change', ajustarVisibilidadFiltros);
ajustarVisibilidadFiltros(); 

// Ejecución del clic principal
document.getElementById('btnSearch').addEventListener('click', async () => {
    const type = searchTypeSelect.value;
    const format = pcFormatSelect.value;
    const budget = parseFloat(document.getElementById('budget').value);
    
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');
    const storesList = document.getElementById('storesList');

    resultsGrid.innerHTML = '<p class="text-gray-400 text-center col-span-3 py-4">Buscando y optimizando ofertas...</p>';
    resultsContainer.classList.remove('hidden');
    
    let dataSource = fallbackDatabase;
    try {
        const response = await fetch('precios.json');
        if (response.ok) dataSource = await response.json();
    } catch (e) { 
        console.log("Cargando base de datos interna de respaldo."); 
    }

    resultsGrid.innerHTML = '';

    // CASO A: TORRES DE ESCRITORIO
    if (type === 'pc' && format === 'desktop') {
        storesList.innerText = "PcComponentes, Coolmod, Neobyte, Amazon España";
        const selectedCpu = document.getElementById('cpuBrand').value;
        const selectedPurpose = document.getElementById('purpose').value;

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
                            <p class="text-xs text-gray-500 mt-1">Haz clic en cualquier pieza para ir directo a la oferta oficial</p>
                        </div>
                        <span class="text-2xl font-black text-emerald-400 bg-gray-900/50 px-4 py-2 rounded border border-gray-700">${total.toFixed(2)}€</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-gray-700 text-gray-400 text-xs uppercase">
                                <tr><th class="p-3">Componente</th><th class="p-3 text-center">Precio Ref.</th><th class="p-3 text-right">Tienda</th></tr>
                            </thead>
                            <tbody>
            `;
            config.parts.forEach(p => {
                html += `
                    <tr class="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                        <td class="p-3"><a href="${p.url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-2">
                            <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            ${p.name}
                        </a></td>
                        <td class="p-3 text-center font-mono">${p.price.toFixed(2)}€</td>
                        <td class="p-3 text-right"><span class="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">${p.store}</span></td>
                    </tr>
                `;
            });
            html += `</tbody></table></div></div>`;
            resultsGrid.innerHTML = html;
        } else {
            resultsGrid.innerHTML = `<p class="text-amber-400 text-center col-span-3 py-4">No hay combinaciones preconfiguradas exactas para ese presupuesto con esos filtros. Prueba a ampliar presupuesto o cambiar la CPU a 'Indiferente'.</p>`;
        }

    // CASO B: ORDENADORES PORTÁTILES
    } else if (type === 'pc' && format === 'laptop') {
        storesList.innerText = "Amazon España, PcComponentes, Coolmod, MediaMarkt";
        const laptopsDisponibles = dataSource.laptops.filter(l => budget >= l.approxPrice);

        if (laptopsDisponibles.length > 0) {
            laptopsDisponibles.forEach(l => {
                resultsGrid.innerHTML += `
                    <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col justify-between shadow-md hover:border-blue-500/50 transition-all duration-300">
                        <div>
                            <span class="text-xs bg-blue-500/10 text-blue-400 font-mono px-2 py-0.5 rounded border border-blue-500/20 font-semibold">Portátil</span>
                            <h3 class="text-lg font-bold mt-3 mb-1 text-white">${l.title}</h3>
                            <p class="text-xs text-gray-400 font-mono bg-gray-900/50 p-2.5 rounded border border-gray-700/50 mt-2">${l.specs}</p>
                        </div>
                        <div class="border-t border-gray-700 pt-4 mt-6">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-xs text-gray-400">Precio Ref.</span>
                                <span class="text-2xl font-black text-emerald-400">${l.approxPrice.toFixed(2)}€</span>
                            </div>
                            <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="block text-center w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded text-xs transition">
                                Ver Oferta en ${l.bestStore || 'Tienda'} ↗
                            </a>
                        </div>
                    </div>
                `;
            });
        } else {
            resultsGrid.innerHTML = `<p class="text-amber-400 text-center col-span-3 py-4">Tu presupuesto es ajustado para portátiles recomendados actuales (Mínimo aprox. 350€-400€).</p>`;
        }

    // CASO C: SMARTPHONES
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
            resultsGrid.innerHTML = `<p class="text-amber-400 text-center col-span-3 py-4">Introduce un presupuesto mínimo de 150€ para mostrar smartphones viables en el mercado español.</p>`;
        }
    }
});
