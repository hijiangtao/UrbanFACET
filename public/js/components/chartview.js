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
		this.data = chartTestData;
	}

	initDraw(id, data) {
		let containerwidth = document.getElementById(id.substring(1)).offsetWidth,
			containerheight = document.getElementById(id.substring(1)).offsetHeight;

		d3.select('#estatsvg').remove();
		let svg = d3.select(id)
			.append('svg')
			.attr('id', 'estatsvg')
			.attr('width', containerwidth)
			.attr('height', containerheight);

		let margin = {top: 5, right: 10, bottom: containerheight*0.8, left: 40},
		    margin2 = {top: containerheight*0.3, right: 10, bottom: 18, left: 40},
		    width = +svg.attr("width") - margin.left - margin.right,
		    height = +svg.attr("height") - margin.top - margin.bottom,
		    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

		let x = d3.scaleLinear().range([0, width]),
		    x2 = d3.scaleLinear().range([0, width]),
		    y = d3.scaleLinear().range([height, 0]),
		    y2 = d3.scaleLinear().range([height2, 0]);

		let xAxis = d3.axisBottom(x).ticks(5),//.tickFormat(d3.format("d")),
		    xAxis2 = d3.axisBottom(x2).ticks(5),//.tickFormat(d3.format("d")),
		    yAxis2 = d3.axisLeft(y2).ticks(5).tickFormat(function(d){
		    	return `${d/1000}K`;
		    });

		let brush = d3.brushX()
		    .extent([[0, 0], [width, height2]])
		    .on("brush end", brushed);

		let zoom = d3.zoom()
		    .scaleExtent([1, Infinity])
		    .translateExtent([[0, 0], [width, height]])
		    .extent([[0, 0], [width, height]])
		    .on("zoom", zoomed);

		let area = d3.area()
		    .curve(d3.curveMonotoneX)
		    .x(function(d) { return x(d.k); })
		    .y0(height)
		    .y1(function(d) { return y(d.v); });

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
		x2.domain(x.domain());
		y2.domain(y.domain());

		focus.append("path")
		  .datum(data)
		  .attr("class", "area")
		  .attr("d", area);

		// focus.append("g")
		//   .attr("class", "axis axis--x")
		//   .attr("transform", "translate(0," + height + ")")
		//   .call(xAxis);

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
		  .call(brush.move, x.range());

		svg.append("rect")
		  .attr("class", "zoom")
		  .attr("width", width)
		  .attr("height", height)
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		  .call(zoom);

		function brushed() {
		  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
		  let s = d3.event.selection || x2.range();
		  x.domain(s.map(x2.invert, x2));
		  focus.select(".area").attr("d", area);
		  focus.select(".axis--x").call(xAxis);
		  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
		      .scale(width / (s[1] - s[0]))
		      .translate(-s[0], 0));
		}

		function zoomed() {
		  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
		  let t = d3.event.transform;
		  x.domain(t.rescaleX(x2).domain());
		  focus.select(".area").attr("d", area);
		  focus.select(".axis--x").call(xAxis);
		  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
		}

		function type(d) {
		  d.k = +d['k'];
		  d.v = +d['v'];
		  return d;
		}
	}
}

export default chart