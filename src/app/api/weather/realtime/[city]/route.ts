import { NextResponse } from 'next/server'
import WeatherApiInstance from '../../../WeatherApi';
import { WeatherRealtime } from '../../../../types/WeatherRealtime';
import { AxiosError } from 'axios';

export async function GET(request: Request, { params }: { params: { city: string } }) {
    try {
        const response = await WeatherApiInstance.get<WeatherRealtime>('/current.json', {
            params: { q: params.city },
        });
        return NextResponse.json({ ...response.data })
    } catch (error) {
        console.log("Entre catch")
        if (error instanceof AxiosError) {
            if (error.response?.status === 400) {
                return NextResponse.json({msg: "Invalid value for city"}, {status: 400});             
            }
        }
        
        return NextResponse.json({msg: "Error while getting data"}, {status: 500});
    }
    
}