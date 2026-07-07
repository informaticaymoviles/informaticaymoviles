/*
 * informaticaymoviles.com - v6.0 (Algoritmo de Aproximación Avanzada y Ratio AnTuTu)
 * Licencia: GNU GPLv3
 */

const fallbackDatabase = {
    pc: [
        {
            precio_base: 440.00,
            cpuBrand: "amd",
            purpose: "office",
            gpuBrand: "indiferente",
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
            precio_base: 412.00,
            cpuBrand: "intel",
            purpose: "office",
            gpuBrand: "indiferente",
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
            precio_base: 818.00,
            cpuBrand: "amd",
            purpose: "gaming",
            gpuBrand: "amd",
            title: "PC Fijo Gaming Calidad/Precio AMD Ryzen + Radeon RX",
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
            precio_base: 912.00,
            cpuBrand: "intel",
            purpose: "gaming",
            gpuBrand: "nvidia",
            title: "PC Fijo Gaming Esencial Intel Core + RTX",
            parts: [
                { name: "CPU: Intel Core i5-12400F", price: 124.90, store: "PcComponentes", url: "https://www.pccomponentes.com/" },
                { name: "GPU: NVIDIA RTX 4060 8GB GDDR6", price: 310.00, store: "Coolmod", url: "https://www.coolmod.com/" },
                { name: "Placa Base: Gigabyte B760M DS3H", price: 109.00, store: "Amazon ES", url: "https://www.amazon.es/" },
                { name: "RAM: Corsair Vengeance 16GB DDR4", price: 46.00, store: "Neobyte", url: "https://www.neobyte.es/" },
                { name: "SSD: 1TB NVMe M.2 WD Black", price: 79.00, store: "Amazon ES", url: "https://www.amazon.es/" },
                { name: "Fuente: Gigabyte P650B Bronze", price: 59.90, store: "PcComponentes", url: "https://www.pccomponentes.com/" },
                { name: "Torre: Nox Hummer Nemesis", price: 65.00, store: "Coolmod", url: "https://www.coolmod.com/" }
            ]
        },
        {
            precio_base: 2450.00,
            cpuBrand: "amd",
            purpose: "gaming",
            gpuBrand: "nvidia",
            title: "PC Fijo ULTRA GAMING Entusiasta de Última Generación",
            parts: [
                { name: "CPU: AMD Ryzen 7 7800X3D (Top Gaming)", price: 399.00, store: "PcComponentes", url: "https://www.pccomponentes.com/" },
                { name: "GPU: NVIDIA RTX 4080 Super 16GB", price: 1120.00, store: "Coolmod", url: "https://www.coolmod.com/" },
                { name: "Placa Base: ASUS ROG Strix B650-A WiFi", price: 240.00, store: "Amazon ES", url: "https://www.amazon.es/" },
                { name: "RAM: 32GB DDR5 6000MHz G.Skill", price: 135.00, store: "Neobyte", price: 135.00, store: "Neobyte", url: "https://www.neobyte.es/" },
                { name: "SSD: 2TB Samsung 990 Pro NVMe", price: 180.00, store: "PcComponentes", url: "https://www.pccomponentes.com/" },
                { name: "Fuente: Seasonic Focus 850W ATX 3.0", price: 165.00, store: "Amazon ES", url: "https://www.amazon.es/" },
                { name: "Torre + Refr. Líquida 360mm Premium", price: 211.00, store: "Coolmod", url: "https://www.coolmod.com/" }
            ]
        }
    ],
    laptops: [
        { cpuBrand: "amd", purpose: "office", gpuBrand: "indiferente", title: "Portátil Ofimática AMD Ryzen Económico", specs: "Lenovo IdeaPad Slim 3 | AMD Ryzen 5 7520U | 16GB RAM | 512GB SSD | 15.6\" FHD", approxPrice: 449.00, bestStore: "Amazon ES", url: "https://www.amazon.es/" },
        { cpuBrand: "intel", purpose: "office", gpuBrand: "indiferente", title: "Portátil Ofimática Intel Core Ligero", specs: "ASUS Vivobook 15 | Intel Core i3-1215U | 16GB RAM | 512GB SSD | 15.6\" FHD", approxPrice: 399.00, bestStore: "PcComponentes", url: "https://www.pccomponentes.com/" },
        { cpuBrand: "amd", purpose: "gaming", gpuBrand: "nvidia", title: "Portátil Gaming Equilibrado AMD + RTX", specs: "ASUS TUF Gaming A15 | AMD Ryzen 5 7535HS | 16GB RAM | 512GB SSD | NVIDIA RTX 3050 4GB", approxPrice: 699.00, bestStore: "PcComponentes", url: "https://www.pccomponentes.com/" },
        { cpuBrand: "intel", purpose: "gaming", gpuBrand: "nvidia", title: "Portátil Gaming Avanzado Intel Core + RTX 4060", specs: "HP Victus 16 | Intel Core i7-13700H | 32GB RAM | 1TB SSD | NVIDIA RTX 4060 8GB", approxPrice: 1049.00, bestStore: "Coolmod", url: "https://www.coolmod.com/" },
        { cpuBrand: "intel", purpose: "gaming", gpuBrand: "nvidia", title: "Portátil ULTRA GAMING Rendimiento Extremo", specs: "MSI Raider GE78 | Intel Core i9-14900HX | 32GB DDR5 | 2TB SSD | NVIDIA RTX 4080 12GB", approxPrice: 2599.00, bestStore: "PcComponentes", url: "https://www.pccomponentes.com/" }
    ],
    mobile: [
        { name: "POCO X6 Pro 5G", desc: "Brutal rendimiento gaming en la gama media con pantalla Flow AMOLED.", antutu: 1390000, approxPrice: 319.00, bestStore: "PcComponentes", url: "https://www.pccomponentes.com/" },
        { name: "Xiaomi Redmi Note 13 Pro 5G", desc: "Cámara de 200MP muy equilibrada y excelente pantalla.", antutu: 605000, approxPrice: 255.00, bestStore: "Amazon ES", url: "https://www.amazon.es/" },
        { name: "Google Pixel 8a", desc: "Fotografía premium con IA de Google y 7 años de actualizaciones.", antutu: 1100000, approxPrice: 489.00, bestStore: "Amazon ES", url: "https://www.amazon.es/" }
    ]
};

const searchTypeSelect = document.getElementById('searchType');
const pcFormatSelect = document.getElementById('pcFormat');
const formatFilter = document.getElementById('formatFilter');
const advancedComputerFilters = document.getElementById('advancedComputerFilters');
const gpuFilterContainer = document.getElementById('gpuFilterContainer');
const purposeSelect = document.getElementById('purpose');

function ajustarVisibilidadFiltros() {
    const type = searchTypeSelect.value;
    const purpose = purposeSelect.value;

    if (type === 'pc') {
        formatFilter.classList.remove('hidden');
        advancedComputerFilters.classList.remove('hidden');
        if (purpose === 'gaming') {
            gpuFilterContainer.classList.remove('hidden');
        } else {
            gpuFilterContainer.classList.add('hidden');
        }
    } else {
        formatFilter.classList.add('hidden');
        advancedComputerFilters.classList.add('hidden');
        gpuFilterContainer.classList.add('hidden');
    }
}

searchTypeSelect.addEventListener('change', ajustarVisibilidadFiltros);
pcFormatSelect.addEventListener('change', ajustarVisibilidadFiltros);
purposeSelect.addEventListener('change', ajustarVisibilidadFiltros);
ajustarVisibilidadFiltros(); 

document.getElementById('btnSearch').addEventListener('click', async () => {
    const type = searchTypeSelect.value;
    const format = pcFormatSelect.value;
    const budget = parseFloat(document.getElementById('budget').value);
    const selectedCpu = document.getElementById('cpuBrand').value;
    const selectedPurpose = purposeSelect.value;
    const selectedGpu = document.getElementById('gpuBrand').value;
    
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');
    const storesList = document.getElementById('storesList');

    resultsGrid.innerHTML = '<p class="text-gray-400 text-center col-span-3 py-4 font-medium">Procesando catálogo y optimizando ratio rendimiento/precio...</p>';
    resultsContainer.classList.remove('hidden');
    
    let dataSource = fallbackDatabase;
    try {
        const response = await fetch('precios.json');
        if (response.ok) dataSource = await response.json();
    } catch (e) { console.log("Cargando backup de datos."); }

    resultsGrid.innerHTML = '';

    // 1. TORRES DE ESCRITORIO POR PIEZAS (ALGORITMO POR APROXIMACIÓN)
    if (type === 'pc' && format === 'desktop') {
        storesList.innerText = "PcComponentes, Coolmod, Neobyte, Amazon España";
        
        let opcionesValidas = dataSource.pc.filter(item => {
            const precioTotal = item.parts.reduce((sum, p) => sum + p.price, 0);
            const matchBudget = budget >= precioTotal;
            const matchCpu = (selectedCpu === 'indiferente') || (item.cpuBrand === selectedCpu);
            const matchPurpose = item.purpose === selectedPurpose;
            const matchGpu = (selectedPurpose === 'office') || (selectedGpu === 'indiferente') || (item.gpuBrand === selectedGpu);
            
            return matchBudget && matchCpu && matchPurpose && matchGpu;
        });

        if (opcionesValidas.length > 0) {
            opcionesValidas.sort((a, b) => {
                const priceA = a.parts.reduce((sum, p) => sum + p.price, 0);
                const priceB = b.parts.reduce((sum, p) => sum + p.price, 0);
                return priceB - priceA;
            });

            const config = opcionesValidas[0]; 
            let total = config.parts.reduce((sum, p) => sum + p.price, 0);
            let sobrante = budget - total;

            let html = `
                <div class="bg-gray-800 p-6 rounded-xl border border-gray-750 shadow-md md:col-span-3">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div>
                            <h3 class="text-xl font-bold text-blue-400">${config.title}</h3>
                            <p class="text-xs text-gray-500 mt-1">Se adapta perfectamente. Te sobran <strong class="text-emerald-400">${sobrante.toFixed(2)}€</strong> de tu presupuesto.</p>
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
                        <td class="p-3 text-right"><span class="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">${p.store}</span></td>
                    </tr>
                `;
            });
            html += `</tbody></table></div></div>`;
            resultsGrid.innerHTML = html;
        } else {
            resultsGrid.innerHTML = `<p class="text-amber-400 text-center col-span-3 py-4">Presupuesto insuficiente para armar una torre fija de esas especificaciones. Intenta subir el presupuesto mínimo (Mínimo aprox: 420€).</p>`;
        }

    // 2. FILTRADO PARA PORTÁTILES (ALGORITMO POR APROXIMACIÓN)
    } else if (type === 'pc' && format === 'laptop') {
        storesList.innerText = "Amazon España, PcComponentes, Coolmod, MediaMarkt";
        
        let laptopsDisponibles = dataSource.laptops.filter(l => {
            const matchBudget = budget >= l.approxPrice;
            const matchCpu = (selectedCpu === 'indiferente') || (l.cpuBrand === selectedCpu);
            const matchPurpose = l.purpose === selectedPurpose;
            const matchGpu = (selectedPurpose === 'office') || (selectedGpu === 'indiferente') || (l.gpuBrand === selectedGpu);
            return matchBudget && matchCpu && matchPurpose && matchGpu;
        });

        if (laptopsDisponibles.length > 0) {
            laptopsDisponibles.sort((a, b) => b.approxPrice - a.approxPrice);

            laptopsDisponibles.forEach(l => {
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
            resultsGrid.innerHTML = `<p class="text-amber-400 text-center col-span-3 py-4">No se han encontrado portátiles que se ajusten a tus filtros y se mantengan bajo tu presupuesto.</p>`;
        }

    // 3. SMARTPHONES CON RATIO POTENCIA (ANTUTU) / PRECIO AVANZADO
    } else if (type === 'mobile') {
        storesList.innerText = "Amazon España, BackMarket, PcComponentes, El Corte Inglés, Carrefour";
        let mobilesDisponibles = dataSource.mobile.filter(m => budget >= m.approxPrice);

        if (mobilesDisponibles.length > 0) {
            // Ordenar por Ratio Calidad/Precio Puro (Puntos AnTuTu por cada Euro gastado)
            mobilesDisponibles.sort((a, b) => {
                const ratioA = a.antutu / a.approxPrice;
                const ratioB = b.antutu / b.approxPrice;
                return ratioB - ratioA;
            });

            mobilesDisponibles.forEach((m, index) => {
                const puntosPorEuro = (m.antutu / m.approxPrice).toFixed(0);
                const esElMejor = index === 0;
                const badgeColor = esElMejor ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                const badgeText = esElMejor ? '👑 Máxima Calidad/Precio' : 'Smartphone Recomendado';

                resultsGrid.innerHTML += `
                    <div class="bg-gray-800 p-6 rounded-xl border ${esElMejor ? 'border-amber-500/50 shadow-amber-500/5' : 'border-gray-700'} flex flex-col justify-between shadow-md hover:scale-[1.01] transition-all duration-300">
                        <div>
                            <div class="flex justify-between items-center gap-2">
                                <span class="text-xs font-mono px-2 py-0.5 rounded border font-semibold uppercase ${badgeColor}">
                                    ${badgeText}
                                </span>
                                <span class="text-[10px] text-gray-500 font-mono">Rank #${index + 1}</span>
                            </div>
                            <h3 class="text-lg font-bold mt-4 mb-1 text-white">${m.name}</h3>
                            <p class="text-sm text-gray-400 line-clamp-2 mb-4">${m.desc}</p>
                            <div class="bg-gray-900/80 p-3 rounded-lg border border-gray-700/60 mb-4">
                                <div class="flex justify-between text-xs font-mono mb-1">
                                    <span class="text-gray-400">Potencia (AnTuTu):</span>
                                    <span class="text-blue-400 font-bold">${m.antutu.toLocaleString('es-ES')} pts</span>
                                </div>
                                <div class="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                    <div class="bg-blue-500 h-full" style="width: ${Math.min((m.antutu / 1600000) * 100, 100)}%"></div>
                                </div>
                                <div class="text-[10px] text-gray-500 text-right mt-1 font-mono">
                                    Ofrece ${puntosPorEuro} pts por cada 1€ invertido
                                </div>
                            </div>
                        </div>
                        <div class="border-t border-gray-700 pt-4">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-xs text-gray-400">Mejor precio</span>
                                <span class="text-2xl font-black 
