<?php
    require_once('include/database.inc.php');
    session_start();
    $leaderboarddepth = 17;
    include('one_player_game_header.html'); 
    
    $scoreCurrPlayerArray = dbQueryGetResult("SELECT `best_score` FROM `users_info` WHERE" . $_SESSION['IdCoockie']);
    $scoreCurrPlayer = array_pop($scoreCurrPlayerArray); 
    echo ("<div><span>username: " . $_SESSION['UsernameCoockie'] . "</span></div>");
    echo ("<div ><span>best score: </span><span id='userBestScore'>" . $scoreCurrPlayer['best_score'] . "</span></div>");
    
    include('one_player_game_table.html');    
    $total = countRowsMysql("SELECT COUNT(*) FROM `table`");
    //s print_r ($total);
    if ($total <= $leaderboarddepth)
    {
        $scores = dbQueryGetResult("SELECT `username`, `best_score` FROM `users_info` ORDER By `best_score` DESC LIMIT $leaderboarddepth");
        for($i = 0; $i <= $leaderboarddepth - 1; $i++)
        {                
            $data = $scores["$i"];                  
            echo ("<tr><td>" . ($i + 1) . "</td>");
            echo ("<td>" . $data['username'] . "</td>");
            echo ("<td>" . $data['best_score'] . "</td></tr>");
        }
    }
    include('one_player_game_footer.html');  