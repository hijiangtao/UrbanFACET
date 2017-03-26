/**
 * chartview.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-03-01 17:04:06
 * @version $Id$
 */

'use strict'
import * as d3 from 'd3'
import { chartTestData } from './initdata'

class chart {
    constructor(id) {
        this.id = id,
            this.data = null
    }

    /**
     * 带 tooltip line chart 绘制方法
     * @param  {[type]} id   [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    lineChartDraw(id, data) {
        d3.select(`#${id}`).select('svg').remove();

        var svg = d3.select("svg"),
            margin = { top: 20, right: 20, bottom: 30, left: 40 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        var parseTime = d3.timeParse("%Y")
        bisectDate = d3.bisector(function(d) {
            return d.year; }).left;

        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var line = d3.line()
            .x(function(d) {
                return x(d.year); })
            .y(function(d) {
                return y(d.value); });

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.json("data.json", function(error, data) {
            if (error) throw error;

            data.forEach(function(d) {
                d.year = parseTime(d.year);
                d.value = +d.value;
            });

            x.domain(d3.extent(data, function(d) {
                return d.year; }));
            y.domain([d3.min(data, function(d) {
                return d.value; }) / 1.005, d3.max(data, function(d) {
                return d.value; }) * 1.005]);

            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y).ticks(6).tickFormat(function(d) {
                    return parseInt(d / 1000) + "k"; }))
                .append("text")
                .attr("class", "axis-title")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .attr("fill", "#5D6971")
                .text("Population)");

            g.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);

            var focus = g.append("g")
                .attr("class", "focus")
                .style("display", "none");

            focus.append("line")
                .attr("class", "x-hover-line hover-line")
                .attr("y1", 0)
                .attr("y2", height);

            focus.append("line")
                .attr("class", "y-hover-line hover-line")
                .attr("x1", width)
                .attr("x2", width);

            focus.append("circle")
                .attr("r", 7.5);

            focus.append("text")
                .attr("x", 15)
                .attr("dy", ".31em");

            svg.append("rect")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);

            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i],
                    d = x0 - d0.year > d1.year - x0 ? d1 : d0;
                focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
                focus.select("text").text(function() {
                    return d.value; });
                focus.select(".x-hover-line").attr("y2", height - y(d.value));
                focus.select(".y-hover-line").attr("x2", width + width);
            }
        });
    }

    /**
     * 废弃的带 brush area chart 绘制方法
     * @param  {[type]} id   [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    brushDraw(id, data) {
        let containerwidth = document.getElementById(id.substring(1)).offsetWidth,
            containerheight = document.getElementById(id.substring(1)).offsetHeight;

        d3.select(`${id}svg`).remove();
        let svg = d3.select(id)
            .append('svg')
            .attr('id', `${id.substring(1)}svg`)
            .attr('width', containerwidth)
            .attr('height', 60);

        let margin = { top: 5, right: 10, bottom: containerheight * 0.7, left: 30 },
            margin2 = { top: 2, right: 16, bottom: 18, left: 30 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

        let x = d3.scaleLinear().range([0, width]),
            x2 = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);

        let xAxis = d3.axisBottom(x).ticks(4), //.tickFormat(d3.format("d")),
            xAxis2 = d3.axisBottom(x2).ticks(4), //.tickFormat(d3.format("d")),
            yAxis2 = d3.axisLeft(y2).ticks(3).tickFormat(function(d) {
                return `${d/1000}K`;
            });

        let brush = d3.brushX()
            .extent([
                [0, 0],
                [width, height2]
            ])
            .on("brush end", brushed);


        let area2 = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function(d) {
                return x2(d.k); })
            .y0(height2)
            .y1(function(d) {
                return y2(d.v); });

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height2);

        let focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        data = data.map(type);

        x.domain(d3.extent(data, function(d) {
            return d.k; }));
        y.domain([0, d3.max(data, function(d) {
            return d.v; })]);
        x2.domain(d3.extent(data, function(d) {
            return d.k; }));
        y2.domain([0, d3.max(data, function(d) {
            return d.v; })]);

        context.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis2);

        context.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area2);

        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2);

        // context.append("g")
        //   .attr("class", "brush")
        //   .call(brush)
        //   .call(brush.move, x2.range());

        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            let s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
        }

        function type(d) {
            d.k = +d['k'];
            d.v = +d['v']; //Math.log(Number.parseFloat(d['v']));
            return d;
        }
    }
}

export default chart
