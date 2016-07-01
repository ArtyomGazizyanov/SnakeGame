<?php
    require_once('string.inc.php');
    require_once('request.inc.php');
    if (isset($_GET['str']))
    {
        $str = $_GET['str'];
        echo(last($str));
    }
    else
    {
       echo('str not found');
    }
