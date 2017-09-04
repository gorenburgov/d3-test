import * as d3 from 'd3';

class Axes {
    constructor(chart, container) {
        this.chart = chart;
        this.container = container;
        this.xG = this.container
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${this.chart.height - this.chart.margin.bottom})`);

        this.yG = this.container
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', `translate(${this.chart.width - this.chart.margin.right}, ${this.chart.margin.top})`);

        this.render();


    }

    render() {
        this.x = this.chart.xScale;

        this.y = this.chart.yScale;

        this.xAxis = d3.axisBottom(this.x)
            .tickSize(-(this.chart.height - this.chart.margin.bottom), 0)
            .ticks(5)
            .tickFormat(d3.timeFormat('%H:%M'));

        this.yAxis = d3.axisRight(this.y)
            .tickSize(this.chart.margin.right - this.chart.width, 0)
            .ticks(5)
            .tickFormat((d) => d.toFixed(2));

        this.xG.call(this.xAxis);
        this.yG.call(this.yAxis);
    }
}

export default Axes;
