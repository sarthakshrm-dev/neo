import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [token, setToken] = useState("btcusdt");
  const [logo, setLogo] = useState("btc");
  const [price, setPrice] = useState("0");
  const [popUp, setPopUp] = useState(false);
  const [cryptoList, setCryptoList] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    console.log(quantity);
  }, [quantity])

  useEffect(() => {
    console.log("yes");
    axios
      .get("https://api.binance.com/api/v3/exchangeInfo")
      .then((response) => {
        const topCrypto = [
          "BTC",
          "ETH",
          "BNB",
          "DOGE",
          "ADX",
          "XRP",
          "ZEN",
          "VEN",
          "LTC",
          "KNC",
          "BCH",
          "XZC",
          "XLM",
          "NAV",
          "EOS",
          "TRX",
          "MONA",
          "OMG",
          "PPC",
          "RDN",
        ];
        const cryptoData = [];
        response.data.symbols
          .filter((symbol) => symbol.quoteAsset === "USDT")
          .map((symbol) => {
            topCrypto.map((coin) => {
              if (symbol.baseAsset === coin) {
                cryptoData.push({
                  base: symbol.baseAsset,
                  quote: symbol.quoteAsset,
                });
              }
            });
          });
        setCryptoList(cryptoData);
        setFilteredItems(cryptoData)
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const socket = new WebSocket(
      `wss://stream.binance.com:443/ws/${token}@trade`
    );

    socket.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      const p = parseFloat(trade.p)*80;
      setPrice(p.toFixed(2));
    };

    return () => {
      socket.close();
    };
  }, [token]);

  const handleSearch = (e) => {
    if(e.target.value.length>0) {
      const filtered = cryptoList.filter(item => (item.base+item.quote).toUpperCase().startsWith(e.target.value.toUpperCase()));
      setFilteredItems(filtered);
    }
    else {
      setFilteredItems(cryptoList)
    }
  }

  return (
    <div className="App">
      {popUp && (
        <div className="popUpWindow">
          <div className="popUpContainer">
            <div className="popUp">
              <button className="close" onClick={() => setPopUp(false)}>
                X
              </button>

              <div className="tokenList">
                <input
                  className="search"
                  type="text"
                  placeholder="Search Chains"
                  onChange={handleSearch}
                />
                <ul>
                  {filteredItems.map((x) => {
                    return (
                      <li
                      className={token===x.base.toLowerCase()+x.quote.toLowerCase() && 'active'}
                        onClick={() => {
                          setLogo(x.base.toLowerCase());
                          setToken(x.base.toLowerCase() + x.quote.toLowerCase());
                        }}
                      >
                        <div>
                        <img
                          src={require('./images/token logos/' + x.base + '.png')}
                        />
                        {x.base + x.quote}
                        </div>
                        <img
                          className={token===x.base.toLowerCase()+x.quote.toLowerCase() ? 'visible' : 'hidden'}
                          src={require('./images/selected.png')}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="navBar">
        <img src={require("./images/logo.png")} />
        <div className="links">
          <div className="activeLink">Trade</div>
          <div className="link">Earn</div>
          <div className="link">Support</div>
          <div className="link">About</div>
        </div>
        <button className="btn">Connect Wallet</button>
      </div>
      <div className="flexContainer">
        <div className="container">
          <img
            className="logo"
            src={require(`./images/token logos/${logo.toUpperCase()}.png`)}
          />
          <div className="content">
            <div className="priceContainer heading">
              <div>Current Price</div>
              <div className="price">₹ {price}</div>
            </div>
            <div className="select" onClick={() => setPopUp(true)}>
            <div>
                        <img
                          src={require('./images/token logos/' + logo.toUpperCase() + '.png')}
                        />
                        {token.toUpperCase()}
                        </div>
                        <img
                          src={require('./images/dropdown.png')}
                        />
            </div>
            <div className="heading">Amount you want to invest</div>
            <input className="priceInput" placeholder="0" onChange={(e) => {
              if(e.target.value.toString().length===0) {
                console.log('yesss')
                setQuantity(0)
              } else {
                console.log('noooo');
                setQuantity(e.target.value/price) 
              }
              }} type="number" />
            <div className="heading">
              Estimate number of {logo.toUpperCase()} you will be getting
            </div>
            <input className="qtyInput" value={quantity} disabled type="text" />
            <button className="btn buybtn">Buy</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
