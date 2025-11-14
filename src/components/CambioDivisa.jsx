// src/components/CambioDivisa.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/cambioDivisa.css';

const CambioDivisa = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '71653b5ed6a7daa58940ce22';

  const currencies = [
    { value: 'USD', label: 'Dólar americano', flag: 'USD.png' },
    { value: 'EUR', label: 'Euro', flag: 'EUR.png' },
    { value: 'CHF', label: 'Franco suizo', flag: 'CHF.png' },
    { value: 'JPY', label: 'Yen japonés', flag: 'JPY.png' },
    { value: 'HKD', label: 'Dólar hongkonés', flag: 'HKD.png' },
    { value: 'CAD', label: 'Dólar canadiense', flag: 'CAD.png' },
    { value: 'CNY', label: 'Yuan chino', flag: 'CNY.png' },
    { value: 'AUD', label: 'Dólar australiano', flag: 'AUD.png' },
    { value: 'BRL', label: 'Real brasileño', flag: 'BRL.png' },
    { value: 'RUB', label: 'Rublo ruso', flag: 'RUB.png' },
    { value: 'COP', label: 'Peso Colombiano', flag: 'COP.png' },
    { value: 'PEN', label: 'Sol Peruano', flag: 'PEN.png' },
    { value: 'MXN', label: 'Peso Mexicano', flag: 'MXN.png' },
    { value: 'KRW', label: 'Won Surcoreano', flag: 'KRW.png' },
    { value: 'IDR', label: 'Rupia Indonesia', flag: 'IDR.png' },
  ];

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
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = (amount, to, rates) => {
    if (rates && rates[to]) {
      return (amount * rates[to]).toFixed(2);
    }
    return null;
  };

  const handleConvert = async () => {
    if (amount && fromCurrency && toCurrency) {
      const rates = await fetchExchangeRate(fromCurrency);
      if (rates) {
        const converted = convertCurrency(amount, toCurrency, rates);
        setConvertedAmount(converted);
      }
    }
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
    setToCurrency('');
    setConvertedAmount(null);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
    setConvertedAmount(null);
  };

  const fromCurrencyObj = currencies.find(c => c.value === fromCurrency);
  const toCurrencyObj = currencies.find(c => c.value === toCurrency);

  return (
    <div className="container mt-5">
      <div className='box-central'>
        <h1 className="text-center mb-4">Convertidor de Divisas</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Monto</label>
            <input
              type="number"
              id="amount"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {fromCurrencyObj && (
            <div className="mb-3 text-center">
              <img
                src={`/flags/${fromCurrencyObj.flag}`}
                alt={fromCurrencyObj.label}
                width="40"
                height="30"
              />
            </div>
          )}

          <div className="mb-3 text-center">
            <label htmlFor="fromCurrency" className="form-label">De</label>
            <select
              id="fromCurrency"
              className="form-select"
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
          {toCurrencyObj && (
            <div className="mb-3 text-center">
              <img
                src={`/flags/${toCurrencyObj.flag}`}
                alt={toCurrencyObj.label}
                width="40"
                height="30"
              />
            </div>
          )}

          <div className="mb-3 text-center">
            <label htmlFor="toCurrency" className="form-label">A</label>
            <select
              id="toCurrency"
              className="form-select"
              value={toCurrency}
              onChange={handleToCurrencyChange}
            >
              <option value="">Seleccione moneda</option>
              {currencies
                .filter(currency => currency.value !== fromCurrency)
                .map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
              ))}
            </select>
          </div>

          <button className="btn btn-dark w-100" onClick={handleConvert}>Convertir</button>

          {loading && <p className="mt-3 text-center">Cargando...</p>}
          {error && <p className="mt-3 text-center text-danger">Error: {error}</p>}
          {convertedAmount !== null && toCurrency && (
            <div className="mt-3 text-center">
              <h4>Resultado: {convertedAmount} {toCurrency}</h4>
            </div>
          )}

        </div>
      </div>

      </div>
    </div>
  );
};

export default CambioDivisa;



