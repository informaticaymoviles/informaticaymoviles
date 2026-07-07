/*
 * informaticaymoviles.com - v5.0 (Búsqueda por Aproximación Dinámica y Filtro GPU)
 * Licencia: GNU GPLv3
 */

const fallbackDatabase = { pc: [], laptops: [], mobile: [] }; // Mismo esquema que precios.json

const searchTypeSelect = document.getElementById('searchType');
const pcFormatSelect = document.getElementById('pcFormat');
const formatFilter = document.getElementById('formatFilter');
const advancedComputerFilters = document.getElementById('advancedComputerFilters');
const gpuFilterContainer = document.getElementById('gpuFilterContainer');
const purposeSelect = document.getElementById('purpose');

// Control inteligente de la visibilidad de los filtros interactivos
function ajustarVisibilidadFiltros() {
    const type = searchTypeSelect.value;
    const format = pcFormatSelect.value;
    const purpose = purposeSelect.value;

    if (type === 'pc') {
        formatFilter.classList.remove('hidden');
        advancedComputerFilters.classList.remove('hidden');
        
        // El filtro de marca de GPU solo aparece si se busca un equipo enfocado a Gaming
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
ajustarVisibilidadFiltros(); // Disparo inicial

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

    resultsGrid.innerHTML = '<p class="text-gray-400 text-center col-span-3 py-4 font-medium">Buscando la configuración más potente para tu dinero...</p>';
    resultsContainer.classList.remove('hidden');
    
    let dataSource = fallbackDatabase;
    try {
        const response = await fetch('precios.json');
        if (response.ok) dataSource = await response.json();
    } catch (e) { console.log("Cargando backup interno."); }

    resultsGrid.innerHTML = '';

    // NUEVO ALGORITMO: FILTRAR Y ENCONTRAR LA MEJOR OPCIÓN DISPONIBLE (POR APROXIMACIÓN)
    
    // 1. TORRES DE ESCRITORIO
    if (type === 'pc' && format === 'desktop') {
        storesList.innerText = "PcComponentes, Coolmod, Neobyte, Amazon España";
        
        // Filtramos todos los PCs que coinciden con los gustos del usuario y no superan su dinero
        let opcionesValidas = dataSource.pc.filter(item => {
            const precioTotal = item.parts.reduce((sum, p) => sum + p.price, 0);
            const matchBudget = budget >= precioTotal;
            const matchCpu = (selectedCpu === 'indiferente') || (item.cpuBrand === selectedCpu);
            const matchPurpose = item.purpose === selectedPurpose;
            const matchGpu = (selectedPurpose === 'office') || (selectedGpu === 'indiferente') || (item.gpuBrand === selectedGpu);
            
            return matchBudget && matchCpu && matchPurpose && matchGpu;
        });

        if (opcionesValidas.length > 0) {
            // Ordenamos de mayor a menor precio para darle el mejor equipo posible dentro de su rango
            opcionesValidas.sort((a, b) => {
                const priceA = a.parts.reduce((sum, p) => sum + p.price, 0);
                const priceB = b.parts.reduce((sum, p) => sum + p.price, 0);
                return priceB - priceA;
            });

            const config = opcionesValidas[0]; // Elegimos el mejor ordenador disponible
            let total = config.parts.reduce((sum, p) => sum + p.price, 0);
            let sobrante = budget - total;

            let html = `
                <div class="bg-gray-800 p-6 rounded-xl border border-gray-750 shadow-md md:col-span-3">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div>
                            <h3 class="text-xl font-bold text-blue-400">${config.title}</h3>
                            <p class="text-xs text-gray-500 mt-1">Te sobran <strong class="text-emerald-400">${sobrante.toFixed(2)}€</strong> de tu presupuesto máximo.</p>
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
            resultsGrid.innerHTML = `<p class="text-amber-400 text-center col-span-3 py-4">Presupuesto demasiado bajo para armar una torre fija con esas características específicas (Prueba con un presupuesto mayor).</p>`;
        }

    // 2. FILTRADO PARA PORTÁTILES
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
            // Ordenamos para mostrar primero los más potentes que se queden cerca de su tope
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
            resultsGrid.innerHTML = `<p class="text-amber-400 text-center col-span-3 py-4">No se han encontrado portátiles recomendados con esa combinación por debajo de tu presupuesto.</p>`;
        }

    // 3. FILTRADO PARA SMARTPHONES
    } else if (type === 'mobile') {
        storesList.innerText = "Amazon España, BackMarket, PcComponentes, El Corte Inglés, Carrefour";
        let mobilesDisponibles = dataSource.mobile.filter(m => budget >= m.approxPrice);

        if (mobilesDisponibles.length > 0) {
            mobilesDisponibles.sort((a, b) => b.approxPrice - a.approxPrice);
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
                
