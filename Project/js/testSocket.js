var  = null;

function initSocket()
{
    socket = io.connect(":3000");
    socket.emit('playerConnect');
    socket.on('playerConnect', function(id)
    {
        if (playerId === null)
        {
            playerId = id;
            if (playerId === 0)
            {
                ocket.emit('sendMap', g_map);
            }
            else
            {
                socket.emit('getMap');
            }
        }
    });

    socket.on('playerUpKeyDown', function(object)
    {
        for (var i = 0; i < players.length; i++)
        {
            if (object.playerId == players[i].playerId)
            {
                players[i].upKeyDown = object.upKeyDown;
                break;
            }
        }
    });

    socket.on('playerRightKeyDown', function(object)
    {
        for (var i = 0; i < players.length; i++)
        {
            if (object.playerId == players[i].playerId)
            {
                players[i].rightKeyDown = object.rightKeyDown;
                break;
            }
        }
    });

    socket.on('playerDownKeyDown', function(object)
    {
        for (var i = 0; i < players.length; i++)
        {
            if (object.playerId == players[i].playerId)
            {
                players[i].downKeyDown = object.downKeyDown;
                break;
            }
        }
    });

    socket.on('playerLeftKeyDown', function(object)
    {
        for (var i = 0; i < players.length; i++)
        {
            if (object.playerId == players[i].playerId)
            {
                players[i].leftKeyDown = object.leftKeyDown;
                break;
            }
        }
    });

    socket.on('playerAteApple', function(object)
    {
        for (var i = 0; i < players.length; i++)
        {
            if (object.playerId == players[i].playerId)
            {
                addBombToPlayerPos(players[i], object.state);
                break;
            }
        }
    });
}