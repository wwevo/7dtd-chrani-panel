<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/../private/passwords.php';
require_once __DIR__ . '/../config_steam-auth.php';
require_once __DIR__ . '/../config_7dtd-permissions.php';

if (!$steam->loggedIn()) {
	$header = 'Location: ' . $config['SteamAuth']['domainname'];
	header($header);
	exit;
}

$context = stream_context_create();
$filename = utf8_encode("http://chrani.net:25004/api/getplayersonline?adminuser=" . constant('SDTD-ADMINUSER') . "&admintoken=" . constant('SDTD-ADMINTOKEN'));

$file = file_get_contents($filename, false, $context);

$json = json_decode($file, true);
foreach($json as $key => $data) {
    $json[$key]['permission_level'] = get_permission_level($data['steamid']);
}
$json = json_encode($json);

echo $json;
