var  socket = null;

var playerId = null;

function initSocket()
{
    socket = io.connect(":3000");
    socket.emit('playerConnect');
    socket.on('playerConnect', function(id)
    {
        if (playerId === null)
        {
            playerId = id;
            console.log('sockets send back player id = ' + playerId);
            if (playerId == 0)
            { 
                //init();
                newGame();                  
                //экран ожидания
                //drawWaitingScreen();
                //snakes.push(snake, snakeEnemy);
                socket.emit('sendLevel', level);
            }
            else
            {
              // newGame();
                socket.emit('getLevel');
            }
        }
    });
    socket.on('sendArraySnakes', function(arrayOfSnakes)
    {
        g_snakes = arrayOfSnakes;
    });
    socket.on('sendLevel', function()
    {
        //level = new Level(30, 19, 32, 32); 
        g_level = level;
    });
    
    socket.on('getLevel', function(savedLevel)
    {
        level = savedLevel;
        console.log('level acsepted');
    });
    
    socket.on('createXYapple', function(object)
    {
        if (object.playerId == 0)
        {
            level.tiles[object.x][object.y] = 2;
        }
    });
    
    socket.on('sendGameover', function()
    {
        gameover = true;
    });
    
    socket.on('wasSnakesCreated', function(snakeWasCreated)
    {
        g_snakeCreated = snakeWasCreated;
    });
    
    socket.on('startNewGame', function(timer)
    {
        if (timer == 0)
        {
            tryNewGame();
            g_timerToStartAfterDeath = 4000; 
        }
    });
    
    socket.on('playerUpKeyDown', function(object)
    {
        for (var i = 0; i < snakes.length; i++)
        {
            if (object.playerId == snakes[i].playerId)
            {
                if (snakes[i].direction != 2)  
                {
                    snakes[i].direction = 0;
                }
                console.log(i +'`s player pressed UpKeyDown');
                break;
            }
        }
    });

    socket.on('playerRightKeyDown', function(object)
    {
        for (var i = 0; i < snakes.length; i++)
        {
            if (object.playerId == snakes[i].playerId)
            {
                if (snakes[i].direction != 3)  
                {
                    snakes[i].direction = 1;
                }
                console.log(i +'`s player pressed RightKeyDown');
                break;
            }
        }
    });

    socket.on('playerDownKeyDown', function(object)
    {
        for (var i = 0; i < snakes.length; i++)
        {
            if (object.playerId == snakes[i].playerId)
            {
                 // Down or S
                if (snakes[i].direction != 0)  
                {
                    snakes[i].direction = 2;
                }
                console.log(i +'`s player pressed DownKeyDown');
                break;
            }
        }
    });

    socket.on('playerLeftKeyDown', function(object)
    {
        for (var i = 0; i < snakes.length; i++)
        {
            if (object.playerId == snakes[i].playerId)
            {
                if (snakes[i].direction != 1)
                {
                    snakes[i].direction = 3;
                }
                console.log(i +'`s player pressed LeftKeyDown');
                break;
            }
        }
    });

    socket.on('playerAteApple', function(object)
    {
        for (var i = 0; i < snakes.length; i++)
        {
            if (object.playerId == snakes[i].playerId)
            {
                snakes[i].growScore;
                console.log('player with ' + snakes[i].playerId + ' ID ' + 'ate an apple ');
                break;
            }
        }
    });
    
     socket.on('deleteXYapple', function(object)
    {                  
         level.tiles[object.x][object.y] = 0;
        // io.emit('playerRightKeyDown', level);
    });   
}

