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

// 2. EVENTOS
btnConvertir.addEventListener("click", convertirMoneda);
btnIntercambiar.addEventListener("click", intercambiarMonedas);

// 3. FUNCIÓN PRINCIPAL
async function convertirMoneda() {
  // Misiones guiadas 1-3: ya existe un flujo mínimo funcional EUR -> USD.
  // A partir de la Misión 4 debes convertirlo en una solución dinámica.

  // MISIÓN 07: validación completa de la cantidad y de las monedas.
  const texto = cantidad.value.trim();

  if (texto === "") {
    mostrarError("Escribe una cantidad.");
    return;
  }

  const valor = Number(texto);

  if (!Number.isFinite(valor)) {
    mostrarError("La cantidad no es un número válido.");
    return;
  }

  if (valor <= 0) {
    mostrarError("La cantidad debe ser mayor que cero.");
    return;
  }

  if (origen.value === destino.value) {
    mostrarError("Elige dos monedas distintas.");
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

    // MISIÓN 09: fetch no lanza error con 404 o 500, hay que revisarlo a mano.
    if (!respuesta.ok) {
      const fallo = new Error(`HTTP ${respuesta.status}`);
      fallo.status = respuesta.status;
      throw fallo;
    }

    const datos = await respuesta.json();

    // MISIÓN 09: comprobar que la API devolvió la tasa esperada.
    if (typeof datos.rate !== "number") {
      throw new Error("Respuesta inesperada de la API");
    }

    const conversion = valor * datos.rate;

    // MISIÓN 05: resultado formateado con separador de miles y 2 decimales.
    const formato = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

    resultado.classList.remove("error");
    resultadoTexto.textContent =
      `${valor.toLocaleString("es-MX", formato)} ${monedaOrigen} = ${conversion.toLocaleString("es-MX", formato)} ${monedaDestino}`;
    detalleTasa.textContent =
      `1 ${monedaOrigen} = ${datos.rate} ${monedaDestino} · Actualizado: ${datos.date}`;

} catch (error) {
    // MISIÓN 09: se distingue el tipo de fallo para dar un mensaje útil.
    if (error.status === 404 || error.status === 422) {
      mostrarError("Esa combinación de monedas no está disponible.");
    } else if (error.status) {
      mostrarError(`El servidor respondió con un error (${error.status}). Inténtalo más tarde.`);
    } else if (error instanceof TypeError) {
      mostrarError("No hay conexión con el servicio. Revisa tu internet.");
    } else {
      mostrarError("No fue posible completar la consulta.");
    }
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
