import React from 'react';

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 text-center shadow-lg">
      <p className="text-sm font-medium">
        Designed and developed by Deekshitha • Please note Alpha Vantage limits API calls to 25 requests per day under free tier 
      </p>
    </footer>
  );
}