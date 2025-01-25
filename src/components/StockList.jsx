import React from 'react';
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

export function StockList({ stocks, onEdit, onDelete }) {
  const getPerformanceColor = (buyPrice, currentPrice) => {
    const performance = ((currentPrice - buyPrice) / buyPrice) * 100;
    return performance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-purple-600 to-indigo-600">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Buy Price</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Current Price</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Performance</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock) => {
              const performanceColor = getPerformanceColor(stock.buyPrice, stock.currentPrice);
              const performance = ((stock.currentPrice - stock.buyPrice) / stock.buyPrice) * 100;
              
              return (
                <tr key={stock.id} className="hover:bg-purple-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-purple-700">{stock.symbol}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{stock.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{stock.quantity}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">${stock.buyPrice.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">${stock.currentPrice.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${performanceColor}`}>
                      {performance >= 0 ? (
                        <TrendingUp size={16} className="mr-1" />
                      ) : (
                        <TrendingDown size={16} className="mr-1" />
                      )}
                      <span className="text-sm font-medium">{performance.toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onEdit(stock)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(stock.id)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}