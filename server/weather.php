<?php

/* Weather.php
 * Receives call with zipcodes from Frontend
 * Created by Carlos Brenneisen 12/13/2015
 */

require_once("weatherObject.php");

$arrContextOptions=array(
    "ssl"=>array(
        "verify_peer"=>false,
        "verify_peer_name"=>false,
    ),
);

$zipcodes = json_decode($_GET['zipcode']);
if (gettype($zipcodes) != 'array'){
    $zipcodes = [$zipcodes];
}

$return = array();
foreach($zipcodes as $zipcode){

    //get data from Yahoo
    $url = "https://query.yahooapis.com/v1/public/yql?q=".
           "select%20*%20from%20weather.forecast%20where%20woeid%20in%20".
           "(select%20woeid%20from%20geo.places(1)%20where%20text%3D".$zipcode.")".
           "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

    $json = json_decode(file_get_contents($url, false, stream_context_create($arrContextOptions)));

    //massage data
    $base = $json->query->results->channel;
    $object = new weatherObject($base);

    $return[$zipcode] = $object;
}

echo json_encode($return);

?>