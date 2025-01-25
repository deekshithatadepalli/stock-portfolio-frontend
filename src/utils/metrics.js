export const calculateMetrics = (stocks) => {
  const totalValue = stocks.reduce((sum, stock) => sum + stock.currentPrice * stock.quantity, 0);

  const topPerformer = stocks.reduce((top, stock) => {
    if (!top) return stock;
    const currentReturn = (stock.currentPrice - stock.buyPrice) / stock.buyPrice;
    const topReturn = (top.currentPrice - top.buyPrice) / top.buyPrice;
    return currentReturn > topReturn ? stock : top;
  }, stocks[0]);

  const portfolioDistribution = stocks.map(stock => ({
    symbol: stock.symbol,
    percentage: totalValue > 0 ? (stock.currentPrice * stock.quantity / totalValue) * 100 : 0
  }));

  return {
    totalValue,
    topPerformer: topPerformer || null,
    portfolioDistribution
  };
};