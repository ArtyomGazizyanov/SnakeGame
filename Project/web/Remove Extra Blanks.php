<?php
    require_once('../include/string.inc.php');
    if (isset($_GET['text']))
    {
        $str = $_GET['text'];
        echo('__|' . deleteExtraSpaces($str) . '|__');    
    }
    else
    {
       echo('Varible (text) not found');
    }