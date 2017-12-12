<?php

/*
 * Fill ou and copy this file to the 'private' folder on this level. create irt if needed.
 */

// 7DtD Passwords
if (!defined('SDTD-ADMINUSER')) {
    define('SDTD-ADMINUSER', '');
}
if (!defined('SDTD-ADMINTOKEN')) {
    define('SDTD-ADMINTOKEN', '');
}

if (!defined('SDTD-TELNET-PASSWORD')) {
    define('SDTD-TELNET-PASSWORD', '');
}
if (!defined('SDTD-TELNET-DOMAINNAME')) {
    define('SDTD-TELNET-DOMAINNAME', '');
}

if (!defined('SDTD-TELNET-PORT')) {
    define('SDTD-TELNET-PORT', '');
}

// Steam-Auth
if (!defined('STEAMAUTH-APIKEY')) {
    define('STEAMAUTH-APIKEY', '');
}

// credentials for my own api. I wrote it simply to access the Botmans Database. You have to write your own interface :)
$opts = ["http" => [
        "method" => "GET",
        "header" => "X-API-KEY: \r\n",
        ]];

if (!defined('CHRANI-APIKEY')) {
    define('CHRANI-APIKEY', $opts);
}
