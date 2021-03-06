<?php

if (file_exists(__DIR__ . '/serveradmin.xml')) {
    $xml = simplexml_load_file(__DIR__ . '/serveradmin.xml');
    $config['7dtdPerm'] = array(
        'xml' => $xml,
    );
}

$config['7dtdPerm']['admins'] = $config['7dtdPerm']['xml']->admins;
$config['7dtdPerm']['permissions'] = $config['7dtdPerm']['xml']->permissions;
unset($config['7dtdPerm']['xml']);

function get_permission_level($steamid) {
    global $config;
    foreach ($config['7dtdPerm']['admins']->admin as $admin) {
        if ($steamid == $admin->attributes()['steamID']) {
            $permission = (int) $admin->attributes()['permission_level'];
            break;
        } else {
            $permission = 1000;
        }
    }
    return $permission;
}
$config['7dtdPerm']['permission_level'] = get_permission_level($steam->steamid);

foreach ($config['7dtdPerm']['permissions']->permission as $permission) {
    if ($config['7dtdPerm']['permission_level'] <= (int) $permission->attributes()['permission_level']) {
        $config['7dtdPerm']['commands'][] = (string) $permission->attributes()['cmd'];
    }
}
unset($config['7dtdPerm']['permissions']);

function has_permission($command) {
    global $config;
    if (in_array($command, $config['7dtdPerm']['commands'])) {
        return true;
    } else {
        return false;
    }
}

function has_permission_level($level) {
    global $config;
    if ($config['7dtdPerm']['permission_level'] <= $level) {
        return $config['7dtdPerm']['permission_level'];
    }
    return false;
}
