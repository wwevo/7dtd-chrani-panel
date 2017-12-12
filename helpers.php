<?php

function ends_with($check, $endStr) {
    if (!is_string($check) || !is_string($endStr) || strlen($check) < strlen($endStr)) {
        return false;
    }
    return (substr($check, strlen($check) - strlen($endStr), strlen($endStr)) === $endStr);
}
