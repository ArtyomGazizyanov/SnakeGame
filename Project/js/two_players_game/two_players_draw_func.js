function drawScore(scoreFrstplayer, scoreScndplayer)
{
    context.fillStyle = backgroundColor;
    context.font = "24px Lasco-Bold";
    context.fillStyle = "#00F";
    context.fillText("SCORE: " + scoreFrstplayer, 35, 50);
    context.fillText("SCORE: " + scoreScndplayer, 790, 50);
}

function drawSnakes()
{
    for(var i = 0; i < g_snakes.length; i++)
    {
        drawSnake(g_snakes[i]);
    }
}

// Draw the level tiles
function drawLevel()
{
    for (var i=0; i<level.columns; i++)
    {
        for (var j=0; j<level.rows; j++) 
        {
            // Get the current tile and location
            var tile = level.tiles[i][j];
            var tilex = i*level.tilewidth;
            var tiley = j*level.tileheight;
            
            // Draw tiles based on their type
            if (tile == 0)
            {
                // Empty space
                context.fillStyle = backgroundColor;
                context.fillRect(tilex, tiley, level.tilewidth, level.tileheight);
            } else if (tile == 1)              
            {
              // Wall
                context.fillStyle = backgroundColorWall;
                context.fillRect(tilex, tiley, level.tilewidth, level.tileheight);
            } else if (tile == 2) 
            {
                // Draw apple background
                context.fillStyle = backgroundColor;
                context.fillRect(tilex, tiley,   level.tilewidth, level.tileheight);
              
                // Draw the apple image
                var tx = 0;
                var ty = 3;
                var tilew = 64;
                var tileh = 64;
                context.drawImage(tileimage, tx*tilew,   ty*tileh, tilew, tileh, tilex, tiley,  level.tilewidth, level.tileheight);
            }
        }
    }
}

// Draw the snake
function drawSnake(snake) 
{
    // Loop over every g_snakes[playerId] segment
    for (var i=0; i< snake.segments.length; i++)
    {
        var segment = snake.segments[i];
        var segx = segment.x;
        var segy = segment.y;
        var tilex = segx*level.tilewidth;
        var tiley = segy*level.tileheight;
        
        // Sprite column and row that gets calculated
        var tx = 0;
        var ty = 0;
        
        if (i == 0)
        {
            // Head; Determine the correct image
            var nseg = snake.segments[i+1]; // Next segment
            if (segy < nseg.y)
            {
                // Up
                tx = 3; ty = 0;
            } else if (segx > nseg.x)
            {
                // Right
                tx = 4; ty = 0;
            } else if (segy > nseg.y)
            {
                // Down
                tx = 4; ty = 1;
            } else if (segx < nseg.x)
            {
                // Left
                tx = 3; ty = 1;
            }
        } else if (i == snake.segments.length-1)
        {
            // Tail; Determine the correct image
            var pseg = snake.segments[i-1]; // Prev segment
            if (pseg.y < segy) 
            {
                // Up
                tx = 3; ty = 2;
            } else if (pseg.x > segx) 
            {
                // Right
                tx = 4; ty = 2;
            } else if (pseg.y > segy) 
            {
                // Down
                tx = 4; ty = 3;
            } else if (pseg.x < segx)
            {
                // Left
                tx = 3; ty = 3;
            }
        } else 
        {
            // Body; Determine the correct image
            var pseg = snake.segments[i-1]; // Previous segment
            var nseg = snake.segments[i+1]; // Next segment
            if (pseg.x < segx && nseg.x > segx || nseg.x < segx && pseg.x > segx)
            {
                // Horizontal Left-Right
                tx = 1;
                ty = 0;
            } else if (pseg.x < segx && nseg.y > segy || nseg.x < segx && pseg.y > segy) 
            {
                // Angle Left-Down
                tx = 2;
                ty = 0;
            } else if (pseg.y < segy && nseg.y > segy || nseg.y < segy && pseg.y > segy) 
            {
                // Vertical Up-Down
                tx = 2;
                ty = 1;
            } else if (pseg.y < segy && nseg.x < segx || nseg.y < segy && pseg.x < segx)
            {
                // Angle Top-Left
                tx = 2;
                ty = 2;
            } else if (pseg.x > segx && nseg.y < segy || nseg.x > segx && pseg.y < segy)
            {
                // Angle Right-Up
                tx = 0; 
                ty = 1;
            } else if (pseg.y > segy && nseg.x > segx || nseg.y > segy && pseg.x > segx)
            {
                // Angle Down-Right
                tx = 0; 
                ty = 0;
            }
        }
        // Draw the image of the g_snakes[playerId] part
        context.drawImage(tileimage, tx*64, ty*64, 64, 64, tilex, tiley, level.tilewidth, level.tileheight);
    }
}    
    
    // Draw text that is centered
function drawCenterText(text, x, y, width)
{
    var textdim = context.measureText(text);
    context.fillText(text, x + (width-textdim.width)/2, y);
}
