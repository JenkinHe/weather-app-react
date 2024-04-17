import { useEffect, useState } from "react";
import Search from "../search";



export default function Weather() {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [location, setLocation] = useState({
        long: '0',
        lat: '0',
        name: ''
    })
  

    async function fetchLocationData(param) {
        setLoading(true);

        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${param}&count=1&language=en&format=json`)

            const data = await response.json();
            if (data) {
                setLocation({ long: data.results[0].longitude, lat: data.results[0].latitude, name: param.toUpperCase() });

                setLoading(false);
            }


        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    }

    async function fetchWeatherData(param) {
        try {
            setLoading(true);
            await fetchLocationData(param);

            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.long}&current=temperature_2m,is_day,wind_speed_10m&hourly=temperature_2m`);

            const data = await response.json()
            if (data) {
                setWeatherData(prevWeatherData => {
                    return data; // or any manipulation based on prevWeatherData
                });
                setLoading(false);
            }



        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    }

    function handleSearch() {
        fetchWeatherData(search);

    }

    function getCurrentDate(){
        return new Date().toLocaleDateString('en-us',{
            weekday:'long',
            month:'long',
            day:'numeric',
            year:'numeric'
        })
    }

    function getDayNight(){
        return weatherData?.current?.is_day==1?"Day Time":"Night Time";
    }

    useEffect(() => {
        fetchWeatherData("sydney");

    }, []);
    useEffect(() => {
        console.log(weatherData);
    }, [weatherData]);


    return <div>
        <Search search={search} setSearch={setSearch} handleSearch={handleSearch} />
        {
            loading ? <div>loading</div> :
                <div>
                    <div className="city-name">
                        <h2>{location?.name}</h2>
                    </div>
                    <div className="date">
                        <span>{getCurrentDate()}</span>

                    </div>
                    <div>
                        <div>{weatherData?.current?.temperature_2m}°C</div>
                        <p className="description">
                            {getDayNight()}
                        </p>
                    </div>
                    <div>
                        <div>
                            <p>Wind Speed {weatherData?.current?.wind_speed_10m}km/h</p>
                        </div>
                    </div>
                </div>

        }

    </div>
}