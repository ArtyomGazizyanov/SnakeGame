<?php    
    require_once('../include/string.inc.php');
    if (isset($_GET['password']))
    {
        $str = $_GET['password'];
        echo('Your password: ' . $str . '<br />');
        if (isValidPassword($str))
        {
            echo('Your reliability: ' . ReliabilityValidPassword($str));            
        }    
    }
    else
    {
       echo('Pasword not found');
    }