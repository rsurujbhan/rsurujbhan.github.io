<?php
header("Access-Control-Allow-Origin: *");
define("CUSTOM_SCRIPT", true);

// RightNow-PHP specific includes
require_once('include/init.phph');
list($common_cfgid, $rnw_common_cfgid, $rnw_ui_cfgid, $ma_cfgid) = msg_init($p_cfgdir, 'config', array('common', 'rnw_common', 'rnw_ui', 'ma'));
list($common_mbid, $rnw_mbid) = msg_init($p_cfgdir, 'msgbase', array('common', 'rnw'));

$lxAuthUrl = 'https://live.oraclecloud.com/auth/apps/api/access-token?grant_type=client_credentials&state=0&scope=optional&nonce='.rand();
$lxClientId = "LX-CLIENT-ID";
$lxClientSecret = "LX-CLIENT-SECRET";

$requestHeaders = array();
$requestHeaders[] = 'Accept: application/json';

load_curl();
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $lxAuthUrl);
curl_setopt($ch, CURLOPT_POST, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, $requestHeaders);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch, CURLOPT_USERPWD, "$lxClientId:$lxClientSecret");
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0); //0: none, 1: check for CN, 2: check for CN and verify hostname match
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); //is remote certificate valid?
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 100);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);

$result = curl_exec($ch);

$lxRespData = json_decode($result, false);
//print_r($lx_data);

$lxAuth = array("access_token" => $lxRespData->access_token,"expires_in" => $lxRespData->expires_in);

respond(json_encode($lxAuth));

function respond($_json) {
    header("Content-Type: application/json;charset=UTF-8");
    header("Content-Length: " . strlen($_json));
    header("X-Content-Type-Options: nosniff");
    echo $_json;
}
?>
