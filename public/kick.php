<?php


require __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../config_steam-auth.php';
require_once __DIR__ . '/../config_telnet-auth.php';
require_once __DIR__ . '/../config_7dtd-permissions.php';

if (!$steam->loggedIn() || !has_permission('kick')) {
    $rows[] = array("result" => "insufficient access-rights.");
    $json = json_encode($rows);
    echo $json;
    exit;
}
/*
 * Before we start, let's check if everything we need is present
 */
$steamid = (isset($_GET['steamid']) && is_numeric($_GET['steamid'])) ? $_GET['steamid'] : null;
if (is_null($steamid)) {
    die('No steamid provided');
}
/*
 * crude way to do this- read the output char by char and stop only at
 * predetermined points.
 * 
 * First stop is the password prompt of course:
 */
$prompt = '';
$authenticated = false;
while (!$authenticated) {
    $line = stream_get_contents($telnet, 1);
    $prompt .= $line;
    if (ends_with($prompt, "Please enter password:")) {
        $prompt = "";
        $pwd = $config['TelnetAuth']['password'] . "\n";
        $result = fputs($telnet, $pwd);
        if ($result) {
            $authenticated = true;
            break;
        }
    }
}
if (!$authenticated) {
    fclose($telnet);
    die("Authentication failed!");
}
/*
 * Let's check if telnet is doing it the way we expect.
 */
$telnet_ready = false;
while (!$telnet_ready) {
    flush();
    $line = stream_get_contents($telnet, 1);
    $prompt .= $line;
    if (ends_with($prompt, "Press 'exit' to end session.")) {
        $prompt = "";
        $telnet_ready = true;
        break;
    }
}
if (!$telnet_ready) {
    fclose($telnet);
    die("Something went wrong after login");
}
/*
 * we should be able to issue commands now!
 */
$command = 'kick ' . $steamid . ' "Think about what you did!"';
$result = fputs($telnet, $command, strlen($command));

if (!$result) {
    die("Issuing kick-command seems to have failed!");
}

$rows[] = array("result" => "command '$command' should have been issued!");
$json = json_encode($rows);
echo $json;

fclose($telnet);
