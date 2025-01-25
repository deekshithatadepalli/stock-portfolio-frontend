import React from 'react';
import { LineChart, TrendingUp, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard({ stocks, metrics }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-800">Total Value</h3>
          <LineChart className="text-purple-500" size={24} />
        </div>
        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
          ${metrics.totalValue.toLocaleString()}
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-indigo-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-indigo-800">Top Performer</h3>
          <TrendingUp className="text-indigo-500" size={24} />
        </div>
        <div className="space-y-2">
          <p className="text-xl font-semibold text-indigo-600">{metrics.topPerformer?.name}</p>
          <p className="text-sm text-indigo-400">{metrics.topPerformer?.symbol}</p>
        </div>
      </div>

      <div 
        className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200 border border-purple-100 cursor-pointer"
        onClick={() => navigate('/distribution')}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-800">Distribution</h3>
          <PieChart className="text-purple-500" size={24} />
        </div>
        <div className="space-y-3">
          {metrics.portfolioDistribution.slice(0, 3).map(({ symbol, percentage }) => (
            <div key={symbol} className="flex justify-between items-center">
              <span className="text-sm font-medium text-purple-600">{symbol}</span>
              <div className="flex items-center">
                <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-indigo-600">{percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
          {metrics.portfolioDistribution.length > 3 && (
            <p className="text-sm text-purple-600 text-center mt-2">
              Click to view all {metrics.portfolioDistribution.length} stocks
            </p>
          )}
        </div>
      </div>
    </div>
  );
}