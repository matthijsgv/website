import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
} from 'chart.js';

import zoomPlugin from 'chartjs-plugin-zoom';
import {  useRef } from 'react';
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    zoomPlugin
);

const zoomToAmount = (total, toShow) => {
    return 2 - (toShow / total);
}

const EnergyChart = (props) => {
    const chartRef = useRef();

    setTimeout(() => {
        chartRef.current.zoom(zoomToAmount(props.data.labels.length, 6));
    }, 100);
    return <Bar data={props.data} options={props.options} ref={chartRef}  />
};

export default EnergyChart;