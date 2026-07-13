const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".form-panel");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    panels.forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`form-${tab.dataset.target}`).classList.add("active");
    document.getElementById("results").innerHTML = "";
  });
});

const useCaseSelect = document.getElementById("pc-use-case");
const gpuWrapper = document.getElementById("pc-gpu-brand-wrapper");
useCaseSelect.addEventListener("change", () => {
  gpuWrapper.style.display = useCaseSelect.value === "gaming" ? "block" : "none";
});

async function postJSON(url, body) {
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`Error ${resp.status}`);
  return resp.json();
}

function renderCard(item) {
  const valueScore = item.value_score !== null ? item.value_score.toFixed(4) : "—";
  const specs = [];
  if (item.ram_gb) specs.push(`${item.ram_gb} GB RAM`);
  if (item.storage_gb) specs.push(`${item.storage_gb} GB almacenamiento`);
  if (item.benchmark_score) specs.push(`Benchmark: ${Math.round(item.benchmark_score)}`);

  return `
    <div class="result-card">
      <h3>${item.name}</h3>
      <div class="meta">${item.price_eur.toFixed(2)} € · ${item.source} · puntos/€: ${valueScore}</div>
      <div class="meta">${specs.join(" · ")}</div>
      <a href="${item.url}" target="_blank" rel="nofollow noopener">Ver en ${item.source} →</a>
    </div>`;
}

function renderList(items, emptyMessage) {
  const results = document.getElementById("results");
  if (!items || items.length === 0) {
    results.innerHTML = `<p>${emptyMessage}</p>`;
    return;
  }
  results.innerHTML = items.map(renderCard).join("");
}

document.getElementById("pc-submit").addEventListener("click", async () => {
  const body = {
    budget: Number(document.getElementById("pc-budget").value),
    form_factor: document.getElementById("pc-form-factor").value,
    cpu_brand: document.getElementById("pc-cpu-brand").value,
    use_case: document.getElementById("pc-use-case").value,
    gpu_brand: document.getElementById("pc-gpu-brand").value,
  };
  const data = await postJSON("/api/pc-builder", body);
  const results = document.getElementById("results");

  if (Array.isArray(data)) {
    renderList(data, "No se han encontrado portátiles dentro de ese presupuesto.");
  } else {
    let html = "<h2>Mejores CPUs</h2>" + (data.cpus.length ? data.cpus.map(renderCard).join("") : "<p>Sin resultados.</p>");
    if (body.use_case === "gaming") {
      html += "<h2>Mejores gráficas</h2>" + (data.gpus.length ? data.gpus.map(renderCard).join("") : "<p>Sin resultados.</p>");
    }
    html += `<p class="meta">${data.note}</p>`;
    results.innerHTML = html;
  }
});

document.getElementById("phone-submit").addEventListener("click", async () => {
  const body = {
    budget: Number(document.getElementById("phone-budget").value),
    os: document.getElementById("phone-os").value,
  };
  const data = await postJSON("/api/phones", body);
  renderList(data, "No se han encontrado móviles dentro de ese presupuesto.");
});

document.getElementById("tablet-submit").addEventListener("click", async () => {
  const body = { budget: Number(document.getElementById("tablet-budget").value) };
  const data = await postJSON("/api/tablets", body);
  renderList(data, "No se han encontrado tablets dentro de ese presupuesto.");
});
