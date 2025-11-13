// src/components/CambioDivisa.jsx
import React, { useState } from 'react';

const CambioDivisa = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '71653b5ed6a7daa58940ce22';

  const currencies = [
    { value: 'USD', label: 'Dólar americano' },
    { value: 'EUR', label: 'Euro' },
    { value: 'CHF', label: 'Franco suizo' },
    { value: 'JPY', label: 'Yen japonés' },
    { value: 'HKD', label: 'Dólar hongkonés' },
    { value: 'CAD', label: 'Dólar canadiense' },
    { value: 'CNY', label: 'Yuan chino' },
    { value: 'AUD', label: 'Dólar australiano' },
    { value: 'BRL', label: 'Real brasileño' },
    { value: 'RUB', label: 'Rublo ruso' },
    { value: 'COP', label: 'Peso Colombiano' },
    { value: 'PEN', label: 'Sol Peruano' },
    { value: 'MXN', label: 'Peso Mexicano' },
    { value: 'KRW', label: 'Won Surcoreano' },
    { value: 'IDR', label: 'Rupia Indonesia' },
  ];

  // Función para conectar con la API y obtener las tasas de cambio
  const fetchExchangeRate = async (from) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`);
      const data = await response.json();
      if (data.result !== 'success') {
        throw new Error(data['error-type']);
      }
      return data.conversion_rates;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para realizar la conversión
  const convertCurrency = (amount, from, to, rates) => {
    if (rates && rates[to]) {
      return (amount * rates[to]).toFixed(2);
    }
    return null;
  };

  const handleConvert = async () => {
    if (amount && fromCurrency && toCurrency) {
      const rates = await fetchExchangeRate(fromCurrency);
      if (rates) {
        const converted = convertCurrency(amount, fromCurrency, toCurrency, rates);
        setConvertedAmount(converted);
      }
    }
  };

  const handleFromCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    setFromCurrency(selectedCurrency);
    setToCurrency('');
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  const filteredOptions = currencies.filter(currency => currency.value !== fromCurrency);

  return (
    <div>
      <h1>Convertidor de Divisas</h1>
      <div>
        <div>
          <label htmlFor="amount">Monto</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="fromCurrency">De</label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={handleFromCurrencyChange}
          >
            {currencies.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="toCurrency">A</label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={handleToCurrencyChange}
          >
            {filteredOptions.map((currency) => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleConvert}>Convertir</button>
        {loading && <p>Cargando...</p>}
        {error && <p>Error: {error}</p>}
        {convertedAmount !== null && (
          <div>
            <h4>Resultado: {convertedAmount} {toCurrency}</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default CambioDivisa;