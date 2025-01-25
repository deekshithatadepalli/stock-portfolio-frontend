import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { StockList } from './components/StockList';
import { StockForm } from './components/StockForm';
import { PortfolioDistribution } from './components/PortfolioDistribution';
import { Footer } from './components/Footer';
import { stockApi } from './services/api';
import { calculateMetrics } from './utils/metrics';
import { Plus } from 'lucide-react';

function MainDashboard() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const metrics = calculateMetrics(stocks);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      setLoading(true);
      const data = await stockApi.fetchStocks();
      setStocks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stocks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (stockData) => {
    try {
      const newStock = await stockApi.addStock(stockData);
      setStocks([...stocks, newStock]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add stock');
    }
  };

  const handleUpdateStock = async (stockData) => {
    if (!selectedStock) return;
    try {
      const updatedStock = await stockApi.updateStock(selectedStock.id, stockData);
      setStocks(stocks.map(s => s.id === selectedStock.id ? updatedStock : s));
      setSelectedStock(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update stock');
    }
  };

  const handleDeleteStock = async (id) => {
    try {
      await stockApi.deleteStock(id);
      setStocks(stocks.filter(s => s.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete stock');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            Portfolio Tracker
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Plus size={18} className="mr-2" />
            Add Stock
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 shadow-md">
            {error}
          </div>
        )}

        <Dashboard stocks={stocks} metrics={metrics} />

        {showForm && (
          <div className="mb-8">
            <StockForm
              stock={selectedStock}
              onSubmit={selectedStock ? handleUpdateStock : handleAddStock}
              onCancel={() => {
                setShowForm(false);
                setSelectedStock(null);
              }}
            />
          </div>
        )}

        <StockList
          stocks={stocks}
          onEdit={(stock) => {
            setSelectedStock(stock);
            setShowForm(true);
          }}
          onDelete={handleDeleteStock}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/distribution" element={<PortfolioDistribution />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;