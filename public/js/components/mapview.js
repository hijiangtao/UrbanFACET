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
		let self = this
		
		d3.select("#F_SVG").remove();

		let svg = d3.select(self.map.getPanes().overlayPane).append("svg").attr("id", "F_SVG"),
			g = svg.append("g").attr("class", "leaflet-zoom-hide").attr("id", "F_G");

		let transform = d3.geoTransform({ point: projectPoint }),
			path = d3.geoPath().projection(transform);

		let color = d3.scaleOrdinal(d3.schemeCategory20)

		path.pointRadius(1);

		var feature = g.selectAll("path")
			.data(data.features)
			.enter().append("path")
			.attr("stroke", function(d) {
				return color(d['properties']['name'])
				// return "rgb(250,150,30)";
			})
			.attr("fill", function(d) {
				return color(d['properties']['cla'])
				// return "rgb(250,150,30)";
			})
			.attr("opacity", "0.8")
			.attr("class", "pointmapfeature");

		self.map.on("moveend", reset);
		reset();

		/**
		 * Reposition the SVG to cover the features.
		 * @return {[type]} [description]
		 */
		function reset() {
			var bounds = path.bounds(data),
				topLeft = bounds[0],
				bottomRight = bounds[1];

			// console.log(bounds);

			svg.attr("width", bottomRight[0] - topLeft[0] + 10)
				.attr("height", bottomRight[1] - topLeft[1] + 10)
				.style("left", (topLeft[0] - 5) + "px")
				.style("top", (topLeft[1] - 5) + "px");

			g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

			feature.attr("d", path)
				.attr("transform", "translate(5, 5)");
		};

		/**
		 * Use Leaflet to implement a D3 geometric transformation.
		 * @param  {[type]} x [description]
		 * @param  {[type]} y [description]
		 * @return {[type]}   [description]
		 */
		function projectPoint(x, y) {
			var point = self.map.latLngToLayerPoint(new L.LatLng(y, x));
			this.stream.point(point.x, point.y);
		}
	}
}

export default mapview