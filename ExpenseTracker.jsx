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

  // Estados
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    category: '',
    description: '',
    amount: ''
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

  // Funciones
  const showSuccess = (message) => {
    setSuccessMessage(message);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

    const newTransaction = {
      id: Date.now(),
      date,
      type,
      category,
      description,
      amount: parseFloat(amount)
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

  const { totalIncome, totalExpense, balance } = calculateSummary();
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 11}, (_, i) => currentYear - 5 + i);
  const months = [
    { value: 1, name: 'Enero' }, { value: 2, name: 'Febrero' }, { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' }, { value: 5, name: 'Mayo' }, { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' }, { value: 8, name: 'Agosto' }, { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' }, { value: 11, name: 'Noviembre' }, { value: 12, name: 'Diciembre' }
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
                        
                        return (
                          <tr key={transaction.id} className={`hover:bg-gray-50 transition-colors duration-200 ${rowClass}`}>
                            <td className="p-4">{formattedDate}</td>
                            <td className="p-4">{typeIcon} {typeText}</td>
                            <td className="p-4">{transaction.category}</td>
                            <td className="p-4">{transaction.description}</td>
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
};

export default ExpenseTracker;