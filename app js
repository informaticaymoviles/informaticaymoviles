// Base de datos local simulada (En producción, esto se puede alimentar de una API o scraping)
const database = {
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
            { name: "CPU: Intel Core i5-13400F o Ryzen 5 7600", price: 200, store: "Neobyte" },
            { name: "GPU: NVIDIA RTX 4060 Ti 16GB / RX 7700 XT", price: 450, store: "PcComponentes" },
            { name: "Placa Base: B760M / B650", price: 130, store: "Amazon ES" },
            { name: "RAM: 32GB DDR5 6000MHz", price: 110, store: "Coolmod" },
            { name: "SSD: 2TB Kingston NV2", price: 120, store: "Amazon ES" },
            { name: "Fuente: Gigabyte UD750GM Gold", price: 95, store: "PcComponentes" },
            { name: "Torre + Refrigeración líquida", price: 140, store: "Coolmod" }
        ]}
    ],
    mobile: [
        { budgetMin: 150, budgetMax: 250, name: "Xiaomi Redmi Note 13 / Samsung Galaxy A15", desc: "El rey de la gama de entrada. Pantalla AMOLED y buena batería.", approxPrice: 190, bestStore: "Amazon ES / Carrefour" },
        { budgetMin: 251, budgetMax: 400, name: "POCO X6 Pro 5G / Nothing Phone (2a)", desc: "Rendimiento brutal, ideal para juegos y fluidez total a precio contenido.", approxPrice: 340, bestStore: "PcComponentes" },
        { budgetMin: 401, budgetMax: 650, name: "Google Pixel 8a / OnePlus 12R", desc: "La mejor cámara del mercado en este rango de precio y software limpio.", approxPrice: 510, bestStore: "Amazon ES / El Corte Inglés" },
        { budgetMin: 651, budgetMax: 1200, name: "iPhone 15 (BackMarket - Recondicionado) / Samsung Galaxy S24", desc: "Gama alta premium. Rendimiento top, materiales excelentes.", approxPrice: 820, bestStore: "BackMarket / MediaMarkt" }
    ]
};

document.getElementById('btnSearch').addEventListener('click', () => {
    const type = document.getElementById('searchType').value;
    const budget = parseFloat(document.getElementById('budget').value);
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');
    const storesList = document.getElementById('storesList');

    // Limpiar resultados anteriores
    resultsGrid.innerHTML = '';
    
    if (type === 'pc') {
        storesList.innerText = "PcComponentes, MediaMarkt, Coolmod, Neobyte, Amazon España";
        const config = database.pc.find(item => budget >= item.budgetMin && budget <= item.budgetMax);
        
        if (config) {
            let totalConfigPrice = config.parts.reduce((sum, p) => sum + p.price, 0);
            
            // Tarjeta Principal del Setup
            let cardHtml = `
                <div class="bg-gray-800 p-6 rounded-xl border border-gray-750 shadow-md md:col-span-3">
                    <h3 class="text-xl font-bold text-blue-400 mb-2">${config.title}</h3>
                    <p class="text-sm text-gray-400 mb-4">Costo estimado total: <strong class="text-white">${totalConfigPrice}€</strong> (Ajustado a tu presupuesto de ${budget}€)</p>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-gray-300">
                            <thead class="text-xs uppercase bg-gray-700 text-gray-400">
                                <tr>
                                    <th class="p-3">Componente</th>
                                    <th class="p-3">Precio Ref.</th>
                                    <th class="p-3">Tienda recomendada</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            config.parts.forEach(part => {
                cardHtml += `
                    <tr class="border-b border-gray-700 hover:bg-gray-750">
                        <td class="p-3 font-medium text-white">${part.name}</td>
                        <td class="p-3">${part.price}€</td>
                        <td class="p-3 text-emerald-400 font-semibold">${part.store}</td>
                    </tr>
                `;
            });
            
            cardHtml += `</tbody></table></div></div>`;
            resultsGrid.innerHTML = cardHtml;
        } else {
            resultsGrid.innerHTML = `<p class="text-amber-400 md:col-span-3 text-center">No encontramos un presupuesto preconfigurado exacto para ese rango. Prueba con 450€, 800€ o 1200€.</p>`;
        }

    } else if (type === 'mobile') {
        storesList.innerText = "Amazon España, BackMarket, PcComponentes, El Corte Inglés, Carrefour";
        const mobiles = database.mobile.filter(m => budget >= m.budgetMin); // Muestra opciones viables por debajo o igual al presupuesto
        
        if (mobiles.length > 0) {
            mobiles.forEach(m => {
                const cardHtml = `
                    <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col justify-between shadow-md">
                        <div>
                            <span class="text-xs bg-emerald-500/10 text-emerald-400 font-mono px-2 py-1 rounded border border-emerald-500/20">Recomendado</span>
                            <h3 class="text-lg font-bold mt-3 mb-2 text-white">${m.name}</h3>
                            <p class="text-sm text-gray-400 mb-4">${m.desc}</p>
                        </div>
                        <div class="border-t border-gray-700 pt-4 mt-4">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-xs text-gray-500">Precio aprox.</span>
                                <span class="text-xl font-black text-emerald-400">${m.approxPrice}€</span>
                            </div>
                            <div class="text-xs text-gray-400">
                                Mejor opción en: <span class="text-blue-400 font-semibold">${m.bestStore}</span>
                            </div>
                        </div>
                    </div>
                `;
                resultsGrid.innerHTML += cardHtml;
            });
        } else {
            resultsGrid.innerHTML = `<p class="text-amber-400 md:col-span-3 text-center">Presupuesto demasiado bajo para smartphones recomendados actuales (Mínimo 150€).</p>`;
        }
    }

    resultsContainer.classList.remove('hidden');
});
