<?php
require_once __DIR__ . '/private/passwords.php';
require_once __DIR__ . '/SteamAuth.php';

$config['SteamAuth'] = array(
    'apikey' => constant('STEAMAUTH-APIKEY'), // Steam API KEY
    'domainname' => constant('STEAMAUTH-DOMAINNAME'), // Displayed domain in the login-screen
    'loginpage' => '', // Returns to last page if not set
    'logoutpage' => '',
    'skipAPI' => false, // true = dont get the data from steam, just return the steamid64
);

$steam = new Vikas5914\SteamAuth($config['SteamAuth']);
