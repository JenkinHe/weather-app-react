import { useState } from "react";
import Search from "../search";



export default function Weather(){
    const [search,setSearch]=useState('');
    const [loading,setLoading]=useState(false);
    const [weatherData,setWeatherData] = useState(null);
    const [location,setLocation]= useState({
        long:'0',
        lat:'0'
    })

    async function fetchLocationData(param){
        setLoading(true);

        try{
            const response =await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${param}&count=1&language=en&format=json`)

            const data= await response.json();
            setLocation({long:data.longitude,lat:data.latitude});
            if(data){
                setLoading(false);
            }
            

        }catch(e){
            setLoading(false);
            console.log(e);
        }
    }

    async function fetchWeatherData(param){
        try{
            setLoading(true);
            fetchLocationData(param);
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.long}&current=temperature_2m,is_day,wind_speed_10m&hourly=temperature_2m`);

            const data = await response.json()
            if(data){
                setLoading(false);
            }

            console.log(data)

        }catch(e){
            setLoading(false);
            console.log(e);
        }
    }

    function handleSearch(){
        fetchWeatherData(search);

    }

    return <div>
        <Search search={search} setSearch={setSearch} handleSearch={handleSearch}/>
        weather
    </div>
}