<?php
    if (isset($_GET['username']))
    {
        $str = strtoupper ($_GET['username']); 
        include('../startmenu.html');
    }
    else
    {
       echo('Sorry, there is a problem. Can you rewrite your username and tru again. If it did not help, please wait and try later');
    }