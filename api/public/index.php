<?php

require_once '../../private/passwords.php';
require '../vendor/autoload.php';

function request_headers() {
    $arh = array();
    $rx_http = '/\AHTTP_/';
    foreach ($_SERVER as $key => $val) {
        if (preg_match($rx_http, $key)) {
            $arh_key = preg_replace($rx_http, '', $key);
            $rx_matches = array();
            // do string manipulations to restore the original letter case
            $rx_matches = explode('_', $arh_key);
            if (count($rx_matches) > 0 and strlen($arh_key) > 2) {
                foreach ($rx_matches as $ak_key => $ak_val)
                    $rx_matches[$ak_key] = ucfirst($ak_val);
                $arh_key = implode('-', $rx_matches);
            }
            $arh[$arh_key] = $val;
        }
    }
    return( $arh );
}

function getDB() {
    $dbhost = constant('BOTMAN-DBHOST');
    $dbuser = constant('BOTMAN-DBUSER');
    $dbpass = constant('BOTMAN-DBPASS');
    $dbname = constant('BOTMAN-DBNAME');

    $mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname";
    $dbConnection = new PDO($mysql_conn_string, $dbuser, $dbpass);
    $dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbConnection;
}

function utf8_encode_deep(&$input) {
    if (is_string($input)) {
        $input = utf8_encode($input);
    } else if (is_array($input)) {
        foreach ($input as &$value) {
            utf8_encode_deep($value);
        }
        unset($value);
    } else if (is_object($input)) {
        $vars = array_keys(get_object_vars($input));
        foreach ($vars as $var) {
            utf8_encode_deep($input->$var);
        }
    }
}

/* slim framework */

$config = ['settings' => [
        'addContentLengthHeader' => false,
        ]];
$app = new \Slim\App($config);

// Define app routes
$app->get('/', function ($request, $response, $args) {
    return $response->write("chrani.net api");
});

$app->add(function ($request, $response, $next) {
    $headers = request_headers();
    $api_key = $headers['X-API-KEY'];
    if ($api_key == constant('CHRANI-APIKEY')) {
        $authorized = true;
    }
    if (!$authorized) {
        $req = $_SERVER['REQUEST_URI'];
        if ($req != "/") {
            return $response->withStatus(401)->withHeader('Content-Type', 'text/html')->write("UNAUTHORIZED");
        }
    }
    return $next($request, $response);
});

$app->get('/bases[/{steam}]', function ($request, $response, $args) {
    try {
        if (is_null($args['steam'])) {
            $where = "WHERE ((homeX != '0' AND homeZ != '0') OR (home2X != '0' AND home2Z != '0')) ORDER BY name DESC";
        } else {
            $where = "WHERE steam = :steam LIMIT 1";
        }
        $db = getDB();
        $sth = $db->prepare("
			SELECT steam, name, id, homeX, homeZ, protectSize, protect, home2X, home2Z, protect2Size, protect2
			FROM players
			$where
		");

        if (is_null($args['steam'])) {
            
        } else {
            $sth->bindParam(':steam', $args['steam'], PDO::PARAM_INT);
        }

        $bases = array();
        if ($sth->execute()) {
            while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
                $bases[] = $row;
            }
        }

        if (is_array($bases)) {
            utf8_encode_deep($bases);
            echo json_encode($bases);
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }
    } catch (PDOException $e) {
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }
});

$app->get('/players[/{steam}]', function ($request, $response, $args) {
    try {

        if (is_null($args['steam'])) {
            $where = "ORDER BY seen DESC";
        } else {
            $where = "WHERE steam = :steam LIMIT 1";
        }
        $db = getDB();
        $sth = $db->prepare("
			SELECT steam, name, id, xPos, yPos, zPos, xPosOld, yPosOld, zPosOld, seen
			FROM players
			$where
		");

        if (is_null($args['steam'])) {
            
        } else {
            $sth->bindParam(':steam', $args['steam'], PDO::PARAM_INT);
        }

        $players = array();
        if ($sth->execute()) {
            while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
                $players[] = $row;
            }
        }

        if (is_array($players)) {
            utf8_encode_deep($players);
            echo json_encode($players);
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }
    } catch (PDOException $e) {
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }
});

$app->get('/locations', function ($request, $response, $args) {
    try {
        $db = getDB();
        $sth = $db->prepare("
			SELECT name, x, y, z, protectSize, protected
			FROM locations
		");

        $locations = array();
        if ($sth->execute()) {
            while ($row = $sth->fetch(PDO::FETCH_ASSOC)) {
                $locations[] = $row;
            }
        }

        if (is_array($locations)) {
            utf8_encode_deep($locations);
            echo json_encode($locations);
            $db = null;
        } else {
            throw new PDOException('No records found.');
        }
    } catch (PDOException $e) {
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }
});

// Run app
$app->run();
