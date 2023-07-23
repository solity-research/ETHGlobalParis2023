import axios from "axios";
import { useState, useEffect } from "react";

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
        fetchData();
    },[]);

    return (
        <div className="px-96 mt-10 ">
            <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs  uppercase bg-gray-5 bg-gray-700 text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Borrow Rate
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Cash
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data != undefined && data.map((market) => (
                        <tr className="border-b text-white bg-gray-800 border-gray-700" key={market.id}>
                            <td className="px-6 py-4">{market.name}</td>
                            <td className="px-6 py-4">{parseFloat(market.borrowRate).toFixed(6)}</td>
                            <td className="px-6 py-4">{parseFloat(market.cash).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
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