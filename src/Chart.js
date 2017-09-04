import * as d3 from 'd3';
import Axes from './Axes.js';

export default class Chart {
    constructor(id, data = []) {
        this.data = data;
        this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        this.width = Math.min(window.outerWidth, 1000);
        this.height = 420;

        this.svg = d3.select(id)
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .style('margin-left', `${this.margin.left}px`);

        this.container = this.svg
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);


        this.updateScales = () => {
            this.xScale = d3.scaleTime()
                .range([0, this.width - this.margin.right])
                .domain(d3.extent(this.data, (d) => d.date));

            this.yScale = d3.scaleLinear()
                .range([this.height - this.margin.top - this.margin.bottom, 0])
                .domain(d3.extent(this.data, (d) => d.close));
        };

        this.updateScales();

        this.axes = new Axes(this, this.container);

        this.areaFunc = d3.area()
            .x(d => this.axes.x(d.date))
            .y0(d => this.axes.y(d.close))
            .y1(this.height - this.margin.top - this.margin.bottom);

        this.lineFunc = this.areaFunc.lineY0();

        this.node = this.container
            .append('g');

        this.line = this.node
            .append('path')
            .datum(this.data.slice())
            .attr('d', this.lineFunc)
            .attr('class', 'line')
            .attr('transform', `translate(0, ${this.margin.top})`)
            .attr('stroke-linejoin', 'round')
            .attr('stroke', '#02a6f2')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        this.area = this.node
            .insert('path', '.line')
            .datum(this.data.slice())
            .attr('d', this.areaFunc)
            .attr('class', 'area')
            .attr('transform', `translate(0, ${this.margin.top})`)
            .attr('fill', '#02a6f2')
            .attr('fill-opacity', 0.1);
    }
}
