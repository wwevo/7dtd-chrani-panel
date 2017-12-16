<?php

require_once __DIR__ . '/../config_steam-auth.php';
require_once __DIR__ . '/../config_7dtd-permissions.php';

/*
 * Debug
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);
set_time_limit(5);

if (!$steam->loggedIn() || has_permission_level(4) === false) { // 4 is a rank for a few special players like testers
    $header = 'Location: ' . $config['SteamAuth']['domainname'];
    header($header);
    exit;
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>7 Days to Die Map: Chrani-Gameserver</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="assets/style.css"/>
        <link rel="stylesheet" href="assets/modal.css"/>
        <link rel="stylesheet" href="assets/leaflet/leaflet.css"/>
        <script src="assets/leaflet/leaflet.js"></script>
        <script src="assets/mouseposition/leaflet.mouseposition.js"></script>
        <link rel="stylesheet" href="assets/mouseposition/Mouseposition.css"/>
<!--        <script src="assets/markercluster/leaflet.markercluster.js"></script>
        <link rel="stylesheet" href="assets/markercluster/MarkerCluster.Default.css"/>
        <link rel="stylesheet" href="assets/markercluster/MarkerCluster.css"/> //-->
        <script src="assets/gametime/leaflet.gametime.js"></script>
        <link rel="stylesheet" href="assets/gametime/Gametime.css"/>
        <script src="assets/jquery/jquery-3.2.1.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    </head>
    <body>
        <div id="map">7 Days to Die Map: Chrani-Gameserver (c) 2017</div>
        <!-- Modal EMPTY-->
        <div class="modal left fade" id="playermodal" role="dialog" tabindex="-1">
            <div class="modal-dialog" role="document">
                <div class="modal-content"></div>
            </div>
        </div>
        <div id="players_jumplist">
            <div class="box">
                <div class="content"></div>
            </div>
        </div>
        <div id="locations_jumplist">
            <div class="box">
                <div class="content"></div>
            </div>
        </div>
        <script src="assets/leaflet_7dtd.js"></script>
    </body>
</html>
