<?php

require __DIR__ . '/../config_steam-auth.php';

if (true === $steam->loggedIn() && true === $steam->logout()) {
	unset($steam);
	$header = 'Location: ' . $config['SteamAuth']['domainname'];
	header($header);
	exit;
} else {
	echo 'not logged in';
}
