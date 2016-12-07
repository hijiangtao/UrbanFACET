/**
 * Points and lines' drawing function
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-07 17:18:20
 * @version $Id$
 */

import d3 from 'd3'

/**
 * [pointmapDrawing description]
 * @param  {[type]} data   [description]
 * @param  {[type]} idlist [description]
 * @return {[type]}        [description]
 */
let pointmapDrawing = function(data, idlist) {

    d3.select("#F_SVG").remove();
    
    var color = d3.scale.category10().domain(idlist);

    var svg = d3.select(mapins.map.getPanes().overlayPane).append("svg").attr("id", "F_SVG"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide").attr("id", "F_G");

    var transform = d3.geo.transform({ point: projectPoint }),
        path = d3.geo.path().projection(transform);

    path.pointRadius(2);

    // console.log(data.features);

    var feature = g.selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("stroke", function(d) {
            return "rgb(250,150,30)";
        })
        .attr("fill", function(d) {
            return "rgb(250,150,30)";
        })
        .attr("opacity", "0.8")
        .attr("class", "pointmapfeature");

    mapins.map.on("viewreset", reset);
    reset();

    // Reposition the SVG to cover the features.
    function reset() {
        var bounds = path.bounds(data),
            topLeft = bounds[0],
            bottomRight = bounds[1];

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
        var point = mapins.map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
        // console.log(point);
    }
}