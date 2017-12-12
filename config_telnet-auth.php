<?php
require_once __DIR__ . '/private/passwords.php';

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$config['TelnetAuth'] = array(
    'password' => constant('SDTD-TELNET-PASSWORD'), // telnet password for the game-server
    'domainname' => constant('SDTD-TELNET-DOMAINNAME'), // gameserver ip / domain
    'port' => constant('SDTD-TELNET-PORT') // telnet port of the gameserver
);

$telnet = fsockopen("tcp://" . $config['TelnetAuth']['domainname'], $config['TelnetAuth']['port'], $errno, $errstr);
stream_set_blocking($telnet, 0);
