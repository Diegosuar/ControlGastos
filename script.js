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

// Variables globales
let transactions = [];
let filteredTransactions = [];

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

    const transaction = {
        id: Date.now(),
        date: date,
        type: type,
        category: category,
        description: description,
        amount: amount
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
            
            return `
                <tr class="${rowClass}">
                    <td>${formattedDate}</td>
                    <td>${typeIcon} ${typeText}</td>
                    <td>${transaction.category}</td>
                    <td>${transaction.description}</td>
                    <td class="${amountClass}">${amountPrefix}$${transaction.amount.toFixed(2)}</td>
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