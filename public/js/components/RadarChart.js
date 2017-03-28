'use strict'

import * as d3 from 'd3'

var series, dataValues;

var RadarChart = {
    draw: function(id, d, options) {
        var cfg = {
            radius: 5,
            w: 600,
            h: 600,
            factor: 1,
            factorLegend: .85,
            levels: 3,
            maxValue: 100,
            radians: 2 * Math.PI,
            opacityArea: 0.5,
            ToRight: 5,
            TranslateX: 20,
            TranslateY: 20,
            ExtraWidthX: 40,
            ExtraWidthY: 40,
            color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"]),
            speColor: d3.hsl(0, 50, 50)
        };

        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) {
                    cfg[i] = options[i];
                }
            }
        }

        // 用于显示该区域所有结果
        // 临时措施,只用于一个radar element
        let htmlStr = d[0].map((v)=>{
            return `<span>${v['area']}: ${v['value'].toFixed(6)}</span>`
        }).join('<br>');
        htmlStr = `${d[0][0]['name']}<br>${htmlStr}<br>Density: ${d[0][0]['data']['d']}`;

        var allAxis = (d[0].map(function(i, j) {
            return i.area }));
        var total = allAxis.length;
        var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
        var Format = d3.format('%');
        document.getElementById(id.substring(1)).innerHTML='';

        var g = d3.select(id)
            .attr('class', 'leaflet-radarchart') // 用于批量删除
            .attr("width", cfg.w + cfg.ExtraWidthX)
            .attr("height", cfg.h + cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

        // //Circular segments
        // for (var j = 0; j < cfg.levels; j++) {
        //     var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
        //     g.selectAll(".levels")
        //         .data(allAxis)
        //         .enter()
        //         .append("svg:line")
        //         .attr("x1", function(d, i) {
        //             return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
        //         .attr("y1", function(d, i) {
        //             return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
        //         .attr("x2", function(d, i) {
        //             return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total)); })
        //         .attr("y2", function(d, i) {
        //             return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total)); })
        //         .attr("class", "line")
        //         .style("stroke", "grey")
        //         .style("stroke-opacity", "0.75")
        //         .style("stroke-width", "0.3px")
        //         .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
        // }

        // //Text indicating at what % each level is
        // for (var j = 0; j < cfg.levels; j++) {
        //     var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
        //     g.selectAll(".levels")
        //         .data([1]) //dummy data
        //         .enter()
        //         .append("svg:text")
        //         .attr("x", function(d) {
        //             return levelFactor * (1 - cfg.factor * Math.sin(0)); })
        //         .attr("y", function(d) {
        //             return levelFactor * (1 - cfg.factor * Math.cos(0)); })
        //         .attr("class", "legend")
        //         .style("font-family", "sans-serif")
        //         .style("font-size", "10px")
        //         .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
        //         .attr("fill", "#737373")
        //         .text((j + 1) * 100 / cfg.levels);
        // }

        series = 0;

        var axis = g.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", cfg.w / 2)
            .attr("y1", cfg.h / 2)
            .attr("x2", function(d, i) {
                return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
            .attr("y2", function(d, i) {
                return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-dasharray", "4 5")
            .style("stroke-width", "1px");

        axis.append("text")
            .attr("class", "legend")
            .text(function(d) {
                return d })
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function(d, i) {
                return "translate(0, -10)" })
            .attr("x", function(d, i) {
                return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 15 * Math.sin(i * cfg.radians / total); })
            .attr("y", function(d, i) {
                return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 10 * Math.cos(i * cfg.radians / total) - 2; });

        let densityLabel = axis.append('text')
            .attr("class", "legend")
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr('x', cfg.w/2)
            .attr('y', cfg.h/2-12)
            .text('T');

        d.forEach(function(y, x) {
            dataValues = [];
            g.selectAll(".nodes")
                .data(y, function(j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                });
            dataValues.push(dataValues[0]);
            g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie" + series)
                .style("stroke-width", "2px")
                .style("stroke", cfg.speColor)//cfg.color(series))
                .attr("points", function(d) {
                    var str = "";
                    for (var pti = 0; pti < d.length; pti++) {
                        str = str + d[pti][0] + "," + d[pti][1] + " ";
                    }
                    return str;
                })
                .style('fill', cfg.speColor)
                // .style("fill", function(j, i) {
                //     return cfg.color(series) })
                .style("fill-opacity", cfg.opacityArea)
                .on('mouseover', function(d) {
                    let z = "polygon." + d3.select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .9);
                    
                    tooltip.style("left", d3.event.pageX + 30 + "px")
                        .style("top", d3.event.pageY - 160 + "px")
                        .style("display", "inline-block")
                        .html(htmlStr);
                    // console.log(d);
                })
                .on('mouseout', function() {
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);

                    tooltip.style("display", "none");
                });
            series++;
        });
        series = 0;

        let tooltip;
        // console.log(d3.select('#leaflet-radarchart-tooltip'))
        if (d3.select('#leaflet-radarchart-tooltip').empty()) {
          tooltip = d3.select("body").append("div")
          .attr('id', 'leaflet-radarchart-tooltip')
          .style("z-index", 999)
          .style('background-color', 'white')
          .style('border', '2px solid rgba(250,150,30,1)')
          .style('padding', '4px')
          .style('border-radius', '5px')
          .style('position', 'absolute')
          .attr("class", "toolTip");
        } else {
          tooltip = d3.select('#leaflet-radarchart-tooltip');
        }

        d.forEach(function(y, x) {
            g.selectAll(".nodes")
                .data(y).enter()
                .append("svg:circle")
                .attr("class", "radar-chart-serie" + series)
                .attr('r', cfg.radius)
                .attr("alt", function(j) {
                    return Math.max(j.value, 0) })
                .attr("cx", function(j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                    return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
                })
                .attr("cy", function(j, i) {
                    return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
                })
                .attr("data-id", function(j) {
                    return j.area })
                .style("fill", "#fff")
                .style("stroke-width", "1.2px")
                .style('stroke', cfg.speColor)
                // .style("stroke", cfg.color(series))
                .style("fill-opacity", .9)
                .on('mouseover', function(d) {
                    console.log(d.area);
                    tooltip
                        .style("left", d3.event.pageX - 40 + "px")
                        .style("top", d3.event.pageY - 80 + "px")
                        .style("display", "inline-block")
                        .html((d.area) + " Value<br><span>" + (d.value.toFixed(6)) + "</span>");
                })
                .on("mouseout", function(d) { tooltip.style("display", "none"); });

            series++;
        });
    }
};

export { RadarChart };
