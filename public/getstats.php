<?php

require_once __DIR__ . '/../private/passwords.php';
require __DIR__ . '/../config_steam-auth.php';

if (!$steam->loggedIn()) {
	$header = 'Location: ' . $config['SteamAuth']['domainname'];
	header($header);
	exit;
}
$file = file_get_contents('http://panel.chrani-bot.notjustfor.me:8082/api/getlandclaims?adminuser=' . constant("SDTD-ADMINUSER") . '&admintoken=' . constant("SDTD-ADMINTOKEN"), false);
echo $file;
