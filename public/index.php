<?php


require __DIR__ . '/../config_steam-auth.php';

if ($steam->loggedIn()) {
    echo "Hello " . $steam->personaname . " (" . $steam->steamid. ")!<br />";
    echo '<a href="map.php">Onlinemap</a> | <a href="logout.php">Logout</a>';
} else {
    echo '<a href="' . $steam->loginUrl() . '">Login</a>';
}
