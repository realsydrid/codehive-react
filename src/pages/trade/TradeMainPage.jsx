import {useQuery} from "@tanstack/react-query";

export default function TradeMainPage() {
    const {data: markets, isLoading, error} = useQuery({
        queryKey: ["markets"],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        refetchInterval:500,
        queryFn: async () => {
            const URL = "https://api.upbit.com/v1/ticker/all?quote_currencies=KRW";
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                const res = await fetch(URL);
                if (!res.ok) throw new Error(res.status + "");
                return res.json();

            } catch (error) {
                throw new Error(error);
            }
        }
    });
    return (

        <>
            <h1>거래소메인페이지</h1>
            {isLoading && <Loading/>}
            {error && <ErrorComponent msg={error.message}/>}
            <table>
                <thead>
                <tr>
                    <th>자산명</th>
                    <th>현재가</th>
                    <th>변동</th>
                    <th>거래금액</th>
                </tr>
                </thead>
                <tbody>
                {markets && markets.map((m) =>
                    <tr key={m.market}>
                        <td>{m.market}</td>
                        <td>{m.trade_price}</td>
                        <td>
                            <p>{m.change_rate}</p>
                            <p>{m.change_price}</p>
                        </td>
                        <td>{m.acc_trade_price_24h}</td>
                    </tr>
                )}
                </tbody>
            </table>


        </>
    );
}

function Loading() {
    return <p>Loading...</p>;
}

function ErrorComponent({msg}) {
    return <p style={{color: "red"}}>{msg}</p>;
}