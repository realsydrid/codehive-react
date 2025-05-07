import {useQuery} from "@tanstack/react-query";
import {useEffect, useRef, useState} from "react";
import coinListJson from "./coinListJson.json"
import "./CoinDetailInfo.css"
import {Link} from "react-router-dom";

export default function CoinDetailInfo({combinedData, market}) {

    const [englishName, setEnglishName] = useState("");


    const {data: coinList, isListLoading, listError} = useQuery({
        queryKey: ["coinList"],
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60,
        retry: 1,
        queryFn: async () => {
            const URL = `http://localhost:8801/api/proxy/coingecko/coins/list`
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
        const coinId = coinList?.find(item => item.name === combinedData?.english_name)?.id;
        setEnglishName(coinId);
    }, [coinList, market]);


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
                const data = await res.json();
                if (!res.ok) throw new Error(res.status + "");
                return data;
            } catch (error) {
                console.log(error);
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
                            <div className="coinDetailInfo-description" dangerouslySetInnerHTML={{
                                __html: coinDetailData.description.ko?.trim()
                                    ? coinDetailData.description.ko
                                    : coinDetailData.description.en
                            }} />
                            <div>
                                {!coinDetailData.description.ko && !coinDetailData.description.en &&
                                    <>
                                        <p> 제공된 코인정보가 없습니다.</p>
                                        <Link
                                            to={coinDetailData.links.whitepaper}>웹사이트 직접 방문하기</Link>
                                    </>
                                }
                            </div>
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