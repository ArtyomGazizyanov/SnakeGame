<?php
    require_once('../include/database.inc.php');
    //session_start();
    $leaderboarddepth = 17;
    $total = countRowsMysql("SELECT COUNT(*) FROM `table`");
    //s print_r ($total);
    include('../template/one_player_game_table.html');   
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