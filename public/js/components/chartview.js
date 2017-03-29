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
    lineChartDraw(id, data, prop) {
    	let container = d3.select(`#${id}`),
    		cWidth = container.node().getBoundingClientRect().width,
    		cHeight = container.node().getBoundingClientRect().height,
    		xname = prop['xname'];
        container.select('svg').remove();

        console.log('Container', d3.select(`#${id}`), 'cWidth', cWidth, 'cHeight', cHeight);
        let svg = container.append("svg")
            .attr('width', cWidth)
            .attr('height', cHeight),
            margin = { top: 20, right: 5, bottom: 30, left: 25 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        let bisectDate = d3.bisector(function(d) {
                return d.k; }).left,
        	x = d3.scaleLinear().range([0, width]),
        	y = d3.scaleLinear().range([height, 0]);

        let line = d3.line()
        	.curve(d3.curveNatural)// .interpolate("monotone")
            .x(function(d) {
                return x(d.k);
            })
            .y(function(d) {
                return y(d.v);
            });

        let g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function(d) {
            return d.k;
        }));
        y.domain([d3.min(data, function(d) {
            return d.v;
        }) / 1.005, d3.max(data, function(d) {
            return d.v;
        }) * 1.005]);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(function(d) {
            	return `${d}%`;
            }))
            .append("text")
            .attr("class", "axis-title")
            .attr("y", -16)
            .attr("x", width)
            .attr("dy", ".95em")
            .style("text-anchor", "end")
            .attr("fill", "#5D6971")
            .text(xname);

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(6).tickFormat(function(d) {
                return parseInt(d / 1000) + "K";
            }))
            .append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".95em")
            .style("text-anchor", "end")
            .attr("fill", "#5D6971")
            .text("Count");

        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);

        let text = g.append('text')
        	.attr("transform", "translate(" + (width*0.7) + ",0)")
        	// .style('position', 'absolute')
        	// .style('right', 2)
        	// .style('top', 2);

        let focus = g.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height);

        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", 0)
            .attr("x2", width);

        focus.append("circle")
            .attr("r", 5);

        focus.append("text")
            .attr("x", 15)
            .attr("dy", ".31em");

        svg.append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { 
            	focus.style("display", "none");
            	text.text(''); 
            })
            .on("mousemove", mousemove);

        function mousemove() {
            let x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.k > d1.k - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.k) + "," + y(d.v) + ")");
            // focus.select("text").text(function() {
            //     return `k: ${d.k}, v: ${d.v}`;
            // });
            text.text(`${prop['xname']}: ${d.k}, Count: ${d.v}`);
            focus.select(".x-hover-line").attr("y2", height - y(d.v));
            focus.select(".y-hover-line").attr("x2", -x(d.k));
        }
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
                return x2(d.k);
            })
            .y0(height2)
            .y1(function(d) {
                return y2(d.v);
            });

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
            return d.k;
        }));
        y.domain([0, d3.max(data, function(d) {
            return d.v;
        })]);
        x2.domain(d3.extent(data, function(d) {
            return d.k;
        }));
        y2.domain([0, d3.max(data, function(d) {
            return d.v;
        })]);

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
