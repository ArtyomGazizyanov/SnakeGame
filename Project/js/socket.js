var  socket = null;

var playerId = null;

var g_snakes = [];

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
                //socket.emit('sendLevel', level);
            }
            else
            {
              // newGame();
               // socket.emit('getLevel');
            }
        }
    });


    socket.on('gameStarted', function()
    {
        init();
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
       // console.log('create apple  from user # ' + playerId);
        level.tiles[object.x][object.y] = 2;
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
//        console.log(i +'`s player pressed UpKeyDown');
        //console.log(object.playerId)
        //console.log(g_snakes)
        for (var i = 0; i < g_snakes.length; i++)
        {
            if (object.playerId == g_snakes[i].playerId)
            {
                if (g_snakes[i].direction != 2)
                {
                    //console.log(g_snakes[i].playerId +'`s player pressed UpKeyDown');
                    g_snakes[i].direction = 0;
                }
                break;
            }
        }
    });

    socket.on('playerRightKeyDown', function(object)
    {
        //console.log(object.playerId)
        for (var i = 0; i < g_snakes.length; i++)
        {
            if (object.playerId == g_snakes[i].playerId)
            {
                if (g_snakes[i].direction != 3 )
                {
                    //console.log(g_snakes[i].playerId +'`s player pressed RightKeyDown');
                    g_snakes[i].direction = 1;
                }
                break;
            }
        }
    });

    socket.on('playerDownKeyDown', function(object)
    {
       // console.log(object.playerId)
        for (var i = 0; i < g_snakes.length; i++)
        {
            if (object.playerId == g_snakes[i].playerId)
            {
                 // Down or S
                if (g_snakes[i].direction != 0)
                {
                   // console.log(g_snakes[i].playerId +'`s player pressed DownKeyDown');
                    g_snakes[i].direction = 2;
                }
                break;
            }
        }
    });

    socket.on('playerLeftKeyDown', function(object)
    {
        //console.log(object.playerId)
        for (var i = 0; i < g_snakes.length; i++)
        {
            if (object.playerId == g_snakes[i].playerId)
            {
                if (g_snakes[i].direction != 1)
                {
                    //console.log(g_snakes[i].playerId +'`s player pressed LeftKeyDown');
                    g_snakes[i].direction = 3;
                }

                break;
            }
       }
    });

    socket.on('playerAteApple', function(object)
    {
        console.log('ate!!!!!!!!!!!!!!!');
        for (var i = 0; i < g_snakes.length; i++)
        {
            if (object.playerId == g_snakes[i].playerId)
            {
                g_snakes[i].score++;
                //console.log('player with ' + g_snakes[i].playerId + ' ID ' + 'ate an apple ');
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

