import React from 'react';

import TopBar from "../UI/TopBar";
import "../style/Energy.css";
import { useEffect, useState } from 'react';
import EnergyChart from '../Components/EnergyChart';



const Energy = () => {

    let style = getComputedStyle(document.body);
    let mainColor = style.getPropertyValue('--main-color');
    const [energyData, setEnergyData] = useState(null);

    const convertData = (res) => {
        const labels = Object.keys(res);
        setEnergyData(
            {
                labels: labels,
                datasets: [
                    {
                        label: "Energy Consumed",
                        data: labels.map(x => res[x].consumptieLaagTariefDifference / 1000),
                        backgroundColor: mainColor
                    }
                ]
            }
        )
    }
    const fetchEnergyDaily = async () => {
        await fetch("https://p1-energie-meting-backend.onrender.com/api/measurement/range?startDate=2024-03-01&endDate=2024-03-31", {
            method: "GET"
        }).then((res) => res.json()).then((response) => convertData(response));
    };

    useEffect(() => {
        fetchEnergyDaily();
        // eslint-disable-next-line
    }, []);




    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            
            y: {
                ticks: {
                    
                    color: mainColor
                },
                title: {
                    display: true,
                    text: "kWh",
                    color: mainColor
                }
            },
            x: {
                ticks: {
                    color: mainColor
                }
            }
        },
        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: "x",
                    onPanComplete: (e) => {console.log(e.chart)}
                },
                zoom: {
                    wheel: {
                        enabled: true,
                        mode: "x"
                    },
                    mode: "x",

                }
            }
        }
    }




    return <div className="energy-outer">
        <TopBar title="Energy" />
        <div className="energy-inner">
            <div className='energy_bar_chart_outer'>
                {energyData != null && <EnergyChart data={energyData} options={options} />}
            </div>
        </div>
    </div>
};

export default Energy;