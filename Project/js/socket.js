var  socket = null;

function initSocket()
{
    socket = io.connect(":3000");
    socket.emit('playerConnect');
    socket.on('playerConnect', function(id)
    {
        if (playerId == null)
        {
            playerId = id;
            console.log('player id = ' + playerId);
        }
    });

    socket.on('createXYapple', function(object)
    {
        level.tiles[object.x][object.y] = 2;
        //console.log(object.x + ', ' +  object.y );
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
                console.log('playerUpKeyDown');
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
                console.log('playerRightKeyDown');
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
                console.log('playerDownKeyDown');
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
                console.log('playerLeftKeyDown');
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
                addBombToPlayerPos(snakes[i], object.state);
                break;
            }
        }
    });
}
