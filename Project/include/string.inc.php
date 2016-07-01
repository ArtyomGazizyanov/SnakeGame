    <?php
    function last($str)
    {
       $lastChar = substr($str, strlen($str) - 1);
       return $lastChar;
    }

    function withoutLast($str)
    {
        $strWithoutLast = substr($str, 0, strlen($str) - 1);
        return $strWithoutLast;
    }

    function revers($str)
    {
        $reverseStr = '';
        $length = strlen($str);
        for($i = $length - 1; $i >= 0; $i--)
        {
            $reverseStr = $reverseStr . $str[$i];
        }
        return $reverseStr;
    }

    function firstStrChar($str)
    {
        $strFirstChar = substr($str, 0, 1);
        return $strFirstChar;
    }

    function isInvalidIdentifierSymbol($symbol)
    {
        $isGoodSymbol =  true;
        if (!(((ord($symbol) >= 65)) && (ord($symbol) <= 90))) // A .. Z
        {
            if (!(((ord($symbol) >= 97)) && (ord($symbol) <= 122))) // a .. z
            {
                if (!(((ord($symbol) >= 48)) && (ord($symbol) <= 57))) //0 .. 9
                {
                    $isGoodSymbol = false;
                }
            }
        }
        return $isGoodSymbol;
    }
    function isValidIdentifier($str)
    {
        $isGoodStr =  true;
        $length = strlen($str);
        $invalidSymbol = false;
        if ((is_numeric(firstStrChar($str))))
        {
            echo ('Invalid sumbol: ' . ' |' . (firstStrChar($str)) . '| </br>');
        }
        for ($i = 1; $i < $length; $i++)
        {
            if (!(isInvalidIdentifierSymbol($str[$i])))
            {
                $invalidSymbol = true;
                $isGoodStr = false;
            }
            if (($invalidSymbol))
            {
                echo ('Invalid sumbol: ' . ' |' . ($str[$i]) . '| </br>');
                $invalidSymbol = false;
            }
        }
        return $isGoodStr;
    }

    function isSetStr($str)
    {
        if (isset($_GET[$str]))
        {
            $setStr = $_GET[$str];
        }
        else
        {
            echo('ERROR: Variable str not found, check you input! Please, add this variable to url.').PHP_EOL;
        }
    }

    function deleteExtraSpaces($str)
    {
        $freeSpacesStr = ' ';
        if (!empty($str))
        {
            $i = 1;
            $length = strlen($str);
            while ($i <= $length - 1)
            {
                while (($str[$i - 1] != ' ') && ($i <= $length - 1))    // собираем слово
                {
                  $freeSpacesStr = $freeSpacesStr . $str[$i - 1];
                    $i++;
                }
                $freeSpacesStr = $freeSpacesStr . $str[$i - 1];
                $i++;
            }
        }
        else
        {
            $freeSpacesStr = 'Varible is is empty.';
        }
        return ltrim(rtrim($freeSpacesStr));
    }

    function isValidPassword($password)
    {
        if (!empty($password))
        {
            if(preg_match('|^[A-Z0-9]+$|i', $password))
            {
                return true;
            }
            else
            {
                echo ('Use only english symbols and digits for your password.');
                return false;
            }
        }
        else
        {
            echo('Pasword is is empty.');
            return false;
        }
    }
    
    function ReliabilityValidPassword($password)
    {
        $paswordReliability = 0;
        $counterDigits = 0;
        $unicSymbols = [];
        $onlyChar = true;
        $onlyDigit = true;
        $counterRepeatSymbols = 0;
        $counterUpperCaseLetters = 0;
        $counterLowerCaseLetters = 0;
        $paswordReliability = strlen($password) * 4;
        for ($i = 0; $i < strlen($password); $i++)
        {
            if (!(is_numeric($password[$i])))
            {
                $onlyDigit = false;
                if (in_array($password[$i], $unicSymbols))
                {
                    $counterRepeatSymbols++;
                }
                else
                {
                    array_push($unicSymbols, $password[$i]);
                    if (($password[$i] >= 'A') &&   ($password[$i] <= 'Z'))
                    {
                        $counterUpperCaseLetters++;
                    }
                    else
                        if (($password[$i] >= 'a') &&   ($password[$i] <= 'z'))
                        {
                            $counterLowerCaseLetters++;
                        }
                }
            }
            else
            {
                $onlyChar = false;
                $counterDigits++;
                //$counterRepeatSymbols++;
            }
        }
        if (($onlyChar)  || ($onlyDigit))
        {
            $paswordReliability = $paswordReliability - strlen($password);
        }
        $counterDigits = 4 * $counterDigits;
        if ($counterUpperCaseLetters != 0)
        {
            $counterUpperCaseLetters = (strlen($password) -  $counterUpperCaseLetters) * 2;
        }
        if ($counterUpperCaseLetters != 0)
        {
            $counterLowerCaseLetters = (strlen($password) -  $counterLowerCaseLetters) * 2;
        }
		echo ('paswordReliability = ' . $paswordReliability . '</br>');
		echo ('counterDigits = ' . $counterDigits . '</br>');
		echo ('counterUpperCaseLetters = ' . $counterUpperCaseLetters . '</br>');
		echo ('counterLowerCaseLetters = ' . $counterLowerCaseLetters . '</br>');
		echo ('counterRepeatSymbols = ' . $counterRepeatSymbols . '</br>');
        $paswordReliability = $paswordReliability + $counterDigits + $counterUpperCaseLetters + $counterLowerCaseLetters - $counterRepeatSymbols;
        return $paswordReliability;
    }
