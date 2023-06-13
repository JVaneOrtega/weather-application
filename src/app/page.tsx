'use client'
import SearchInput from './components/SearchInput/SearchInput';
import Weather from './components/Weather/Weather';
import { useEffect, useState } from 'react';
import Calendar from './components/Calendar/Calendar';
import { Forecastday } from './types/WeatherForecast';
import { Grid, Loading } from '@nextui-org/react';

export default function Home() {
  const [cityName, setCityName] = useState<string>("");
  const [forecast, setForecast] = useState<Forecastday[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDay, setIsDay] = useState<boolean>(false);

  useEffect(() => {
    const previousCity = localStorage.getItem("city")
    if(previousCity) {
      setCityName(previousCity)
      setIsLoading(false)
    }
  }, [])

  const fontDay : string = 'from-blue-600 via-blue-400 to-blue-300';
  const fontNight : string = 'from-purple-600 via-blue-700 to-blue-800'

  return (
    <div>
      <main className={"flex min-h-screen flex-col items-center justify-between p-10 pt-20 bg-gradient-radial " + (isDay ? fontDay : fontNight)}>
        <nav className={'fixed top-0 left-0 right-0 w-full items-center p-5 mb-5 ' + (isDay ? 'bg-blue-300' : 'bg-blue-800')}>
          <SearchInput
            city={cityName}
            setCity={setCityName}
            isDay={isDay}
          />
        </nav>
          <Grid.Container gap={2}>
            {isLoading && <div className='absolute inset-1/2'><Loading size="xl"></Loading></div>}
            <Grid xl={12} lg={12} md={12} sm={12} xs={12} justify="center" className={isLoading ? "opacity-10": ""}>
              <div className='w-full pb-1 pt-1'>
                <Weather
                  city={cityName}
                  setForecast={setForecast}
                  setIsLoading={setIsLoading}
                  setIsDay={setIsDay}
                />
              </div>
            </Grid>
            <Grid xl={12} lg={12} md={12} sm={12} xs={12} justify="center" className={isLoading ? "opacity-10": ""}>
              <Calendar
                forecast={forecast ? forecast : null}
              />
            </Grid>
          </Grid.Container>
      </main>
    </div>
  )
}
