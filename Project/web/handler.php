<?php
   require_once('../include/string.inc.php');
   if (isset($_GET['username']))
    {
        
        $username = $_GET['username'];
    }
    else
    {
        alert('You wrote nothing');
    }
?>