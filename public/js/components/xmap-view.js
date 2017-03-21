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
import { legendColor } from 'd3-svg-legend'
import { getSubGrids, getLinearNum, getRandomCenter, outOfRange, getPropName } from './apis'
import { stats } from './init'
import * as coordtransform from 'coordtransform';

// 临时变量 
import $ from "jquery"
window.jQuery = $

const SPLIT = 0.003

class mapview {
    /**
     * LMap class constructor
     * @return {[type]} [description]
     */
    constructor(id, grdleg, ctrleg) {
        let self = this;
        this.ides = {
            'mapid': id,
            'grdleg': grdleg,
            'ctrleg': ctrleg
        };
        this.baseLayer = L.tileLayer(
            'https://api.mapbox.com/styles/v1/{uid}/cisu4qyac00362wqbe6oejlfh/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Urban Mobility Map &copy; 2017',
                maxZoom: 18,
                uid: 'hijiangtao',
                accessToken: 'pk.eyJ1IjoiaGlqaWFuZ3RhbyIsImEiOiJjaWx1bGpldnowMWVwdGlrcm5rcDNiazU2In0.6bViwknzYRPVyqOj7JUuKw'
            });
        this.heatmapLayer = null;
        this.gridmapLayer = null;
        this.map = new L.map(id, {
            center: L.latLng(39.9120, 116.3907),
            zoom: 11,
            layers: self.baseLayer
        });
        this.map.zoomControl.setPosition('topright');
        this.gridData = {};
        this.gridDataType = '';

        this.map.on('resize', function(argument) {
            console.log('resize');
        })
    }

    getGridData() {
        return this.gridData;
    }

    setGridData(data) {
        this.gridData = data;
        return this;
    }

    getGridDataType() {
        return this.gridDataType;
    }

    setGridDataType(data) {
        this.gridDataType = data;
        return this;
    }

    syncmap(map) {
        if (!this.map.isSynced()) {
            this.map.sync(map);
        }
        
        return ;
    }

    unsyncmap(map) {
        if (this.map.isSynced()) {
            this.map.unsync(map);
        }

        return ;
    }

    /**
     * Canvas Drawing Function
     * @param  {[type]} data   [description]
     * @param  {[type]} idlist [description]
     * @param  {[type]} legend [description]
     * @return {[type]}        [description]
     */
    pointmapCDrawing(data, prop) {
        const RADIUS = 1,
              colorSchema = '#FF0000'

        let self = this,
            overlay = d3.select(self.map.getPanes().overlayPane);

        // 暂时只处理一个视图下的可视化实现
        d3.select('#aoiCanvas').remove();
        d3.select('#boundarySVG').remove();

        if (data.length === 0) {
            alert('No records found!')
            return;
        }

        let width = Math.max(960, overlay.style('width')),
            height = Math.max(500, overlay.style('height'));

        let projection = d3.geoMercator()
            .scale((1 << 24) / 2 / Math.PI)
            .translate([-width / 2, -height / 2]);

        let canvas = overlay.append("canvas")
            .attr("width", width)
            .attr("height", height)
            .attr('class', 'layer')
            .attr('id', 'aoiCanvas')

        let context = canvas.node().getContext("2d");

        self.map.on('moveend', zoomed);
        zoomed()

        function drawCanvas() {
            data['features'].forEach(function(element) {
                let node = projectPoint(element['geometry']['coordinates'][0], element['geometry']['coordinates'][1])
                context.beginPath();
                context.arc(node[0], node[1], RADIUS, 0, 2 * Math.PI)
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

    boundaryDrawing(data, prop) {
        let self = this,
            city = prop['city'] || 'bj',
            type = prop['type'] || 0,
            statsdata = stats[city];

        d3.select('#boundarySVG').remove();
        d3.select('#aoiCanvas').remove();
        if (type === -1) {
        	return ;
        }

        let range = d3.extent(Object.values(statsdata).map((val) => {
                return val[type];
            })),
            color = d3.scaleLinear().domain(range)
            .range(["rgba(255,255,255,0.5)", "rgba(251, 0, 128, 0.5)"]);

        let svg = d3.select(self.map.getPanes().overlayPane).append("svg").attr('id', 'boundarySVG'),
            g = svg.append("g").attr("class", "leaflet-zoom-hide");

        let div = d3.select("#boundarySVG").append("div")
		    .attr("class", "svgtooltip")
		    .style("opacity", 0);

        d3.json(`/${city}.json`, function(error, collection) {
            if (error) throw error;

            let transform = d3.geoTransform({ point: projectPoint }),
                path = d3.geoPath().projection(transform);

            let feature = g.selectAll("path")
                .data(collection.features)
                .enter().append("path")
                .attr('fill', function(d) {
                    let name = d.properties.name;
                    // let val = 200 + Math.floor(Math.random()*55);
                    return color(statsdata[name][type]);
                })
                .attr('stroke', 'white')
                .attr("stroke-width", 1.2)
                .on("mouseover", function(d) {
                	let name = d.properties.name;

                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(name + "<br/>" + statsdata[name][type])
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            self.map.on("viewreset", reset);
            reset();

            // Reposition the SVG to cover the features.
            function reset() {
                let bounds = path.bounds(collection),
                    topLeft = bounds[0],
                    bottomRight = bounds[1];

                svg.attr("width", bottomRight[0] - topLeft[0])
                    .attr("height", bottomRight[1] - topLeft[1])
                    .style("left", topLeft[0] + "px")
                    .style("top", topLeft[1] + "px");

                g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

                feature.attr("d", path);
            }

            // Use Leaflet to implement a D3 geometric transformation.
            function projectPoint(x, y) {
                let p2 = coordtransform.gcj02towgs84(x, y);
                // p2 = coordtransform.gcj02towgs84(p[0], p[1]);

                let point = self.map.latLngToLayerPoint(new L.LatLng(p2[1], p2[0]));
                this.stream.point(point.x, point.y);
            }
        });
    }

    /**
     * 用 canvas 绘制 gridmap, 提供从本地或者远程获取数据两种绘制方式
     * @param  {[type]} data [description]
     * @param  {[type]} prop [description]
     * @return {[type]}      [description]
     */
    mapgridCDrawing(data, prop, update = false, split = false, random = false) {
        // update为false表示当前执行重绘操作, update为true则从实例中调用历史数据进行绘制
        if (!update) {
            this.setGridData(data);
        } else {
            data = this.getGridData();
        }
        this.setGridDataType(prop['prop']['type']);

        let self = this;
        const drawtype = prop['prop']['type'],
            resprop = data['prop'],
            SPLITNUMBER = 4;

        // updated color scale
        let begVal = 0,
            minVal = prop[drawtype]['min'],
            maxVal = prop[drawtype]['max'],
            endVal = prop[drawtype]['scales'],
            maxRate = maxVal / endVal,
            minRate = minVal / endVal,
            colordomain = [minVal, maxVal, endVal],
            ledcolordomain = [minRate, maxRate, 1],
            colorrange = ['rgba(255,255,255,0)', 'rgba(255,0,0,1)', 'rgba(255,0,0,1)']

        // 
        if (prop['prop']['maprev']) {
            colorrange = ['rgba(255,0,0,1)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)']
        }

        let color = d3.scaleLinear().domain(colordomain).range(colorrange),
            legColor = d3.scaleLinear().domain(ledcolordomain).range(colorrange);


        this.clearLayers();
        console.log('Begin to draw gridmap based on received data.');
        console.time('DRAWING');

        // canvas 图层绘制方法
        let countVal = 0;
        let drawingOnCanvas = function(canvasOverlay, params) {
            let ctx = params.canvas.getContext('2d');
            ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);

            let len = data.features.length;
            for (let i = 0; i < len; i++) {
                let feature = data.features[i],
                    poly = feature.geometry.coordinates[0],
                    center = feature['prop']['c'], // center
                    evalue = feature['prop']['e'], // entropy value
                    dvalue = feature['prop']['d']; // density value

                // 根据 filter 值及选中类型进行过滤
                if (outOfRange(drawtype, evalue, dvalue, prop['e']['min'], prop['d']['min'])) {
                    continue;
                }
                countVal += 1;

                if (params.bounds.contains([center[1], center[0]])) {
                    if (split) {
                        let subgrids = getSubGrids(poly, center, SPLITNUMBER)

                        for (let subind = SPLITNUMBER - 1; subind >= 0; subind--) {
                            // 
                            let nw = canvasOverlay._map.latLngToContainerPoint(subgrids[subind]['nw']),
                                se = canvasOverlay._map.latLngToContainerPoint(subgrids[subind]['se']);
                            ctx.fillStyle = color(feature['prop'][drawtype] * (1 + Math.random() * 0.3)),
                                ctx.fillRect(nw.x, nw.y, Math.abs(se.x - nw.x), Math.abs(se.y - nw.y));
                        }
                    } else {
                        let nw = canvasOverlay._map.latLngToContainerPoint([poly[3][1], poly[3][0]]),
                            se = canvasOverlay._map.latLngToContainerPoint([poly[1][1], poly[1][0]]);
                        ctx.fillStyle = color(feature['prop'][drawtype]),
                            ctx.fillRect(nw.x, nw.y, Math.abs(se.x - nw.x), Math.abs(se.y - nw.y));
                    }
                }
            }
        }

        console.log('Gridmap Used Feature Number ', countVal);
        self.drawGridLegend(`Content ${getPropName(drawtype)}`, legColor);

        console.log('Finished gridmap drawing.');
        console.timeEnd('DRAWING');

        self.gridmapLayer = L.canvasOverlay()
            .drawing(drawingOnCanvas)
            .addTo(self.map);
    }

    /**
     * 利用 contour 方式绘制 heatmap,使绘制出的结果较 gridmap 连续
     * @param  {[type]} data [description]
     * @param  {[type]} prop [description]
     * @return {[type]}      [description]
     */
    mapcontourCDrawing(data, prop, update = false) {
        // update为false表示当前执行重绘操作, update为true则从实例中调用历史数据进行绘制
        if (!update) {
            this.setGridData(data);
        } else {
            data = this.getGridData();
            // prop['prop']['type'] = this.getGridDataType();
        }
        this.setGridDataType(prop['prop']['type']);

        console.log('Contour props: ', prop, 'Update: ', update);

        const drawtype = prop['prop']['type'],
            resprop = data['prop'],
            SPLITNUMBER = 4;

        // updated color scale
        let begVal = 0,
            minVal = prop[drawtype]['min'],
            maxVal = prop[drawtype]['max'],
            endVal = prop[drawtype]['scales'],
            maxRate = maxVal / endVal,
            minRate = minVal / endVal,
            judRate = Number.parseFloat((maxVal - minVal) / (endVal - minVal));

        let len = data.features.length,
            hdata = {
                max: endVal,
                min: minVal,
                data: []
            }

        let oneqVal = 0.25 * judRate,
            twoqVal = 0.5 * judRate,
            thrqVal = 0.85 * judRate,
            forqVal = judRate;

        if (forqVal > 1.0) {
            forqVal = 1.0;
        }
        this.clearLayers();

        let countVal = 0;
        for (let i = len - 1; i >= 0; i--) {
            let feature = data.features[i],
                evalue = feature['prop']['e'],
                dvalue = feature['prop']['d'];

            // 根据 filter 值及选中类型进行过滤
            if (outOfRange(drawtype, evalue, dvalue, prop['e']['min'], prop['d']['min'])) {
                continue;
            }
            countVal += 1;

            let center = data.features[i]['prop']['c'],
                val = data.features[i]['prop']['e'],
                renderNum = getLinearNum(dvalue, minVal, maxVal, 1, SPLITNUMBER);

            // 为 hdata 注入数据
            switch (drawtype) {
                case 'm': // density based
                    for (let i = 0; i < renderNum; i++) {
                        let random = getRandomCenter(center, -SPLIT / 2, SPLIT)
                        hdata.data.push({ 'lat': random[1], 'lng': random[0], 'c': val })
                    }
                    break;
                case 'd': // density
                    for (let i = 0; i < renderNum; i++) {
                        let random = getRandomCenter(center, -SPLIT / 2, SPLIT)
                        hdata.data.push({ 'lat': random[1], 'lng': random[0], 'c': hdata.max * 0.5 })
                    }
                    break;
                default: // entropy
                    hdata.data.push({ 'lat': center[1], 'lng': center[0], 'c': val })
                    break;
            }
        }
        console.log('Contourmap Used point number', countVal);

        let cfg = {
            // radius should be small ONLY if scaleRadius is true (or small radius is intended)
            // if scaleRadius is false it will be the constant radius used in pixels
            "radius": .005,
            "maxOpacity": .9,
            // scales the radius based on map zoom
            "scaleRadius": true,
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries
            gradient: {},
            //   (there will always be a red spot with useLocalExtremas true)
            "useLocalExtrema": prop['prop']['useLocalExtrema'],
            // which field name in your data represents the latitude - default "lat"
            "latField": 'lat',
            // which field name in your data represents the longitude - default "lng"
            "lngField": 'lng',
            // which field name in your data represents the data value - default "value"
            "valueField": 'c'
        };

        let gradients = ['rgba(255,255,255,0)', 'rgba(255,0,0,1)', 'rgb(0,0,255)', 'rgb(0,255,0)', 'yellow', 'rgb(255,0,0)'];
        if (prop['prop']['maprev']) {
            gradients = ['rgba(255,0,0,1)', 'rgba(255,255,255,0)', 'rgb(255,0,0)', 'yellow', 'rgb(0,255,0)', 'rgb(0,0,255)'];
        }

        // console.log(prop['prop']);
        if (!prop['prop']['multiColorSchema']) {
            cfg.gradient = {
                // enter n keys between 0 and 1 here
                // for gradient color customization
                '0': gradients[0],
                '1.0': gradients[1]
            }
            if (judRate !== 1.0) {
                cfg.gradient[maxRate] = gradients[1];
            }
        } else {
            cfg.gradient[oneqVal.toString()] = gradients[2];
            cfg.gradient[twoqVal.toString()] = gradients[3];
            cfg.gradient[thrqVal.toString()] = gradients[4];
            cfg.gradient[forqVal.toString()] = gradients[5];

            if (judRate < 1.0) {
                cfg.gradient['1.0'] = gradients[5];
            }
        }

        // draw legends
        this.drawContourLegend(`Content ${getPropName(drawtype)}`, cfg.gradient);

        this.heatmapLayer = new HeatmapOverlay(cfg);
        this.map.addLayer(this.heatmapLayer);
        this.heatmapLayer.setData(hdata)
    }

    /**
     * 绘制地图中的参考图标
     * @param  {String} title [description]
     * @param  {Array}  scale [description]
     * @param  {[type]} 100]  [description]
     * @return {[type]}       [description]
     */
    drawGridLegend(title = 'entropy', linear) {
        this.switchLegDisplay('grdleg');

        let id = `#${this.ides.grdleg}`;

        d3.select(id).selectAll('*').remove();
        let svg = d3.select(id).attr('height', 50);

        // svg.append('text')
        // 	.attr('y', 23)
        // 	.attr('x', 2)
        // 	.text(title);

        svg.append("g")
            .attr("class", "legendLinear")
            .attr("transform", "translate(10,10)");

        let legendLinear = legendColor()
            .labelFormat(function(d) {
                return `${Number.parseInt(d*100)}%`
            })
            .shapeWidth(30)
            .orient('horizontal')
            .scale(linear);

        svg.select(".legendLinear")
            .call(legendLinear);
    }

    /**
     * 根据 contour 的标题以及 scale 定制绘制 legend
     * @param  {[type]} title [description]
     * @param  {[type]} scale [description]
     * @return {[type]}       [description]
     */
    drawContourLegend(title = "Contour Legend", gradientCfg) {
        this.switchLegDisplay('ctrleg');

        let container = document.getElementById(this.ides.ctrleg),
            svg = d3.select(`#${this.ides.ctrleg}`),
            legCanvas = document.createElement('canvas');
        legCanvas.width = 180;
        legCanvas.height = 15;

        svg.selectAll('*').remove();
        let g = svg.append('svg')
            .attr('height', 20)
            // .attr("transform", "translate(10,10)");

        // g.append('text')
        // 	.attr('y', 13)
        // 	.attr('x', 2)
        // 	.text(title);
        g.append('text')
            .attr('y', 13)
            .attr('x', 2)
            .text('0%');
        g.append('text')
            .attr('y', 13)
            .attr('x', 145)
            .text('100%');

        let gradientImg = document.createElement("img"),
            legCtx = legCanvas.getContext('2d'),
            gradient = legCtx.createLinearGradient(0, 0, 100, 1);

        for (let key in gradientCfg) {
            gradient.addColorStop(key, gradientCfg[key]);
        }

        legCtx.fillStyle = gradient;
        legCtx.fillRect(0, 0, 180, 15);

        gradientImg.src = legCanvas.toDataURL();
        // gradientImg.style.position = 'absolute';
        // gradientImg.style.left = '10px';
        container.insertBefore(gradientImg, container.childNodes[0]);
    }

    /**
     * [panTo description]
     * @param  {[lat, lng]} point [description]
     * @return {[type]}       [description]
     */
    panTo(point) {
        this.map.panTo(L.latLng(point[0], point[1]))
    }

    panBy(point) {
        this.map.panBy(L.point(point[0], point[1]))
    }

    setView(lat = 39.914, lng = 116.39, zoom = 11) {
        this.map.setView(L.latLng(lat, lng), zoom)
    }

    /**
     * 删除所有附加可视化图层
     * @return {[type]} [description]
     */
    clearLayers() {
        if (this.heatmapLayer) {
            this.map.removeLayer(this.heatmapLayer);
            this.heatmapLayer = null;
        }
        if (this.gridmapLayer) {
            this.map.removeLayer(this.gridmapLayer);
            this.gridmapLayer = null;
        }
    }

    /**
     * 切换不同 legend 的图层显示
     * @param  {[type]} cfg [description]
     * @return {[type]}     [description]
     */
    switchLegDisplay(cfg) {
        for (let key in this.ides) {
            if (key === 'mapid') {
                continue;
            }

            let val = this.ides[key];
            if (key !== cfg) {
                document.getElementById(val).style.display = 'none';
            } else {
                document.getElementById(val).style.display = 'inline';
            }
        }
    }

}

export default mapview
