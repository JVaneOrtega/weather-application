import { useEffect, useRef, useState } from "react";
import { WeatherPropType } from "./WeatherPropType";
import { WeatherRealtime } from '@/app/types/WeatherRealtime';
import { WeatherForecast } from "@/app/types/WeatherForecast";
import axios, { AxiosError } from 'axios';

export default function Weather(props: WeatherPropType) {
    const [weatherData, setWeatherData] = useState<WeatherRealtime>();
    const [forecastData, setForecastData] = useState<WeatherForecast>();
    const [cityName, setCityName] = useState<string>();
    const [temperature, setTemperature] = useState<string>();
    const [description, setDescription] = useState<string>();
    const debounceRef = useRef<NodeJS.Timeout>();

    const {
        city,
        setForecast,
        setIsLoading,
        setIsDay
    } = props;

    function isWeatherRealtime(obj: any): obj is WeatherRealtime {
        return 'location' in obj && 'current' in obj
    }

    function getImgURL(iconURL: string) {
        const icon = iconURL.replace("64x64", "128x128");
        return icon;
    }

    async function getDataRealtime(city: string) {
        try {
            const response = await axios.get<WeatherRealtime>(`/api/weather/realtime/${city}`);
            setWeatherData(response.data);
        } catch (error) {
            let res: WeatherRealtime = {};
            if (error instanceof AxiosError) {
                res = {
                    codeError: error.response?.status,
                    msgError: error.response?.data.msg
                };
            }

            if (Object.keys(res).length === 0) {
                res = {
                    codeError: 500,
                    msgError: "Error while getting data"
                }
            }
            setWeatherData(res);
        }
    }

    async function getDataForecast(city: string) {
        try {
            const response = await axios.get<WeatherForecast>(`/api/weather/forecast/${city}`);
            setForecastData(response.data);
        } catch (error) {
            let res: WeatherForecast = {};
            if (error instanceof AxiosError) {
                res = {
                    codeError: error.response?.status,
                    msgError: error.response?.data.msg
                };
            }

            if (Object.keys(res).length === 0) {
                res = {
                    codeError: 500,
                    msgError: "Error while getting data"
                }
            }
            setForecastData(res);
        }
    }

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setIsLoading(true)
            getDataRealtime(city)
            getDataForecast(city)
            localStorage.setItem("city", city)
        }, 300);
    }, [city]);

    useEffect(() => {
        let name: string = '', tempe: string = '', desc: string = '';

        if (weatherData?.location) {
            name = weatherData.location.name + ', ' + weatherData.location.region
        } else {
            name = 'Ooops, this city was not found';
        }

        if (weatherData?.current) {
            tempe = weatherData.current.temp_c + '°C';
            desc = "Today is " + weatherData.current.condition.text.toLowerCase();
            desc += weatherData.current.wind_mph < 12 ? '. Take a walk, the wind is comfortable' : '. Take care, wind is being savage';
            
            setIsDay(weatherData.current.is_day === 1)
        } else {
            tempe = ':(';
            desc = 'Why you don\'t try another city?'
        }

        if (forecastData?.forecast) {
            setForecast(forecastData?.forecast?.forecastday);
        } else {
            setForecast([])
        }

        setCityName(name);
        setTemperature(tempe);
        setDescription(desc);
        setIsLoading(false);
    }, [weatherData, forecastData]);

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md md:max-w-2xl">
            <div className="md:flex">
                <div className="md:shrink-0 items-center p-10">
                    <img
                        src={`${weatherData?.current && getImgURL(isWeatherRealtime(weatherData) ? weatherData.current.condition.icon : '')}`}
                        alt={`${weatherData?.current && isWeatherRealtime(weatherData) ? weatherData?.current.condition.text : 'Not found'}`}
                    />
                </div>
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{cityName}</div>
                    <p className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{temperature}</p>
                    <p className="mt-2 text-slate-500">{description}</p>
                </div>
            </div>
        </div>
    );


}