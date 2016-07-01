<?php
    $g_server = 'localhost:3306';
    $g_user = 'root';
    $g_password  = 'vertrigo';
    $g_database = 'snake_game';
    $g_table_users_info = 'users_info';
    $g_dblink = mysqli_connect($GLOBALS['g_server'], $GLOBALS['g_user'],  $GLOBALS['g_password'], $GLOBALS['g_database']);
    function dbInitialConnect()
    {
        global $g_dblink;
        if (!$g_dblink)
        {
            die('Ошибка подключения (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
        }
        //echo 'Соединение установлено... ' . mysqli_get_host_info($link) . "\n";
        return $g_dblink;
    }

    function dbQuery($query)
    {
       $a = mysqli_query(dbInitialConnect(), $query);
       return $a;
    }

    function dbQueryGetResult($query)
    {
        global $g_dblink;
        $data = array();
        $result = mysqli_query($g_dblink, $query);
        if ($result)
        {
            while($row = mysqli_fetch_assoc($result))
            {
                array_push($data, $row);
            }
            mysqli_free_result($result);
        }
        return $data;
    }

    function getLastMysqlData($query)  // LAST_INSERT_ID()
    {
        $array = array(dbQueryGetResult($query));
        $result = array_pop($array);
        $result = array_pop($result);
        $result = array_pop($result);
        return $result;
    }
    function getArrayrFromTable($query)  // LAST_INSERT_ID()
    {
        $array = array(dbQueryGetResult($query));
        $result = array_pop($array);
        return $result;
    }

    function countRowsMysql($query)  // LAST_INSERT_ID()
    {
        $array = array(dbQueryGetResult($query));
        $result = array_pop($array);
        $result = array_pop($array);
        return $result;
    }

