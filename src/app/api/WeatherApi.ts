import axios from 'axios';

const WeatherApiInstance = axios.create({
    baseURL: 'https://weatherapi-com.p.rapidapi.com',
    timeout: 30000,
    headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.HOST
      }
});

export default WeatherApiInstance;