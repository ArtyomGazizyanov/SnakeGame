<?php
        include('../headerleaderboard1.html');
        require_once('../include/database.inc.php');
        $leaderboarddepth = 5;
        $total = countRowsMysql("SELECT COUNT(*) FROM `table`");
        print_r ($total);
        if ($total <= $leaderboarddepth)
        {
            $scores = dbQueryGetResult("SELECT `username`, `best_score` FROM `users_info` ORDER By `best_score` DESC LIMIT $leaderboarddepth");
            for($i = 0; $i <= 4; $i++)
            {                
                $data = $scores["$i"];                  
                echo "<tr><td>" . $data['username'] . "</td>";
                echo "<td>" . $data['best_score'] . "</td></tr>";
           }
        }
        include('../foorerleaderboard1.html');  