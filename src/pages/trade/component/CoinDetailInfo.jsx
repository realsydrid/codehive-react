import {useQuery} from "@tanstack/react-query";
import {useEffect, useRef, useState} from "react";
import coinListJson from "./coinListJson.json"
import "./CoinDetailInfo.css"

export default function CoinDetailInfo({combinedData, market}) {

    const [englishName, setEnglishName] = useState("");


    const {data: coinList, isListLoading, listError} = useQuery({
        queryKey: ["coinList"],
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60,
        retry: 1,
        queryFn: async () => {
            const URL = `https://api.coingecko.com/api/v3/coins/list`
            try {
                await new Promise(resolve => setTimeout(resolve, 0));
                const res = await fetch(URL);
                if (!res.ok) throw new Error("CoinListInfo could not be found!");
                return await res.json()

            } catch (e) {
                throw new Error(e)
            }
        }
    })

    useEffect(() => {

        if (!combinedData?.english_name) {
            return;
        }
        let coinId = ""
        if (!coinList) {
            const coin = coinListJson.find(item => item.name === combinedData?.english_name);
            coinId = coin.id;

        } else {
            coinId = coinList?.find(item => item.name === combinedData?.english_name?.id || null);
        }

        setEnglishName(coinId);
    }, [combinedData?.english_name, market]);



    const {data: coinDetailData, isLoading, error} = useQuery({
        queryKey: ['coinDetailData', englishName],
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60,
        retry: 1,
        enabled: !!englishName,
        queryFn: async () => {
            if (!englishName) {
                return null;
            }
            const URL = `https://api.coingecko.com/api/v3/coins/${englishName}?developer_data=false&market_data=false&sparkline=false&community_data=false&tickers=false`;
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

    return (
        <>


            {coinDetailData ?
                (
                    <>
                        <div className="coinDetailInfo-coinTitle">
                            <div style={{background: `url('${coinDetailData.image.small}') no-repeat center`}}>
                                코인 이미지
                            </div>
                            <p>
                                {combinedData?.korean_name}({combinedData?.english_name})
                            </p>


                        </div>
                        <div>
                            <p>코인정보</p>
                            <p>
                                {coinDetailData.description.ko}

                            </p>
                        </div>
                    </>) : (
                    <div>
                        코인정보가 없습니다.
                    </div>
                )
            }


        </>
    )
}