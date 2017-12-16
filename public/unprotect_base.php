<?php

require __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../config_steam-auth.php';
require_once __DIR__ . '/../config_7dtd-permissions.php';

if (!$steam->loggedIn() || !has_permission('ban')) { // for now, people who are allowed to ban are also allowed to moderate bases!
    $rows[] = array("result" => "insufficient access-rights.");
    $json = json_encode($rows);
    echo $json;
    exit;
}
/*
 * Before we start, let's check if everything we need is present
 */
$steamid = (isset($_GET['steamid']) && is_numeric($_GET['steamid'])) ? $_GET['steamid'] : null;
if (is_null($steamid)) {
    die('No steamid provided');
}
$order = (isset($_GET['order'])) ? $_GET['order'] : null;
if (is_null($order)) {
    die('No base selected');
}

$postdata = http_build_query(
    array(
        'steamid' => $steamid,
        'order' => $order
    )
);

$opts = constant('CHRANI-APIKEY-OPTS');
$opts['http']['method'] = 'POST';
$opts['http']['header'] = array($opts['http']['header'], 'Content-type: application/x-www-form-urlencoded');
$opts['http']['content'] = $postdata;
$context = stream_context_create($opts);
$file = file_get_contents('https://api.chrani.net/unprotect_base', false, $context);

echo $file;
