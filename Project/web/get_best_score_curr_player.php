<?php    
    require_once('../include/database.inc.php');
    session_start();
    $scoreCurrPlayerArray = dbQueryGetResult("SELECT `best_score` FROM `users_info` WHERE" . $_SESSION['IdCoockie']);
    $scoreCurrPlayer = array_pop($scoreCurrPlayerArray); 
    echo ($scoreCurrPlayer['best_score']);