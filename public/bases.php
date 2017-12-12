<?php

require_once __DIR__ . '/../private/passwords.php';
require __DIR__ . '/../config_steam-auth.php';

if (!$steam->loggedIn()) {
	$header = 'Location: ' . $config['SteamAuth']['domainname'];
	header($header);
	exit;
}

$context = stream_context_create(constant('CHRANI-APIKEY'));
$file = file_get_contents('https://api.chrani.net/bases', false, $context);
echo $file;
