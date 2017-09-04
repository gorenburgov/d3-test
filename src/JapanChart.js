import * as d3 from 'd3';
import Axes from './Axes.js';

export default class JapanChart {
    constructor(id, data = []) {
        const AGGREGATION_COUNT = 10;
        const CANDLE_WIDTH = 20;

        //For Japan Candles chart we aggregate each 10 sequent points
        this.data =  data.reduce((aggr, item, ind)=>{
            if (ind % AGGREGATION_COUNT === 0) {
                aggr.push([]);
            };
            const aggregation = aggr[aggr.length - 1];
            aggregation.push(item);
            if ((ind + 1) % AGGREGATION_COUNT === 0 || ind === data.length - 1) {
                const aggrData = {};
                aggrData.open = aggregation[0].open;
                aggrData.close = aggregation[aggregation.length - 1].close;
                aggrData.min = d3.extent(aggregation, item => item.min)[0];
                aggrData.max = d3.extent(aggregation, item => item.max)[1];
                aggrData. date = Math.floor((aggregation[0].date + aggregation[aggregation.length - 1].date)/2);
                aggr[aggr.length - 1] = aggrData;
            };
         return aggr}, []);


        this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        this.width = Math.min(window.outerWidth, 1000);
        this.height = 420;


        this.xScale = d3.scaleTime()
            .range([0, this.width - this.margin.right - CANDLE_WIDTH])
            .domain(d3.extent(this.data, (d) => d.date));

        this.yScale = d3.scaleLinear()
            .range([this.height - this.margin.top - this.margin.bottom, 0])
            .domain([d3.extent(this.data, (d) => d.min)[0],d3.extent(this.data, (d) => d.max)[1]]);
        const height = this.height;

        this.svg = d3.select(id)
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .style('margin-left', `${this.margin.left}px`);

        this.container = this.svg
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        this.axes = new Axes(this, this.container);

        this.node = this.container
            .append('g');

        this.groups = this.node.selectAll('g').data(this.data).enter()
            .append('g').attr('transform', d => `translate(${this.xScale(d.date)},0)`);

        this.groups.append('rect')
            .attr('width', CANDLE_WIDTH)
            .attr('height',  data => Math.abs(this.yScale(data.open) - this.yScale(data.close)))
            .attr('y', data => this.yScale(Math.max(data.close,data.open)))
            .attr('fill', d => d.open > d.close ? 'red' : 'green')
            .attr('stroke', 'blue')
            .attr('stroke-width', '1');
        this.groups.append('line')
            .attr('transform', d => `translate(${CANDLE_WIDTH/2},0)`)
            .attr('y1',d => this.yScale(d.max))
            .attr('y2',d => this.yScale(Math.max(d.close, d.open)))
            .attr('stroke','#02a6f2')
            .attr('stroke-width', 2);

        this.groups.append('line')
            .attr('transform', d => `translate(${CANDLE_WIDTH/2},0)`)
            .attr('y1',d => this.yScale(Math.min(d.close, d.open)))
            .attr('y2',d => this.yScale(d.min))
            .attr('stroke','#02a6f2')
            .attr('stroke-width', 2);


    }
}
