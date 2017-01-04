/**
 * mapview.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-07 15:31:51
 * @version $Id$
 */

'use strict'

import L from 'leaflet'
// L = require('leaflet')
import * as d3 from 'd3'

class mapview {
	/**
	 * LMap class constructor
	 * @return {[type]} [description]
	 */
	constructor(id) {
	  let self = this
	  this.id = id
	  this.baseLayer = L.tileLayer(
		'https://api.mapbox.com/styles/v1/{id}/cisu4qyac00362wqbe6oejlfh/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
		  attribution: 'Living-Modes-Visual-Comparison 2016 &copy; ISCAS VIS',
		  maxZoom: 18,
		  id: 'hijiangtao',
		  accessToken: 'pk.eyJ1IjoiaGlqaWFuZ3RhbyIsImEiOiJjaWx1bGpldnowMWVwdGlrcm5rcDNiazU2In0.6bViwknzYRPVyqOj7JUuKw'
		})
	  this.map = new L.map(self.id, {
		center: L.latLng(39.914,116.396),
		zoom: 12,
		layers: self.baseLayer
	  })
	  this.map.zoomControl.setPosition('topright');
	}

	/**
	 * Drawing point plot in map with given featurecollection data
	 * @param  {[type]} data   [description]
	 * @param  {[type]} idlist [description]
	 * @return {[type]}        [description]
	 */
	pointmapDrawing(data, idlist) {
		const LEDINTERVAL = 20,
			  colorSchema = ['#F3E500', '#F7B20F', '#EE7D1D', '#E74A21', '#D9051B', '#A0077C', '#4F2577', '#172C85'],
			  colorJudge = idlist.length < 8 && idlist > 2
		let self = this
		
		d3.select('#F_SVG').remove();

		if(data.features.length === 0) {
			alert('No records found!')
			return ;
		}

		let svg = d3.select(self.map.getPanes().overlayPane).append('svg').attr('id', 'F_SVG'),
			g = svg.append('g').attr('class', 'leaflet-zoom-hide').attr('id', 'F_G');

		let transform = d3.geoTransform({ point: projectPoint }),
			path = d3.geoPath().projection(transform);

		let color = d3.scaleOrdinal( colorJudge ? colorSchema:d3.schemeCategory10 ).domain(idlist)
		// d3.schemeCategory20
		// ['#24AADD', 'rgb(250,150,30)']

		let maplegend = d3.select('#mapviewlegend')
			.attr('width', 160)
			.attr('height', idlist.length * 30)
		maplegend.selectAll('*').remove();

		let legendg = maplegend.append('g').selectAll('.maplegendcircle')
			.data(idlist)
			
		legendg.enter().append('circle')
			.attr('class', 'maplegendcircle')
			.attr('stroke', function(d) {
				return color(d)
			})
			.attr('fill', function(d) {
				return color(d)
			})
			.attr('cx', '10')
			.attr('cy', function(d, i) {
				return i*LEDINTERVAL + 10;
			})
			.attr('r', '8')
			.on("click", function(d){
				// Determine if current line is visible
				let els = document.getElementsByClassName(`ma_class_${d}`),
					active   = Number.parseInt(els[0].getAttribute('opacity')) ? true:false,
				  newOpacity = active ? 0 : 1;
				// Hide or show the elements
				Array.prototype.forEach.call(els, function(el) {
				    el.setAttribute('opacity', newOpacity)
				});
			})
		
		legendg.enter().append('text')
			.attr('dx', '24')
			.attr('dy', function(d, i){return i*LEDINTERVAL + 14})
	    	.text(function(d){return d})

		path.pointRadius(1);

		let feature = g.selectAll('path')
			.data(data.features)
			.enter().append('path')
			.attr('class', function(d) {
				return `pointmapfeature ma_class_${d['properties']['group']}`
			})
			.attr('stroke', function(d) {
				return color(d['properties']['group'])
				// return 'rgb(250,150,30)';
			})
			.attr('fill', function(d) {
				return color(d['properties']['group'])
				// return 'rgb(250,150,30)';
			})
			.attr('opacity', '1')

		self.map.on('moveend', reset);
		reset();

		/**
		 * Reposition the SVG to cover the features.
		 * @return {[type]} [description]
		 */
		function reset() {
			let bounds = path.bounds(data),
				topLeft = bounds[0],
				bottomRight = bounds[1];

			// console.log(bounds);

			svg.attr('width', bottomRight[0] - topLeft[0] + 10)
				.attr('height', bottomRight[1] - topLeft[1] + 10)
				.style('left', (topLeft[0] - 5) + 'px')
				.style('top', (topLeft[1] - 5) + 'px');

			g.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

			feature.attr('d', path)
				.attr('transform', 'translate(5, 5)');
		};

		/**
		 * Use Leaflet to implement a D3 geometric transformation.
		 * @param  {[type]} x [description]
		 * @param  {[type]} y [description]
		 * @return {[type]}   [description]
		 */
		function projectPoint(x, y) {
			let point = self.map.latLngToLayerPoint(new L.LatLng(y, x));
			this.stream.point(point.x, point.y);
		}
	}

	scatterplotDrawing(data, idlist, containerid, vueins) {
		let margin = {top: 5, right: 50, bottom: 20, left: 20},
			containerbound = document.getElementById(containerid).getBoundingClientRect(),
			width = containerbound.width - margin.left - margin.right,
			height = containerbound.height - margin.top - margin.bottom;

		let colorSchema = ['#CCCCCC', '#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a']
		let color = idlist.length === 12? d3.scaleOrdinal(colorSchema.concat('#666666')).domain(idlist.concat('-999')):d3.scaleOrdinal(colorSchema.slice(0, idlist.length+1).concat('#666666')).domain(idlist.concat('-999'))

		// set the ranges
		let x = d3.scaleLinear().range([0, width]);
		let y = d3.scaleLinear().range([height, 0]);

		d3.select(`#${containerid}`).html("")
		let svg = d3.select(`#${containerid}`).append("svg")
			.attr('class', 'posabs')
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  	.append("g")
		  	.attr('class', 'posabs')
		    .attr("transform",
		          `translate(${margin.left},${margin.top})`);

		let factory = d3.quadtree()
			.x(function(d) {
				return d['x']
			})
			.y(function(d) {
				return d['y']
			})
			.extent([
				[0, 0],
				[width, height]
			]);

		let chartArea = d3.select(`#${containerid}`).append("div")
		  .attr('class', 'posabs')
		  .style("left", margin.left + "px")
		  .style("top", margin.top + "px");

		let canvas = chartArea.append("canvas")
		  .attr('class', 'posabs')
		  .attr("width", width)
		  .attr("height", height);

		let context = canvas.node().getContext("2d");

		// Layer on top of canvas, example of selection details
		let highlight = chartArea.append("svg")
		  .attr('class', 'posabs')
		  .attr("width", width)
		  .attr("height", height)
		  .append("circle")
	      .attr("r", 4)
	      .attr('fill', 'none')
	      .attr('stroke', 'red')
	      .attr('stroke-width', '2px')
	      .classed("hidden", true);

		// svg.selectAll('dot')
		// 	.data(data)
		// 	.enter().append('circle')
		// 	.attr('r', 1)
		// 	.attr('cx', function(d) {
		// 		return x(d.x);
		// 	}).
		// 	attr('cy', function(d) {
		// 		return y(d.y);
		// 	})
		// 	.on("mouseover", function(d) {
		// 	  tooltip.transition()
		// 	       .duration(200)
		// 	       .style("opacity", .9);
		// 	  tooltip.html(`CLASS: ${d['cla']}<br>ID: ${d['id']}, NUM: ${d['num']}`)
		// 	       .style("left", (d3.event.pageX + 5) + "px")
		// 	       .style("top", (d3.event.pageY - 28) + "px");
		// 	})
		// 	.on("mouseout", function(d) {
		// 	  tooltip.transition()
		// 	       .duration(500)
		// 	       .style("opacity", 0)
		//    	});

		// Add the X Axis
		let xg = svg.append("g")
		  .attr("transform", "translate(0," + height + ")")

		// Add the Y Axis
		let yg = svg.append("g")

		let legend = svg.append("g").selectAll('.scatterLegend')
			.data(idlist.concat('other'))
			
		legend.enter()
			.append('circle')
			.attr('r', 3)
			.attr('fill', function(d) {
				return color(d)
			})
			.attr('cx', width+5)
			.attr('cy', function(d, i) {
				return i*10 + 5
			})

		legend.enter()
			.append('text')
			.attr('x', width+10)
			.attr('y', function(d, i) {
				return i*10 + 4
			})
			.style("font-size", ".6em")
			.text(function(d) {
				return `Class ${d}`
			})


		let tooltip = d3.select(`#${containerid}`).append('div')
			.attr('id', 'scattertooltip')
		    .attr('class', 'tooltip')
		    .style('opacity', 0);

		redraw();

		function redraw() {
			// Redraw axes
			x.domain(d3.extent(data, function(d) {
				return d.x;
			}))
			y.domain(d3.extent(data, function(d) {
				return d.y;
			}))
			xg.call(d3.axisBottom(x));
			yg.call(d3.axisLeft(y));

			let tree = factory.addAll(data);

			// Update canvas
			context.clearRect(0, 0, width, height);

			data.forEach(function(p,i){
				context.beginPath();
				context.arc(x(p['x']), y(p['y']), .5, 0, 2 * Math.PI);
				context.fillStyle = p['cla'] in idlist? color(p['cla']):color('-999');
				context.fill();

			});

			canvas.on("mousemove",function(){
				let mouse = d3.mouse(this),
				    closest = tree.find(x.invert(mouse[0]), y.invert(mouse[1]));

				highlight.attr("cx", x(closest['x']))
				  .attr("cy", y(closest['y']));

				// display tooltip
				tooltip.transition()
			       .duration(200)
			       .style("opacity", .9);
			  	
			  	tooltip.html(`CLASS: ${closest['cla']}<br>ID: ${closest['id']}, NUM: ${closest['num']}`)
			       .style("left", (mouse[0] + 25) + "px")
			       .style("top", (mouse[1] - 30) + "px");
			});

			canvas.on("mouseover",function(){
				highlight.classed("hidden", false);
				console.log('canvas mouseover')
			});

			canvas.on("mouseout",function(){
				highlight.classed("hidden", true);

				tooltip.transition()
			       .duration(500)
			       .style("opacity", 0)
			});

			canvas.on('click', function() {
				let mouse = d3.mouse(this),
				    closest = tree.find(x.invert(mouse[0]), y.invert(mouse[1])),
				    cla = closest['cla'];

				if (cla in idlist && cla !== '-1') {
					if (vueins.selections.vcclaName == 'Select Class') {
						vueins.selections.vcclaName = cla
					} else {
						vueins.selections.compvcclaName = vueins.selections.vcclaName
						vueins.selections.vcclaName = cla
					}
				}
			})
		}
	}
}

export default mapview