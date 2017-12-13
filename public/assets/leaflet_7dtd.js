
// <editor-fold defaultstate="collapsed" desc=" Base Markers ">
var basesMappingList = {};
var basesMappingListOld = {};
var secondBasesMappingList = {};
var secondBasesMappingListOld = {};
var active_bases = L.layerGroup();

function createBaseMarker(bounds, protected, name) {
    var marker;
    if (protected === '1') {
        var color = 'green';
    } else {
        var color = 'red';
    }
    marker = L.rectangle(bounds, {color: color, weight: 1, fillOpacity: 0.1});
    marker.bindTooltip(name + " (1st base)", {permanent: false, direction: "center"});
    return marker;
}

var setBaseMarkers = function (data) {
    active_bases.clearLayers();
    basesMappingListOld = jQuery.extend({}, basesMappingList);
    secondBasesMappingListOld = jQuery.extend({}, secondBasesMappingList);
    basesMappingList = {};
    secondBasesMappingList = {};
    var bases = 0;
    var bounds;
    var marker;

    $.each(data, function (key, val) {
        if (val.homeX !== '0' && val.homeZ !== '0') {
            bounds = [[Number(val.homeX) - Number(val.protectSize), Number(val.homeZ) - Number(val.protectSize)], [Number(val.homeX) + Number(val.protectSize), Number(val.homeZ) + Number(val.protectSize)]];
            marker = createBaseMarker(bounds, val.protect, val.name);
            basesMappingList[val.steam] = { marker: marker, val: val};
            bases++;
        }
        if (val.home2X !== '0' && val.home2Z !== '0') {
            bounds = [[Number(val.home2X) - Number(val.protect2Size), Number(val.home2Z) - Number(val.protect2Size)], [Number(val.home2X) + Number(val.protect2Size), Number(val.home2Z) + Number(val.protect2Size)]];
            marker = createBaseMarker(bounds, val.protect, val.name);
            secondBasesMappingList[val.steam] = { marker: marker, val: val};
            bases++;
        }
    });
    // remove all markers no longer present
    $.each(basesMappingListOld, function (key, val) {
        if (!basesMappingList.hasOwnProperty(key)) {
            active_bases.removeLayer(val.marker);
        }
    });
    // add new markers to the map
    $.each(basesMappingList, function (key, val) {
        if (!basesMappingListOld.hasOwnProperty(key)) {
            active_bases.addLayer(val.marker);
        } else {
            active_bases.addLayer(val.marker);
        }
    });
    
    $.each(secondBasesMappingListOld, function (key, val) {
        if (!secondBasesMappingList.hasOwnProperty(key)) {
            active_bases.removeLayer(val.marker);
        }
    });
    // add new markers to the map
    $.each(secondBasesMappingList, function (key, val) {
        if (!secondBasesMappingListOld.hasOwnProperty(key)) {
            active_bases.addLayer(val.marker);            
        } else {
            active_bases.addLayer(val.marker);
        }
        // need to add a check for changed markers and update them
    });
    
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
    updateBasesTimeout = window.setTimeout(pollBases, 5000); // if active or not, poll this function periodically
    return active_bases; // return current layer, this is just for convenience
};
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc=" Player Markers and List ">
var playersMappingList = {};
var online_players = L.markerClusterGroup();

var setOnlinePlayerMarkers = function (data) {
    online_players.clearLayers();
    playersMappingList = {};
    var online = 0;
    $.each(data, function (key, val) {
        var marker = L.marker([val.position.x, val.position.z], {title: val.name, steamid: val.steamid}).bindTooltip(val.name, {permanent: true, direction: "right"});
        marker.setOpacity(1.0);
        marker.on('click', markerOnClick);
        online_players.addLayer(marker);
        playersMappingList[val.steamid] = marker;
        online++;
    });
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
    map.setView(player.getLatLng());
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
function markerOnClick(e) {
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

overlayControl.addTo(map);
tileLayer.addTo(map);
onlinePlayers.addTo(map);
locations.addTo(map);
gametime.addTo(map);
mouseposition.addTo(map); // needs Allocs projection code to show sensible data
