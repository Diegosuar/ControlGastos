// Control de Gastos e Ingresos - Alpha Style - JavaScript Vanilla
// Archivo completo y funcional

// ===== CONFIGURACIÓN INICIAL =====
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

let productInventory = {
    capilar: [
        { code: 'CI001', name: 'Cera Inmortal', price: 42000, stock: 20 },
        { code: 'CB001', name: 'Cera Mr. Buff', price: 40000, stock: 12 },
        { code: 'CPI001', name: 'Cera en Polvo Inmortal', price: 42000, stock: 3 },
        { code: 'CPR001', name: 'Cera en Polvo Roterbart', price: 42000, stock: 3 },
        { code: 'SI001', name: 'Shampoo Inmortal', price: 36000, stock: 2 }
    ],
    barba: [
        { code: 'MK001', name: 'Minoxidil Kirkland', price: 45000, stock: 12 },
        { code: 'AR001', name: 'Aceite Barba Roterbart', price: 35000, stock: 6 },
        { code: 'AI001', name: 'Aceite Barba Inmortal', price: 38000, stock: 2 },
        { code: 'CBI001', name: 'Cera Barba Inmortal', price: 36000, stock: 2 },
        { code: 'SBI001', name: 'Shampoo Barba Inmortal', price: 36000, stock: 2 },
        { code: 'CRI001', name: 'Crema Barba Inmortal', price: 38000, stock: 2 },
        { code: 'DR001', name: 'Derma Roller', price: 20000, stock: 10 }
    ],
    facial: [
        { code: 'EI001', name: 'Exfoliante Inmortal', price: 17000, stock: 5 },
        { code: 'EO001', name: 'Exfoliante Ossion', price: 35000, stock: 3 },
        { code: 'MN001', name: 'Mascarilla Negra Nevada', price: 25000, stock: 3 },
        { code: 'ASC001', name: 'After Shave Crema Red One', price: 50000, stock: 6 }
    ],
    maquinas: [
        { code: 'TN001', name: 'Trimmer Nariz', price: 47000, stock: 3 },
        { code: 'PK001', name: 'Patillera Kemei', price: 80000, stock: 6 }
    ],
    insumos: [
        { code: 'CU001', name: 'Cuelleros', price: 16000, stock: 12 },
        { code: 'AS001', name: 'After Shave', price: 20000, stock: 3 },
        { code: 'ASP001', name: 'After Shave Pequeño', price: 6000, stock: 3 },
        { code: 'SG001', name: 'Shaving Gel', price: 23000, stock: 6 },
        { code: 'SGP001', name: 'Shaving Gel Pequeño', price: 6000, stock: 6 },
        { code: 'CD001', name: 'Cuchillas Dórco', price: 13000, stock: 10 },
        { code: 'CL001', name: 'Cuchillas Level 3', price: 23000, stock: 3 },
        { code: 'TB001', name: 'Talco Mr Buffel', price: 18000, stock: 10 }
    ]
};

// Variables globales
let transactions = [];
let filteredTransactions = [];

// ===== FUNCIONES DE INICIALIZACIÓN =====
function init() {
    const today = new Date();
    document.getElementById('date').value = today.toISOString().split('T')[0];
    document.getElementById('currentMonth').value = today.getMonth() + 1;
    document.getElementById('currentYear').value = today.getFullYear();
    
    populateYearFilter();
    loadDataFromLocalStorage();
    loadProductInventory();
    updateSummary();
    setupEventListeners();
    addStyles();
    
    console.log('Aplicación inicializada correctamente');
}

function populateYearFilter() {
    const currentYear = new Date().getFullYear();
    const yearFilter = document.getElementById('filterYear');
    
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    }
}

function setupEventListeners() {
    document.getElementById('type').addEventListener('change', updateCategoryOptions);
    document.getElementById('category').addEventListener('change', handleCategoryChange);
    document.getElementById('filterMonth').addEventListener('change', filterTransactions);
    document.getElementById('filterYear').addEventListener('change', filterTransactions);
    document.getElementById('filterType').addEventListener('change', filterTransactions);
    document.getElementById('currentMonth').addEventListener('change', updateSummary);
    document.getElementById('currentYear').addEventListener('change', updateSummary);
    
    // Event listeners para productos (con delay para asegurar que existan)
    setTimeout(setupProductEventListeners, 100);
}

function setupProductEventListeners() {
    const elements = {
        productCategory: document.getElementById('productCategory'),
        productSelect: document.getElementById('productSelect'),
        productQuantity: document.getElementById('productQuantity'),
        productPrice: document.getElementById('productPrice')
    };
    
    if (elements.productCategory) {
        elements.productCategory.addEventListener('change', updateProductOptions);
    }
    if (elements.productSelect) {
        elements.productSelect.addEventListener('change', updateProductDetails);
    }
    if (elements.productQuantity) {
        elements.productQuantity.addEventListener('input', calculateTotal);
    }
    if (elements.productPrice) {
        elements.productPrice.addEventListener('input', calculateTotal);
    }
}

// ===== FUNCIONES DE INTERFAZ =====
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

function handleCategoryChange() {
    const category = document.getElementById('category').value;
    const productSection = document.getElementById('productInventorySection');
    
    if (category === 'Ventas') {
        productSection.style.display = 'block';
        clearProductFields();
        setTimeout(setupProductEventListeners, 50);
    } else {
        productSection.style.display = 'none';
        clearProductFields();
    }
}

function clearProductFields() {
    const elements = {
        productCategory: document.getElementById('productCategory'),
        productSelect: document.getElementById('productSelect'),
        productQuantity: document.getElementById('productQuantity'),
        productPrice: document.getElementById('productPrice'),
        productCode: document.getElementById('productCode'),
        totalPrice: document.getElementById('totalPrice')
    };
    
    if (elements.productCategory) elements.productCategory.value = '';
    if (elements.productSelect) elements.productSelect.innerHTML = '<option value="">Seleccionar producto...</option>';
    if (elements.productQuantity) elements.productQuantity.value = '1';
    if (elements.productPrice) elements.productPrice.value = '';
    if (elements.productCode) elements.productCode.value = '';
    if (elements.totalPrice) elements.totalPrice.value = '';
}

function updateProductOptions() {
    const categoryElement = document.getElementById('productCategory');
    const productSelect = document.getElementById('productSelect');
    
    if (!categoryElement || !productSelect) return;
    
    const category = categoryElement.value;
    productSelect.innerHTML = '<option value="">Seleccionar producto...</option>';
    
    if (category && productInventory[category]) {
        productInventory[category].forEach(product => {
            const option = document.createElement('option');
            option.value = JSON.stringify(product);
            option.textContent = `${product.name} (${product.code}) - Stock: ${product.stock} - $${product.price.toLocaleString('es-CO')}`;
            
            // Colores según stock
            if (product.stock <= 5) {
                option.style.color = '#dc3545';
                option.style.fontWeight = 'bold';
            } else if (product.stock <= 10) {
                option.style.color = '#ffc107';
            } else {
                option.style.color = '#28a745';
            }
            
            productSelect.appendChild(option);
        });
    }
}

function updateProductDetails() {
    const productSelect = document.getElementById('productSelect');
    const selectedProduct = productSelect.value;
    
    if (selectedProduct) {
        const product = JSON.parse(selectedProduct);
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCode').value = product.code;
        document.getElementById('description').value = `Venta: ${product.name} (${product.code})`;
        calculateTotal();
    } else {
        document.getElementById('productPrice').value = '';
        document.getElementById('productCode').value = '';
        document.getElementById('totalPrice').value = '';
    }
}

function calculateTotal() {
    const quantity = parseFloat(document.getElementById('productQuantity').value) || 0;
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const total = quantity * price;
    
    document.getElementById('totalPrice').value = total;
    document.getElementById('amount').value = total;
}

// ===== FUNCIONES DE TRANSACCIONES =====
function addTransaction() {
    const data = {
        date: document.getElementById('date').value,
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value)
    };

    // Validaciones
    if (!data.date || !data.type || !data.category || !data.description || !data.amount) {
        alert('⚠️ Por favor, completa todos los campos');
        return;
    }

    if (data.amount <= 0) {
        alert('⚠️ El monto debe ser mayor a 0');
        return;
    }

    // Procesamiento especial para ventas
    if (data.category === 'Ventas') {
        if (!handleSaleTransaction(data)) return;
    }

    // Crear transacción
    const transaction = {
        id: Date.now(),
        ...data,
        ...(data.category === 'Ventas' && {
            productInfo: getProductInfo()
        })
    };

    transactions.push(transaction);
    saveDataToLocalStorage();
    clearForm();
    filterTransactions();
    updateSummary();
    showSuccessMessage('✅ Movimiento agregado exitosamente');
}

function handleSaleTransaction(data) {
    const productSelect = document.getElementById('productSelect').value;
    const quantity = parseInt(document.getElementById('productQuantity').value);
    
    if (!productSelect) {
        alert('⚠️ Debes seleccionar un producto para registrar una venta');
        return false;
    }
    
    const product = JSON.parse(productSelect);
    const productCategory = document.getElementById('productCategory').value;
    
    if (product.stock < quantity) {
        alert(`⚠️ Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${quantity}`);
        return false;
    }
    
    // Actualizar stock
    const productIndex = productInventory[productCategory].findIndex(p => p.code === product.code);
    if (productIndex !== -1) {
        productInventory[productCategory][productIndex].stock -= quantity;
        saveProductInventory();
        
        const newStock = productInventory[productCategory][productIndex].stock;
        if (newStock <= 5) {
            setTimeout(() => {
                alert(`⚠️ ALERTA: Stock bajo para ${product.name} (${product.code}). Stock actual: ${newStock}`);
            }, 1000);
        }
    }
    
    return true;
}

function getProductInfo() {
    return {
        code: document.getElementById('productCode').value,
        quantity: parseInt(document.getElementById('productQuantity').value),
        unitPrice: parseFloat(document.getElementById('productPrice').value)
    };
}

function deleteTransaction(id) {
    if (confirm('🗑️ ¿Estás seguro de que quieres eliminar este movimiento?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveDataToLocalStorage();
        filterTransactions();
        updateSummary();
        showSuccessMessage('✅ Movimiento eliminado');
    }
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    // Llenar formulario
    document.getElementById('date').value = transaction.date;
    document.getElementById('type').value = transaction.type;
    
    updateCategoryOptions();
    setTimeout(() => {
        document.getElementById('category').value = transaction.category;
    }, 100);
    
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    
    deleteTransaction(id);
    document.querySelector('.input-section').scrollIntoView({ behavior: 'smooth' });
    showSuccessMessage('📝 Datos cargados para edición');
}

function clearForm() {
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    document.getElementById('type').value = '';
    document.getElementById('category').innerHTML = '<option value="">Seleccionar tipo primero...</option>';
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('productInventorySection').style.display = 'none';
    clearProductFields();
}

// ===== FUNCIONES DE FILTRADO Y VISUALIZACIÓN =====
function filterTransactions() {
    const filters = {
        month: document.getElementById('filterMonth').value,
        year: document.getElementById('filterYear').value,
        type: document.getElementById('filterType').value
    };

    filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionMonth = transactionDate.getMonth() + 1;
        const transactionYear = transactionDate.getFullYear();

        const monthMatch = !filters.month || transactionMonth == filters.month;
        const yearMatch = !filters.year || transactionYear == filters.year;
        const typeMatch = !filters.type || transaction.type === filters.type;

        return monthMatch && yearMatch && typeMatch;
    });

    displayTransactions();
}

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
        .map(createTransactionRow)
        .join('');
}

function createTransactionRow(transaction) {
    const formattedDate = new Date(transaction.date).toLocaleDateString('es-ES');
    const typeIcon = transaction.type === 'income' ? '💚' : '💸';
    const typeText = transaction.type === 'income' ? 'Ingreso' : 'Gasto';
    const amountClass = transaction.type === 'income' ? 'amount-positive' : 'amount-negative';
    const amountPrefix = transaction.type === 'income' ? '+' : '-';
    const rowClass = transaction.type === 'income' ? 'income-row' : 'expense-row';
    
    let description = transaction.description;
    if (transaction.category === 'Ventas' && transaction.productInfo) {
        description += ` | Qty: ${transaction.productInfo.quantity} | $${transaction.productInfo.unitPrice.toLocaleString('es-CO')}/u`;
    }
    
    return `
        <tr class="${rowClass}">
            <td>${formattedDate}</td>
            <td>${typeIcon} ${typeText}</td>
            <td>${transaction.category}</td>
            <td>${description}</td>
            <td class="${amountClass}">${amountPrefix}$${transaction.amount.toLocaleString('es-CO')}</td>
            <td>
                <button class="btn btn-primary" onclick="editTransaction(${transaction.id})" style="margin-right: 5px;">
                    ✏️ Editar
                </button>
                <button class="btn btn-danger" onclick="deleteTransaction(${transaction.id})">
                    🗑️ Eliminar
                </button>
            </td>
        </tr>
    `;
}

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

    document.getElementById('totalIncome').textContent = `$${totalIncome.toLocaleString('es-CO')}`;
    document.getElementById('totalExpense').textContent = `$${totalExpense.toLocaleString('es-CO')}`;
    document.getElementById('balance').textContent = `$${balance.toLocaleString('es-CO')}`;

    const balanceElement = document.getElementById('balance');
    balanceElement.className = `amount balance ${balance < 0 ? 'negative' : ''}`;
}

// ===== FUNCIONES DE INVENTARIO =====
function generateProductCode(category) {
    const prefixes = {
        capilar: 'C', barba: 'B', facial: 'F', maquinas: 'M', insumos: 'I'
    };
    
    const categoryNames = {
        capilar: ['CI', 'CB', 'CPI', 'CPR', 'SI'],
        barba: ['MK', 'AR', 'AI', 'CBI', 'SBI', 'CRI', 'DR'],
        facial: ['EI', 'EO', 'MN', 'ASC'],
        maquinas: ['TN', 'PK'],
        insumos: ['CU', 'AS', 'ASP', 'SG', 'SGP', 'CD', 'CL', 'TB']
    };
    
    const existingCodes = productInventory[category] ? productInventory[category].map(p => p.code) : [];
    
    if (categoryNames[category]) {
        for (let prefix of categoryNames[category]) {
            let number = 1;
            let code;
            
            do {
                code = `${prefix}${number.toString().padStart(3, '0')}`;
                number++;
            } while (existingCodes.includes(code));
            
            if (number <= 999) return code;
        }
    }
    
    const prefix = prefixes[category] || 'PRD';
    let number = 1;
    let code;
    
    do {
        code = `${prefix}${number.toString().padStart(3, '0')}`;
        number++;
    } while (existingCodes.includes(code));
    
    return code;
}

function addNewProduct() {
    const modal = createModal(`
        <h3 style="color: #2c3e50; margin-bottom: 20px; text-align: center;">➕ Agregar Nuevo Producto</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Categoría</label>
                <select id="newProductCategory" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px;">
                    <option value="">Seleccionar...</option>
                    <option value="capilar">💇‍♂️ Capilar</option>
                    <option value="barba">🧔 Barba</option>
                    <option value="facial">👨‍🦲 Facial</option>
                    <option value="maquinas">🔧 Máquinas</option>
                    <option value="insumos">📦 Insumos Barbería</option>
                </select>
            </div>
            <div>
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Código (Automático)</label>
                <input type="text" id="newProductCode" placeholder="Se genera automáticamente" readonly 
                       style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px; background: #f8f9fa;">
            </div>
            <div style="grid-column: 1 / -1;">
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Nombre del Producto</label>
                <input type="text" id="newProductName" placeholder="Ej: Cera Inmortal" 
                       style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Precio</label>
                <input type="number" id="newProductPrice" step="1" placeholder="0" 
                       style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Stock Inicial</label>
                <input type="number" id="newProductStock" min="0" placeholder="0" 
                       style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px;">
            </div>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: center;">
            <button onclick="saveNewProduct()" style="background: linear-gradient(135deg, #444b1d 0%, #5a6123 100%); color: white; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight: bold;">💾 Guardar Producto</button>
            <button onclick="closeModal()" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight: bold;">❌ Cancelar</button>
        </div>
    `);
    
    document.getElementById('newProductCategory').addEventListener('change', function() {
        const category = this.value;
        if (category) {
            document.getElementById('newProductCode').value = generateProductCode(category);
        }
    });
}

function saveNewProduct() {
    const data = {
        category: document.getElementById('newProductCategory').value,
        name: document.getElementById('newProductName').value,
        price: parseFloat(document.getElementById('newProductPrice').value),
        stock: parseInt(document.getElementById('newProductStock').value),
        code: document.getElementById('newProductCode').value
    };
    
    if (!data.category || !data.name || !data.price || !data.stock || !data.code) {
        alert('⚠️ Por favor, completa todos los campos');
        return;
    }
    
    if (data.price <= 0) {
        alert('⚠️ El precio debe ser mayor a 0');
        return;
    }
    
    if (data.stock < 0) {
        alert('⚠️ El stock no puede ser negativo');
        return;
    }
    
    if (!productInventory[data.category]) {
        productInventory[data.category] = [];
    }
    
    productInventory[data.category].push({
        code: data.code,
        name: data.name,
        price: data.price,
        stock: data.stock
    });
    
    saveProductInventory();
    closeModal();
    updateProductOptions();
    showSuccessMessage(`✅ Producto ${data.code} agregado exitosamente`);
}

function viewInventory() {
    let inventoryHTML = `
        <h3 style="color: #2c3e50; margin-bottom: 20px; text-align: center;">📦 Inventario de Productos de Barbería</h3>
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: linear-gradient(135deg, #444b1d 0%, #3a4019 100%); color: white;">
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Código</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Categoría</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Producto</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Precio</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Stock</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Estado</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    Object.keys(productInventory).forEach(category => {
        productInventory[category].forEach(product => {
            const stockStyle = product.stock <= 5 ? 'color: #dc3545; font-weight: bold;' : 
                             product.stock <= 10 ? 'color: #ffc107; font-weight: bold;' : 'color: #28a745;';
            const stockStatus = product.stock <= 5 ? '🔴 Crítico' : 
                              product.stock <= 10 ? '🟡 Bajo' : '🟢 Normal';
            
            inventoryHTML += `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>${product.code}</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${category.charAt(0).toUpperCase() + category.slice(1)}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${product.name}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">$${product.price.toLocaleString('es-CO')}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; ${stockStyle}">${product.stock}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${stockStatus}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                        <button onclick="editProductStock('${category}', '${product.code}')" style="background: #444b1d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">📝 Stock</button>
                    </td>
                </tr>
            `;
        });
    });
    
    inventoryHTML += `
                </tbody>
            </table>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: center;">
            <button onclick="exportInventory()" style="background: #444b1d; color: white; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight: bold;">📊 Exportar Inventario</button>
            <button onclick="closeModal()" style="background: #dc3545; color: white; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight: bold;">❌ Cerrar</button>
        </div>
    `;
    
    createModal(inventoryHTML);
}

function editProductStock(category, code) {
    const product = productInventory[category].find(p => p.code === code);
    if (!product) return;
    
    const newStock = prompt(`Actualizar stock para ${product.name} (${code})\nStock actual: ${product.stock}`, product.stock);
    
    if (newStock !== null && !isNaN(newStock) && parseInt(newStock) >= 0) {
        product.stock = parseInt(newStock);
        saveProductInventory();
        showSuccessMessage(`✅ Stock actualizado para ${code}`);
        closeModal();
        setTimeout(() => viewInventory(), 100);
    }
}

// ===== FUNCIONES DE EXPORTACIÓN =====
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

    downloadCSV(csvContent, `gastos_ingresos_${new Date().toISOString().split('T')[0]}.csv`);
    showSuccessMessage('📊 Archivo CSV descargado exitosamente');
}

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
    
    downloadCSV(csvContent, `inventario_productos_${new Date().toISOString().split('T')[0]}.csv`);
    showSuccessMessage('📊 Inventario exportado exitosamente');
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            
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
    event.target.value = '';
}

// ===== FUNCIONES DE PERSISTENCIA =====
function saveDataToLocalStorage() {
    try {
        localStorage.setItem('expenseTrackerData', JSON.stringify(transactions));
    } catch (error) {
        console.warn('No se pudieron guardar los datos localmente:', error);
    }
}

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

function saveProductInventory() {
    try {
        localStorage.setItem('productInventory', JSON.stringify(productInventory));
    } catch (error) {
        console.warn('No se pudo guardar el inventario:', error);
    }
}

function loadProductInventory() {
    try {
        const savedInventory = localStorage.getItem('productInventory');
        if (savedInventory) {
            const loadedInventory = JSON.parse(savedInventory);
            if (Object.keys(loadedInventory).length > 0) {
                productInventory = loadedInventory;
                console.log('Inventario cargado desde localStorage');
            }
        }
    } catch (error) {
        console.warn('No se pudo cargar el inventario:', error);
    }
}

// ===== FUNCIONES DE UTILIDAD =====
function clearAllData() {
    if (confirm('🚨 ¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
        transactions = [];
        saveDataToLocalStorage();
        filterTransactions();
        updateSummary();
        showSuccessMessage('🗑️ Todos los datos han sido eliminados');
    }
}

function showSuccessMessage(message) {
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: fadeInOut 3s ease-in-out;
    `;
    
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'inventory-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 95%;
            max-height: 90%;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.inventory-modal');
    if (modal) {
        modal.remove();
    }
}

function debugInventory() {
    console.log('=== DEBUG INVENTARIO ===');
    console.log('productInventory:', productInventory);
    Object.keys(productInventory).forEach(category => {
        console.log(`Categoría ${category}:`, productInventory[category]);
    });
    console.log('========================');
}

function resetInventoryToDefault() {
    productInventory = {
        capilar: [
            { code: 'CI001', name: 'Cera Inmortal', price: 42000, stock: 20 },
            { code: 'CB001', name: 'Cera Mr. Buff', price: 40000, stock: 12 },
            { code: 'CPI001', name: 'Cera en Polvo Inmortal', price: 42000, stock: 3 },
            { code: 'CPR001', name: 'Cera en Polvo Roterbart', price: 42000, stock: 3 },
            { code: 'SI001', name: 'Shampoo Inmortal', price: 36000, stock: 2 }
        ],
        barba: [
            { code: 'MK001', name: 'Minoxidil Kirkland', price: 45000, stock: 12 },
            { code: 'AR001', name: 'Aceite Barba Roterbart', price: 35000, stock: 6 },
            { code: 'AI001', name: 'Aceite Barba Inmortal', price: 38000, stock: 2 },
            { code: 'CBI001', name: 'Cera Barba Inmortal', price: 36000, stock: 2 },
            { code: 'SBI001', name: 'Shampoo Barba Inmortal', price: 36000, stock: 2 },
            { code: 'CRI001', name: 'Crema Barba Inmortal', price: 38000, stock: 2 },
            { code: 'DR001', name: 'Derma Roller', price: 20000, stock: 10 }
        ],
        facial: [
            { code: 'EI001', name: 'Exfoliante Inmortal', price: 17000, stock: 5 },
            { code: 'EO001', name: 'Exfoliante Ossion', price: 35000, stock: 3 },
            { code: 'MN001', name: 'Mascarilla Negra Nevada', price: 25000, stock: 3 },
            { code: 'ASC001', name: 'After Shave Crema Red One', price: 50000, stock: 6 }
        ],
        maquinas: [
            { code: 'TN001', name: 'Trimmer Nariz', price: 47000, stock: 3 },
            { code: 'PK001', name: 'Patillera Kemei', price: 80000, stock: 6 }
        ],
        insumos: [
            { code: 'CU001', name: 'Cuelleros', price: 16000, stock: 12 },
            { code: 'AS001', name: 'After Shave', price: 20000, stock: 3 },
            { code: 'ASP001', name: 'After Shave Pequeño', price: 6000, stock: 3 },
            { code: 'SG001', name: 'Shaving Gel', price: 23000, stock: 6 },
            { code: 'SGP001', name: 'Shaving Gel Pequeño', price: 6000, stock: 6 },
            { code: 'CD001', name: 'Cuchillas Dórco', price: 13000, stock: 10 },
            { code: 'CL001', name: 'Cuchillas Level 3', price: 23000, stock: 3 },
            { code: 'TB001', name: 'Talco Mr Buffel', price: 18000, stock: 10 }
        ]
    };
    saveProductInventory();
    console.log('Inventario reseteado a valores por defecto');
}

// ===== ESTILOS CSS =====
function addStyles() {
    const styles = `
        <style>
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
            
            .success-message {
                animation: fadeInOut 3s ease-in-out;
            }
            
            .amount-positive {
                color: #28a745 !important;
                font-weight: bold;
            }
            
            .amount-negative {
                color: #dc3545 !important;
                font-weight: bold;
            }
            
            .income-row {
                border-left: 4px solid #28a745;
                background-color: rgba(40, 167, 69, 0.05);
            }
            
            .expense-row {
                border-left: 4px solid #dc3545;
                background-color: rgba(220, 53, 69, 0.05);
            }
            
            .btn {
                padding: 6px 12px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
                margin: 2px;
            }
            
            .btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #444b1d 0%, #5a6123 100%);
                color: white;
            }
            
            .btn-danger {
                background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                color: white;
            }
            
            .btn-info {
                background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
                color: white;
            }
            
            .inventory-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            
            .stock-low {
                color: #dc3545;
                font-weight: bold;
            }
            
            .stock-medium {
                color: #ffc107;
                font-weight: bold;
            }
            
            .stock-high {
                color: #28a745;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// ===== INICIALIZACIÓN Y EVENTOS =====
document.addEventListener('DOMContentLoaded', function() {
    init();
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ===== FUNCIONES GLOBALES =====
// Exportar funciones al objeto window para uso desde HTML
window.addTransaction = addTransaction;
window.deleteTransaction = deleteTransaction;
window.editTransaction = editTransaction;
window.exportToCSV = exportToCSV;
window.clearAllData = clearAllData;
window.importFromCSV = importFromCSV;
window.addNewProduct = addNewProduct;
window.saveNewProduct = saveNewProduct;
window.viewInventory = viewInventory;
window.editProductStock = editProductStock;
window.exportInventory = exportInventory;
window.closeModal = closeModal;
window.debugInventory = debugInventory;
window.resetInventoryToDefault = resetInventoryToDefault;

// ===== DEBUG Y UTILIDADES EXTRA =====
console.log('Expense Tracker JS cargado correctamente');
console.log('Funciones disponibles:', [
    'addTransaction', 'deleteTransaction', 'editTransaction',
    'exportToCSV', 'clearAllData', 'importFromCSV',
    'addNewProduct', 'saveNewProduct', 'viewInventory',
    'editProductStock', 'exportInventory', 'debugInventory'
]);

// Función para mostrar estadísticas rápidas
window.showStats = function() {
    console.log('=== ESTADÍSTICAS RÁPIDAS ===');
    console.log(`Total transacciones: ${transactions.length}`);
    console.log(`Total productos: ${Object.values(productInventory).flat().length}`);
    console.log(`Categorías de productos: ${Object.keys(productInventory).length}`);
    
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    console.log(`Total ingresos históricos: ${totalIncome.toLocaleString('es-CO')}`);
    console.log(`Total gastos históricos: ${totalExpense.toLocaleString('es-CO')}`);
    console.log(`Balance histórico: ${(totalIncome - totalExpense).toLocaleString('es-CO')}`);
    console.log('===============================');
};

// Función para backup manual
window.backupData = function() {
    const backup = {
        transactions: transactions,
        inventory: productInventory,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_alpha_style_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showSuccessMessage('💾 Backup creado y descargado');
};

// Función para restaurar backup
window.restoreBackup = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            if (backup.transactions && backup.inventory) {
                if (confirm('¿Estás seguro de que quieres restaurar este backup? Esto sobrescribirá todos los datos actuales.')) {
                    transactions = backup.transactions;
                    productInventory = backup.inventory;
                    
                    saveDataToLocalStorage();
                    saveProductInventory();
                    filterTransactions();
                    updateSummary();
                    
                    showSuccessMessage('✅ Backup restaurado exitosamente');
                }
            } else {
                alert('❌ Archivo de backup inválido');
            }
        } catch (error) {
            alert('❌ Error al leer el archivo de backup');
        }
    };
    
    reader.readAsText(file);
    event.target.value = '';
};

console.log('🎉 Control de Gastos e Ingresos - Alpha Style inicializado correctamente');
console.log('💡 Usa showStats() para ver estadísticas rápidas');
console.log('💾 Usa backupData() para crear un backup manual');