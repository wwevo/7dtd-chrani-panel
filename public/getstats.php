<?php

require_once __DIR__ . '/../private/passwords.php';
require __DIR__ . '/../config_steam-auth.php';

if (!$steam->loggedIn()) {
	$header = 'Location: ' . $config['SteamAuth']['domainname'];
	header($header);
	exit;
}
$file = file_get_contents('http://chrani.net:25004/api/getstats?adminuser=' . constant("SDTD-ADMINUSER") . '&admintoken=' . constant("SDTD-ADMINTOKEN"), false);
echo $file;
