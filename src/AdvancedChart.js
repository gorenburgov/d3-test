import * as d3 from 'd3';
import Chart from './Chart.js';

export default  class AdvancedChart extends Chart {
    constructor(id, data = [], features) {
        super(id,data);
        this.features = features;
        features.forEach((feature) => {
            this[feature.name + 'Feature'](feature.config);
        });
    }
    //Feature of generation new point in pushing it into processing que.
    randomUpdateFeature (config) {
        const data = this.data;
        const MAX_TIMEOUT = 2000;               //Maximum time between generation of two points
        const POINT_TIME_INTERVAL = 6000;       //Time interval between .date of two sequent points
        const TRANSITION_TIME = 300;            //Point transition duration
        const CHANGE_FACTOR = 0.02;             //Something like volatility
        const CHANGE_TREND_DIRECTION_PROBABILITY = 0.05;
        const updateQue = d3.queue(1);          //New point que


        // Process point from que
        const processPoint = (point, callback) => {
            const lastPoint = data[data.length - 1];
            data.shift();
            data.push(lastPoint);
            this.line.datum(data).attr('d', this.lineFunc);
            data[data.length - 1] = point;
            this.updateScales();
            this.axes.render();
            this.line.datum(data).transition().duration(TRANSITION_TIME).attr('d', this.lineFunc).on('end', callback(null));
            this.area.datum(data).attr('d', this.areaFunc);

        };

        // Generation of next random point
        const addPointFunc = () => {
            const lastPoint = data[data.length - 1];
            const preLastPoint = data[data.length - 2];
            const [dataMin, dataMax] = d3.extent(data, (d) => d.close);
            const newDate = lastPoint.date + POINT_TIME_INTERVAL;
            let deltaDirection = Math.sign(Math.random() - CHANGE_TREND_DIRECTION_PROBABILITY) * Math.sign(lastPoint.close - preLastPoint.close);
            deltaDirection = deltaDirection || (Math.random() > 0.5 ? 1 : -1);
            const newPointClose = parseFloat(Number(lastPoint.close + Math.random() * deltaDirection * CHANGE_FACTOR * (dataMax - dataMin)).toFixed(3));
            const point = {
                "date": newDate,
                "open": 57.604,
                "max": 57.622,
                "min": 57.596,
                "close": newPointClose
            };
            updateQue.defer(processPoint, point);
            d3.timeout(addPointFunc, Math.floor(Math.random()*MAX_TIMEOUT));
        };
        addPointFunc();
    }
}