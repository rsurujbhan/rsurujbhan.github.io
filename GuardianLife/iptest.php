<?php
require_once(get_cfg_var('doc_root').'/include/services/AgentAuthenticator.phph');
$auth = AgentAuthenticator::authenticateValidIPAddress();
if ($auth) {
    echo "valid ADMIN_HOSTS match!";
}
?>
<!DOCTYPE html>
<html lang="en-us">
<head>
    <title>IP Test</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <h1>Hello!</h1>
</body>
</html>
