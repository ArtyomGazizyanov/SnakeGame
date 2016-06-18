<?php
    require_once('../include/string.inc.php');
    if (isset($_GET['str']))
    {
        $str = $_GET['str'];
        echo(revers($str));    
    }
    else
    {
       echo('ERROR: Variable str not found, check you input! Please, add this variable to url.').PHP_EOL;
    }