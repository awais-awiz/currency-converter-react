import React, { useEffect, useState } from "react";
import { countryList } from "./countryList";
import "./App.css";

const BASE_FLAG_URL = "https://flagsapi.com";
const BASE_RATE_URL = "https://api.exchangerate-api.com/v4/latest";

export default function App() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setconvertedAmount] = useState(0);
  const [submittedAmount, setSubmittedAmount] = useState(1);

  function conversion(am) {
    fetch(`${BASE_RATE_URL}/${fromCurrency}`)
      .then((res) => res.json())
      .then((data) => {
        const rate = data.rates[toCurrency];
        setconvertedAmount((am * rate).toFixed(2));
      })
      .catch((error) => {
        console.error("Error fetching exchange rate:", error);
      });
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    conversion(amount < 1 ? 1 : amount);
  }, [fromCurrency, toCurrency]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validAmount = !amount || amount < 1 ? 1 : amount;
    setSubmittedAmount(validAmount);
    setAmount(validAmount);
    conversion(validAmount);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setAmount("");
      return;
    }
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      setAmount(numericValue);
    }
  };

  return (
    <div className="container fontclr">
      <h1 className="Heading">Currency Converter</h1>

      <form onSubmit={handleSubmit}>
        <label className="form-label">Enter Amount</label>
        <input type="number" id="amount" className="background fontclr" placeholder="Amount" min="1" value={amount} onChange={handleAmountChange} />

        <div className="dropdown">
            <div className="box">
                <label className="form-label">From</label>
                <div className="selectcontainer background">
                    <img src={`${BASE_FLAG_URL}/${countryList[fromCurrency]}/shiny/64.png`} alt="From Flag" />
                    <select name="from" value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                          {Object.keys(countryList).map((code) => (
                          <option key={code} value={code}> {code} </option>))}
                    </select>
                </div>
            </div>

          <div className="swap-icon background" onClick={handleSwapCurrencies}>
            <svg width="16" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg"><path d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .17.35h1.97c.13 0 .25-.06.33-.16l4.59-5.78a.9.9 0 0 0-.7-1.43zM19.78 5.29H3.34L7.26.35A.22.22 0 0 0 7.09 0H5.12a.22.22 0 0 0-.34.16L.19 5.94a.9.9 0 0 0 .68 1.4H19.78a.22.22 0 0 0 .22-.22V5.51a.22.22 0 0 0-.22-.22z"fill="#fff" /></svg>
          </div>

            <div className="box">
                <label className="form-label">To</label>
                <div className="selectcontainer background">
                    <img src={`${BASE_FLAG_URL}/${countryList[toCurrency]}/shiny/64.png`} alt="To Flag" />
                    <select name="to" value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} >
                          {Object.keys(countryList).map((code) => (
                          <option key={code} value={code}>   {code}   </option>))}
                    </select>
                </div>
            </div>
        </div>

        <button id="submit" type="submit"> Get Exchange Rate  </button>
        <h3 id="Total" className="fontclr"> {convertedAmount ? `${submittedAmount} ${fromCurrency} = ${convertedAmount} ${toCurrency}` : ""}</h3>
      </form>
    </div>
  );
}