<?php
        include('../headerleaderboard.html');
        require_once('../include/database.inc.php');
        $leaderboarddepth = 10;
        $total = countRowsMysql("SELECT COUNT(*) FROM `table`");
        print_r ($total);
        if ($total <= $leaderboarddepth)
        {
            $scores = dbQueryGetResult("SELECT `username`, `best_score` FROM `users_info` ORDER By `best_score` DESC LIMIT $leaderboarddepth");
            for($i = 0; $i <= $leaderboarddepth - 1; $i++)
            {                
                $data = $scores["$i"];                  
                echo "<tr><td>" . ($i + 1) . "</td>";
                echo "<td>" . $data['username'] . "</td>";
                echo "<td>" . $data['best_score'] . "</td></tr>";
           }
        }
        include('../footerleaderboard.html');  