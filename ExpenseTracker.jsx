import React, { useState, useEffect } from 'react';

const ExpenseTracker = () => {
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

  // Base de datos de productos de belleza capilar
  const initialProductInventory = {
    gel: [
      { code: 'GEL01', name: 'Gel Fijación Extra Fuerte', price: 15.99, stock: 25 },
      { code: 'GEL02', name: 'Gel Modelador Natural', price: 12.50, stock: 30 },
      { code: 'GEL03', name: 'Gel Brillo Intenso', price: 18.75, stock: 15 },
      { code: 'GEL04', name: 'Gel Sin Alcohol', price: 14.25, stock: 20 },
      { code: 'GEL05', name: 'Gel Rizos Definidos', price: 16.80, stock: 18 }
    ],
    shampoo: [
      { code: 'SHP01', name: 'Shampoo Hidratante Intensivo', price: 22.99, stock: 40 },
      { code: 'SHP02', name: 'Shampoo Anti-Caspa', price: 19.50, stock: 35 },
      { code: 'SHP03', name: 'Shampoo Cabello Graso', price: 18.75, stock: 25 },
      { code: 'SHP04', name: 'Shampoo Bebé Suave', price: 16.25, stock: 50 },
      { code: 'SHP05', name: 'Shampoo Matizador Rubio', price: 28.90, stock: 20 }
    ],
    acondicionador: [
      { code: 'ACD01', name: 'Acondicionador Reparador', price: 20.99, stock: 30 },
      { code: 'ACD02', name: 'Acondicionador Sin Enjuague', price: 24.50, stock: 25 },
      { code: 'ACD03', name: 'Acondicionador Volumen', price: 18.75, stock: 28 },
      { code: 'ACD04', name: 'Acondicionador Rizos', price: 22.80, stock: 22 },
      { code: 'ACD05', name: 'Acondicionador Desenredante', price: 19.99, stock: 35 }
    ],
    mascarilla: [
      { code: 'MSC01', name: 'Mascarilla Hidratación Profunda', price: 32.99, stock: 15 },
      { code: 'MSC02', name: 'Mascarilla Reconstrucción', price: 38.50, stock: 12 },
      { code: 'MSC03', name: 'Mascarilla Nutrición Intensa', price: 29.75, stock: 18 },
      { code: 'MSC04', name: 'Mascarilla Cabello Teñido', price: 34.25, stock: 14 },
      { code: 'MSC05', name: 'Mascarilla Anti-Edad', price: 42.90, stock: 10 }
    ],
    tratamiento: [
      { code: 'TRT01', name: 'Tratamiento Keratina', price: 85.99, stock: 8 },
      { code: 'TRT02', name: 'Tratamiento Botox Capilar', price: 95.50, stock: 6 },
      { code: 'TRT03', name: 'Tratamiento Anti-Caída', price: 68.75, stock: 12 },
      { code: 'TRT04', name: 'Tratamiento Crecimiento', price: 72.80, stock: 10 },
      { code: 'TRT05', name: 'Tratamiento Reparación Extrema', price: 89.99, stock: 7 }
    ],
    spray: [
      { code: 'SPR01', name: 'Spray Protector Térmico', price: 26.99, stock: 22 },
      { code: 'SPR02', name: 'Spray Brillo Instantáneo', price: 19.50, stock: 30 },
      { code: 'SPR03', name: 'Spray Volumen Raíces', price: 24.75, stock: 25 },
      { code: 'SPR04', name: 'Spray Desenredante', price: 18.25, stock: 28 },
      { code: 'SPR05', name: 'Spray Fijador Flexible', price: 22.80, stock: 20 }
    ],
    serum: [
      { code: 'SER01', name: 'Serum Puntas Abiertas', price: 34.99, stock: 16 },
      { code: 'SER02', name: 'Serum Crecimiento Rápido', price: 48.50, stock: 12 },
      { code: 'SER03', name: 'Serum Brillo Diamante', price: 29.75, stock: 18 },
      { code: 'SER04', name: 'Serum Anti-Frizz', price: 32.25, stock: 15 },
      { code: 'SER05', name: 'Serum Nutrición Nocturna', price: 42.90, stock: 10 }
    ],
    aceite: [
      { code: 'ACE01', name: 'Aceite Argán Puro', price: 45.99, stock: 14 },
      { code: 'ACE02', name: 'Aceite Coco Virgen', price: 28.50, stock: 20 },
      { code: 'ACE03', name: 'Aceite Jojoba Natural', price: 38.75, stock: 16 },
      { code: 'ACE04', name: 'Aceite Ricino Fortalecedor', price: 22.25, stock: 25 },
      { code: 'ACE05', name: 'Aceite Mezcla 7 Aceites', price: 52.90, stock: 8 }
    ],
    mousse: [
      { code: 'MOU01', name: 'Mousse Volumen Extremo', price: 24.99, stock: 20 },
      { code: 'MOU02', name: 'Mousse Rizos Naturales', price: 26.50, stock: 18 },
      { code: 'MOU03', name: 'Mousse Fijación Media', price: 22.75, stock: 22 },
      { code: 'MOU04', name: 'Mousse Cabello Fino', price: 28.25, stock: 15 },
      { code: 'MOU05', name: 'Mousse Hidratante', price: 25.80, stock: 19 }
    ],
    cera: [
      { code: 'CER01', name: 'Cera Modeladora Mate', price: 18.99, stock: 25 },
      { code: 'CER02', name: 'Cera Brillo Natural', price: 20.50, stock: 22 },
      { code: 'CER03', name: 'Cera Fijación Extrema', price: 24.75, stock: 18 },
      { code: 'CER04', name: 'Cera Texturizante', price: 22.25, stock: 20 },
      { code: 'CER05', name: 'Cera Moldeadora Flexible', price: 19.80, stock: 24 }
    ]
  };

  // Estados
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [productInventory, setProductInventory] = useState(initialProductInventory);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    category: '',
    description: '',
    amount: ''
  });
  const [productData, setProductData] = useState({
    category: '',
    product: null,
    quantity: 1,
    code: '',
    unitPrice: 0,
    total: 0
  });
  const [filters, setFilters] = useState({
    month: '',
    year: '',
    type: ''
  });
  const [currentPeriod, setCurrentPeriod] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Efectos
  useEffect(() => {
    filterTransactions();
  }, [transactions, filters]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (formData.category === 'Ventas' && productData.product && productData.quantity) {
      const total = productData.unitPrice * productData.quantity;
      setProductData(prev => ({ ...prev, total }));
      setFormData(prev => ({ ...prev, amount: total.toString() }));
    }
  }, [productData.unitPrice, productData.quantity, formData.category]);

  // Funciones
  const showSuccess = (message) => {
    setSuccessMessage(message);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar datos de producto si no es venta
    if (field === 'category' && value !== 'Ventas') {
      setProductData({
        category: '',
        product: null,
        quantity: 1,
        code: '',
        unitPrice: 0,
        total: 0
      });
    }
  };

  const handleProductDataChange = (field, value) => {
    setProductData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'category') {
        newData.product = null;
        newData.code = '';
        newData.unitPrice = 0;
        newData.total = 0;
      }
      
      if (field === 'product' && value) {
        const product = JSON.parse(value);
        newData.code = product.code;
        newData.unitPrice = product.price;
        newData.total = product.price * newData.quantity;
        
        // Actualizar descripción automáticamente
        setFormData(prev => ({
          ...prev,
          description: `Venta: ${product.name} (${product.code})`
        }));
      }
      
      return newData;
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTransaction = () => {
    const { date, type, category, description, amount } = formData;
    
    if (!date || !type || !category || !description || !amount) {
      alert('⚠️ Por favor, completa todos los campos');
      return;
    }

    if (parseFloat(amount) <= 0) {
      alert('⚠️ El monto debe ser mayor a 0');
      return;
    }

    // Validaciones especiales para ventas
    if (category === 'Ventas') {
      if (!productData.product) {
        alert('⚠️ Debes seleccionar un producto para registrar una venta');
        return;
      }
      
      const product = JSON.parse(productData.product);
      
      // Verificar stock disponible
      if (product.stock < productData.quantity) {
        alert(`⚠️ Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${productData.quantity}`);
        return;
      }
      
      // Actualizar stock del producto
      setProductInventory(prev => {
        const newInventory = { ...prev };
        const productIndex = newInventory[productData.category].findIndex(p => p.code === product.code);
        if (productIndex !== -1) {
          newInventory[productData.category][productIndex].stock -= productData.quantity;
          
          // Mostrar alerta si el stock queda bajo
          const newStock = newInventory[productData.category][productIndex].stock;
          if (newStock <= 5) {
            setTimeout(() => {
              alert(`⚠️ ALERTA: Stock bajo para ${product.name} (${product.code}). Stock actual: ${newStock}`);
            }, 1000);
          }
        }
        return newInventory;
      });
    }

    const newTransaction = {
      id: Date.now(),
      date,
      type,
      category,
      description,
      amount: parseFloat(amount),
      // Agregar información del producto si es una venta
      ...(category === 'Ventas' && {
        productInfo: {
          code: productData.code,
          quantity: productData.quantity,
          unitPrice: productData.unitPrice
        }
      })
    };

    setTransactions(prev => [...prev, newTransaction]);
    clearForm();
    showSuccess('✅ Movimiento agregado exitosamente');
  };

  const clearForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: '',
      category: '',
      description: '',
      amount: ''
    });
    setProductData({
      category: '',
      product: null,
      quantity: 1,
      code: '',
      unitPrice: 0,
      total: 0
    });
  };

  const deleteTransaction = (id) => {
    if (window.confirm('🗑️ ¿Estás seguro de que quieres eliminar este movimiento?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      showSuccess('✅ Movimiento eliminado');
    }
  };

  const editTransaction = (id) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setFormData({
        date: transaction.date,
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount.toString()
      });
      deleteTransaction(id);
      showSuccess('📝 Datos cargados para edición');
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    if (filters.month) {
      filtered = filtered.filter(t => {
        const transactionMonth = new Date(t.date).getMonth() + 1;
        return transactionMonth == filters.month;
      });
    }

    if (filters.year) {
      filtered = filtered.filter(t => {
        const transactionYear = new Date(t.date).getFullYear();
        return transactionYear == filters.year;
      });
    }

    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    setFilteredTransactions(filtered);
  };

  const calculateSummary = () => {
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() + 1 === currentPeriod.month && 
             transactionDate.getFullYear() === currentPeriod.year;
    });

    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance };
  };

  const exportToCSV = () => {
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
    
    showSuccess('📊 Archivo CSV descargado exitosamente');
  };

  const generateProductCode = (category) => {
    const prefixes = {
      gel: 'GEL',
      shampoo: 'SHP',
      acondicionador: 'ACD',
      mascarilla: 'MSC',
      tratamiento: 'TRT',
      spray: 'SPR',
      serum: 'SER',
      aceite: 'ACE',
      mousse: 'MOU',
      cera: 'CER'
    };
    
    const prefix = prefixes[category] || 'PRD';
    const existingCodes = productInventory[category] ? productInventory[category].map(p => p.code) : [];
    
    let number = 1;
    let code;
    
    do {
      code = `${prefix}${number.toString().padStart(2, '0')}`;
      number++;
    } while (existingCodes.includes(code));
    
    return code;
  };

  const { totalIncome, totalExpense, balance } = calculateSummary();
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 11}, (_, i) => currentYear - 5 + i);
  const months = [
    { value: 1, name: 'Enero' }, { value: 2, name: 'Febrero' }, { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' }, { value: 5, name: 'Mayo' }, { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' }, { value: 8, name: 'Agosto' }, { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' }, { value: 11, name: 'Noviembre' }, { value: 12, name: 'Diciembre' }
  ];

  const productCategories = [
    { value: 'gel', name: 'Geles' },
    { value: 'shampoo', name: 'Shampoos' },
    { value: 'acondicionador', name: 'Acondicionadores' },
    { value: 'mascarilla', name: 'Mascarillas' },
    { value: 'tratamiento', name: 'Tratamientos' },
    { value: 'spray', name: 'Sprays' },
    { value: 'serum', name: 'Serums' },
    { value: 'aceite', name: 'Aceites' },
    { value: 'mousse', name: 'Mousse' },
    { value: 'cera', name: 'Ceras' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-purple-700 p-5">
      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          {successMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-blue-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">💰 Control de Gastos e Ingresos</h1>
          <p className="text-lg opacity-90">Gestiona tus finanzas personales de manera inteligente</p>
        </div>

        {/* Selector de período */}
        <div className="bg-white p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mes Actual</label>
              <select 
                value={currentPeriod.month}
                onChange={(e) => setCurrentPeriod(prev => ({...prev, month: parseInt(e.target.value)}))}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Año Actual</label>
              <input 
                type="number"
                value={currentPeriod.year}
                onChange={(e) => setCurrentPeriod(prev => ({...prev, year: parseInt(e.target.value)}))}
                min="2020"
                max="2030"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gray-50">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-gray-700 font-semibold mb-2">💚 Total Ingresos</h3>
            <div className="text-3xl font-bold text-green-600 mb-1">
              ${totalIncome.toLocaleString('es-ES', {minimumFractionDigits: 2})}
            </div>
            <small className="text-gray-500">Este mes</small>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500 hover:transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-gray-700 font-semibold mb-2">💸 Total Gastos</h3>
            <div className="text-3xl font-bold text-red-600 mb-1">
              ${totalExpense.toLocaleString('es-ES', {minimumFractionDigits: 2})}
            </div>
            <small className="text-gray-500">Este mes</small>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-gray-700 font-semibold mb-2">💰 Balance</h3>
            <div className={`text-3xl font-bold mb-1 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${balance.toLocaleString('es-ES', {minimumFractionDigits: 2})}
            </div>
            <small className="text-gray-500">Ingresos - Gastos</small>
          </div>
        </div>

        {/* Formulario de entrada */}
        <div className="p-8 bg-white border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">➕ Agregar Movimiento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
              <input 
                type="date"
                value={formData.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
              <select 
                value={formData.type}
                onChange={(e) => handleFormChange('type', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Seleccionar...</option>
                <option value="income">💚 Ingreso</option>
                <option value="expense">💸 Gasto</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
              <select 
                value={formData.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Seleccionar categoría...</option>
                {formData.type && categories[formData.type]?.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
              <input 
                type="text"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Descripción del movimiento"
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Monto ($)</label>
              <input 
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleFormChange('amount', e.target.value)}
                placeholder="0.00"
                readOnly={formData.category === 'Ventas'}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="flex items-end">
              <button 
                onClick={addTransaction}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 hover:transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
              >
                Agregar Movimiento
              </button>
            </div>
          </div>

          {/* Sección de Inventario de Productos (solo visible para Ventas) */}
          {formData.category === 'Ventas' && (
            <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Seleccionar Producto de Belleza Capilar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría de Producto</label>
                  <select 
                    value={productData.category}
                    onChange={(e) => handleProductDataChange('category', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Seleccionar categoría...</option>
                    {productCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Producto</label>
                  <select 
                    value={productData.product || ''}
                    onChange={(e) => handleProductDataChange('product', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Seleccionar producto...</option>
                    {productData.category && productInventory[productData.category]?.map(product => (
                      <option 
                        key={product.code} 
                        value={JSON.stringify(product)}
                        className={product.stock <= 5 ? 'text-red-600' : product.stock <= 10 ? 'text-yellow-600' : 'text-green-600'}
                      >
                        {product.name} - Stock: {product.stock}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cantidad</label>
                  <input 
                    type="number"
                    min="1"
                    value={productData.quantity}
                    onChange={(e) => handleProductDataChange('quantity', parseInt(e.target.value))}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Precio Unitario</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={productData.unitPrice}
                    readOnly
                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Código</label>
                  <input 
                    type="text"
                    value={productData.code}
                    readOnly
                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Total</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={productData.total}
                    readOnly
                    className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-100 font-bold"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
                >
                  ➕ Agregar Nuevo Producto
                </button>
                <button 
                  onClick={() => setShowInventoryModal(true)}
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300"
                >
                  📦 Ver Inventario
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="p-8 bg-gray-50">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filtrar por Mes</label>
              <select 
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Todos los meses</option>
                {months.map(month => (
                  <option key={month.value} value={month.value}>{month.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filtrar por Año</label>
              <select 
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Todos los años</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filtrar por Tipo</label>
              <select 
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">Todos</option>
                <option value="income">Ingresos</option>
                <option value="expense">Gastos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de transacciones */}
        <div className="p-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white">
                    <th className="p-4 text-left font-semibold">Fecha</th>
                    <th className="p-4 text-left font-semibold">Tipo</th>
                    <th className="p-4 text-left font-semibold">Categoría</th>
                    <th className="p-4 text-left font-semibold">Descripción</th>
                    <th className="p-4 text-left font-semibold">Monto</th>
                    <th className="p-4 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-10 text-center text-gray-500">
                        🎯 No hay movimientos registrados. ¡Agrega tu primer ingreso o gasto!
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map(transaction => {
                        const formattedDate = new Date(transaction.date).toLocaleDateString('es-ES');
                        const typeIcon = transaction.type === 'income' ? '💚' : '💸';
                        const typeText = transaction.type === 'income' ? 'Ingreso' : 'Gasto';
                        const amountClass = transaction.type === 'income' ? 'text-green-600' : 'text-red-600';
                        const amountPrefix = transaction.type === 'income' ? '+' : '-';
                        const rowClass = transaction.type === 'income' ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500';
                        
                        // Agregar información de producto si es una venta
                        let description = transaction.description;
                        if (transaction.category === 'Ventas' && transaction.productInfo) {
                          description += ` | Qty: ${transaction.productInfo.quantity} | ${transaction.productInfo.unitPrice}/u`;
                        }
                        
                        return (
                          <tr key={transaction.id} className={`hover:bg-gray-50 transition-colors duration-200 ${rowClass}`}>
                            <td className="p-4">{formattedDate}</td>
                            <td className="p-4">{typeIcon} {typeText}</td>
                            <td className="p-4">{transaction.category}</td>
                            <td className="p-4">{description}</td>
                            <td className={`p-4 font-bold ${amountClass}`}>
                              {amountPrefix}${transaction.amount.toFixed(2)}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => editTransaction(transaction.id)}
                                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors duration-200"
                                >
                                  ✏️ Editar
                                </button>
                                <button 
                                  onClick={() => deleteTransaction(transaction.id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors duration-200"
                                >
                                  🗑️ Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sección de exportar */}
        <div className="p-8 bg-gray-50 text-center border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Exportar Datos</h3>
          <button 
            onClick={exportToCSV}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 hover:transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg"
          >
            Descargar CSV
          </button>
        </div>
      </div>

      {/* Modal de Inventario */}
      {showInventoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setShowInventoryModal(false)}>
          <div className="bg-white p-8 rounded-2xl max-w-6xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">📦 Inventario Completo de Productos</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="p-3 text-left">Código</th>
                    <th className="p-3 text-left">Categoría</th>
                    <th className="p-3 text-left">Producto</th>
                    <th className="p-3 text-left">Precio</th>
                    <th className="p-3 text-left">Stock</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(productInventory).map(category => 
                    productInventory[category].map(product => {
                      const stockClass = product.stock <= 5 ? 'text-red-600' : 
                                       product.stock <= 10 ? 'text-yellow-600' : 'text-green-600';
                      const stockStatus = product.stock <= 5 ? '🔴 Crítico' : 
                                        product.stock <= 10 ? '🟡 Bajo' : '🟢 Normal';
                      
                      return (
                        <tr key={product.code} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-bold">{product.code}</td>
                          <td className="p-3">{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                          <td className="p-3">{product.name}</td>
                          <td className="p-3">${product.price.toFixed(2)}</td>
                          <td className={`p-3 font-bold ${stockClass}`}>{product.stock}</td>
                          <td className="p-3">{stockStatus}</td>
                          <td className="p-3">
                            <button 
                              onClick={() => editProductStock(category, product.code)}
                              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors duration-200"
                            >
                              📝 Stock
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 mt-6">
              <button 
                onClick={exportInventory}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                📊 Exportar Inventario
              </button>
              <button 
                onClick={() => setShowInventoryModal(false)}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                ❌ Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Agregar Nuevo Producto */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setShowAddProductModal(false)}>
          <div className="bg-white p-8 rounded-2xl max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">➕ Agregar Nuevo Producto</h3>
            <AddProductForm 
              productInventory={productInventory}
              setProductInventory={setProductInventory}
              setShowAddProductModal={setShowAddProductModal}
              showSuccess={showSuccess}
              generateProductCode={generateProductCode}
              productCategories={productCategories}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease;
        }
      `}</style>
    </div>
  );

  // Función para editar stock de producto
  function editProductStock(category, code) {
    const product = productInventory[category].find(p => p.code === code);
    if (!product) return;
    
    const newStock = prompt(`Actualizar stock para ${product.name} (${code})\nStock actual: ${product.stock}`, product.stock);
    
    if (newStock !== null && !isNaN(newStock) && parseInt(newStock) >= 0) {
      setProductInventory(prev => {
        const newInventory = { ...prev };
        const productIndex = newInventory[category].findIndex(p => p.code === code);
        if (productIndex !== -1) {
          newInventory[category][productIndex].stock = parseInt(newStock);
        }
        return newInventory;
      });
      showSuccess(`✅ Stock actualizado para ${code}`);
      // Refrescar vista del inventario cerrando y abriendo
      setShowInventoryModal(false);
      setTimeout(() => setShowInventoryModal(true), 100);
    }
  }

  // Función para exportar inventario
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
    
    showSuccess('📊 Inventario exportado exitosamente');
  }
};

// Componente para formulario de agregar producto
const AddProductForm = ({ 
  productInventory, 
  setProductInventory, 
  setShowAddProductModal, 
  showSuccess, 
  generateProductCode,
  productCategories 
}) => {
  const [newProduct, setNewProduct] = useState({
    category: '',
    name: '',
    price: '',
    stock: '',
    code: ''
  });

  const handleInputChange = (field, value) => {
    setNewProduct(prev => {
      const updated = { ...prev, [field]: value };
      
      // Generar código automático cuando se selecciona categoría
      if (field === 'category' && value) {
        updated.code = generateProductCode(value);
      }
      
      return updated;
    });
  };

  const saveNewProduct = () => {
    const { category, name, price, stock, code } = newProduct;
    
    if (!category || !name || !price || !stock || !code) {
      alert('⚠️ Por favor, completa todos los campos');
      return;
    }

    if (parseFloat(price) <= 0) {
      alert('⚠️ El precio debe ser mayor a 0');
      return;
    }

    if (parseInt(stock) < 0) {
      alert('⚠️ El stock no puede ser negativo');
      return;
    }
    
    const product = {
      code: code,
      name: name,
      price: parseFloat(price),
      stock: parseInt(stock)
    };
    
    setProductInventory(prev => {
      const newInventory = { ...prev };
      if (!newInventory[category]) {
        newInventory[category] = [];
      }
      newInventory[category].push(product);
      return newInventory;
    });
    
    setShowAddProductModal(false);
    showSuccess(`✅ Producto ${code} agregado exitosamente`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
          <select 
            value={newProduct.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="">Seleccionar...</option>
            {productCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Código (Automático)</label>
          <input 
            type="text"
            value={newProduct.code}
            readOnly
            placeholder="Se genera automáticamente"
            className="w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-100"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Producto</label>
          <input 
            type="text"
            value={newProduct.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ej: Gel Fijación Ultra"
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Precio</label>
          <input 
            type="number"
            step="0.01"
            value={newProduct.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="0.00"
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Inicial</label>
          <input 
            type="number"
            min="0"
            value={newProduct.stock}
            onChange={(e) => handleInputChange('stock', e.target.value)}
            placeholder="0"
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
      
      <div className="flex gap-4 mt-6">
        <button 
          onClick={saveNewProduct}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
        >
          💾 Guardar Producto
        </button>
        <button 
          onClick={() => setShowAddProductModal(false)}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300"
        >
          ❌ Cancelar
        </button>
      </div>
    </div>
  );
};

export default ExpenseTracker;