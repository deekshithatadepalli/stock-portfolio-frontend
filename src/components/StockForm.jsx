import React, { useState, useEffect } from "react";

export function StockForm({ stock, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    quantity: 1,
    buyPrice: 0,
    currentPrice: 0,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (stock) {
      setFormData({
        symbol: stock.symbol,
        name: stock.name,
        quantity: stock.quantity,
        buyPrice: stock.buyPrice,
      });
    }
  }, [stock]);

  const fetchSymbols = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const apiKey = "P4FHM7BI41OQI8A0";
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`
      );
      const data = await response.json();
      const matches = data.bestMatches || [];

      const uniqueCompanies = new Set();
      const filteredSuggestions = matches.filter((symbol) => {
        if (!uniqueCompanies.has(symbol["2. name"])) {
          uniqueCompanies.add(symbol["2. name"]);
          return true;
        }
        return false;
      });

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching symbols:", error);
      setSuggestions([]);
    }
  };

  const handleSymbolChange = async (e) => {
    const value = e.target.value.toUpperCase();
    setFormData({ ...formData, symbol: value });
    setIsSearching(true);
    await fetchSymbols(value);
  };

  const selectSymbol = (symbol, name) => {
    setFormData({
      ...formData,
      symbol: symbol,
      name: name,
    });
    setSuggestions([]);
    setIsSearching(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiKey = "P4FHM7BI41OQI8A0";
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${formData.symbol}&apikey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      console.log(data);

      if (data["Note"] || data["Information"]) {
        throw new Error("API rate limit exceeded");
      }

      const quote = data["Global Quote"];

      if (!quote || !quote["05. price"]) {
        throw new Error("Invalid stock symbol");
      }

      const currentPrice = parseFloat(quote["05. price"]);
      onSubmit({
        ...formData,
        currentPrice: parseFloat(currentPrice.toFixed(2)),
      });
    } catch (error) {
      console.error("Error fetching stock price:", error);
      alert(`The following error occurred: ${error.message}`);
      setFormData({
        symbol: "",
        name: "",
        quantity: 1,
        buyPrice: 0,
        currentPrice: 0,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 space-y-6 border border-purple-100"
    >
      <div className="relative">
        <label
          htmlFor="symbol"
          className="block text-sm font-medium text-purple-700"
        >
          Stock Symbol
        </label>
        <input
          type="text"
          id="symbol"
          value={formData.symbol}
          onChange={handleSymbolChange}
          onFocus={() => setIsSearching(true)}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
          placeholder="Enter stock symbol or company name"
          required
        />
        {isSearching && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
            {suggestions.map((item, index) => (
              <div
                key={index}
                onClick={() => selectSymbol(item["1. symbol"], item["2. name"])}
                className="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors duration-150 flex flex-col"
              >
                <span className="font-medium text-purple-700">
                  {item["1. symbol"]}
                </span>
                <span className="text-sm text-gray-600">{item["2. name"]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-purple-700"
        >
          Company Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
          placeholder="Enter company name"
          required
        />
      </div>

      <div>
        <label
          htmlFor="quantity"
          className="block text-sm font-medium text-purple-700"
        >
          Quantity
        </label>
        <input
          type="number"
          id="quantity"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({
              ...formData,
              quantity: parseInt(e.target.value) || 1,
            })
          }
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
          min="1"
          required
        />
      </div>

      <div>
        <label
          htmlFor="buyPrice"
          className="block text-sm font-medium text-purple-700"
        >
          Buy Price (USD)
        </label>
        <input
          type="number"
          id="buyPrice"
          value={formData.buyPrice}
          onChange={(e) =>
            setFormData({
              ...formData,
              buyPrice: parseFloat(e.target.value) || 0,
            })
          }
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md"
        >
          {stock ? "Update" : "Add"} Stock
        </button>
      </div>
    </form>
  );
}