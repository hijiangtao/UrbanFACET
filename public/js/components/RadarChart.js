'use strict'

import * as d3 from 'd3'

var series, dataValues;

var RadarChart = {
    draw: function(id, d, options, kind) {
        var cfg = {
            radius: 2,
            w: 100,
            h: 100,
            factor: 1,
            factorLegend: .85,
            levels: 3,
            maxValue: 100,
            radians: 2 * Math.PI,
            opacityArea: 1.0,
            ToRight: 5,
            TranslateX: 10,
            TranslateY: 10,
            ExtraWidthX: 20,
            ExtraWidthY: 20,
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
            return `<span>${v['area']}: ${v['value'].toFixed(2)}</span>`
        }).join('<br>');
        htmlStr = `${d[0][0]['name']}<br>${htmlStr}<br>densiTy: ${(d[0][0]['data']['d']/1000000).toFixed(2)}${'*10^6/km^2'}`;
        //console.log(d[0][0]['data']['d'])

        var allAxis = (d[0].map(function(i, j) {
            return i.area }));
        var total = allAxis.length;
        var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
        var Format = d3.format('%');
        document.getElementById(id.substring(1)).innerHTML='';
       
       if(kind == 'd'){
            var g = d3.select(id)
            .attr('class', 'leaflet-radarchart') // 用于批量删除
            .attr("width", cfg.w + cfg.ExtraWidthX)
            .attr("height", cfg.h + cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
       }
       else if (kind == 'c'){
            var g = d3.select(id)
            .attr('class', 'leaflet-flower') // 用于批量删除
            .attr("width", cfg.w + cfg.ExtraWidthX)
            .attr("height", cfg.h + cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
       }
        

        series = 0;
            
        d.forEach(function(y, x) {
            dataValues = [];
            g.selectAll(".area")
            .data([dataValues])
            .enter()
            .append("svg:circle")
            .attr("class", "radar-chart-serie" + series)
            .attr('r', cfg.R0)
            .attr("cx", cfg.w/2)
            .attr("cy", cfg.h/2)
            .style("stroke-width", "1.5px")
            .style('stroke', d3.hcl(359, 60, 40))
            //.style('stroke', d3.hcl(359, 0, 30))
            .style("fill-opacity", 0)
            .on('mouseover', function(d) {
                let z = "path." + d3.select(this).attr("class");
                d3.select(this)
                    .style("cursor", "pointer");

                g.selectAll("path")
                 .transition(200)
                 .style("stroke", d3.hcl(359, 100, 60))
                 .style("stroke-width", "1.5px")
                 .style("fill-opacity", 1.0)
                 .attr("d", function(j,i){
                   /*dataValues.push([
                    cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)) - cfg.w/2,
                    cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total)) - cfg.h/2
                ]);*/
                   var cx = 0, cy = 0,
                       r = 0, s = 0, e = 0, m = 0;
                   if (i == 0){
                           cy = cfg.r1 * cfg.r_max,
                           r = cy,
                           s = {x: 0, y: -r/2},
                           e = {x: -r/2, y: 0},
                           m = {x: -Math.sqrt(2) * r / 2 , y: -Math.sqrt(2) * r / 2};
                           //console.log("1s: " + JSON.stringify(m))
                   } 
                   else if(i == 1){
                           cx = cfg.r2 * cfg.r_max,
                           r = cx,
                           s = {x: -r/2, y: 0},
                           e = {x: 0, y: r/2},
                           m = {x: -Math.sqrt(2) * r / 2 , y: Math.sqrt(2) * r / 2};
                         //console.log("2s: " + JSON.stringify(m))
                   }
                   else if(i == 2){
                           cy = cfg.r3 * cfg.r_max,
                           r = cy,
                           s = {x: 0, y: r/2},
                           e = {x: r/2, y: 0},
                           m = {x: Math.sqrt(2) * r / 2 , y: Math.sqrt(2) * r / 2};
                         //console.log("3s: " + JSON.stringify(m))
                   }
                   else if(i == 3){
                           cx = cfg.r4 * cfg.r_max,
                           r = cx,
                           s = {x: r/2, y: 0},
                           e = {x: 0, y: -r/2},
                           m = {x: Math.sqrt(2) * r / 2 , y: -Math.sqrt(2) * r / 2};
                         //console.log("4s: " + JSON.stringify(m))
                   }
                    return "M0,0Q" + s.x + "," + s.y + " " + m.x + "," + m.y + 
                            "M0,0Q" + e.x + "," + e.y + " " + m.x + "," + m.y ;
            });
                
                g.select("circle")
                 .transition(200)
                 .attr('r', cfg.r_max)
                 .style("stroke", d3.hcl(359, 100, 60));
                
                g.selectAll("text")
                .transition(200)
                .style("fill-opacity", 1.0)
                .attr("x", function(j, i) {
                    if(i == 0){
                            var r = cfg.r_max + 10;
                            return -Math.sqrt(2) * r / 2;
                    } 
                    else if( i == 1){
                            var r = cfg.r_max + 10;
                            return -Math.sqrt(2) * r / 2;
                    }
                    else if( i == 2){
                            var r = cfg.r_max + 10;
                            return Math.sqrt(2) * r / 2;
                    }
                    else if( i == 3){
                            var r = cfg.r_max + 6;
                            return Math.sqrt(2) * r / 2;
                    }
                })
                .attr("y", function(j, i) {
                        if(i == 0){
                            var r = cfg.r_max + 3;
                            return -Math.sqrt(2) * r / 2;
                        } 
                        else if( i == 1){
                            var r = cfg.r_max + 10;
                            return Math.sqrt(2) * r / 2;
                        }
                        else if( i == 2){
                            var r = cfg.r_max + 10;
                            return Math.sqrt(2) * r / 2;
                        }
                        else if( i == 3){
                            var r = cfg.r_max + 6;
                            return -Math.sqrt(2) * r / 2;
                        }
                });
                            
                tooltip.style("left", d3.event.pageX + 30 + "px")
                       .style("top", d3.event.pageY - 160 + "px")
                       .style("display", "inline-block")
                       .html(htmlStr);

               })
            .on('mouseout', function() {
               g.selectAll("path")
                  .transition(200)
                  .style("stroke",function(i, j){
                      //console.log("i" + j)
                        return d3.hcl(j / 4 * 360, 60, 40);
                 })
                 .style("fill-opacity", cfg.opacityArea)
                 .style("stroke-width", "1.0px")
                 .attr("d", function(j,i){
                   /*dataValues.push([
                    cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)) - cfg.w/2,
                    cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total)) - cfg.h/2
                ]);*/
                   var cx = 0, cy = 0,
                       r = 0, s = 0, e = 0, m = 0;
                   if (i == 0){
                           cy = cfg.r1 * cfg.R0,
                           r = cy,
                           s = {x: 0, y: -r/2},
                           e = {x: -r/2, y: 0},
                           m = {x: -Math.sqrt(2) * r / 2 , y: -Math.sqrt(2) * r / 2};
                           //console.log("1s: " + JSON.stringify(m))
                   } 
                   else if(i == 1){
                           cx = cfg.r2 * cfg.R0,
                           r = cx,
                           s = {x: -r/2, y: 0},
                           e = {x: 0, y: r/2},
                           m = {x: -Math.sqrt(2) * r / 2 , y: Math.sqrt(2) * r / 2};
                         //console.log("2s: " + JSON.stringify(m))
                   }
                   else if(i == 2){
                           cy = cfg.r3 * cfg.R0,
                           r = cy,
                           s = {x: 0, y: r/2},
                           e = {x: r/2, y: 0},
                           m = {x: Math.sqrt(2) * r / 2 , y: Math.sqrt(2) * r / 2};
                         //console.log("3s: " + JSON.stringify(m))
                   }
                   else if(i == 3){
                           cx = cfg.r4 * cfg.R0,
                           r = cx,
                           s = {x: r/2, y: 0},
                           e = {x: 0, y: -r/2},
                           m = {x: Math.sqrt(2) * r / 2 , y: -Math.sqrt(2) * r / 2};
                         //console.log("4s: " + JSON.stringify(m))
                   }
                    return "M0,0Q" + s.x + "," + s.y + " " + m.x + "," + m.y + 
                            "M0,0Q" + e.x + "," + e.y + " " + m.x + "," + m.y ;
            });
               
               g.select("circle")
                .transition(200)
                .attr('r', cfg.R0)
                .style('stroke', d3.hcl(359, 60, 40));
                 //.style('stroke', d3.hcl(359, 0, 30));
               
               g.selectAll("text")
                .transition(200)
                .style("fill-opacity", 0.0)
                .attr("x", function(j, i) {
                    if(i == 0){
                            var r = cfg.R0 + 10;
                            return -Math.sqrt(2) * r / 2;
                    } 
                    else if( i == 1){
                            var r = cfg.R0 + 10;
                            return -Math.sqrt(2) * r / 2;
                    }
                    else if( i == 2){
                            var r = cfg.R0 + 10;
                            return Math.sqrt(2) * r / 2;
                    }
                    else if( i == 3){
                            var r = cfg.R0 + 6;
                            return Math.sqrt(2) * r / 2;
                    }
                })
                .attr("y", function(j, i) {
                        if(i == 0){
                            var r = cfg.R0 + 3;
                            return -Math.sqrt(2) * r / 2;
                        } 
                        else if( i == 1){
                            var r = cfg.R0 + 10;
                            return Math.sqrt(2) * r / 2;
                        }
                        else if( i == 2){
                            var r = cfg.R0 + 10;
                            return Math.sqrt(2) * r / 2;
                        }
                        else if( i == 3){
                            var r = cfg.R0 + 6;
                            return -Math.sqrt(2) * r / 2;
                        }
                });
                
                tooltip.style("display", "none");
                }); 
            
            g.selectAll(".nodes")
            .data(y).enter()
            .append("path")
            .attr("class", "radar-chart-serie" + series)
            .attr("transform", "translate(" + cfg.w/2 + "," + cfg.h/2 + ")")
            .attr("d", function(j,i){
            	   dataValues.push([
                    cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)) - cfg.w/2,
                    cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total)) - cfg.h/2
                ]);
            	   var //cx = cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)) - cfg.w/2,
            	       //cy = cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total)) - cfg.h/2,
            	   	   cx = 0, cy = 0,
            	       r = 0, s = 0, e = 0, m = 0;
            	   if (i == 0){
            		   	   cy = cfg.r1 * cfg.R0,
            		   	   r = cy,
            		       s = {x: 0, y: -r/2},
            		       e = {x: -r/2, y: 0},
            		       m = {x: -Math.sqrt(2) * r / 2 , y: -Math.sqrt(2) * r / 2};
            		   	   //console.log("1s: " + JSON.stringify(m))
            	   } 
            	   else if(i == 1){
            		   	   cx = cfg.r2 * cfg.R0,
            		       r = cx,
            		       s = {x: -r/2, y: 0},
            		       e = {x: 0, y: r/2},
            		       m = {x: -Math.sqrt(2) * r / 2 , y: Math.sqrt(2) * r / 2};
            		   	 //console.log("2s: " + JSON.stringify(m))
            	   }
            	   else if(i == 2){
            		   	   cy = cfg.r3 * cfg.R0,
            		       r = cy,
            		       s = {x: 0, y: r/2},
            		       e = {x: r/2, y: 0},
            		       m = {x: Math.sqrt(2) * r / 2 , y: Math.sqrt(2) * r / 2};
            		   	 //console.log("3s: " + JSON.stringify(m))
            	   }
            	   else if(i == 3){
            		   	   cx = cfg.r4 * cfg.R0,
            		   	   r = cx,
            		       s = {x: r/2, y: 0},
            		       e = {x: 0, y: -r/2},
            		       m = {x: Math.sqrt(2) * r / 2 , y: -Math.sqrt(2) * r / 2};
            		   	 //console.log("4s: " + JSON.stringify(m))
            	   }
            		return "M0,0Q" + s.x + "," + s.y + " " + m.x + "," + m.y + 
            				"M0,0Q" + e.x + "," + e.y + " " + m.x + "," + m.y ;
            })
            .style("stroke", function(j,i){
            		return d3.hcl(i/ 4 * 360, 60, 40);
            })
            .style("fill", function(j,i){
            		if (i == 0)
            			return cfg.speColor1;
            		else if (i == 1)
            			return cfg.speColor2;
            		else if (i == 2)
            			return cfg.speColor3;
            		else if (i == 3)
            			return cfg.speColor4;
            })
            .style("fill-opacity", cfg.opacityArea);
            /*.on('mouseover', function(d) {
                let z = "path." + d3.select(this).attr("class");
                g.selectAll("path")
                 .transition(200)
                 .style("stroke", d3.hcl(359, 100, 60))
                 .style("stroke-width", "1.5px")
                 .style("fill-opacity", 1.0);
                
                g.selectAll("circle")
                	 .transition(200)
                 .style("stroke", d3.hcl(359, 100, 60));
                
                g.selectAll("text")
         	 	.transition(200)
         	 	.style("fill-opacity", 1.0);

                tooltip.style("left", d3.event.pageX + 30 + "px")
                       .style("top", d3.event.pageY - 160 + "px")
                       .style("display", "inline-block")
                       .html(htmlStr);

               })
             .on('mouseout', function() {
               g.selectAll("path")
               	  .transition(200)
               	  .style("stroke",function(i, j){
               		  console.log("i" + j)
                	 	return d3.hcl(j / 4 * 360, 60, 40);
                 })
                 .style("fill-opacity", cfg.opacityArea)
                 .style("stroke-width", "1.0px");
               
               g.selectAll("circle")
          	 	.transition(200)
          	 	.style('stroke', d3.hcl(359, 60, 40));
          	 	 //.style('stroke', d3.hcl(359, 0, 30));
               
               g.selectAll("text")
         	 	.transition(200)
         	 	.style("fill-opacity", 0.0);

                tooltip.style("display", "none");
                });*/
            var s = d[0][0]['data']['d']
            //console.log("data"+ d[0][0]['data']['d'])
            /*
            g.append("text")
            .attr("class", "radar-chart-serie" + series)
            .attr("x", cfg.w/2)
            .attr("y", cfg.h/2 - 6)
            .text('T')
            .style("font-family", "Microsoft YaHei")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .style("fill-opacity", 0.0)
            .on('mouseover', function(d) {
            		g.selectAll("text")
            		 .style("fill-opacity", 1.0);
            		
                tooltip
                  .style("left", d3.event.pageX - 40 + "px")
                  .style("top", d3.event.pageY - 80 + "px")
                  .style("display", "inline-block")
                  .html( 'Density ' +  "Value<br><span>"+ s + "</span>" + '/km^2<br>');
                })
            .on("mouseout", function(d) { 
            		g.selectAll("text")
            		 .style("fill-opacity", 0.0);
            		
            		tooltip.style("display", "none"); });*/
            
            g.selectAll(".area")
             .data([dataValues])
             .enter()
             .append("svg:circle")
             .attr("class", "radar-chart-serie" + series)
             .attr('r', cfg.r5)
             .attr("cx", cfg.w/2)
             .attr("cy", cfg.h/2)
             .style("fill", cfg.speColor)
             .style("stroke-width", "1.0px")
             .style('stroke', d3.hcl(359, 60, 40))
             .style("fill-opacity", .9); 
           
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
                .append("text")
                .attr("class", "radar-chart-serie" + series)
                //.attr('r', cfg.radius+1)
                .attr("transform", "translate(" + cfg.w/2 + "," + cfg.h/2 + ")")
                .text(function(j, i) {
                		if (i == 0) return "F";
                		if (i == 1) return "A";
                		if (i == 2) return "C";
                		if (i == 3) return "E";})
                //.style("font-family", "sans-serif")
                .style("font-family", "Microsoft YaHei")	
                .style("font-size", "11px")
                .attr("text-anchor", "middle")
                .style("fill-opacity", 0.0)
                //.attr("dy", "1.5em")
                //.attr("cx", cfg.w/2)
                //.attr("cy", cfg.h/2)
                //.attr("alt", function(j) {
                  //  return Math.max(j.value, 0) })
                .attr("x", function(j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                    var cx = cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)) - cfg.w/2,
         	       	    cy = cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total)) - cfg.h/2;
                    if(i == 0){
                    		var r = cfg.R0 + 10;
                    		return -Math.sqrt(2) * r / 2;
                    } 
                    else if( i == 1){
                    		var r = cfg.R0 + 10;
                    		return -Math.sqrt(2) * r / 2;
                    }
                    else if( i == 2){
                			var r = cfg.R0 + 10;
                			return Math.sqrt(2) * r / 2;
                    }
                    else if( i == 3){
                			var r = cfg.R0 + 6;
                			return Math.sqrt(2) * r / 2;
                    }
                   // return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
                })
                .attr("y", function(j, i) {
                		var cx = cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)) - cfg.w/2,
     	       	    		cy = cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total)) - cfg.h/2;
                		if(i == 0){
                			var r = cfg.R0 + 3;
                			return -Math.sqrt(2) * r / 2;
                		} 
                		else if( i == 1){
                			var r = cfg.R0 + 10;
                			return Math.sqrt(2) * r / 2;
                		}
                		else if( i == 2){
                			var r = cfg.R0 + 10;
                			return Math.sqrt(2) * r / 2;
                		}
                		else if( i == 3){
                			var r = cfg.R0 + 6;
                			return -Math.sqrt(2) * r / 2;
                		}
                   // return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
                })
                //.attr("data-id", function(j) {
                  //  return j.area })
                //.style("fill", "#fff")
                //.style("stroke-width", "0.9px")
                //.style('stroke', "#000")
                //.style("stroke", cfg.color(series))
                //.style("fill-opacity", .9)
                
                .on('mouseover', function(d) {
                    //console.log(d.area);
                    d3.select(this)
                      .style("cursor", "pointer");

                    g.selectAll("text")
                    	//.transition(200)
                    	.style("fill-opacity", 1.0);
                    tooltip
                        .style("left", d3.event.pageX - 40 + "px")
                        .style("top", d3.event.pageY - 80 + "px")
                        .style("display", "inline-block")
                        .html((d.area) + " Value<br><span>" + (d.value.toFixed(2)) + "</span>");
                })
                .on('mouseout', function(d) { 
                		g.selectAll("text")
                		 .transition(400)
                		 .style("fill-opacity", 0.0);
                		tooltip.style("display", "none"); });
				
            series++;
        });
       
        /*/
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
		/*/
	   /*
        var g = d3.select(id)
        .attr('class', 'leaflet-radarchart') // 用于批量删除
        .attr("width", cfg.w + cfg.ExtraWidthX)
        .attr("height", cfg.h + cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

        series = 0;
            
        d.forEach(function(y, x) {
            dataValues = [];
            g.selectAll(".nodes")
            .data(y).enter()
            .append("path")
            .attr("class", "radar-chart-serie" + series)
            .attr("transform", "translate(" + cfg.w/2 + "," + cfg.h/2 + ")")
            .attr("d", function(j,i){
            	   dataValues.push([
                    cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)) - cfg.w/2,
                    cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total)) - cfg.h/2
                ]);
            	   var cx = cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)) - cfg.w/2,
            	       cy = cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total)) - cfg.h/2,
            	       r = 0, s = 0, e = 0, m = 0;
            	   if (i == 0){
            		   	   r = -cy,
            		       s = {x: 0, y: -r/2},
            		       e = {x: -r/2, y: 0},
            		       m = {x: -Math.sqrt(2) * r / 2 , y: -Math.sqrt(2) * r / 2};
            	   } 
            	   else if(i == 1){
            		       r = -cx,
            		       s = {x: -r/2, y: 0},
            		       e = {x: 0, y: r/2},
            		       m = {x: -Math.sqrt(2) * r / 2 , y: Math.sqrt(2) * r / 2};
            	   }
            	   else if(i == 2){
            		       r = cy,
            		       s = {x: 0, y: r/2},
            		       e = {x: r/2, y: 0},
            		       m = {x: Math.sqrt(2) * r / 2 , y: Math.sqrt(2) * r / 2};
            	   }
            	   else if(i == 3){
            		   	   r = cx,
            		       s = {x: r/2, y: 0},
            		       e = {x: 0, y: -r/2},
            		       m = {x: Math.sqrt(2) * r / 2 , y: -Math.sqrt(2) * r / 2};
            	   }
            		return "M0,0Q" + s.x + "," + s.y + " " + m.x + "," + m.y + 
            				"M0,0Q" + e.x + "," + e.y + " " + m.x + "," + m.y ;
            })
            .style("stroke", function(j,i){
            		return d3.hcl(i/ 4 * 360, 60, 40);
            })
            .style("fill", function(j,i){
            		if (i == 0)
            			return cfg.speColor1;
            		else if (i == 1)
            			return cfg.speColor2;
            		else if (i == 2)
            			return cfg.speColor3;
            		else if (i == 3)
            			return cfg.speColor4;
            })
            .style("fill-opacity", cfg.opacityArea)
            .on('mouseover', function(d) {
                let z = "path." + d3.select(this).attr("class");
                g.selectAll("path")
                 .transition(200)
                 .style("stroke", d3.hcl(359, 100, 60))
                 .style("stroke-width", "1.5px")
                 .style("fill-opacity", 1.0);

                tooltip.style("left", d3.event.pageX + 30 + "px")
                       .style("top", d3.event.pageY - 160 + "px")
                       .style("display", "inline-block")
                       .html(htmlStr);

               })
             .on('mouseout', function() {
               g.selectAll("path")
               	  .transition(200)
               	  .style("stroke",function(i, j){
               		  console.log("i" + j)
                	 	return d3.hcl(j / 4 * 360, 60, 40);
                 })
                 .style("fill-opacity", cfg.opacityArea)
                 .style("stroke-width", "1.0px");

                tooltip.style("display", "none");
                });
            var s = d[0][0]['data']['d']
            console.log("data"+ d[0][0]['data']['d'])
            
            g.append("text")
            .attr("class", "radar-chart-serie" + series)
            .attr("x", cfg.w/2)
            .attr("y", cfg.h/2 - 6)
            .text('T')
            .style("font-family", "serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .style("fill-opacity", 0.0)
            .on('mouseover', function(d) {
            		g.selectAll("text")
            		 .style("fill-opacity", 0.9);
            		
                tooltip
                  .style("left", d3.event.pageX - 40 + "px")
                  .style("top", d3.event.pageY - 80 + "px")
                  .style("display", "inline-block")
                  .html( 'Density ' +  "Value<br><span>"+ s + "</span>" + '/km^2<br>');
                })
            .on("mouseout", function(d) { 
            		g.selectAll("text")
            		 .style("fill-opacity", 0.0);
            		
            		tooltip.style("display", "none"); });
            
            g.selectAll(".area")
             .data([dataValues])
             .enter()
             .append("svg:circle")
             .attr("class", "radar-chart-serie" + series)
             .attr('r', cfg.radius)
             .attr("cx", cfg.w/2)
             .attr("cy", cfg.h/2)
             .style("fill", cfg.speColor)
             .style("stroke-width", "1.0px")
             .style('stroke', d3.hcl(359, 60, 40))
             .style("fill-opacity", .9); 
           
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
                .append("text")
                .attr("class", "radar-chart-serie" + series)
                //.attr('r', cfg.radius+1)
                .attr("transform", "translate(" + cfg.w/2 + "," + cfg.h/2 + ")")
                .text(function(j, i) {
                		if (i == 0) return "F";
                		if (i == 1) return "E";
                		if (i == 2) return "C";
                		if (i == 3) return "A";})
                .style("font-family", "sans-serif")
                .style("font-size", "11px")
                .attr("text-anchor", "middle")
                .style("fill-opacity", 0.0)
                //.attr("dy", "1.5em")
                //.attr("cx", cfg.w/2)
                //.attr("cy", cfg.h/2)
                //.attr("alt", function(j) {
                  //  return Math.max(j.value, 0) })
                .attr("x", function(j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                    var cx = cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)) - cfg.w/2,
         	       	    cy = cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total)) - cfg.h/2;
                    if(i == 0){
                    		var r = -cy + 6;
                    		return -Math.sqrt(2) * r / 2;
                    } 
                    else if( i == 1){
                    		var r = -cx + 10;
                    		return -Math.sqrt(2) * r / 2;
                    }
                    else if( i == 2){
                			var r = cy + 10;
                			return Math.sqrt(2) * r / 2;
                    }
                    else if( i == 3){
                			var r = cx + 6;
                			return Math.sqrt(2) * r / 2;
                    }
                   // return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
                })
                .attr("y", function(j, i) {
                		var cx = cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)) - cfg.w/2,
     	       	    		cy = cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total)) - cfg.h/2;
                		if(i == 0){
                			var r = -cy + 3;
                			return -Math.sqrt(2) * r / 2;
                		} 
                		else if( i == 1){
                			var r = -cx + 10;
                			return Math.sqrt(2) * r / 2;
                		}
                		else if( i == 2){
                			var r = cy + 15;
                			return Math.sqrt(2) * r / 2;
                		}
                		else if( i == 3){
                			var r = cx + 6;
                			return -Math.sqrt(2) * r / 2;
                		}
                   // return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
                })
                //.attr("data-id", function(j) {
                  //  return j.area })
                //.style("fill", "#fff")
                //.style("stroke-width", "0.9px")
                //.style('stroke', "#000")
                //.style("stroke", cfg.color(series))
                //.style("fill-opacity", .9)
                
                .on('mouseover', function(d) {
                    console.log(d.area);
                    g.selectAll("text")
                    	//.transition(200)
                    	.style("fill-opacity", 0.9);
                    tooltip
                        .style("left", d3.event.pageX - 40 + "px")
                        .style("top", d3.event.pageY - 80 + "px")
                        .style("display", "inline-block")
                        .html((d.area) + " Value<br><span>" + (d.value.toFixed(2)) + "</span>");
                })
                .on('mouseout', function(d) { 
                		g.selectAll("text")
                		 .transition(400)
                		 .style("fill-opacity", 0.0);
                		tooltip.style("display", "none"); });
				
            series++;
        });*/
       
    }
};

export { RadarChart };
