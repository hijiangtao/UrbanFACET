/**
 * chartview.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-03-01 17:04:06
 * @version $Id$
 */

'use strict'
import * as d3 from 'd3'
import {chartTestData} from './initdata'

class chart {
	constructor(id) {
		this.id = id
	}

	brushDraw(id, data) {
		let containerwidth = document.getElementById(id.substring(1)).offsetWidth,
			containerheight = document.getElementById(id.substring(1)).offsetHeight;

		d3.select(`${id}svg`).remove();
		let svg = d3.select(id)
			.append('svg')
			.attr('id', `${id.substring(1)}svg`)
			.attr('width', containerwidth)
			.attr('height', 60);

		let margin = {top: 5, right: 5, bottom: containerheight*0.7, left: 30},
		    margin2 = {top: 2, right: 12, bottom: 18, left: 30},
		    width = +svg.attr("width") - margin.left - margin.right,
		    height = +svg.attr("height") - margin.top - margin.bottom,
		    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

		let x = d3.scaleLinear().range([0, width]),
		    x2 = d3.scaleLinear().range([0, width]),
		    y = d3.scaleLinear().range([height, 0]),
		    y2 = d3.scaleLinear().range([height2, 0]);

		let xAxis = d3.axisBottom(x).ticks(4),//.tickFormat(d3.format("d")),
		    xAxis2 = d3.axisBottom(x2).ticks(4),//.tickFormat(d3.format("d")),
		    yAxis2 = d3.axisLeft(y2).ticks(3).tickFormat(function(d){
		    	return `${d/1000}K`;
		    });

		let brush = d3.brushX()
		    .extent([[0, 0], [width, height2]])
		    .on("brush end", brushed);


		let area2 = d3.area()
		    .curve(d3.curveMonotoneX)
		    .x(function(d) { return x2(d.k); })
		    .y0(height2)
		    .y1(function(d) { return y2(d.v); });

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

		x.domain(d3.extent(data, function(d) { return d.k; }));
		y.domain([0, d3.max(data, function(d) { return d.v; })]);
		x2.domain(d3.extent(data, function(d) { return d.k; }));
		y2.domain([0, d3.max(data, function(d) { return d.v; })]);

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

		context.append("g")
		  .attr("class", "brush")
		  .call(brush)
		  .call(brush.move, x2.range());

		function brushed() {
		  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
		  let s = d3.event.selection || x2.range();
		  x.domain(s.map(x2.invert, x2));
		  // focus.select(".area").attr("d", area);
		  // focus.select(".axis--x").call(xAxis);
		  // svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
		  //     .scale(width / (s[1] - s[0]))
		  //     .translate(-s[0], 0));
		}

		function type(d) {
		  d.k = +d['k'];
		  d.v = +d['v']; //Math.log(Number.parseFloat(d['v']));
		  return d;
		}
	}
}

export default chart