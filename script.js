// Categorías predefinidas
const categories = {
    income: [
        'Salario', 'Freelance', 'Bonos', 'Inversiones', 'Ventas', 
        'Alquiler', 'Intereses', 'Regalos', 'Otros Ingresos'
    ],
    expense: [
        'Alimentación', 'Transporte', 'Vivienda', 'Servicios', 
        'Salud', 'Educación', 'Entretenimiento', 'Ropa', 
        'Tecnología', 'Seguros', 'Impuestos', 'Otros Gastos'
    ]
};

// Base de datos de productos de barbería y belleza
let productInventory = {
    capilar: [
        { code: 'CI001', name: 'Cera Inmortal', price: 25.99, stock: 20 },
        { code: 'CB001', name: 'Cera Mr. Buff', price: 22.50, stock: 15 },
        { code: 'CPI001', name: 'Cera en Polvo Inmortal', price: 28.75, stock: 12 },
        { code: 'CPR001', name: 'Cera en Polvo Roterbart', price: 26.99, stock: 18 },
        { code: 'SI001', name: 'Shampoo Inmortal', price: 19.99, stock: 25 }
    ],
    barba: [
        { code: 'MK001', name: 'Minoxidil Kirkland', price: 45.99, stock: 8 },
        { code: 'AR001', name: 'Aceite Barba Roterbart', price: 32.50, stock: 15 },
        { code: 'AI001', name: 'Aceite Barba Inmortal', price: 35.75, stock: 12 },
        { code: 'CBI001', name: 'Cera Barba Inmortal', price: 24.99, stock: 20 },
        { code: 'SBI001', name: 'Shampoo Barba Inmortal', price: 21.50, stock: 18 },
        { code: 'CRI001', name: 'Crema Barba Inmortal', price: 28.99, stock: 14 },
        { code: 'DR001', name: 'Derma Roller', price: 15.99, stock: 10 }
    ],
    facial: [
        { code: 'EI001', name: 'Exfoliante Inmortal', price: 18.99, stock: 22 },
        { code: 'EO001', name: 'Exfoliante Ossion', price: 16.50, stock: 25 },
        { code: 'MN001', name: 'Mascarilla Negra Nevada', price: 24.75, stock: 16 },
        { code: 'ASC001', name: 'After Shave Crema Red One', price: 19.99, stock: 20 }
    ],
    maquinas: [
        { code: 'TN001', name: 'Trimmer Nariz', price: 12.99, stock: 8 },
        { code: 'PK001', name: 'Patillera Kemei', price: 35.50, stock: 6 }
    ],
    insumos: [
        { code: 'CU001', name: 'Cuelloros', price: 2.99, stock: 50 },
        { code: 'AS001', name: 'After Shave', price: 14.99, stock: 30 },
        { code: 'ASP001', name: 'After Shave Pequeño', price: 8.50, stock: 40 },
        { code: 'SG001', name: 'Shaving Gel', price: 12.75, stock: 25 },
        { code: 'SGP001', name: 'Shaving Gel Pequeño', price: 7.99, stock: 35 },
        { code: 'CD001', name: 'Cuchillas Dórco', price: 9.99, stock: 45 },
        { code: 'CL001', name: 'Cuchillas Level 3', price: 11.50, stock: 38 },
        { code: 'TB001', name: 'Talco Mr Buffel', price: 6.99, stock: 42 }
    ]
};

// Variables globales
let transactions = [];
let filteredTransactions = [];
let nextProductCode = 1;

// Inicializar la aplicación
function init() {
    const today = new Date();
    document.getElementById('date').value = today.toISOString().split('T')[0];
    document.getElementById('currentMonth').value = today.getMonth() + 1;
    document.getElementById('currentYear').value = today.getFullYear();
    
    // Llenar años en el filtro
    const currentYear = today.getFullYear();
    const yearFilter = document.getElementById('filterYear');
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    }
    
    // Cargar datos guardados
    loadDataFromLocalStorage();
    loadProductInventory();
    updateSummary();
    setupEventListeners();
}

// Configurar event listeners
function setupEventListeners() {
    document.getElementById('type').addEventListener('change', updateCategoryOptions);
    document.getElementById('filterMonth').addEventListener('change', filterTransactions);
    document.getElementById('filterYear').addEventListener('change', filterTransactions);
    document.getElementById('filterType').addEventListener('change', filterTransactions);
    document.getElementById('currentMonth').addEventListener('change', updateSummary);
    document.getElementById('currentYear').addEventListener('change', updateSummary);
    
    // Event listeners para inventario de productos
    document.getElementById('category').addEventListener('change', handleCategoryChange);
    document.getElementById('productCategory').addEventListener('change', updateProductOptions);
    document.getElementById('productSelect').addEventListener('change', updateProductDetails);
    document.getElementById('productQuantity').addEventListener('input', calculateTotal);
    document.getElementById('productPrice').addEventListener('input', calculateTotal);
}

// Manejar cambio de categoría para mostrar/ocultar inventario
function handleCategoryChange() {
    const category = document.getElementById('category').value;
    const productSection = document.getElementById('productInventorySection');
    
    if (category === 'Ventas') {
        productSection.style.display = 'block';
        // Limpiar campos de producto
        clearProductFields();
    } else {
        productSection.style.display = 'none';
        clearProductFields();
    }
}

// Limpiar campos de productos
function clearProductFields() {
    document.getElementById('productCategory').value = '';
    document.getElementById('productSelect').innerHTML = '<option value="">Seleccionar producto...</option>';
    document.getElementById('productQuantity').value = '1';
    document.getElementById('productPrice').value = '';
    document.getElementById('productCode').value = '';
    document.getElementById('totalPrice').value = '';
}

// Actualizar opciones de productos según categoría
function updateProductOptions() {
    const category = document.getElementById('productCategory').value;
    const productSelect = document.getElementById('productSelect');
    
    productSelect.innerHTML = '<option value="">Seleccionar producto...</option>';
    
    if (category && productInventory[category]) {
        productInventory[category].forEach(product => {
            const option = document.createElement('option');
            option.value = JSON.stringify(product);
            option.textContent = `${product.name} - Stock: ${product.stock}`;
            if (product.stock <= 5) {
                option.style.color = '#dc3545'; // Rojo para stock bajo
            } else if (product.stock <= 10) {
                option.style.color = '#ffc107'; // Amarillo para stock medio
            } else {
                option.style.color = '#28a745'; // Verde para stock alto
            }
            productSelect.appendChild(option);
        });
    }
}

// Actualizar detalles del producto seleccionado
function updateProductDetails() {
    const productSelect = document.getElementById('productSelect');
    const selectedProduct = productSelect.value;
    
    if (selectedProduct) {
        const product = JSON.parse(selectedProduct);
        document.getElementById('productPrice').value = product.price.toFixed(2);
        document.getElementById('productCode').value = product.code;
        calculateTotal();
        
        // Actualizar descripción automáticamente
        document.getElementById('description').value = `Venta: ${product.name} (${product.code})`;
    } else {
        document.getElementById('productPrice').value = '';
        document.getElementById('productCode').value = '';
        document.getElementById('totalPrice').value = '';
    }
}

// Calcular total del producto
function calculateTotal() {
    const quantity = parseFloat(document.getElementById('productQuantity').value) || 0;
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const total = quantity * price;
    
    document.getElementById('totalPrice').value = total.toFixed(2);
    document.getElementById('amount').value = total.toFixed(2);
}

// Agregar nuevo producto al inventario
function addNewProduct() {
    const modal = document.createElement('div');
    modal.className = 'inventory-modal';
    modal.innerHTML = `
        <div class="inventory-modal-content">
            <h3 style="color: #2c3e50; margin-bottom: 20px;">➕ Agregar Nuevo Producto</h3>
            <div class="product-grid">
                <div class="input-group">
                    <label for="newProductCategory">Categoría</label>
                    <select id="newProductCategory">
                        <option value="">Seleccionar...</option>
                        <option value="capilar">💇‍♂️ Capilar</option>
                        <option value="barba">🧔 Barba</option>
                        <option value="facial">👨‍🦲 Facial</option>
                        <option value="maquinas">🔧 Máquinas</option>
                        <option value="insumos">📦 Insumos Barbería</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="newProductName">Nombre del Producto</label>
                    <input type="text" id="newProductName" placeholder="Ej: Cera Inmortal">
                </div>
                <div class="input-group">
                    <label for="newProductPrice">Precio</label>
                    <input type="number" id="newProductPrice" step="0.01" placeholder="0.00">
                </div>
                <div class="input-group">
                    <label for="newProductStock">Stock Inicial</label>
                    <input type="number" id="newProductStock" min="0" placeholder="0">
                </div>
                <div class="input-group">
                    <label for="newProductCode">Código (Automático)</label>
                    <input type="text" id="newProductCode" placeholder="Se genera automáticamente" readonly>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="saveNewProduct()">💾 Guardar Producto</button>
                <button class="btn btn-danger" onclick="closeModal()">❌ Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Generar código automático cuando se selecciona categoría
    document.getElementById('newProductCategory').addEventListener('change', function() {
        const category = this.value;
        if (category) {
            const code = generateProductCode(category);
            document.getElementById('newProductCode').value = code;
        }
    });
}

// Generar código automático para producto
function generateProductCode(category) {
    const prefixes = {
        capilar: 'C',
        barba: 'B',
        facial: 'F',
        maquinas: 'M',
        insumos: 'I'
    };
    
    const categoryNames = {
        capilar: ['CI', 'CB', 'CPI', 'CPR', 'SI'], // Códigos base existentes
        barba: ['MK', 'AR', 'AI', 'CBI', 'SBI', 'CRI', 'DR'],
        facial: ['EI', 'EO', 'MN', 'ASC'],
        maquinas: ['TN', 'PK'],
        insumos: ['CU', 'AS', 'ASP', 'SG', 'SGP', 'CD', 'CL', 'TB']
    };
    
    const existingCodes = productInventory[category] ? productInventory[category].map(p => p.code) : [];
    
    // Intentar usar un prefijo existente de la categoría
    if (categoryNames[category]) {
        for (let prefix of categoryNames[category]) {
            let number = 1;
            let code;
            
            do {
                code = `${prefix}${number.toString().padStart(3, '0')}`;
                number++;
            } while (existingCodes.includes(code));
            
            if (number <= 999) { // Evitar códigos muy largos
                return code;
            }
        }
    }
    
    // Si no se puede usar un prefijo existente, usar el prefijo general
    const prefix = prefixes[category] || 'PRD';
    let number = 1;
    let code;
    
    do {
        code = `${prefix}${number.toString().padStart(3, '0')}`;
        number++;
    } while (existingCodes.includes(code));
    
    return code;
}

// Guardar nuevo producto
function saveNewProduct() {
    const category = document.getElementById('newProductCategory').value;
    const name = document.getElementById('newProductName').value;
    const price = parseFloat(document.getElementById('newProductPrice').value);
    const stock = parseInt(document.getElementById('newProductStock').value);
    const code = document.getElementById('newProductCode').value;
    
    if (!category || !name || !price || !stock || !code) {
        alert('⚠️ Por favor, completa todos los campos');
        return;
    }
    
    const newProduct = {
        code: code,
        name: name,
        price: price,
        stock: stock
    };
    
    if (!productInventory[category]) {
        productInventory[category] = [];
    }
    
    productInventory[category].push(newProduct);
    saveProductInventory();
    closeModal();
    updateProductOptions(); // Actualizar opciones si está en la misma categoría
    showSuccessMessage(`✅ Producto ${code} agregado exitosamente`);
}

// Ver inventario completo
function viewInventory() {
    const modal = document.createElement('div');
    modal.className = 'inventory-modal';
    
    let inventoryHTML = `
        <div class="inventory-modal-content" style="max-width: 95%; max-height: 90%;">
            <h3 style="color: #2c3e50; margin-bottom: 20px;">📦 Inventario Completo de Productos</h3>
            <div style="overflow-x: auto;">
                <table class="inventory-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Categoría</th>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    Object.keys(productInventory).forEach(category => {
        productInventory[category].forEach(product => {
            const stockClass = product.stock <= 5 ? 'stock-low' : 
                             product.stock <= 10 ? 'stock-medium' : 'stock-high';
            const stockStatus = product.stock <= 5 ? '🔴 Crítico' : 
                              product.stock <= 10 ? '🟡 Bajo' : '🟢 Normal';
            
            inventoryHTML += `
                <tr>
                    <td><strong>${product.code}</strong></td>
                    <td>${category.charAt(0).toUpperCase() + category.slice(1)}</td>
                    <td>${product.name}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td class="${stockClass}">${product.stock}</td>
                    <td>${stockStatus}</td>
                    <td>
                        <button class="btn btn-info" style="padding: 4px 8px; font-size: 12px;" 
                                onclick="editProductStock('${category}', '${product.code}')">
                            📝 Stock
                        </button>
                    </td>
                </tr>
            `;
        });
    });
    
    inventoryHTML += `
                    </tbody>
                </table>
            </div>
            <div class="product-actions" style="margin-top: 20px;">
                <button class="btn btn-primary" onclick="exportInventory()">📊 Exportar Inventario</button>
                <button class="btn btn-danger" onclick="closeModal()">❌ Cerrar</button>
            </div>
        </div>
    `;
    
    modal.innerHTML = inventoryHTML;
    document.body.appendChild(modal);
}

// Editar stock de producto
function editProductStock(category, code) {
    const product = productInventory[category].find(p => p.code === code);
    if (!product) return;
    
    const newStock = prompt(`Actualizar stock para ${product.name} (${code})\nStock actual: ${product.stock}`, product.stock);
    
    if (newStock !== null && !isNaN(newStock) && parseInt(newStock) >= 0) {
        product.stock = parseInt(newStock);
        saveProductInventory();
        showSuccessMessage(`✅ Stock actualizado para ${code}`);
        // Refrescar vista del inventario
        closeModal();
        setTimeout(() => viewInventory(), 100);
    }
}

// Exportar inventario
function exportInventory() {
    const headers = ['Código', 'Categoría', 'Producto', 'Precio', 'Stock', 'Estado'];
    let csvContent = headers.join(',') + '\n';
    
    Object.keys(productInventory).forEach(category => {
        productInventory[category].forEach(product => {
            const stockStatus = product.stock <= 5 ? 'Crítico' : 
                              product.stock <= 10 ? 'Bajo' : 'Normal';
            
            csvContent += [
                product.code,
                category.charAt(0).toUpperCase() + category.slice(1),
                `"${product.name}"`,
                product.price,
                product.stock,
                stockStatus
            ].join(',') + '\n';
        });
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_productos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccessMessage('📊 Inventario exportado exitosamente');
}

// Cerrar modal
function closeModal() {
    const modal = document.querySelector('.inventory-modal');
    if (modal) {
        modal.remove();
    }
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('inventory-modal')) {
        closeModal();
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Guardar inventario en localStorage
function saveProductInventory() {
    try {
        localStorage.setItem('productInventory', JSON.stringify(productInventory));
    } catch (error) {
        console.warn('No se pudo guardar el inventario:', error);
    }
}

// Cargar inventario desde localStorage
function loadProductInventory() {
    try {
        const savedInventory = localStorage.getItem('productInventory');
        if (savedInventory) {
            productInventory = JSON.parse(savedInventory);
        }
    } catch (error) {
        console.warn('No se pudo cargar el inventario:', error);
    }
}

// Actualizar opciones de categoría según el tipo
function updateCategoryOptions() {
    const type = document.getElementById('type').value;
    const categorySelect = document.getElementById('category');
    
    categorySelect.innerHTML = '<option value="">Seleccionar categoría...</option>';
    
    if (type && categories[type]) {
        categories[type].forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
}

// Agregar transacción
function addTransaction() {
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!date || !type || !category || !description || !amount) {
        alert('⚠️ Por favor, completa todos los campos');
        return;
    }

    if (amount <= 0) {
        alert('⚠️ El monto debe ser mayor a 0');
        return;
    }

    // Validaciones especiales para ventas
    if (category === 'Ventas') {
        const productSelect = document.getElementById('productSelect').value;
        const quantity = parseInt(document.getElementById('productQuantity').value);
        
        if (!productSelect) {
            alert('⚠️ Debes seleccionar un producto para registrar una venta');
            return;
        }
        
        const product = JSON.parse(productSelect);
        const productCategory = document.getElementById('productCategory').value;
        
        // Verificar stock disponible
        if (product.stock < quantity) {
            alert(`⚠️ Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${quantity}`);
            return;
        }
        
        // Actualizar stock del producto
        const productIndex = productInventory[productCategory].findIndex(p => p.code === product.code);
        if (productIndex !== -1) {
            productInventory[productCategory][productIndex].stock -= quantity;
            saveProductInventory();
            
            // Mostrar alerta si el stock queda bajo
            const newStock = productInventory[productCategory][productIndex].stock;
            if (newStock <= 5) {
                setTimeout(() => {
                    alert(`⚠️ ALERTA: Stock bajo para ${product.name} (${product.code}). Stock actual: ${newStock}`);
                }, 1000);
            }
        }
    }

    const transaction = {
        id: Date.now(),
        date: date,
        type: type,
        category: category,
        description: description,
        amount: amount,
        // Agregar información del producto si es una venta
        ...(category === 'Ventas' && {
            productInfo: {
                code: JSON.parse(document.getElementById('productSelect').value).code,
                quantity: parseInt(document.getElementById('productQuantity').value),
                unitPrice: parseFloat(document.getElementById('productPrice').value)
            }
        })
    };

    transactions.push(transaction);
    saveDataToLocalStorage();
    clearForm();
    filterTransactions();
    updateSummary();
    
    // Mostrar mensaje de éxito
    showSuccessMessage('✅ Movimiento agregado exitosamente');
}

// Limpiar formulario
function clearForm() {
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    document.getElementById('type').value = '';
    document.getElementById('category').innerHTML = '<option value="">Seleccionar tipo primero...</option>';
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    
    // Ocultar y limpiar sección de productos
    document.getElementById('productInventorySection').style.display = 'none';
    clearProductFields();
}

// Mostrar mensaje de éxito
function showSuccessMessage(message) {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Eliminar transacción
function deleteTransaction(id) {
    if (confirm('🗑️ ¿Estás seguro de que quieres eliminar este movimiento?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveDataToLocalStorage();
        filterTransactions();
        updateSummary();
        showSuccessMessage('✅ Movimiento eliminado');
    }
}

// Editar transacción
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    // Llenar el formulario con los datos de la transacción
    document.getElementById('date').value = transaction.date;
    document.getElementById('type').value = transaction.type;
    
    // Actualizar categorías y seleccionar la correcta
    updateCategoryOptions();
    setTimeout(() => {
        document.getElementById('category').value = transaction.category;
    }, 100);
    
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    
    // Eliminar la transacción actual para que se pueda agregar la editada
    deleteTransaction(id);
    
    // Scroll al formulario
    document.querySelector('.input-section').scrollIntoView({ behavior: 'smooth' });
    showSuccessMessage('📝 Datos cargados para edición');
}

// Filtrar transacciones
function filterTransactions() {
    const monthFilter = document.getElementById('filterMonth').value;
    const yearFilter = document.getElementById('filterYear').value;
    const typeFilter = document.getElementById('filterType').value;

    filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionMonth = transactionDate.getMonth() + 1;
        const transactionYear = transactionDate.getFullYear();

        const monthMatch = !monthFilter || transactionMonth == monthFilter;
        const yearMatch = !yearFilter || transactionYear == yearFilter;
        const typeMatch = !typeFilter || transaction.type === typeFilter;

        return monthMatch && yearMatch && typeMatch;
    });

    displayTransactions();
}

// Mostrar transacciones en la tabla
function displayTransactions() {
    const tbody = document.getElementById('transactionTable');
    
    if (filteredTransactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #7f8c8d; padding: 40px;">
                    🔍 No se encontraron movimientos con los filtros aplicados
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredTransactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(transaction => {
            const formattedDate = new Date(transaction.date).toLocaleDateString('es-ES');
            const typeIcon = transaction.type === 'income' ? '💚' : '💸';
            const typeText = transaction.type === 'income' ? 'Ingreso' : 'Gasto';
            const amountClass = transaction.type === 'income' ? 'amount-positive' : 'amount-negative';
            const amountPrefix = transaction.type === 'income' ? '+' : '-';
            const rowClass = transaction.type === 'income' ? 'income-row' : 'expense-row';
            
            // Agregar información de producto si es una venta
            let description = transaction.description;
            if (transaction.category === 'Ventas' && transaction.productInfo) {
                description += ` | Qty: ${transaction.productInfo.quantity} | ${transaction.productInfo.unitPrice}/u`;
            }
            
            return `
                <tr class="${rowClass}">
                    <td>${formattedDate}</td>
                    <td>${typeIcon} ${typeText}</td>
                    <td>${transaction.category}</td>
                    <td>${description}</td>
                    <td class="${amountClass}">${amountPrefix}${transaction.amount.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-primary" onclick="editTransaction(${transaction.id})" style="margin-right: 5px; padding: 6px 10px; font-size: 11px;">
                            ✏️ Editar
                        </button>
                        <button class="btn btn-danger" onclick="deleteTransaction(${transaction.id})">
                            🗑️ Eliminar
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
}

// Actualizar resumen
function updateSummary() {
    const currentMonth = parseInt(document.getElementById('currentMonth').value);
    const currentYear = parseInt(document.getElementById('currentYear').value);

    const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() + 1 === currentMonth && 
               transactionDate.getFullYear() === currentYear;
    });

    const totalIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    document.getElementById('totalIncome').textContent = `$${totalIncome.toLocaleString('es-ES', {minimumFractionDigits: 2})}`;
    document.getElementById('totalExpense').textContent = `$${totalExpense.toLocaleString('es-ES', {minimumFractionDigits: 2})}`;
    document.getElementById('balance').textContent = `$${balance.toLocaleString('es-ES', {minimumFractionDigits: 2})}`;

    // Cambiar color del balance según sea positivo o negativo
    const balanceElement = document.getElementById('balance');
    if (balance >= 0) {
        balanceElement.style.color = '#27ae60';
    } else {
        balanceElement.style.color = '#e74c3c';
    }
}

// Exportar a CSV
function exportToCSV() {
    if (transactions.length === 0) {
        alert('⚠️ No hay datos para exportar');
        return;
    }

    const headers = ['Fecha', 'Tipo', 'Categoría', 'Descripción', 'Monto'];
    const csvContent = [
        headers.join(','),
        ...transactions.map(t => [
            t.date,
            t.type === 'income' ? 'Ingreso' : 'Gasto',
            `"${t.category}"`,
            `"${t.description}"`,
            t.amount
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `gastos_ingresos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showSuccessMessage('📊 Archivo CSV descargado exitosamente');
}

// Guardar datos en localStorage
function saveDataToLocalStorage() {
    try {
        localStorage.setItem('expenseTrackerData', JSON.stringify(transactions));
    } catch (error) {
        console.warn('No se pudieron guardar los datos localmente:', error);
    }
}

// Cargar datos desde localStorage
function loadDataFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('expenseTrackerData');
        if (savedData) {
            transactions = JSON.parse(savedData);
            filterTransactions();
        }
    } catch (error) {
        console.warn('No se pudieron cargar los datos guardados:', error);
        transactions = [];
    }
}

// Limpiar todos los datos
function clearAllData() {
    if (confirm('🚨 ¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
        transactions = [];
        saveDataToLocalStorage();
        filterTransactions();
        updateSummary();
        showSuccessMessage('🗑️ Todos los datos han sido eliminados');
    }
}

// Importar datos desde CSV
function importFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const headers = lines[0].split(',');
            
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const values = line.split(',');
                if (values.length >= 5) {
                    const transaction = {
                        id: Date.now() + i,
                        date: values[0],
                        type: values[1].toLowerCase().includes('ingreso') ? 'income' : 'expense',
                        category: values[2].replace(/"/g, ''),
                        description: values[3].replace(/"/g, ''),
                        amount: parseFloat(values[4])
                    };
                    
                    if (transaction.amount > 0) {
                        transactions.push(transaction);
                    }
                }
            }
            
            saveDataToLocalStorage();
            filterTransactions();
            updateSummary();
            showSuccessMessage('📊 Datos importados exitosamente');
        } catch (error) {
            alert('❌ Error al importar el archivo CSV. Verifica el formato.');
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Limpiar el input
}

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', init);