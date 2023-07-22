import axios from "axios";
import { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2';

const CompoundPortal = () => {
    const [data, setData] = useState<Market[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/graph/compound');
                setData(response.data.data.markets);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (data != null) {
            const marketNames = data.map((market) => market.name);
            const borrowRates = data.map((market) => parseFloat(market.borrowRate));
        } else {
            fetchData();
        }
    }, [data]);



    return (
        <div>
            <div>
                <h2>Market Rates Chart</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Borrow Rate</th>
                            <th>Cash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data != undefined && data.map((market) => (
                            <tr key={market.id}>
                                <td>{market.name}</td>
                                <td>{parseFloat(market.borrowRate).toFixed(6)}</td>
                                <td>{parseFloat(market.cash).toFixed(2)}</td>
                                {/* Add other table data cells for the properties you want to display */}
                                {/* Example: <td>{parseFloat(market.collateralFactor).toFixed(2)}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
interface MarketData {
    data: {
        markets: Market[];
    };
}

interface Market {
    borrowRate: string;
    cash: string;
    collateralFactor: string;
    exchangeRate: string;
    interestRateModelAddress: string;
    name: string;
    reserves: string;
    supplyRate: string;
    symbol: string;
    id: string;
    totalBorrows: string;
    totalSupply: string;
    underlyingAddress: string;
    underlyingName: string;
    underlyingPrice: string;
    underlyingSymbol: string;
    reserveFactor: string;
    underlyingPriceUSD: string;
}

export default CompoundPortal;