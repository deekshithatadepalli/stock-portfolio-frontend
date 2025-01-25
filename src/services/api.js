import { API_CONFIG } from "./config";
import { handleApiError, delay } from "./utils";
import { mockStocks } from "./mockData";

class StockApi {
  async fetchStocks() {
    try {
      if (API_CONFIG.mockEnabled) {
        await delay(API_CONFIG.mockDelay);
        return [...mockStocks];
      }

      const response = await fetch(`${API_CONFIG.baseUrl}/stocks`);
      if (!response.ok) throw new Error("Failed to fetch stocks");
      return response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async addStock(stock) {
    try {
      if (API_CONFIG.mockEnabled) {
        await delay(API_CONFIG.mockDelay);

        mockStocks.push(stock);
        return stock;
      }

      const response = await fetch(`${API_CONFIG.baseUrl}/stocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stock),
      });
      if (!response.ok) throw new Error("Failed to add stock");
      return response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateStock(id, stockData) {
    try {
      if (API_CONFIG.mockEnabled) {
        await delay(API_CONFIG.mockDelay);
        const index = mockStocks.findIndex((s) => s.id === id);
        if (index === -1) throw new Error("Stock not found");

        mockStocks[index] = {
          ...mockStocks[index],
          ...stockData,
          currentPrice: stockData.buyPrice
            ? stockData.buyPrice * 1.1
            : mockStocks[index].currentPrice,
        };
        return mockStocks[index];
      }

      const response = await fetch(`${API_CONFIG.baseUrl}/stocks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stockData),
      });
      if (!response.ok) throw new Error("Failed to update stock");
      return response.json();
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteStock(id) {
    try {
      if (API_CONFIG.mockEnabled) {
        await delay(API_CONFIG.mockDelay);
        const index = mockStocks.findIndex((s) => s.id === id);
        if (index === -1) throw new Error("Stock not found");
        mockStocks.splice(index, 1);
        return;
      }

      const response = await fetch(`${API_CONFIG.baseUrl}/stocks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete stock");
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const stockApi = new StockApi();
