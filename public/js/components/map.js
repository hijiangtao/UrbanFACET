/*
 UPDATE July 2016 , moved and updated to here: https://github.com/Sumbera/gLayers.Leaflet
 
 Generic  Canvas Overlay for leaflet, 
 Stanislav Sumbera, April , 2014
 - added userDrawFunc that is called when Canvas need to be redrawn
 - added few useful params fro userDrawFunc callback
  - fixed resize map bug
  inspired & portions taken from  :   https://github.com/Leaflet/Leaflet.heat
  
  License: MIT
*/

import L from 'leaflet'

L.CRS.CustomZoom = L.extend({}, L.CRS.EPSG3857, {
    scale: function (zoom) {
        return Math.round(256 * Math.pow(2, zoom));
    }
});

L.CanvasOverlay = L.Class.extend({

    initialize: function(userDrawFunc, options) {
        this._userDrawFunc = userDrawFunc;
        L.setOptions(this, options);
    },

    drawing: function(userDrawFunc) {
        this._userDrawFunc = userDrawFunc;
        return this;
    },

    params: function(options) {
        L.setOptions(this, options);
        return this;
    },

    canvas: function() {
        return this._canvas;
    },

    redraw: function() {
        if (!this._frame) {
            this._frame = L.Util.requestAnimFrame(this._redraw, this);
        }
        return this;
    },



    onAdd: function(map) {
        this._map = map;
        this._canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-layer');

        let size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;

        let animated = this._map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(this._canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));


        map._panes.overlayPane.appendChild(this._canvas);

        map.on('moveend', this._reset, this);
        map.on('resize', this._resize, this);

        if (map.options.zoomAnimation && L.Browser.any3d) {
            map.on('zoomanim', this._animateZoom, this);
        }

        this._reset();
    },

    onRemove: function(map) {
        map.getPanes().overlayPane.removeChild(this._canvas);

        map.off('moveend', this._reset, this);
        map.off('resize', this._resize, this);

        if (map.options.zoomAnimation) {
            map.off('zoomanim', this._animateZoom, this);
        }
        this._canvas = null;

    },

    addTo: function(map) {
        map.addLayer(this);
        return this;
    },

    _resize: function(resizeEvent) {
        this._canvas.width = resizeEvent.newSize.x;
        this._canvas.height = resizeEvent.newSize.y;
    },
    _reset: function() {
        let topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this._canvas, topLeft);
        this._redraw();
    },

    _redraw: function() {
        let size = this._map.getSize();
        let bounds = this._map.getBounds();
        let zoomScale = (size.x * 180) / (20037508.34 * (bounds.getEast() - bounds.getWest())); // resolution = 1/zoomScale
        let zoom = this._map.getZoom();

        // console.time('process');

        if (this._userDrawFunc) {
            this._userDrawFunc(this, {
                canvas: this._canvas,
                bounds: bounds,
                size: size,
                zoomScale: zoomScale,
                zoom: zoom,
                options: this.options
            });
        }


        // console.timeEnd('process');

        this._frame = null;
    },

    _animateZoom: function(e) {
        let scale = this._map.getZoomScale(e.zoom),
            offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());

        this._canvas.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';

    }
});

L.canvasOverlay = function(userDrawFunc, options) {
    return new L.CanvasOverlay(userDrawFunc, options);
};

/*
 * Extends L.Map to synchronize the interaction on one map to one or more other maps.
 */

let NO_ANIMATION = {
    animate: false,
    reset: true
};

L.Map = L.Map.extend({
    sync: function(map, options) {
        this._initSync();
        options = L.extend({
            noInitialSync: false,
            syncCursor: false,
            syncCursorMarkerOptions: {
                radius: 10,
                fillOpacity: 0.3,
                color: '#da291c',
                fillColor: '#fff'
            }
        }, options);

        // prevent double-syncing the map:
        if (this._syncMaps.indexOf(map) === -1) {
            this._syncMaps.push(map);
        }

        if (!options.noInitialSync) {
            map.setView(this.getCenter(), this.getZoom(), NO_ANIMATION);
        }
        if (options.syncCursor) {
            map.cursor = L.circleMarker([0, 0], options.syncCursorMarkerOptions).addTo(map);

            this._cursors.push(map.cursor);

            this.on('mousemove', this._cursorSyncMove, this);
            this.on('mouseout', this._cursorSyncOut, this);
        }
        return this;
    },

    _cursorSyncMove: function(e) {
        this._cursors.forEach(function(cursor) {
            cursor.setLatLng(e.latlng);
        });
    },

    _cursorSyncOut: function(e) {
        this._cursors.forEach(function(cursor) {
            // TODO: hide cursor in stead of moving to 0, 0
            cursor.setLatLng([0, 0]);
        });
    },


    // unsync maps from each other
    unsync: function(map) {
        let self = this;

        if (this._syncMaps) {
            this._syncMaps.forEach(function(synced, id) {
                if (map === synced) {
                    self._syncMaps.splice(id, 1);
                    if (map.cursor) {
                        map.cursor.removeFrom(map);
                    }
                }
            });
        }
        this.off('mousemove', this._cursorSyncMove, this);
        this.off('mouseout', this._cursorSyncOut, this);

        return this;
    },

    // Checks if the maps is synced with anything
    isSynced: function() {
        return (this.hasOwnProperty('_syncMaps') && Object.keys(this._syncMaps).length > 0);
    },

    // overload methods on originalMap to replay interactions on _syncMaps;
    _initSync: function() {
        if (this._syncMaps) {
            return;
        }
        let originalMap = this;

        this._syncMaps = [];
        this._cursors = [];

        L.extend(originalMap, {
            setView: function(center, zoom, options, sync) {
                if (!sync) {
                    originalMap._syncMaps.forEach(function(toSync) {
                        toSync.setView(center, zoom, options, true);
                    });
                }
                return L.Map.prototype.setView.call(this, center, zoom, options);
            },

            panBy: function(offset, options, sync) {
                if (!sync) {
                    originalMap._syncMaps.forEach(function(toSync) {
                        toSync.panBy(offset, options, true);
                    });
                }
                return L.Map.prototype.panBy.call(this, offset, options);
            },

            _onResize: function(event, sync) {
                if (!sync) {
                    originalMap._syncMaps.forEach(function(toSync) {
                        toSync._onResize(event, true);
                    });
                }
                return L.Map.prototype._onResize.call(this, event);
            }
        });

        originalMap.on('zoomend', function() {
            originalMap._syncMaps.forEach(function(toSync) {
                toSync.setView(originalMap.getCenter(), originalMap.getZoom(), NO_ANIMATION);
            });
        }, this);

        originalMap.dragging._draggable._updatePosition = function() {
            L.Draggable.prototype._updatePosition.call(this);
            let self = this;
            originalMap._syncMaps.forEach(function(toSync) {
                L.DomUtil.setPosition(toSync.dragging._draggable._element, self._newPos);
                toSync.eachLayer(function(layer) {
                    if (layer._google !== undefined) {
                        layer._google.setCenter(originalMap.getCenter());
                    }
                });
                toSync.fire('moveend');
            });
        };
    }
});

/**
 * AreaSelect is a leaflet plugin for letting users select a square area (bounding box), using a resizable centered box on top of the map.
 */

L.AreaSelect = L.Class.extend({
    includes: L.Mixin.Events,
    
    options: {
        width: 200,
        height: 300,
        keepAspectRatio: false,
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
        
        this._width = this.options.width;
        this._height = this.options.height;
    },
    
    addTo: function(map) {
        this.map = map;
        this._createElements();
        this._render();
        return this;
    },
    
    getBounds: function() {
        var size = this.map.getSize();
        var topRight = new L.Point();
        var bottomLeft = new L.Point();
        
        bottomLeft.x = Math.round((size.x - this._width) / 2);
        topRight.y = Math.round((size.y - this._height) / 2);
        topRight.x = size.x - bottomLeft.x;
        bottomLeft.y = size.y - topRight.y;
        
        var sw = this.map.containerPointToLatLng(bottomLeft);
        var ne = this.map.containerPointToLatLng(topRight);
        
        return new L.LatLngBounds(sw, ne);
    },

    /**
     * Get Dimensions
     */
    getDimensions: function() {
        return {
            'width': this._width,
            'height': this._height
        } 
    },
    
    remove: function() {
        this.map.off("moveend", this._onMapChange);
        this.map.off("zoomend", this._onMapChange);
        this.map.off("resize", this._onMapResize);
        
        this._container.parentNode.removeChild(this._container);
    },

    
    setDimensions: function(dimensions) {
        if (!dimensions)
            return;

        this._height = parseInt(dimensions.height) || this._height;
        this._width = parseInt(dimensions.width) || this._width;
        this._render();
        this.fire("change");
    },

    
    _createElements: function() {
        if (!!this._container)
            return;
        
        this._container = L.DomUtil.create("div", "leaflet-areaselect-container", this.map._controlContainer)
        this._topShade = L.DomUtil.create("div", "leaflet-areaselect-shade leaflet-control", this._container);
        this._bottomShade = L.DomUtil.create("div", "leaflet-areaselect-shade leaflet-control", this._container);
        this._leftShade = L.DomUtil.create("div", "leaflet-areaselect-shade leaflet-control", this._container);
        this._rightShade = L.DomUtil.create("div", "leaflet-areaselect-shade leaflet-control", this._container);
        
        this._nwHandle = L.DomUtil.create("div", "leaflet-areaselect-handle leaflet-control", this._container);
        this._swHandle = L.DomUtil.create("div", "leaflet-areaselect-handle leaflet-control", this._container);
        this._neHandle = L.DomUtil.create("div", "leaflet-areaselect-handle leaflet-control", this._container);
        this._seHandle = L.DomUtil.create("div", "leaflet-areaselect-handle leaflet-control", this._container);
        
        this._setUpHandlerEvents(this._nwHandle);
        this._setUpHandlerEvents(this._neHandle, -1, 1);
        this._setUpHandlerEvents(this._swHandle, 1, -1);
        this._setUpHandlerEvents(this._seHandle, -1, -1);
        
        this.map.on("moveend", this._onMapChange, this);
        this.map.on("zoomend", this._onMapChange, this);
        this.map.on("resize", this._onMapResize, this);
        
        this.fire("change");
    },
    
    _setUpHandlerEvents: function(handle, xMod, yMod) {
        xMod = xMod || 1;
        yMod = yMod || 1;
        
        var self = this;
        function onMouseDown(event) {
            event.stopPropagation();
            self.map.dragging.disable();
            L.DomEvent.removeListener(this, "mousedown", onMouseDown);
            var curX = event.pageX;
            var curY = event.pageY;
            var ratio = self._width / self._height;
            var size = self.map.getSize();
            
            function onMouseMove(event) {
                if (self.options.keepAspectRatio) {
                    var maxHeight = (self._height >= self._width ? size.y : size.y * (1/ratio) ) - 30;
                    self._height += (curY - event.originalEvent.pageY) * 2 * yMod;
                    self._height = Math.max(30, self._height);
                    self._height = Math.min(maxHeight, self._height);
                    self._width = self._height * ratio;
                } else {
                    self._width += (curX - event.originalEvent.pageX) * 2 * xMod;
                    self._height += (curY - event.originalEvent.pageY) * 2 * yMod;
                    self._width = Math.max(30, self._width);
                    self._height = Math.max(30, self._height);
                    self._width = Math.min(size.x-30, self._width);
                    self._height = Math.min(size.y-30, self._height);
                    
                }
                
                curX = event.originalEvent.pageX;
                curY = event.originalEvent.pageY;
                self._render();
            }
            function onMouseUp(event) {
                self.map.dragging.enable();
                L.DomEvent.removeListener(self.map, "mouseup", onMouseUp);
                L.DomEvent.removeListener(self.map, "mousemove", onMouseMove);
                L.DomEvent.addListener(handle, "mousedown", onMouseDown);
                self.fire("change");
            }
            
            L.DomEvent.addListener(self.map, "mousemove", onMouseMove);
            L.DomEvent.addListener(self.map, "mouseup", onMouseUp);
        }
        L.DomEvent.addListener(handle, "mousedown", onMouseDown);
    },
    
    _onMapResize: function() {
        this._render();
    },
    
    _onMapChange: function() {
        this.fire("change");
    },
    
    _render: function() {
        var size = this.map.getSize();
        var handleOffset = Math.round(this._nwHandle.offsetWidth/2);
        
        var topBottomHeight = Math.round((size.y-this._height)/2);
        var leftRightWidth = Math.round((size.x-this._width)/2);
        // 
        // var handleOffset = this._nwHandle.offsetWidth/2;
        
        // var topBottomHeight = (size.y-this._height)/2;
        // var leftRightWidth = (size.x-this._width)/2;
        
        function setDimensions(element, dimension) {
            element.style.width = dimension.width + "px";
            element.style.height = dimension.height + "px";
            element.style.top = dimension.top + "px";
            element.style.left = dimension.left + "px";
            element.style.bottom = dimension.bottom + "px";
            element.style.right = dimension.right + "px";
        }
        
        setDimensions(this._topShade, {width:size.x, height:topBottomHeight, top:0, left:0});
        setDimensions(this._bottomShade, {width:size.x, height:topBottomHeight, bottom:0, left:0});
        setDimensions(this._leftShade, {
            width: leftRightWidth, 
            height: size.y-(topBottomHeight*2), 
            top: topBottomHeight, 
            left: 0
        });
        setDimensions(this._rightShade, {
            width: leftRightWidth, 
            height: size.y-(topBottomHeight*2), 
            top: topBottomHeight, 
            right: 0
        });
        
        setDimensions(this._nwHandle, {left:leftRightWidth-handleOffset, top:topBottomHeight-7});
        setDimensions(this._neHandle, {right:leftRightWidth-handleOffset, top:topBottomHeight-7});
        setDimensions(this._swHandle, {left:leftRightWidth-handleOffset, bottom:topBottomHeight-7});
        setDimensions(this._seHandle, {right:leftRightWidth-handleOffset, bottom:topBottomHeight-7});
    }
});

L.areaSelect = function(options) {
    return new L.AreaSelect(options);
};

export default L
