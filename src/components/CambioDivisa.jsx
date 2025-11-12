// src/components/CambioDivisa.jsx
import React, { useState } from 'react';

const CambioDivisa = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '71653b5ed6a7daa58940ce22';

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
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            <option value="USD">Dólar americano</option>
            <option value="EUR">Euro</option>
            <option value="CHF">Franco suizo</option>
            <option value="JPY">Yen japonés</option>
            <option value="HKD">Dólar hongkonés</option>
            <option value="CAD">Dólar canadiense</option>
            <option value="CNY">Yuan chino</option>
            <option value="AUD">Dólar australiano</option>
            <option value="BRL">Real brasileño</option>
            <option value="RUB">Rublo ruso</option>
            <option value="COP">Peso Colombiano</option>
            <option value="PEN">Sol Peruano</option>
          </select>
        </div>
        <div>
          <label htmlFor="toCurrency">A</label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            <option value="USD">Dólar americano</option>
            <option value="EUR">Euro</option>
            <option value="CHF">Franco suizo</option>
            <option value="JPY">Yen japonés</option>
            <option value="HKD">Dólar hongkonés</option>
            <option value="CAD">Dólar canadiense</option>
            <option value="CNY">Yuan chino</option>
            <option value="AUD">Dólar australiano</option>
            <option value="BRL">Real brasileño</option>
            <option value="RUB">Rublo ruso</option>
            <option value="COP">Peso Colombiano</option>
            <option value="PEN">Sol Peruano</option>
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