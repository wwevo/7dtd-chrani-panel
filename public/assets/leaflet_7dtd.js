function deepEqual(x, y) { // probably overkill
    const ok = Object.keys, tx = typeof x, ty = typeof y;
    return x && y && tx === 'object' && tx === ty ? (
            ok(x).length === ok(y).length &&
            ok(x).every(key => deepEqual(x[key], y[key]))
            ) : (x === y);
}
// <editor-fold defaultstate="collapsed" desc=" Base Markers ">
var basesMappingList = {};
var basesMappingListOld = {};
var active_bases = L.layerGroup();

function baseMarkerGetColor(protect) {
    var color;
    if (protect === '1') {
        color = 'green';
    } else {
        color = 'red';
    }
    return color;
}

function createBaseMarker(val, order) {
    var marker;
    var color;
    var protect;

    if (order === '1st') {
        bounds = [[Number(val.homeX) - Number(val.protectSize), Number(val.homeZ) - Number(val.protectSize)], [Number(val.homeX) + Number(val.protectSize), Number(val.homeZ) + Number(val.protectSize)]];
        steamid = val.steam + 'a';
        protect = val.protect;
        color = baseMarkerGetColor(protect);
    } else {
        bounds = [[Number(val.home2X) - Number(val.protect2Size), Number(val.home2Z) - Number(val.protect2Size)], [Number(val.home2X) + Number(val.protect2Size), Number(val.home2Z) + Number(val.protect2Size)]];
        steamid = val.steam + 'b';
        protect = val.protect2;
        color = baseMarkerGetColor(protect);
    }
    marker = L.rectangle(bounds, {color: color, weight: 1, fillOpacity: 0.1});
    marker.bindTooltip(val.name + " (" + order + " base)", {permanent: false, direction: "center"});
    marker.steamid = steamid;
    marker.protect = protect;
    return marker;
}
// this shit is more of a mockup and not at all optimized or even thought through :)
// Let's get it to work first
var setBaseMarkers = function (data) {
    basesMappingListOld = jQuery.extend({}, basesMappingList);
    basesMappingList = {};
    var marker;
    var bases = 0;

    $.each(data, function (key, val) {
        if (val.homeX !== '0' || val.homeZ !== '0') {
            basesMappingList[val.steam + 'a'] = {marker: createBaseMarker(val, '1st'), val: val};
        }
        if (val.home2X !== '0' || val.home2Z !== '0') {
            basesMappingList[val.steam + 'b'] = {marker: createBaseMarker(val, '2nd'), val: val};
        }
    });
    if (jQuery.isEmptyObject(basesMappingListOld)) { // first run! 
        $.each(basesMappingList, function (key, val) {
            active_bases.addLayer(val.marker); // add all available bases
            bases++;
        });
    } else { // this only gets executed when the layer is active!
        // Now we want to remove the old markers...
        // Let's do it one by one. You can come up with a clever way later!
        active_bases.eachLayer(function (marker) {
            steamid = marker.steamid;
            if (!basesMappingList.hasOwnProperty(marker.steamid)) { // it's not present in the current list!
                active_bases.removeLayer(marker); // remove
            } else { //  update the existing ones...
                if (!deepEqual(marker.getBounds(), basesMappingList[marker.steamid].marker.getBounds())) {
                    // moved base
                }
                if (marker.options.color !== basesMappingList[marker.steamid].marker.options.color) {
                    // changed protection;
                    marker.options.color = baseMarkerGetColor(basesMappingList[marker.steamid].marker.protect);
                    update(marker);
                }
                bases++;
            }
        });
        $.each(data, function (key, val) { // and add new ones!
            if (val.homeX !== '0' || val.homeZ !== '0') {
                if (!basesMappingListOld.hasOwnProperty(val.steam + 'a')) {
                    marker = createBaseMarker(val, '1st');
                    basesMappingList[val.steam + 'a'] = {marker: marker, val: val};
                    active_bases.addLayer(marker); // add all available bases
                    bases++;
                }
            }
            if (val.home2X !== '0' || val.home2Z !== '0') {
                if (!basesMappingListOld.hasOwnProperty(val.steam + 'b')) {
                    marker = createBaseMarker(val, '2nd');
                    basesMappingList[val.steam + 'b'] = {marker: marker, val: val};
                    active_bases.addLayer(marker); // add all available bases
                    bases++;
                }
            }
        });
    }
    $("#mapControlBasesCount").text(bases);
    return true;
};

var updateBasesTimeout = false;
var pollBases = function () {
    if (updateBasesTimeout === false // only false the very first time
            || map.hasLayer(active_bases)) { // only execute the poll if the layer is actually being displayed
        $.getJSON("https://panel.chrani.net/bases.php")
                .done(function (data) {
                    setBaseMarkers(data); // poll complete, set the markers!!
                });
    }
    updateBasesTimeout = window.setTimeout(pollBases, 7500); // if active or not, poll this function periodically
    return active_bases; // return current layer, this is just for convenience
};
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc=" Player Markers and List ">
var playersMappingList = {};
var playersMappingListOld = {};
var online_players = L.layerGroup();

function createPlayerMarker(val) {
    var marker = L.marker([val.position.x, val.position.z], {title: val.name, steamid: val.steamid}).bindTooltip(val.name, {permanent: true, direction: "right"});
    marker.setOpacity(1.0);
    marker.on('click', playerMarkerOnClick);
    playersMappingList[val.steamid] = marker;
    marker.steamid = val.steamid;

    return marker;
}

var setOnlinePlayerMarkers = function (data) {
    playersMappingListOld = jQuery.extend({}, playersMappingList);
    playersMappingList = {};
    var marker;
    var online = 0;

    $.each(data, function (key, val) {
        marker = createPlayerMarker(val);
        playersMappingList[val.steamid] = {marker: marker, val: val};
    });
    if (jQuery.isEmptyObject(playersMappingListOld)) { // first run! 
        $.each(playersMappingList, function (key, val) {
            online_players.addLayer(val.marker); // add all available players
            online++;
        });
    } else { // this only gets executed when the layer is active!
        // Now we want to remove the old markers...
        // Let's do it one by one. You can come up with a clever way later!
        online_players.eachLayer(function (marker) {
            steamid = marker.steamid;
            if (!playersMappingList.hasOwnProperty(marker.steamid)) { // it's not present in the current list!
                online_players.removeLayer(marker); // remove
            } else { //  update the existing ones...
                if (!deepEqual(marker.getLatLng(), playersMappingList[marker.steamid].marker.getLatLng())) {
                    // moved player
                    var pos = L.latLng(playersMappingList[marker.steamid].val.position.x, playersMappingList[marker.steamid].val.position.z);
                    marker.setLatLng(pos).update(marker);
                }
                online++;
            }
        });
        $.each(data, function (key, val) { // and add new ones!
            if (!playersMappingListOld.hasOwnProperty(val.steamid)) {
                marker = createPlayerMarker(val);
                playersMappingList[val.steamid] = {marker: marker, val: val};
                online_players.addLayer(marker); // add all available bases
                online++;
            }
        });
    }
    $("#mapControlOnlineCount").text(online);
    return true;
};

var updatePlayerTimeout = false;
var pollOnlinePlayers = function () {
    if (updatePlayerTimeout === false
            || map.hasLayer(online_players)) {
        $.getJSON("https://panel.chrani.net/online_players.php")
                .done(function (data) {
                    setOnlinePlayerMarkers(data);
                    updateLivestats(data);
                });
    }
    updatePlayerTimeout = window.setTimeout(pollOnlinePlayers, 2000);
    return online_players;
};

player_action = function (e) {
    e.preventDefault();
    var player = playersMappingList[e.currentTarget.id];
    map.setView(player.marker.getLatLng());
}

var updateLivestats = function (data) {
    var player_list;
    player_list = "<ul>";
    $.each(data, function (key, val) {
        player_list += '<li><a id="' + val.steamid + '" href="#" onclick="player_action(event)">' + val.name + "</a></li>";
    });
    player_list += "</ul>";
    $("#livestatsmodal .content").html(player_list);

};

api_action = function (e) {
    e.preventDefault();
    $.ajax({
        url: e.currentTarget.href,
        success: function (data) {}
    });
}

/* Open modal & center map on marker click  */
function playerMarkerOnClick(e) {
    var title = this.options.title;
    var steamid = this.options.steamid;
    $("#playermodal .modal-content").html(
            '<div class="player-info">' +
            '<span>Actions for player</span><br />' +
            '<strong>' + title + '</strong><br />' +
            '<span>' + steamid + '</span>' +
            '</div>' +
            '<hr />' +
            '<div class="btn-group">' +
            '<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
            'Kick / Ban <span class="caret"></span>' +
            '</button>' +
            '<ul class="dropdown-menu">' +
            '<li><a href="kick.php?steamid=' + steamid + '" onclick="api_action(event)">Kick - Think about what you did!!</a></li>' +
            '<li><a href="ban_3days.php?steamid=' + steamid + '" onclick="api_action(event)">Ban - 3 Days - Read the rules again, cool down!</a></li>' +
            '<li><a href="ban_7days.php?steamid=' + steamid + '" onclick="api_action(event)">Ban - 7 Days - Read the rules again! You were THIS close to be banned forrrevaaaarrrrr!</a></li>' +
            '<li><a href="ban_10years.php?steamid=' + steamid + '" onclick="api_action(event)">Ban - 10 Years - Not on this server pal! Never return!! NEVER!!!</a></li>' +
            '</ul>' +
            '</div>'
            );
    $('#playermodal').modal('show');
    map.setView(e.target.getLatLng());
}
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc=" Location Markers ">
var locationsMappingList = {};
var active_locations = L.layerGroup();

var setLocationMarkers = function (data) {
    active_locations.clearLayers();
    locationsMappingList = {};
    $.each(data, function (key, val) {
        var marker;
        if (val.x !== '0' && val.z !== '0') {
            if (val.protected === '1') {
                var color = 'blue';
            } else {
                var color = 'red';
            }
            var bounds = [[Number(val.x) - Number(val.protectSize), Number(val.z) - Number(val.protectSize)], [Number(val.x) + Number(val.protectSize), Number(val.z) + Number(val.protectSize)]];
            marker = L.rectangle(bounds, {color: color, weight: 3, fillOpacity: 0, dashArray: "5 5 1 5"});
            marker.bindTooltip(val.name, {permanent: true, direction: "center"});
            active_locations.addLayer(marker);
            locationsMappingList[val.name] = marker;
        }
    });
    return true;
};

var updateLocationTimeout = false;
var pollLocations = function () {
    if (updateLocationTimeout === false
            || map.hasLayer(active_locations)) {
        $.getJSON("https://panel.chrani.net/locations.php")
                .done(function (data) {
                    setLocationMarkers(data);
                });
    }
    updateLocationTimeout = window.setTimeout(pollLocations, 30000);
    return active_locations;
};
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc=" LCB Markers ">
var lcbMappingList = {};
var active_lcb = L.layerGroup();

var setLcbMarkers = function (data) {
    active_lcb.clearLayers();
    lcbMappingList = {};
    var lcb = 0;
    $.each(data.claimowners, function (key, claimowners) {
        var marker;
        $.each(claimowners.claims, function (key, claim) {
            var bounds = [[Number(claim.x) - Number(data.claimsize / 2), Number(claim.z) - Number(data.claimsize / 2)], [Number(claim.x) + Number(data.claimsize / 2), Number(claim.z) + Number(data.claimsize / 2)]];
            if (claimowners.claimactive === true) {
                var color = 'green';
            } else {
                var color = 'red';
            }
            marker = L.rectangle(bounds, {color: color, weight: 1, fillOpacity: 0.1});
            marker.bindTooltip(claimowners.playername + " (claim)", {permanent: false, direction: "center"});

            active_lcb.addLayer(marker);
            lcbMappingList[lcb] = marker;
            lcb++;
        });
    });
    $("#mapControlLcbCount").text(lcb);
    return true;
};

var updateLcbTimeout = false;
var pollLcb = function () {
    if (updateLcbTimeout === false
            || map.hasLayer(active_lcb)) {
        $.getJSON("https://panel.chrani.net/landclaims.php")
                .done(function (data) {
                    setLcbMarkers(data);
                });
    }
    updateLcbTimeout = window.setTimeout(pollLcb, 60000);
    return active_lcb;
};
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc=" Set up Game-Map ">
/*	create 7dtd map object
 utilizes Projection code from Allocs WebAndMapRendering */
function initMap() {
    SDTD_Projection = {
        project: function (latlng) {
            return new L.Point(
                    (latlng.lat) / Math.pow(2, 4),
                    (latlng.lng) / Math.pow(2, 4));
        },
        unproject: function (point) {
            return new L.LatLng(
                    point.x * Math.pow(2, 4),
                    point.y * Math.pow(2, 4));
        }
    };

    SDTD_CRS = L.extend({}, L.CRS.Simple, {
        projection: SDTD_Projection,
        transformation: new L.Transformation(1, 0, -1, 0),
        scale: function (zoom) {
            return Math.pow(2, zoom);
        }
    });

    return new L.Map('map', {
        crs: SDTD_CRS,
        center: [767, -257],
        zoom: 3
    });
}
/*	fetch all map tiles and perform manual offset manipulation */
function pollTileLayer() {
    var _tileLayer = L.tileLayer('https://panel.chrani.net/tiles/{z}/{x}/{y}.png', {
        tileSize: 128,
        minNativeZoom: 0,
        minZoom: -1,
        maxNativeZoom: 4,
        maxZoom: 7,
        attribution: 'Tiles Courtesy of <a href="http://sevendaystodie.com/" target="_blank">7dtd</a>'
    });
    /*	Small hack to be able to use the weird tile-layout 7dtd provides
     thanks goes out to IvanSanchez and ghybs from stackexchange.
     */
    _tileLayer.getTileUrl = function (coords) {
        coords.y = (-coords.y) - 1;
        return L.TileLayer.prototype.getTileUrl.bind(_tileLayer)(coords);
    };
    return _tileLayer;
}
// </editor-fold>
var map = initMap();

var tileLayer = pollTileLayer();
var locations = pollLocations();
var onlinePlayers = pollOnlinePlayers();
var bases = pollBases();
var lcb = pollLcb();

var gametime = L.control.gameTime();
var mouseposition = L.control.mousePosition();

var baseMaps = {
    "World": tileLayer
};
var overlayMaps = {
    'All locations': locations,
    'Online players (<span id="mapControlOnlineCount">0</span>)': onlinePlayers,
    'All bases (<span id="mapControlBasesCount">0</span>)': bases,
    'Landclaims (<span id="mapControlLcbCount">0</span>)': lcb
};

var overlayControl = L.control.layers(null, overlayMaps, {collapsed: false});

locations.addTo(map);
overlayControl.addTo(map);
tileLayer.addTo(map);
onlinePlayers.addTo(map);
gametime.addTo(map);
mouseposition.addTo(map); // needs Allocs projection code to show sensible data
