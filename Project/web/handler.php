<?php
    
    require_once('../include/database.inc.php');
    if ((isset($_GET['username'])) &&(dbInitialConnect()))
    {
        $result = 'fycj';
        $str = strtoupper ($_GET['username']);        // " . $str . "
        $result = dbQuery("INSERT INTO `users_info`(`username`) VALUES ('" . $str . "')");
        //$row = mysql_fetch_array($result);
        //$result = dbQuery("SELECT MAX(`id`), * `users_info` INTO @result");
       // $result = dbQuery("SELECT * FROM `users_info` ORDER BY `id` DESC LIMIT 1");
        //$result = mysql_insert_id();//dbQuery("SELECT * FROM `users_info` ORDER BY `id` DESC LIMIT 1");
        $array = array(dbQueryGetResult("SELECT MAX(`id`) FROM `users_info`"));
        //print_r(dbQueryGetResult("SELECT MAX(`id`) FROM `users_info`"));
        echo current($array);
        //$name = $row["name"];
       // echo '___"'.$name.'"___';
        include('../startmenu.html');
    }
    else
    {
       echo('Sorry, there is a problem. Can you rewrite your username and tru again. If it did not help, please wait and try later');
    }