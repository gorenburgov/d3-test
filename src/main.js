import './style/main.scss';
import data from './data.json';
import AdvancedChart from './AdvancedChart.js';
import JapanChart from './JapanChart.js';
const chart = new AdvancedChart('#chart', data, [{name:'randomUpdate', config:{}}]);
const chart2 = new JapanChart('#chart2', data);
