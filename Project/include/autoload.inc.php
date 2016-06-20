<?php
    $filelist = glob("inc/*.inc.php");
    $lenght = count($filelist);
    for($i = 0; $i <= $lenght - 1; $i++)
    {
        require_once($filelist[$i]);
    }