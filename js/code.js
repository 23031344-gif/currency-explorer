// ============================================================
// CURRENCY EXPLORER · STARTER PROJECT
// Archivo principal de trabajo para las misiones de JavaScript
// ============================================================

// 1. REFERENCIAS AL DOM
const cantidad = document.querySelector("#cantidad");
const origen = document.querySelector("#origen");
const destino = document.querySelector("#destino");
const btnConvertir = document.querySelector("#convertir");
const btnIntercambiar = document.querySelector("#intercambiar");
const resultado = document.querySelector("#resultado");
const resultadoTexto = document.querySelector("#resultadoTexto");
const detalleTasa = document.querySelector("#detalleTasa");
const btnHistorico = document.querySelector("#historico");
const grafica = document.querySelector("#grafica");

// 2. EVENTOS
btnConvertir.addEventListener("click", convertirMoneda);
btnIntercambiar.addEventListener("click", intercambiarMonedas);
btnHistorico.addEventListener("click", consultarHistorico);

// 3. FUNCIÓN PRINCIPAL
async function convertirMoneda() {
  // Misiones guiadas 1-3: ya existe un flujo mínimo funcional EUR -> USD.
  // A partir de la Misión 4 debes convertirlo en una solución dinámica.

  const valor = Number(cantidad.value);

  // TODO · MISIÓN 07: sustituir esta validación mínima por una validación completa.
  if (!Number.isFinite(valor) || valor <= 0) {
    mostrarError("Escribe una cantidad mayor que cero.");
    return;
  }

  // MISIÓN 04: se leen las monedas elegidas por el usuario en los <select>.
  const monedaOrigen = origen.value;
  const monedaDestino = destino.value;

  const url = `https://api.frankfurter.dev/v2/rate/${monedaOrigen}/${monedaDestino}`;

  try {
    // MISIÓN 08: estado de carga mientras se espera la respuesta de la API.
    setCargando(true);

    const respuesta = await fetch(url);

    // TODO · MISIÓN 09: comprobar response.ok y lanzar un error si corresponde.
    const datos = await respuesta.json();

    const conversion = valor * datos.rate;

    // MISIÓN 05: resultado formateado con separador de miles y 2 decimales.
    const formato = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

    resultado.classList.remove("error");
    resultadoTexto.textContent =
      `${valor.toLocaleString("es-MX", formato)} ${monedaOrigen} = ${conversion.toLocaleString("es-MX", formato)} ${monedaDestino}`;
    detalleTasa.textContent =
      `1 ${monedaOrigen} = ${datos.rate} ${monedaDestino} · Actualizado: ${datos.date}`;

  } catch (error) {
    // TODO · MISIÓN 09: mejora el mensaje y analiza qué errores pueden llegar aquí.
    mostrarError("No fue posible completar la consulta.");
    console.error(error);
  } finally {
    // MISIÓN 08: se ejecuta siempre (éxito o error) para reactivar los botones.
    setCargando(false);
  }
}

// MISIÓN 06: intercambiar monedas y recalcular.
function intercambiarMonedas() {
  const temporal = origen.value;   // 1) guardar temporalmente el valor de origen
  origen.value = destino.value;    // 2) origen toma el valor de destino
  destino.value = temporal;        //    destino toma el valor guardado
  convertirMoneda();               // 3) volver a calcular con las monedas invertidas
}

// MISIÓN 11: consulta de la serie temporal de los últimos 12 meses.
async function consultarHistorico() {
  if (origen.value === destino.value) {
    grafica.innerHTML = `<p class="estado">Elige dos monedas distintas.</p>`;
    return;
  }

  const desde = new Date();
  desde.setFullYear(desde.getFullYear() - 1);
  const fechaInicio = desde.toISOString().slice(0, 10);

  const url = `https://api.frankfurter.dev/v2/rates?base=${origen.value}&quotes=${destino.value}&from=${fechaInicio}&group=month`;

  btnHistorico.disabled = true;
  grafica.innerHTML = `<p class="estado">Consultando...</p>`;

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    const datos = await respuesta.json();

    // La respuesta es un arreglo: un objeto por mes. map() separa los dos ejes.
    const fechas = datos.map(item => item.date);
    const tasas = datos.map(item => item.rate);

    if (tasas.length === 0) {
      grafica.innerHTML = `<p class="estado">No hay datos para ese periodo.</p>`;
      return;
    }

    dibujarGrafica(fechas, tasas);
  } catch (error) {
    grafica.innerHTML = `<p class="estado">No fue posible cargar el histórico.</p>`;
    console.error(error);
  } finally {
    btnHistorico.disabled = false;
  }
}

// MISIÓN 11: dibuja la gráfica de líneas como SVG, sin librerías.
function dibujarGrafica(fechas, tasas) {
  const ancho = 600, alto = 260, margen = 45;
  const min = Math.min(...tasas);
  const max = Math.max(...tasas);
  const rango = max - min || 1;
  const pasos = Math.max(tasas.length - 1, 1);

  const puntos = tasas.map((tasa, i) => {
    const x = margen + (i / pasos) * (ancho - 2 * margen);
    const y = alto - margen - ((tasa - min) / rango) * (alto - 2 * margen);
    return { x, y, tasa, fecha: fechas[i] };
  });

  const linea = puntos.map(p => `${p.x},${p.y}`).join(" ");
  const circulos = puntos
    .map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#16758b"><title>${p.fecha}: ${p.tasa}</title></circle>`)
    .join("");

  grafica.innerHTML = `
    <svg viewBox="0 0 ${ancho} ${alto}" role="img"
         aria-label="Evolución de ${origen.value} a ${destino.value}">
      <polyline points="${linea}" fill="none" stroke="#16758b" stroke-width="3"/>
      ${circulos}
      <text x="${margen}" y="${alto - 15}" font-size="12" fill="#667785">${fechas[0]}</text>
      <text x="${ancho - margen}" y="${alto - 15}" font-size="12" fill="#667785" text-anchor="end">${fechas[fechas.length - 1]}</text>
      <text x="5" y="${margen}" font-size="12" fill="#667785">${max}</text>
      <text x="5" y="${alto - margen}" font-size="12" fill="#667785">${min}</text>
    </svg>`;
}

// 4. UTILIDADES DE INTERFAZ
function mostrarError(mensaje) {
  resultado.classList.add("error");
  resultadoTexto.textContent = mensaje;
  detalleTasa.textContent = "Revisa los datos e inténtalo nuevamente.";
}

// MISIÓN 08: activa o desactiva el estado visual de carga.
function setCargando(cargando) {
  btnConvertir.disabled = cargando;
  btnIntercambiar.disabled = cargando;
  btnConvertir.textContent = cargando ? "Consultando..." : "Convertir";

  if (cargando) {
    resultado.classList.remove("error");
    resultadoTexto.textContent = "Consultando...";
    detalleTasa.textContent = "Obteniendo el tipo de cambio desde la API.";
  }
}

// PISTA PARA EL RETO:
// origen.value        -> moneda seleccionada como origen
// destino.value       -> moneda seleccionada como destino
// cantidad.value      -> texto escrito en el input
// Number(...)         -> convierte texto a número
// response.ok         -> indica si la respuesta HTTP fue satisfactoria
// resultado.textContent -> permite modificar texto del DOM
