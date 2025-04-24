import {useQuery} from "@tanstack/react-query";
import {useEffect, useRef, useState} from "react";

export default function CoinDetailInfo({combinedData, market}) {

    const initialized = useRef(false);
    const [englishName, setEnglishName] = useState("");
    useEffect(() => {

        if(initialized.current || !combinedData?.english_name){
            return;
        }
        setEnglishName(combinedData.english_name.toLowerCase());
        console.log(combinedData.english_name.toLowerCase());
        initialized.current = true;
    }, [combinedData?.english_name]);

    const {data: coinList, isListLoading, listError} = useQuery({
        queryKey: ["coinList"],
        staleTime: 1000 * 60 * 60,
        gcTime : 1000* 60 *60,
        retry :1,
        queryFn: async ()=>{
            const URL= `https://api.coingecko.com/api/v3/coins/list`
            try {
                await new Promise(resolve => setTimeout(resolve, 0));
                const res= await fetch(URL);
                if(!res.ok) throw new Error("CoinListInfo could not be found!");
                return await res.json()

            }catch (e){
                throw new Error (e)
            }
        }
    })



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

    return (
        <>


            {coinDetailData ?
                (
                    <div>
                        {coinDetailData.id}
                        {coinDetailData.description.ko}
                    </div>) : (
                    <div>
                        코인정보가 없습니다.
                    </div>
                )
            }


        </>
    )
}