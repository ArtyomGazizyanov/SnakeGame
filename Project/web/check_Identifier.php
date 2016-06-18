<?php
    require_once('../include/string.inc.php');
        $str = $_GET['str'];
        if ((isValidIdentifier($str)))
        {
            echo ($str);
        }
        else
        {
             echo ("There are (is) wrong symbol(s)"); 
        } 
    
   