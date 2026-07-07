/*
 * informaticaymoviles.com - v7.0 (PassMark Core Global Engine Integration)
 * Licencia: GNU GPLv3
 */

const fallbackDatabase = { pc: [], laptops: [], mobile: [] };

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

    resultsGrid.innerHTML = '<p class="text-gray-400 text-center col-span-3 py-4 font-medium">Ejecutando algoritmo de rendimiento indexado (PassMark/AnTuTu)...</p>';
    resultsContainer.classList.remove('hidden');
    
    let dataSource = fallbackDatabase;
    try {
        const response = await fetch('precios.json');
        if (response.ok) dataSource = await response.json();
    } catch (e) { console.log("Cargando backup de datos."); }

    resultsGrid.innerHTML = '';

    // ALGORITMO DE SELECCIÓN POR RATIO TÉCNICO COMPARTIDO

    // 1. TORRES DE ESCRITORIO POR PIEZAS
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
            // ALGORITMO PASSMARK: Ordena de mayor a menor según el rendimiento por euro (CPU Mark + GPU Mark) / Coste
            opcionesValidas.sort((a, b) => {
                const precioA = a.parts.reduce((sum, p) => sum + p.price, 0);
                const precioB = b.parts.reduce((sum, p) => sum + p.price, 0);
                const ratioA = (a.passmark_cpu + a.passmark_gpu) / precioA;
                const ratioB = (b.passmark_cpu + b.passmark_gpu) / precioB;
                return ratioB - ratioA;
            });

            const config = opcionesValidas[0]; 
            let total = config.parts.reduce((sum, p) => sum + p.price, 0);
            let sobrante = budget - total;
            const passmarkTotal = config.passmark_cpu + config.passmark_gpu;

            let html = `
                <div class="bg-gray-800 p-6 rounded-xl border border-amber-500/30 shadow-md md:col-span-3">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div>
                            <span class="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono px-2 py-0.5 rounded font-bold">👑 Configuración Óptima por Rendimiento</span>
                            <h3 class="text-xl font-bold text-white mt-2">${config.title}</h3>
                            <p class="text-xs text-gray-400 mt-1">Sobrante de tu presupuesto: <strong class="text-emerald-400">${sobrante.toFixed(2)}€</strong></p>
                        </div>
                        <div class="text-right">
                            <span class="text-2xl font-black text-emerald-400 bg-gray-900/50 px-4 py-2 rounded border border-gray-700 block">${total.toFixed(2)}€</span>
                            <span class="text-[10px] text-gray-500 font-mono mt-1 block">PassMark Total: ${passmarkTotal.toLocaleString()} pts</span>
                        </div>
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
            resultsGrid.innerHTML = `<p class="text-amber-400 text-center col-span-3 py-4">Presupuesto insuficiente para armar una torre fija bajo estos criterios en el mercado español.</p>`;
        }

    // 2. ORDENADORES PORTÁTILES (MÁXIMO PASSMARK POR EURO)
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
            // Ordenamos por rendimiento PassMark combinado por cada euro
            laptopsDisponibles.sort((a, b) => {
                const ratioA = (a.passmark_cpu + a.passmark_gpu) / a.approxPrice;
                const ratioB = (b.passmark_cpu + b.passmark_gpu) / b.approxPrice;
                return ratioB - ratioA;
            });

            laptopsDisponibles.forEach((l, index) => {
                const esElMejor = index === 0;
                const ptsTotal = l.passmark_cpu + l.passmark_gpu;
                const ptsPorEuro = (ptsTotal / l.approxPrice).toFixed(0);

                resultsGrid.innerHTML += `
                    <div class="bg-gray-800 p-6 rounded-xl border ${esElMejor ? 'border-amber-500/50 shadow-amber-500/5' : 'border-gray-700'} flex flex-col justify-between shadow-md hover:border-blue-500/50 transition-all duration-300">
                        <div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs ${esElMejor ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'} font-mono px-2 py-0.5 rounded border font-semibold uppercase">
                                    ${esElMejor ? '👑 Top Potencia/Euro' : l.purpose}
                                </span>
                                <span class="text-xs text-gray-500 font-semibold font-mono uppercase">${l.cpuBrand}</span>
                            </div>
                            <h3 class="text-lg font-bold mt-3 mb-1 text-white">${l.title}</h3>
                            <p class="text-xs text-gray-400 font-mono bg-gray-900/50 p-2.5 rounded border border-gray-700/50 mt-2">${l.specs}</p>
                            
                            <div class="bg-gray-900/40 p-2.5 rounded-lg border border-gray-750 mt-3 text-[11px] font-mono">
                                <div class="flex justify-between text-gray-400 mb-1">
                                    <span>PassMark CPU:</span><span class="text-blue-400">${l.passmark_cpu.toLocaleString()}</span>
                                </div>
                                <div class="flex justify-between text-gray-400">
                                    <span>PassMark GPU:</span><span class="text-purple-400">${l.passmark_gpu.toLocaleString()}</span>
                                </div>
                                <div class="text-right text-gray-500 text-[10px] border-t border-gray-700/60 mt-1.5 pt-1">
                                    Rendimiento: ${ptsPorEuro} pts / 1€
                                </div>
                            </div>
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

    // 3. SMARTPHONES CON RATIO ANTUTU / PRECIO (Mantenido)
    } else if (type === 'mobile') {
        storesList.innerText = "Amazon España, BackMarket, PcComponentes, El Corte Inglés, Carrefour";
        let mobilesDisponibles = dataSource.mobile.filter(m => budget >= m.approxPrice);

        if (mobilesDisponibles.length > 0) {
            mobilesDisponibles.sort((a, b) => (b.antutu / b.approxPrice) - (a.antutu / a.approxPrice));

            mobilesDisponibles.forEach((m, index) => {
                const puntosPorEuro = (m.antutu / m.approxPrice).toFixed(0);
                const esElMejor = index === 0;
                const badgeColor = esElMejor ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                
                resultsGrid.innerHTML += `
                    <div class="bg-gray-800 p-6 rounded-xl border ${esElMejor ? 'border-amber-500/50 shadow-amber-500/5' : 'border-gray-700'} flex flex-col justify-between shadow-md hover:scale-[1.01] transition-all duration-300">
                        <div>
                            <div class="flex justify-between items-center gap-2">
                                <span class="text-xs font-mono px-2 py-0.5 rounded border font-semibold uppercase ${badgeColor}">
                                    ${esElMejor ? '👑 Máxima Calidad/Precio' : 'Smartphone'}
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
                                    Ofrece ${puntosPorEuro} pts por cada 1€
                                </div>
                            </div>
                        </div>
                        <div class="border-t border-gray-700 pt-4">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-xs text-gray-400">Mejor precio</span>
                                <span class="text-2xl font-black text-emerald-400">${m.approxPrice.toFixed(2)}€</span>
                            </div>
                            <a href="${m.url}" target="_blank" rel="noopener noreferrer" class="block text-center w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded text-xs transition">
                                Ver en ${m.bestStore} ↗
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
                                                                                                   
