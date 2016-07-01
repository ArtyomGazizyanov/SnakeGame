<?php
    require_once('../include/database.inc.php');
    session_start();
    $score = strtoupper ($_GET['score']);
    $id = $_SESSION['IdCoockie'];
    $BestScore = getLastMysqlData("SELECT `best_score` FROM `users_info` WHERE `id` ='$id'");    
    echo $BestScore;
    $username = $_SESSION['UsernameCoockie'];
    print_r($_SESSION);
    if ($score > $BestScore)
    {
        $sql = "UPDATE `users_info` SET `best_score`='$score' WHERE `id` ='$id'";
        dbQuery($sql);
    }
    $sql = "UPDATE `users_info` SET `score`='$score' WHERE `id` ='$id'";    
    if (dbQuery($sql))
    {
        echo ('evrthng is goooood');
    }
    else
    {
        echo ('evrthng is baaaaaaaaaaad');
    }
    