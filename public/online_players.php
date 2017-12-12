<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/../private/passwords.php';
require __DIR__ . '/../config_steam-auth.php';

if (!$steam->loggedIn()) {
	$header = 'Location: ' . $config['SteamAuth']['domainname'];
	header($header);
	exit;
}

$context = stream_context_create();
$filename = utf8_encode("http://chrani.net:25004/api/getplayersonline?adminuser=" . constant('SDTD-ADMINUSER') . "&admintoken=" . constant('SDTD-ADMINTOKEN'));

$file = file_get_contents($filename, false, $context);
echo $file;
