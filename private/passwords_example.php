<?php

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

if (!defined('STEAMAUTH-DOMAINNAME')) {
    define('STEAMAUTH-DOMAINNAME', '');
}

// Chrani-API
if (!defined('CHRANI-APIKEY')) {
    define('CHRANI-APIKEY', '');
}
$opts = ["http" => [
        "method" => "GET",
        "header" => "X-API-KEY: " . constant('CHRANI-APIKEY') . "\r\n",
        ]];

if (!defined('CHRANI-APIKEY-OPTS')) {
    define('CHRANI-APIKEY-OPTS', $opts);
}

// Botman DB
if (!defined('BOTMAN-DBHOST')) {
    define('BOTMAN-DBHOST', '');
}

if (!defined('BOTMAN-DBUSER')) {
    define('BOTMAN-DBUSER', '');
}

if (!defined('BOTMAN-DBPASS')) {
    define('BOTMAN-DBPASS', '');
}

if (!defined('BOTMAN-DBNAME')) {
    define('BOTMAN-DBNAME', '');
}
