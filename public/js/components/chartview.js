/**
 * chartview.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-03-01 17:04:06
 * @version $Id$
 */

'use strict'
import * as d3 from 'd3'
import { getRealProp, smecAve, smecMax } from './init'

class chart {
    constructor(id) {
        this.id = id
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
            xname = prop['xname']; // x轴内容名字
        container.select('svg').remove();
        
        console.log('Container', d3.select(`#${id}`), 'cWidth', cWidth, 'cHeight', cHeight);
        let svg = container.append("svg")
            .attr('width', cWidth)
            .attr('height', cHeight),
            margin = { top: 10, right: 5, bottom: 30, left: 25 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        let bisectDate = d3.bisector(function(d) {
                return d.k;
            }).left,
            x = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]);

        let line = d3.line()
            .curve(d3.curveNatural) // .interpolate("monotone")
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

        let tooltip = d3.select('#cTipContainer');
        if (tooltip.empty()) {
            tooltip = d3.select("body").append("div").attr("id","cTipContainer")
            .style('display', 'none')
            .style('background-color', 'white')
            .style('border', '2px solid rgba(250,150,30,1)')
            .style('padding', '4px')
            .style('border-radius', '5px')
            .style('position', 'absolute')
            .attr("class", "toolTip");
        }

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
                tooltip.style("display", 'none');
            })
            .on("mousemove", mousemove);

        function mousemove() {
            let x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.k > d1.k - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.k) + "," + y(d.v) + ")");

            tooltip
                .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 40 + "px")
                    .style("display", "inline-block")
                    .html(`${prop['xname']}: ${d.k}%, Count: ${d.v}`);
            focus.select(".x-hover-line").attr("y2", height - y(d.v));
            focus.select(".y-hover-line").attr("x2", -x(d.k));
        }
    }

    /**
     * 带 tooltip bar chart 绘制方法
     * @param  {[type]} id   [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    barChartDraw(city, id, data, prop) {
        let container = d3.select(`#${id}`),
            cWidth = container.node().getBoundingClientRect().width,
            cHeight = container.node().getBoundingClientRect().height,
            xname = prop['xname'],
            xprop = 'english',
            yprop = getRealProp(prop['yprop']);
        container.select('svg').remove();
        //console.log("data:" + JSON.stringify(data))
        //console.log("large", smecAve[city][yprop]);
        //console.log('bar Chart props', data);

        // console.log('Container', d3.select(`#${id}`), 'cWidth', cWidth, 'cHeight', cHeight);
        let svg = container.append("svg")
            .attr('width', cWidth)
            .attr('height', cHeight),
            margin = { top: 5, right: 5, bottom: 55, left: 30 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        let tooltip = d3.select('#cTipContainer');
        if (tooltip.empty()) {
            tooltip = d3.select("body").append("div").attr("id","cTipContainer")
            .style('display', 'none')
            .style('background-color', 'white')
            .style('border', '2px solid rgba(250,150,30,1)')
            .style('padding', '4px')
            .style('border-radius', '5px')
            .style('position', 'absolute')
            .attr("class", "toolTip");
        }

        let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);

        let g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d) {
        		//console.log("d" + d[xprop])
                return d[xprop]; }));
        if (yprop === 'd'){
        		y.domain([0, smecMax[city]['d']])
        }else{
        		y.domain([0, d3.max(data, function(d) {
        				return d[yprop]; })]);

        }
        
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("transform", function(d) {
                return "rotate(-40)" 
                });
        g.select('.axis.axis--x').append("text")
            .attr("class", "axis-title")
            .attr("y", -16)
            .attr("x", width)
            .attr("dy", ".95em")
            .style("text-anchor", "end")
            .attr("fill", "#5D6971")
            .text('DIV');

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(5).tickFormat(function(d) {
                if (yprop === 'd') {
                    return Number.parseInt(d / 1000000) + "M";
                } else {
                    return d.toFixed(3);
                }
            }).tickSizeInner([-width]))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .attr("fill", "#5D6971")
            .text(xname);

        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr('class', 'redrect')
            .attr("x", function(d) {
            		//console.log("xprop" + x)
                return x(d[xprop]); })
            .attr("y", function(d) {
                return y(d[yprop]); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) {
            	   //console.log("height" + height - y(d[yprop]))
                return height - y(d[yprop]); })
            .attr("fill", 'rgba(250,150,30,1)')
            .on("mousemove", function(d) {
                tooltip
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html((d[xprop]) + "<br>" + xname + ": " + d[yprop]);
            })
            .on("mouseout", function(d) { tooltip.style("display", "none"); });
       
        	/*
        	   g.append("text")
        		.text("smecAve[city][yprop]")
            //.attr("x", -width)
            .attr("y", y(smecAve[city][yprop]))
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .attr("fill", "#5D6971")
            .text(xname);
		*/
        
        //console.log("height" + (height - y(smecAve[city][yprop])))
        g.append("line")
        		.attr("x1", -10)
        		.attr("y1", y(smecAve[city][yprop]))
        		.attr("x2", width+10)
        		.attr("y2", y(smecAve[city][yprop]))
        		.style("stroke", "green")
            .style("stroke-dasharray", "5 5")
            .style("stroke-width", "1.2px")
            .on("mousemove", function(d) {
                tooltip
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(("Average") + "<br>" + xname + ": " + smecAve[city][yprop]);
            })
            .on("mouseout", function(d) { tooltip.style("display", "none"); });
        		
    }

    /**
     * 合并两类数据的 POI 分步 bar chart
     * !!!需要重构!!!
     * @param  {[type]} id   [description]
     * @param  {[type]} data [description]
     * @param  {[type]} prop [description]
     * @return {[type]}      [description]
     */
    poiBarChartDraw(id, data, prop) {
        let container = d3.select(`#${id}`),
            cWidth = container.node().getBoundingClientRect().width,
            cHeight = container.node().getBoundingClientRect().height,
            xname = 'POI',
            yname = 'Probability',
            kdata = data['k'],
            vdata = data['v'];

        vdata.pop();
        container.select('svg').remove();

        let svg = container.append("svg")
            .attr('width', cWidth)
            .attr('height', cHeight),
            margin = { top: 10, right: 5, bottom: 60, left: 30 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        let tooltip = d3.select('#cTipContainer');
        if (tooltip.empty()) {
            tooltip = d3.select("body").append("div").attr("id","cTipContainer")
            .style('display', 'none')
            .style('background-color', 'white')
            .style('border', '2px solid rgba(250,150,30,1)')
            .style('padding', '4px')
            .style('border-radius', '5px')
            .style('position', 'absolute')
            .attr("class", "toolTip");
        }

        let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);

        let g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(kdata.map(function(d) {
                return d; }));
        let ymax = d3.max(vdata, function(d) {
            return d; });
        y.domain([0, ymax]);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("transform", function(d) {
                return "rotate(-40)" 
                });
        g.select('.axis.axis--x').append("text")
            .attr("class", "axis-title")
            .attr("y", -16)
            .attr("x", width)
            .attr("dy", ".95em")
            .style("text-anchor", "end")
            .attr("fill", "#5D6971")
            .text(xname);

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(5).tickFormat(function(d) {
                return Number.parseInt(d * 100 / ymax) + "%";
            }).tickSizeInner([-width]))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .attr("fill", "#5D6971")
            .text(yname);

        g.selectAll(".bar")
            .data(vdata)
            .enter().append("rect")
            .attr('class', 'redrect')
            .attr("x", function(d, i) {
                return x( kdata[i] ); })
            .attr("y", function(d) {
                return y( d ); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) {
                return height - y(d); })
            .attr("fill", 'rgba(250,150,30,1)')
            .on("mousemove", function(d, i) {
                tooltip
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 70 + "px")
                    .style("display", "inline-block")
                    .html(kdata[i] + " POI<br>" + yname + ": " + d.toFixed(1));
            })
            .on("mouseout", function(d) { tooltip.style("display", "none"); });
    }
}

export default chart
