/**
 * xmap-view.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-02-13 21:40:37
 * @version $Id$
 */

'use strict'

import L from './map'
// import heatmap from 'heatmap.js'
import HeatmapOverlay from 'heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap.js'
import * as d3 from 'd3'

// 临时变量 
import $ from "jquery"
window.jQuery = $
// 临时变量

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
		center: L.latLng(39.914,116.39),
		zoom: 11,
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
	pointmapDrawing(data, idlist, legend) {
		const LEDINTERVAL = 20,
			  colorSchema = ['#F3E500', '#F7B20F', '#EE7D1D', '#E74A21', '#D9051B', '#A0077C', '#4F2577', '#172C85'],
			  colorJudge = idlist.length < 8 && idlist.length > 2
		let self = this
		
		d3.select('#F_SVG').remove();
		d3.select('#GRID_SVG').remove();
		this.removeheatmap()

		if(data.features.length === 0) {
			alert('No records found!')
			return ;
		}

		let svg = d3.select(self.map.getPanes().overlayPane).append('svg').attr('id', 'F_SVG'),
			g = svg.append('g').attr('class', 'leaflet-zoom-hide').attr('id', 'F_G');

		let transform = d3.geoTransform({ point: projectPoint }),
			path = d3.geoPath().projection(transform);

		let color = d3.scaleOrdinal( colorJudge ? colorSchema.slice(0, idlist.length):d3.schemeCategory10.slice(0, idlist.length) ).domain(idlist)
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
				return `pointmapfeature ma_class_${d['properties'][legend]}`
			})
			.attr('stroke', function(d) {
				return color(d['properties'][legend])
				// return 'rgb(250,150,30)';
			})
			.attr('fill', function(d) {
				return color(d['properties'][legend])
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

	pointmapCDrawing(data, idlist, legend) {
		const LEDINTERVAL = 20,
			  RADIUS = 1,
			  colorSchema = ['#F3E500', '#F7B20F', '#EE7D1D', '#E74A21', '#D9051B', '#A0077C', '#4F2577', '#172C85'],
			  colorJudge = idlist.length < 8 && idlist.length > 2
		let self = this
		
		d3.select('#F_SVG').remove();
		d3.select('#GRID_SVG').remove();
		this.removeheatmap()

		if(data.features.length === 0) {
			alert('No records found!')
			return ;
		}

		let width = Math.max(960, window.innerWidth),
			height = Math.max(500, window.innerHeight)
			// prefix = prefixMatch(["webkit", "ms", "Moz", "O"]);

    	var projection = d3.geoMercator()
			.scale((1 << 24) / 2 / Math.PI)
			.translate([-width / 2, -height / 2]);

    	// let zoom = d3.zoom()
		   //  .scale(projection.scale() * 2 * Math.PI)
		   //  .scaleExtent([1 << 9, 1 << 25])
		   //  .translate(projection([-73.975536, 40.691674]).map(function(x) { return -x; }))
		   //  .on("zoom", zoomed);

    	let canvas = d3.select(self.map.getPanes().overlayPane).append("canvas")
		    .attr("width", width)
		    .attr("height", height)
		    .attr('class', 'layer')
		    .attr('id', 'F_SVG')

		let context = canvas.node().getContext("2d");

		self.map.on('moveend', zoomed);
		zoomed()
		
		function drawCanvas() {
			data['features'].forEach(function(element) {
				let node = projectPoint(element['geometry']['coordinates'][0], element['geometry']['coordinates'][1])
			    context.beginPath();
			    context.arc(node[0], node[1], RADIUS, 0, 2 * Math.PI )
			    context.fillStyle = "#ff0000"
			    context.fill()
			    context.closePath()
			});
		}

		function reDraw() {
			context.clearRect(0, 0, width, height);
			drawCanvas();
		}

		function zoomed() {
			// let tiles = tile
		 //      .scale(zoom.scale())
		 //      .translate(zoom.translate())
		 //      ();

		    reDraw();
		}

		function projectPoint(x, y) {
			let point = self.map.latLngToLayerPoint(new L.LatLng(y, x));
			return [point.x, point.y];
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

	/**
	 * [mapgridDrawing description]
	 * @param  {[type]} data [description]
	 * @param  {[type]} prop [description]
	 * @return {[type]}      [description]
	 */
	mapgridDrawing(data, prop) {
		if(data.features.length === 0) {
			alert('No records found!')
			return ;
		}

		let resprop = data['prop'],
			resminVal = Number.parseFloat(resprop['minVal']),
			resmaxVal = Number.parseFloat(resprop['maxVal']),
			usrminVal = Number.parseFloat(prop['min']),
			usrmaxVal = Number.parseFloat(prop['max'])

		d3.select('#F_SVG').remove();
		d3.select('#GRID_SVG').remove();
		this.removeheatmap()

		let self = this,
			panelwidth = document.getElementById('userpanel').getBoundingClientRect().width,
			svg = d3.select(self.map.getPanes().overlayPane).append('svg').attr('id', 'GRID_SVG'),
			g = svg.append('g').attr('class', 'leaflet-zoom-hide').attr('id', 'GRID_G');

		let transform = d3.geoTransform({ point: projectPoint }),
			path = d3.geoPath().projection(transform);

		let minVal = resminVal>usrminVal? resminVal:usrminVal,
			maxVal = resmaxVal<usrmaxVal? resmaxVal:usrmaxVal,
			interval = maxVal - minVal,
			colordomain = [minVal, minVal + interval*0.4, minVal + interval*0.6, maxVal],
			colorrange = ['#00A08A', '#00CC00', '#ff0', '#C00']

		let color = d3.scaleLinear().domain(colordomain).range(colorrange)

		d3.select('#mapviewlegend').selectAll("*").remove();
		let ledsvg = d3.select('#mapviewlegend')
				.attr('width', 200)
				.attr('height', 50)
		let svgForLegendStuff = ledsvg.append('g')
				.append('defs')
	            .append('linearGradient')
	            .attr('id', 'legendGradient')
	            .attr('x1', '0%') // bottom
	            .attr('y1', '0%')
	            .attr('x2', '100%') // to top
	            .attr('y2', '0%')

		// append gradient bar
        let legend = ledsvg.append('rect')
        		.attr('fill', 'url(#legendGradient)')
        		.attr("x",20)
                .attr("y",10)
                .attr("width",100)
                .attr("height",10)

        ledsvg.append("text")
            .attr("class","legendText")
            .attr("text-anchor", "middle")
            .attr("x",5)
            .attr("y",20)
            .attr("dy",0)
            .text(minVal.toFixed(2));
        ledsvg.append("text")
            .attr("class","legendText")
            .attr("text-anchor", "middle")
            .attr("x",130)
            .attr("y",20)
            .attr("dy",0)
            .text(maxVal.toFixed(2));

        let theData = []
        for (let i = 0; i < colordomain.length; i++) {
        	theData.push({
        		'rgb': colorrange[i],
        		'percent': (colordomain[i]-minVal)/interval
        	})
        }
        console.log(theData)
        let stops = d3.select('#legendGradient').selectAll('stop')
            .data(theData)
            .enter().append('stop')
            .attr('offset',function(d) {
			    return d.percent;
			})
			.attr('stop-color',function(d) {
			    return d.rgb;
			})
			.attr('stop-opacity', 1)

		let feature = g.selectAll('path')
				.data(data.features)
				.enter().append("path")
				.attr('fill', function(d) {
					return color(d['properties']['val'])
				});

		self.map.on('moveend', reset);
		reset();

		function reset() {
			let bounds = path.bounds(data),
				topLeft = bounds[0],
				bottomRight = bounds[1];

			svg.attr('width', bottomRight[0] - topLeft[0] + 10)
				.attr('height', bottomRight[1] - topLeft[1] + 10)
				.style('left', (topLeft[0] - 5) + 'px')
				.style('top', (topLeft[1] - 5) + 'px');

			g.attr('transform', 'translate(' + -topLeft[0] + ',' + -topLeft[1] + ')');

			feature.attr('d', path)
				.attr('transform', 'translate(5, 5)')
				.style('fill-opacity', 0.7)
				// .attr('stroke', 'white')
				// .attr('stroke-width', '0.5')
				.attr('fill', function(d) {
					let entropy = d['properties']['val']
					if (entropy < 0) {
						return 'rgba(0,0,0,0)'
					}
					return color(entropy)
				});
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

	/**
	 * [mapgridCDrawing description]
	 * @param  {[type]} data [description]
	 * @param  {[type]} prop [description]
	 * @return {[type]}      [description]
	 */
	mapgridCDrawing(data, prop) {
		let self = this
		if(data.features.length === 0) {
			alert('No records found!')
			return ;
		}

		let resprop = data['prop'],
			resminVal = Number.parseFloat(resprop['minVal']),
			resmaxVal = Number.parseFloat(resprop['maxVal']),
			usrminVal = Number.parseFloat(prop['min']),
			usrmaxVal = Number.parseFloat(prop['max'])

		// updated color scale
		let minVal = resminVal>usrminVal? resminVal:usrminVal,
			maxBVal = resmaxVal<usrmaxVal? resmaxVal:usrmaxVal,
			maxEVal = resmaxVal<usrmaxVal? usrmaxVal:resmaxVal,
			interval = maxBVal - minVal,
			colordomain = [minVal, maxBVal, maxEVal],
			colorrange = ['rgba(255,255,255,0.5)', 'rgba(255,0,0,1)', 'rgba(255,0,0,1)']

		let color = d3.scaleLinear().domain(colordomain).range(colorrange)

		// d3.select('#F_SVG').remove();
		// d3.select('#GRID_SVG').remove();
		// this.removeheatmap()
		this.removecanvas()
		console.log('Begin to draw gridmap based on received data.');
		console.time('DRAWING');
        let drawingOnCanvas = function(canvasOverlay, params) {
			let ctx = params.canvas.getContext('2d');
            ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);

            let len = data.features.length
            for (let i = 0; i < len; i++) {
            	let feature = data.features[i],
            		// d = feature.properties.center.coordinates,
            		poly = feature.geometry.coordinates[0],
            		entropy = data.features[i]['properties']['val']

                if (params.bounds.contains([poly[0][1], poly[0][0]]) && entropy >= minVal) {
                    // let dot = canvasOverlay._map.latLngToContainerPoint([d[1], d[0]]);
                    
                    let nw = canvasOverlay._map.latLngToContainerPoint([poly[3][1], poly[3][0]]),
                    	se = canvasOverlay._map.latLngToContainerPoint([poly[1][1], poly[1][0]]);
                    ctx.fillStyle = color(entropy),
                    ctx.fillRect(nw.x, nw.y, Math.abs(se.x-nw.x), Math.abs(se.y-nw.y));
                }
            }
		}

		console.log('Finished gridmap drawing.');
		console.timeEnd('DRAWING');
		L.canvasOverlay()
            .drawing(drawingOnCanvas)
            .addTo(self.map);
	}

	/**
	 * [heatmapDrawing description]
	 * @param  {[type]} data [description]
	 * @param  {[type]} prop [description]
	 * @return {[type]}      [description]
	 */
	heatmapDrawing(data, prop) {
		let len = data.features.length,
			hdata = {
				max: 0,
				data: []
			}

		d3.select('#F_SVG').remove();
		d3.select('#GRID_SVG').remove();
		this.removeheatmap()
		this.removecanvas()

		for (let i = len - 1; i >= 0; i--) {
			let center = data.features[i]['properties']['center']['coordinates'],
				entropy = data.features[i]['properties']['entropy']

			if (hdata.max < entropy) {
				hdata.max = entropy
			}

			hdata.data.push({'lat': center[1], 'lng': center[0], 'count': entropy})
		}

		let cfg = {
		  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
		  // if scaleRadius is false it will be the constant radius used in pixels
		  "radius": .012,
		  "maxOpacity": .8, 
		  // scales the radius based on map zoom
		  "scaleRadius": true, 
		  // if set to false the heatmap uses the global maximum for colorization
		  // if activated: uses the data maximum within the current map boundaries 
		  //   (there will always be a red spot with useLocalExtremas true)
		  "useLocalExtrema": false,
		  // which field name in your data represents the latitude - default "lat"
		  latField: 'lat',
		  // which field name in your data represents the longitude - default "lng"
		  lngField: 'lng',
		  // which field name in your data represents the data value - default "value"
		  valueField: 'count'
		};
		let heatmapLayer = new HeatmapOverlay(cfg);

		this.map.addLayer(heatmapLayer);
		heatmapLayer.setData(hdata)
	}

	/**
	 * [panTo description]
	 * @param  {[lat, lng]} point [description]
	 * @return {[type]}       [description]
	 */
	panTo(point) {
		this.map.panTo( L.latLng(point[0], point[1]) )
	}

	setView(lat=39.914,lng=116.39,zoom=11) {
		this.map.setView(L.latLng(lat,lng), zoom)
	}

	removeheatmap() {
		// let canvas = document.getElementsByClassName('heatmap-canvas')[0]
		// if (canvas) {
		// 	canvas.parentNode.removeChild(canvas)
		// }
		// 
		
		
		let obj = $('.leaflet-overlay-pane .leaflet-zoom-hide')
		if (obj) {
			obj.remove();
		} 
	}

	removecanvas() {
		$('canvas.leaflet-heatmap-layer.leaflet-zoom-animated').remove()
	}
}

export default mapview