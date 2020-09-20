import React, { useState, useEffect } from 'react';
import Filters from '../../components/Filters';
import './styles.css';
import Chart from 'react-apexcharts';
import { barOptions, pieOptions } from './chart-options';
import axios from 'axios';
import { buildBarSeries, getPlatformChartData, getGenderChartData } from './helpers';


type PieChartData = {
    labels: string[];
    series: number[];
}

type BarChartData = {
    x: string;
    y: number;    
}

/* const chartData = [
    {
        x:'Washington',
        y: 10
    },
    {
        x:'Nelio',
        y: 20
    } ]*/
const  initialPieData= {
    labels: [],
    series: []

}

const BASE_URL = 'http://localhost:8080'


const Charts = () => {

    const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
    const [platformData, setPlatformData] = useState<PieChartData>(initialPieData);
    const [genderData, setGenderData] = useState<PieChartData>(initialPieData);

    useEffect(() => {
        console.log('tela de graficos iniciada!')
        async function getData() {
            const recordsResponse = await axios.get(`${BASE_URL}/records`);
            const gamesResponse = await axios.get(`${BASE_URL}/games`);
            
            console.log(recordsResponse.data);
            console.log(gamesResponse.data);
            
            const barData = buildBarSeries(gamesResponse.data, recordsResponse.data.content);

            // console.log(barData);
            setBarChartData(barData);

            const platformChartData = getPlatformChartData(recordsResponse.data.content);
            console.log(platformChartData);
            setPlatformData(platformChartData);

            const genderChartData = getGenderChartData(recordsResponse.data.content);
            setGenderData(genderChartData);
        }
        getData();

    }, [])

    return (
        <div className="page-container">
        <Filters link="/records" linkText="VER TABELA" />
        <div className="chart-container">
            <div className="top-related">
                <h1 className="top-related-title">
                   Jogos mais votados
                    </h1>
                    <div className="games-container">
                        <Chart 
                            options={barOptions}
                            type="bar"
                            width="900"
                            height="650"
                            series={[{ data: barChartData }]} />
                    </div>
            </div>
            <div className="charts">
               <div className="platform-charts">
                   <h2 className="chart-title">Plataformas</h2>
                   <Chart 
                    options={{ ...pieOptions, labels: platformData?.labels }}
                    type="donut"
                    series={platformData?.series}
                    width="350"
                    />
               </div>
               <div className="gender-charts">
                   <h2 className="chart-title">Gêneros</h2>
                   <Chart 
                    options={{ ...pieOptions, labels: genderData?.labels }}
                    type="donut"
                    series={genderData?.series}
                    width="350"
                    />
               </div>
            </div>
        </div>
        </div>
    )
}

export default Charts;