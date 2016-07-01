<?php
    require_once('../include/database.inc.php');
    if ((isset($_GET['username'])) &&(dbInitialConnect()))
    {
        $username = strtoupper($_GET['username']);
        dbQuery("INSERT INTO `users_info`(`username`) VALUES ('" . $username . "')");
        $lastID = getLastMysqlData("SELECT MAX(`id`) FROM `users_info`");        
        session_start();
        $_SESSION['UsernameCoockie'] = $username;
        $_SESSION['IdCoockie'] = $lastID;
        //print_r($_SESSION);
        include('../startmenu.html');
    }
    else
    {
       echo('Sorry, there is a problem. Can you rewrite your username and tru again. If it did not help, please wait and try later');
    }