import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export default function CoinDetailInfo({combinedData}) {

    const [englishName, setEnglishName] = useState("");
    useEffect(() => {
        if (combinedData?.english_name) {
            setEnglishName(combinedData?.english_name.toLowerCase());
        }
    }, [combinedData?.english_name]);

    const {data: coinDetailData, isLoading, error} = useQuery({
        queryKey: ['coinDetailInfo', englishName],
        staleTime: 1000 * 60 * 60,
        retry: 1,
        enabled: !!englishName,
        queryFn: async () => {
            if (!englishName) {
                return null;
            }
            const URL = `https://api.coingecko.com/api/v3/coins/${englishName}`;
            try {
                await new Promise(resolve => setTimeout(resolve, 0));
                const res = await fetch(URL);
                if (!res.ok) throw new Error(res.status + "");
                return res.json();
            } catch (error) {
                throw new Error(error);
            }
        }

    })
    console.log(coinDetailData)

    return (
        <>
            <h1>코인정보</h1>

            <p>{combinedData.english_name.toLowerCase()}</p>

            {coinDetailData &&
                <div>
                    {coinDetailData.id}
                </div>
            }

            //https://api.coingecko.com/api/v3/coins/ripple
            //https://api.coingecko.com/api/v3/coins/list


        </>
    )
}