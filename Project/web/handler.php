<?php
if (isset($_GET['username']))
    {
        $str = $_GET['username'];
        echo('Your password: ' . $str . '<br />');         
    }
    else
    {
       echo('Pasword not found');
    }
?>