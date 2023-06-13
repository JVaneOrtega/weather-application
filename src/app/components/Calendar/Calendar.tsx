
import { Grid, Card, Text } from "@nextui-org/react";
import { CalendarPropType } from "./CalendarPropType";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function Calendar(props: CalendarPropType) {
    const {
        forecast
    } = props;

    const [weatherDays, setWeatherDays] = useState<React.ReactNode[]>([]);

    useEffect(() => {
        if (forecast && forecast.length > 2) {
            const weatherCards = forecast.map(dayItem => {
                const {
                    date,
                    day
                } = dayItem;

                const {
                    condition,
                    maxtemp_c,
                    mintemp_c,
                    avgtemp_c,
                    daily_chance_of_rain
                } = day;

                const imageURL = condition.icon;
                const imageAlt = condition.text;
                const dateFormatted = dayjs(date).format('DD/MM/YYYY')
                const textRain = `Chance of rain: ${daily_chance_of_rain}%`;
                const textTemperatureMin = `Min: ${mintemp_c}`;
                const textTemperatureMax = `Max: ${maxtemp_c}`;
                const textTemperatureAvg = `Avg: ${avgtemp_c}`;

                return <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md">
                    <div className="md:flex">
                        <div className="md:shrink-0 items-center p-10">
                            <img src={`${imageURL}`} alt={`${imageAlt}`}
                            />
                        </div>
                        <div className="p-8">
                            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{dateFormatted}</div>
                            <p className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{textRain}</p>
                            <p className="mt-2 text-slate-500">{textTemperatureMin}</p>
                            <p className="mt-2 text-slate-500">{textTemperatureMax}</p>
                            <p className="mt-2 text-slate-500">{textTemperatureAvg}</p>
                        </div>
                    </div>
                </div>
            });

            setWeatherDays(weatherCards);
        } else {
            setWeatherDays([])
        }
    }, [forecast]);

    return (
        <Grid.Container gap={2} justify="center">
            {
                weatherDays.length > 0 &&
                weatherDays.map(component => (
                    <Grid xl={4} lg={4} md={4} sm={12} xs={12}>
                        {component}
                    </Grid>
                ))
            }
        </Grid.Container>
    );
}