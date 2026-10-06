// === SISTEMA DE SEGURIDAD INTELIGENTE (REGISTRO / LOGIN) ===
// Intentar buscar si ya existe un usuario y contraseña creados en el dispositivo
let cuentaCreada = JSON.parse(localStorage.getItem('superstock_cuenta_maestra')) || null;

// Selectores del Sistema de Seguridad
const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('login-error');
const btnLogout = document.getElementById('btnLogout');
const displayUserName = document.getElementById('display-user-name');

const loginTitle = document.getElementById('login-title');
const loginDescription = document.getElementById('login-description');
const btnLoginSubmit = document.getElementById('btn-login-submit');

// Función automática para verificar el estado de la cuenta al abrir la app
function inicializarSeguridad() {
    if (!loginOverlay) return;

    // Si ya hay una cuenta registrada en la memoria, cambiar al modo "Iniciar Sesión"
    if (cuentaCreada) {
        if (loginTitle) loginTitle.textContent = "SuperStock Login";
        if (loginDescription) loginDescription.textContent = "Introduce tus credenciales para acceder al sistema del supermercado.";
        if (btnLoginSubmit) btnLoginSubmit.textContent = "🔓 Entrar al Sistema";
    } else {
        // Si no hay cuenta, forzar el modo "Configuración Inicial por primera vez"
        if (loginTitle) loginTitle.textContent = "Crear Administrador";
        if (loginDescription) loginDescription.textContent = "Detectamos que es tu primera vez aquí. Crea las credenciales maestras de tu supermercado.";
        if (btnLoginSubmit) btnLoginSubmit.textContent = "💾 Registrar y Activar";
    }
    // Mantener la sesión abierta si el usuario no cerró sesión la última vez
    const sesionActiva = localStorage.getItem('superstock_sesion_activa');
    const usuarioGuardado = localStorage.getItem('superstock_usuario_actual');
    
    if (sesionActiva === 'true' && loginOverlay) {
        loginOverlay.classList.add('logged-in');
        if (displayUserName && usuarioGuardado) displayUserName.textContent = usuarioGuardado;
    }
}

// Ejecutar la inicialización de seguridad apenas cargue la página
document.addEventListener('DOMContentLoaded', inicializarSeguridad);

// === CONTROL DEL FORMULARIO DE SEGURIDAD (GUARDAR O VALIDAR) ===
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userInput = document.getElementById('login-user').value.trim();
        const passInput = document.getElementById('login-pass').value;

        // CASO A: Es la primera vez y el usuario va a CREAR su cuenta
        if (!cuentaCreada) {
            if (passInput.length < 4) {
                if (loginError) {
                    loginError.textContent = "⚠️ La contraseña debe tener al menos 4 caracteres.";
                    loginError.style.display = 'block';
                }
                return;
            }

            // Guardar la cuenta de forma permanente en el almacenamiento del dispositivo
            cuentaCreada = { usuario: userInput, contrasena: passInput };
            localStorage.setItem('superstock_cuenta_maestra', JSON.stringify(cuentaCreada));

            // Iniciar la sesión automáticamente tras el registro exitoso
            localStorage.setItem('superstock_sesion_activa', 'true');
            localStorage.setItem('superstock_usuario_actual', userInput);
            
            if (loginOverlay) loginOverlay.classList.add('logged-in');
            if (displayUserName) displayUserName.textContent = userInput;
            if (loginError) loginError.style.display = 'none';
            
            alert(`🎉 ¡Cuenta activada con éxito! Tu usuario es "${userInput}". Guarda bien tu contraseña.`);
            loginForm.reset();
            inicializarSeguridad(); // Actualiza los textos para la próxima vez
            return;
        }

        // CASO B: La cuenta ya existe y el usuario está INICIANDO SESIÓN tradicional
        if (userInput === cuentaCreada.usuario && passInput === cuentaCreada.contrasena) {
            localStorage.setItem('superstock_sesion_activa', 'true');
            localStorage.setItem('superstock_usuario_actual', userInput);
            
            if (loginOverlay) loginOverlay.classList.add('logged-in');
            if (displayUserName) displayUserName.textContent = userInput;
            if (loginError) loginError.style.display = 'none';
            
            loginForm.reset();
        } else {
            // Mostrar error si el usuario o la clave no coinciden con la cuenta guardada
            if (loginError) {
                loginError.textContent = "⚠️ Usuario o contraseña incorrectos.";
                loginError.style.display = 'block';
            }
        }
    });
}

// === CONTROL DE CIERRE DE SESIÓN (BLOQUEAR APLICACIÓN) ===
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        const confirmarSalir = confirm("🔒 ¿Deseas cerrar sesión y bloquear el sistema de inventario?");
        if (confirmarSalir) {
            localStorage.removeItem('superstock_sesion_activa');
            localStorage.removeItem('superstock_usuario_actual');
            if (loginOverlay) loginOverlay.classList.remove('logged-in');
            loginForm.reset();
            inicializarSeguridad(); // Asegura que los textos digan "SuperStock Login"
        }
    });
}


// === CONTROL DE ALMACENAMIENTO (LOCALSTORAGE) ===
let inventario = JSON.parse(localStorage.getItem('superstock_inventario')) || [];
let historialEntradas = JSON.parse(localStorage.getItem('superstock_entradas')) || [];
let historialSalidas = JSON.parse(localStorage.getItem('superstock_salidas')) || [];

// === SELECTORES DE LA INTERFAZ ===
const modal = document.getElementById('productModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const productForm = document.getElementById('productForm');

// Botones de Navegación Lateral
const navInventory = document.getElementById('nav-inventory');
const navEntradas = document.getElementById('nav-entradas');
const navSalidas = document.getElementById('nav-salidas');
const navAlerts = document.getElementById('nav-alerts');
const menuItems = document.querySelectorAll('.menu-item');

// Secciones / Vistas Visuales
const viewInventory = document.getElementById('inventory-section');
const viewAlerts = document.getElementById('alerts-section');
const viewEntradas = document.getElementById('entradas-section');
const viewSalidas = document.getElementById('salidas-section');
const viewReportes = document.getElementById('reportes-section');
const btnPrintReport = document.getElementById('btnPrintReport');


// Elementos de Listas e Historiales
const inventoryTableBody = document.getElementById('inventory-table-body');
const stockAlertsList = document.getElementById('stock-alerts-list');
const expiryAlertsList = document.getElementById('expiry-alerts-list');
const entradaSelect = document.getElementById('entrada-select');
const salidaSelect = document.getElementById('salida-select');
const entradaLogList = document.getElementById('entrada-log-list');
const salidaLogList = document.getElementById('salida-log-list');

// Formularios de Transacción
const entradaForm = document.getElementById('entradaForm');
const salidaForm = document.getElementById('salidaForm');

// Contadores del Dashboard
const statTotal = document.getElementById('stat-total');
const statLow = document.getElementById('stat-low');
const statCategories = document.getElementById('stat-categories');
const searchInput = document.getElementById('search-input');

// === SISTEMA DE NAVEGACIÓN LATERAL ===
function mostrarVista(vistaMostrar, menuActivo) {
    viewInventory.classList.add('hidden');
    viewAlerts.classList.add('hidden');
    viewEntradas.classList.add('hidden');
    viewSalidas.classList.add('hidden');
    if (viewReportes) viewReportes.classList.add('hidden'); // <--- ¡Añade esta línea aquí!
    menuItems.forEach(item => item.classList.remove('active'));

    vistaMostrar.classList.remove('hidden');
    menuActivo.classList.add('active');

    // Al cambiar de pestaña, refrescamos los desplegables e historiales
    actualizarDesplegablesProductos();
    renderizarHistoriales();
}

navInventory.addEventListener('click', (e) => { e.preventDefault(); mostrarVista(viewInventory, navInventory); });
navAlerts.addEventListener('click', (e) => { e.preventDefault(); mostrarVista(viewAlerts, navAlerts); });
navEntradas.addEventListener('click', (e) => { e.preventDefault(); mostrarVista(viewEntradas, navEntradas); });
navSalidas.addEventListener('click', (e) => { e.preventDefault(); mostrarVista(viewSalidas, navSalidas); });

// Activar navegación real para la pestaña de Reportes
const navReportes = document.getElementById('nav-reportes');
if (navReportes) {
    navReportes.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarVista(viewReportes, navReportes);
        calcularYGenerarReporte(); // Ejecuta las estadísticas financieras al entrar
    });
}


// === CONTROL DEL MODAL EMERGENTE ===
openModalBtn.addEventListener('click', () => modal.classList.add('active'));
function cerrarModal() { modal.classList.remove('active'); productForm.reset(); }
closeModalBtn.addEventListener('click', cerrarModal);
cancelBtn.addEventListener('click', cerrarModal);
window.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });

// === ACTUALIZAR SELECTS DE PRODUCTOS ===
function actualizarDesplegablesProductos() {
    if (!entradaSelect || !salidaSelect) return;
    
    entradaSelect.innerHTML = '<option value="">-- Elige un producto --</option>';
    salidaSelect.innerHTML = '<option value="">-- Elige un producto --</option>';

    inventario.forEach((prod, index) => {
        const optionText = `${prod.nombre} (${prod.codigo}) - Actual: ${prod.stock} uds`;
        
        const optEntrada = document.createElement('option');
        optEntrada.value = index;
        optEntrada.textContent = optionText;
        entradaSelect.appendChild(optEntrada);

        const optSalida = document.createElement('option');
        optSalida.value = index;
        optSalida.textContent = optionText;
        salidaSelect.appendChild(optSalida);
    });
}
// === RENDERIZAR HISTORIALES DE MOVIMIENTOS ===
function renderizarHistoriales() {
    if (!entradaLogList || !salidaLogList) return;
    entradaLogList.innerHTML = '';
    salidaLogList.innerHTML = '';

    if (historialEntradas.length === 0) {
        entradaLogList.innerHTML = '<p style="color:var(--text-muted); font-size:13px;">No hay registros de entradas.</p>';
    } else {
        historialEntradas.slice().reverse().forEach(log => {
            const item = document.createElement('div');
            item.className = 'alert-item';
            item.style.padding = '10px';
            item.innerHTML = `
                <div class="alert-details">
                    <h4 style="color:var(--success)">+ ${log.cantidad} uds</h4>
                    <p style="font-size:11px;">${log.producto} | ${log.nota || 'S/N'}</p>
                </div>
                <span style="font-size:11px; color:var(--text-muted)">${log.fecha}</span>
            `;
            entradaLogList.appendChild(item);
        });
    }

    if (historialSalidas.length === 0) {
        salidaLogList.innerHTML = '<p style="color:var(--text-muted); font-size:13px;">No hay registros de salidas.</p>';
    } else {
        historialSalidas.slice().reverse().forEach(log => {
            const item = document.createElement('div');
            item.className = 'alert-item';
            item.style.padding = '10px';
            item.innerHTML = `
                <div class="alert-details">
                    <h4 style="color:var(--danger)">- ${log.cantidad} uds</h4>
                    <p style="font-size:11px;">${log.producto} (<em style="color:var(--warning)">${log.motivo}</em>)</p>
                </div>
                <span style="font-size:11px; color:var(--text-muted)">${log.fecha}</span>
            `;
            salidaLogList.appendChild(item);
        });
    }
}

// === PROCESAMIENTO Y RENDERIZADO DEL INVENTARIO ===
// === PROCESAMIENTO Y RENDERIZADO DEL INVENTARIO (CON ACCIONES) ===
function renderizarApp() {
    if (!inventoryTableBody) return;
    inventoryTableBody.innerHTML = '';
    stockAlertsList.innerHTML = '';
    expiryAlertsList.innerHTML = '';

    let contadorBajoStockVencido = 0;
    const categoriasUnicas = new Set();
    const textoBusqueda = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    inventario.forEach((prod, index) => {
        if (prod.categoria) categoriasUnicas.add(prod.categoria);

        const coincideBusqueda = prod.nombre.toLowerCase().includes(textoBusqueda) || 
                                 prod.codigo.toLowerCase().includes(textoBusqueda);

        const fechaVencimiento = new Date(prod.vencimiento + 'T00:00:00');
        const diferenciaTiempo = fechaVencimiento.getTime() - hoy.getTime();
        const diasParaVencer = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

        const estaVencido = diasParaVencer <= 0;
        const proximoAVencer = diasParaVencer > 0 && diasParaVencer <= 7;

        let statusBadge = '<span class="badge status-good">Disponible</span>';
        if (prod.stock <= 10) statusBadge = '<span class="badge status-low">Stock Bajo</span>';
        if (estaVencido) statusBadge = '<span class="badge status-expired">Vencido</span>';

        // --- INSERCIÓN EN LA TABLA CON COLUMNA DE ACCIONES EN VIVO ---
        if (coincideBusqueda) {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${prod.codigo}</td>
                <td class="product-cell"><strong>${prod.nombre}</strong></td>
                <td>${prod.categoria}</td>
                <td>$${parseFloat(prod.precio).toFixed(2)}</td>
                <td>${prod.stock} uds</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-action-table edit" onclick="abrirEdicionProducto(${index})">✏️</button>
                        <button class="btn-action-table delete" onclick="eliminarProducto(${index})">🗑️</button>
                    </div>
                </td>
            `;
            inventoryTableBody.appendChild(fila);
        }

        let contarAlerta = false;

        if (prod.stock <= 10) {
            contarAlerta = true;
            const itemStock = document.createElement('div');
            itemStock.className = `alert-item ${prod.stock <= 3 ? 'priority-high' : 'priority-medium'}`;
            itemStock.innerHTML = `
                <div class="alert-meta">
                    <span class="severity-dot ${prod.stock <= 3 ? 'dot-high' : 'dot-medium'}"></span>
                    <div class="alert-details">
                        <h4>${prod.nombre}</h4>
                        <p>Código: ${prod.codigo} | Cat: ${prod.categoria}</p>
                    </div>
                </div>
                <div class="alert-action-zone">
                    <span class="qty-badge ${prod.stock <= 3 ? 'danger' : 'warning'}">${prod.stock} uds</span>
                </div>
            `;
            stockAlertsList.appendChild(itemStock);
        }

        if (estaVencido || proximoAVencer) {
            contarAlerta = true;
            const itemExpiry = document.createElement('div');
            itemExpiry.className = `alert-item ${estaVencido ? 'priority-high' : 'priority-medium'}`;
            let mensajeFecha = estaVencido ? 'Vencido' : `Vence en ${diasParaVencer} días`;
            
            itemExpiry.innerHTML = `
                <div class="alert-meta">
                    <span class="severity-dot ${estaVencido ? 'dot-high' : 'dot-medium'}"></span>
                    <div class="alert-details">
                        <h4>${prod.nombre}</h4>
                        <p>Código: ${prod.codigo} | Caducidad: ${prod.vencimiento}</p>
                    </div>
                </div>
                <div class="alert-action-zone">
                    <span class="date-badge ${estaVencido ? 'danger' : 'warning'}">${mensajeFecha}</span>
                </div>
            `;
            expiryAlertsList.appendChild(itemExpiry);
        }

        if (contarAlerta) contadorBajoStockVencido++;
    });

    if (statTotal) statTotal.textContent = inventario.length.toLocaleString();
    if (statLow) statLow.textContent = contadorBajoStockVencido;
    if (statCategories) statCategories.textContent = categoriasUnicas.size;

    if (inventario.length === 0) {
        inventoryTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:24px;">📦 No hay productos registrados. Use el botón de arriba para comenzar.</td></tr>';
    }
    if (stockAlertsList && stockAlertsList.children.length === 0) {
        stockAlertsList.innerHTML = '<p style="color:var(--text-muted); font-size:13px; padding:12px;">✅ Todos los productos tienen existencias óptimas.</p>';
    }
    if (expiryAlertsList && expiryAlertsList.children.length === 0) {
        expiryAlertsList.innerHTML = '<p style="color:var(--text-muted); font-size:13px; padding:12px;">✅ No hay productos vencidos ni próximos a caducar.</p>';
    }
}

// === VARIABLE GLOBAL PARA SABER SI ESTAMOS EDITANDO O CREANDO ===
let indexEdicionActual = null;

// === FUNCIÓN PARA ELIMINAR PRODUCTO DE LA MEMORIA ===
window.eliminarProducto = function(index) {
    const confirmado = confirm(`⚠️ ¿Estás seguro de que deseas eliminar permanentemente el producto "${inventario[index].nombre}" del almacén?`);
    if (confirmado) {
        inventario.splice(index, 1); // Quita el producto del array
        localStorage.setItem('superstock_inventario', JSON.stringify(inventario)); // Actualiza la memoria interna
        renderizarApp(); // Refresca las listas de inmediato
        actualizarDesplegablesProductos();
    }
}

// === FUNCIÓN PARA CARGAR DATOS EN EL MODAL PARA EDITAR ===
window.abrirEdicionProducto = function(index) {
    indexEdicionActual = index;
    const prod = inventario[index];

    // Rellenar el formulario existente con los datos guardados para modificarlos
    document.getElementById('prod-name').value = prod.nombre;
    document.getElementById('prod-code').value = prod.codigo;
    document.getElementById('prod-category').value = prod.categoria;
    document.getElementById('prod-price').value = prod.precio;
    document.getElementById('prod-stock').value = prod.stock;
    document.getElementById('prod-expiry').value = prod.vencimiento;

    // Cambiar estéticamente el título del formulario para guiar al usuario
    document.querySelector('.modal-content h2').textContent = "✏️ Modificar Producto";
    modal.classList.add('active');
}

// Interceptar botón de abrir modal para limpiar el estado a "Modo Creación"
if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        indexEdicionActual = null; // Reiniciar estado
        document.querySelector('.modal-content h2').textContent = "Añadir Nuevo Producto";
        modal.classList.add('active');
    });
}

// === REGISTRO / ACTUALIZACIÓN DE PRODUCTOS ===
if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const datosProd = {
            nombre: document.getElementById('prod-name').value,
            codigo: document.getElementById('prod-code').value,
            categoria: document.getElementById('prod-category').value,
            precio: parseFloat(document.getElementById('prod-price').value) || 0,
            stock: parseInt(document.getElementById('prod-stock').value) || 0,
            vencimiento: document.getElementById('prod-expiry').value
        };

        if (indexEdicionActual !== null) {
            // Sobreescribir el elemento existente si estamos en Modo Edición
            inventario[indexEdicionActual] = datosProd;
            indexEdicionActual = null;
        } else {
            // Añadir uno nuevo al final si es Modo Creación
            inventario.push(datosProd);
        }

        localStorage.setItem('superstock_inventario', JSON.stringify(inventario));
        renderizarApp();
        actualizarDesplegablesProductos();
        cerrarModal();
    });
}

// === LOGICA DEL FORMULARIO DE ENTRADAS ===
if (entradaForm) {
    entradaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = parseInt(entradaSelect.value);
        if (isNaN(index)) return;
        const cantidad = parseInt(document.getElementById('entrada-qty').value);
        const proveedor = document.getElementById('entrada-supplier').value || 'Proveedor Desconocido';
        const fechaActual = new Date().toLocaleDateString();

        inventario[index].stock += cantidad;
        localStorage.setItem('superstock_inventario', JSON.stringify(inventario));

        historialEntradas.push({
            producto: inventario[index].nombre,
            cantidad: cantidad,
            nota: proveedor,
            fecha: fechaActual
        });
        localStorage.setItem('superstock_entradas', JSON.stringify(historialEntradas));

        entradaForm.reset();
        mostrarVista(viewInventory, navInventory);
        renderizarApp();
    });
}

// === LOGICA DEL FORMULARIO DE SALIDAS ===
if (salidaForm) {
    salidaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const index = parseInt(salidaSelect.value);
        if (isNaN(index)) return;
        
        const cantidad = parseInt(document.getElementById('salida-qty').value);
        const motivo = document.getElementById('salida-reason').value;
        const fechaActual = new Date().toLocaleDateString();

        // Validación de seguridad (control de existencias)
        if (cantidad > inventario[index].stock) { 
            alert(`❌ Error: No puedes retirar ${cantidad} unidades. Solo quedan ${inventario[index].stock} unidades disponibles de "${inventario[index].nombre}".`);
            return;
        }

        // Restar stock al producto seleccionado y guardar en memoria
        inventario[index].stock -= cantidad;
        localStorage.setItem('superstock_inventario', JSON.stringify(inventario));

        // Guardar el registro en el historial de salidas
        historialSalidas.push({
            producto: inventario[index].nombre,
            cantidad: cantidad,
            motivo: motivo,
            fecha: fechaActual
        });
        localStorage.setItem('superstock_salidas', JSON.stringify(historialSalidas));

        // Limpiar el formulario y regresar a la vista del almacén
        salidaForm.reset();
        mostrarVista(viewInventory, navInventory);
        renderizarApp();
    });
}

// === BARRA DE BÚSQUEDA DINÁMICA ===
if (searchInput) {
    searchInput.addEventListener('input', renderizarApp);
}

// === INICIALIZACIÓN AUTOMÁTICA AL CARGAR LA PÁGINA ===
document.addEventListener('DOMContentLoaded', () => {
    renderizarApp();
    actualizarDesplegablesProductos();
});

// === LÓGICA EXCLUSIVA DEL MÓDULO DE REPORTES ===
function calcularYGenerarReporte() {
    // 1. Establecer fecha de emisión actual del sistema
    const txtFecha = document.getElementById('repo-date');
    if (txtFecha) {
        txtFecha.textContent = new Date().toLocaleDateString() + ' a las ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    // 2. Variables de cálculo financiero y stock
    let valorTotalAlmacen = 0;
    let volumenTotalUnidades = 0;
    let cantidadProductosAlerta = 0;
    const categoriasUnicas = new Set();

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Analizar el inventario actual uno por uno
    inventario.forEach(prod => {
        if (prod.categoria) categoriasUnicas.add(prod.categoria);
        
        let stockActual = parseInt(prod.stock) || 0;
        let precioActual = parseFloat(prod.precio) || 0;

        volumenTotalUnidades += stockActual;
        valorTotalAlmacen += (stockActual * precioActual);

        // Evaluar alertas críticas para el informe
        const fechaVencimiento = new Date(prod.vencimiento + 'T00:00:00');
        const diasParaVencer = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
        
        if (stockActual <= 10 || diasParaVencer <= 7) {
            cantidadProductosAlerta++;
        }
    });

    // 3. Variables de análisis de los historiales
    let totalUnidadesIngresadas = 0;
    let unidadesVendidas = 0;
    let unidadesMermasVencidas = 0;
    let unidadesMermasDanadas = 0;

    historialEntradas.forEach(item => totalUnidadesIngresadas += (parseInt(item.cantidad) || 0));
    
    historialSalidas.forEach(item => {
        let cantidad = parseInt(item.cantidad) || 0;
        if (item.motivo === 'Venta') {
            unidadesVendidas += cantidad;
        } else if (item.motivo === 'Vencido') {
            unidadesMermasVencidas += cantidad;
        } else if (item.motivo === 'Dañado') {
            unidadesMermasDanadas += cantidad;
        }
    });

    let totalMermasGenerales = unidadesMermasVencidas + unidadesMermasDanadas;

    // 4. Inyectar todos los resultados matemáticos en las etiquetas HTML
    document.getElementById('repo-val-total').textContent = '$' + valorTotalAlmacen.toFixed(2);
    document.getElementById('repo-total-entradas').textContent = totalUnidadesIngresadas + ' uds';
    document.getElementById('repo-total-mermas').textContent = totalMermasGenerales + ' uds';
    
    document.getElementById('repo-count-items').textContent = inventario.length + ' tipos';
    document.getElementById('repo-sum-stock').textContent = volumenTotalUnidades + ' unidades';
    document.getElementById('repo-alert-items').textContent = cantidadProductosAlerta + ' productos';
    
    document.getElementById('repo-count-sales').textContent = unidadesVendidas + ' unidades';
    document.getElementById('repo-count-expired').textContent = unidadesMermasVencidas + ' unidades';
    document.getElementById('repo-count-damaged').textContent = unidadesMermasDanadas + ' unidades';
}

// 5. Configurar la acción del botón para mandar a imprimir / Guardar PDF
if (btnPrintReport) {
    btnPrintReport.addEventListener('click', () => {
        window.print();
    });
}

