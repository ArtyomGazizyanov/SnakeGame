
    // Get the canvas and context
    var canvas = document.getElementById("canvas"); 
    var context = canvas.getContext("2d");
        
    context.font = '68px Lasco-Boldr';
        
    // Timing and frames per second
    var lastframe = 0;
    var fpstime = 0;
    var framecount = 0;
    var fps = 0;
    var backgroundColor = "#fff"
    var backgroundColorWall = "#000"
    var firststartgame = true;
    var initialized = false;
    var snakes = []; 
    // Images
    var images = [];
    var tileimage;
    
    // Image loading global variables
    var loadcount = 0;
    var loadtotal = 0;
    var preloaded = false;
    
    // Load images
    function loadImages(imagefiles) 
    {
        // Initialize variables
        loadcount = 0;
        loadtotal = imagefiles.length;
        preloaded = false;
        
        // Load the images
        var loadedimages = [];
        for (var i=0; i<imagefiles.length; i++)
        {
            // Create the image object
            var image = new Image();
            
            // Add onload event handler
            image.onload = function ()
            {
                loadcount++;
                if (loadcount == loadtotal)
                {
                    // Done loading
                    preloaded = true;
                }
            };
            
            // Set the source url of the image
            image.src = imagefiles[i];
            
            // Save to the image array
            loadedimages[i] = image;
        }
        
        // Return an array of images
        return loadedimages;
    }
    
    // Level properties
    var Level = function (columns, rows, tilewidth, tileheight) {
        this.columns = columns;
        this.rows = rows;
        this.tilewidth = tilewidth;
        this.tileheight = tileheight;
        
        // Initialize tiles array
        this.tiles = [];
        for (var i=0; i<this.columns; i++)
        {
            this.tiles[i] = [];
            for (var j=0; j<this.rows; j++)
            {
                this.tiles[i][j] = 0;
            }
        }
    };
    
    // Generate a default level with walls
    Level.prototype.generate = function() 
    {
        for (var i=0; i<this.columns; i++) 
        {
            for (var j=0; j<this.rows; j++)
            {
                if (i == 0 || i == this.columns-1 ||
                    j == 0 || j == this.rows-1)
                {
                    // Add walls at the edges of the level
                    this.tiles[i][j] = 1;
                } else {
                    // Add empty space
                    this.tiles[i][j] = 0;
                }
            }
        }
    };
    
    
    // Snake
    var Snake = function() 
    {
        this.init(0, 0, 1, 10, 1);
    }
    
    // Snake
    var SnakeEnemy = function() 
    {
        this.init(0, 0, 1, 10, 1);
    }
    
    // Direction table: Up, Right, Down, Left
    Snake.prototype.directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    SnakeEnemy.prototype.directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    
    // Initialize the snake at a location
    Snake.prototype.init = function(x, y, direction, speed, numsegments) 
    {
        this.x = x;
        this.y = y;
        this.direction = direction; // Up, Right, Down, Left
        this.speed = speed;         // Movement speed in blocks per second
        this.movedelay = 0;
        
        // Reset the segments and add new ones
        this.segments = [];
        this.growsegments = 0;
        for (var i=0; i<numsegments; i++) 
        {
            this.segments.push({x:this.x - i*this.directions[direction][0],
                                y:this.y - i*this.directions[direction][1]});
        }
    }
    SnakeEnemy.prototype.init = function(x, y, direction, speed, numsegments) 
    {
        this.x = x;
        this.y = y;
        this.direction = direction; // Up, Right, Down, Left
        this.speed = speed;         // Movement speed in blocks per second
        this.movedelay = 0;
        
        // Reset the segments and add new ones
        this.segments = [];
        this.growsegments = 0;
        for (var i=0; i<numsegments; i++) 
        {
            this.segments.push({x:this.x - i*this.directions[direction][0],
                                y:this.y - i*this.directions[direction][1]});
        }
    }
    
    // Increase the segment count
    Snake.prototype.grow = function() 
    {
        this.growsegments++;
    };
    SnakeEnemy.prototype.grow = function() 
    {
        this.growsegments++;
    };
    
    // Check we are allowed to move
    Snake.prototype.tryMove = function(dt) 
    {
        this.movedelay += dt;
        var maxmovedelay = 1 / this.speed;
        if (this.movedelay > maxmovedelay) 
        {
            return true;
        }
        return false;
    };
        
    SnakeEnemy.prototype.tryMove = function(dt) 
    {
        this.movedelay += dt;
        var maxmovedelay = 1 / this.speed;
        if (this.movedelay > maxmovedelay) 
        {
            return true;
        }
        return false;
    };
    
    // Get the position of the next move
    Snake.prototype.nextMove = function() 
    {
        var nextx = this.x + this.directions[this.direction][0];
        var nexty = this.y + this.directions[this.direction][1];
        return {x:nextx, y:nexty};
    }
    SnakeEnemy.prototype.nextMove = function() 
    {
        var nextx = this.x + this.directions[this.direction][0];
        var nexty = this.y + this.directions[this.direction][1];
        return {x:nextx, y:nexty};
    }
    
    // Move the snake in the direction
    Snake.prototype.move = function()
    {
        // Get the next move and modify the position
        var nextmove = this.nextMove();
        this.x = nextmove.x;
        this.y = nextmove.y;
    
        // Get the position of the last segment
        var lastseg = this.segments[this.segments.length-1];
        var growx = lastseg.x;
        var growy = lastseg.y;
    
        // Move segments to the position of the previous segment
        for (var i=this.segments.length-1; i>=1; i--) 
        {
            this.segments[i].x = this.segments[i-1].x;
            this.segments[i].y = this.segments[i-1].y;
        }
        
        // Grow a segment if needed
        if (this.growsegments > 0) 
        {
            this.segments.push({x:growx, y:growy});
            this.growsegments--;
        }
        
        // Move the first segment
        this.segments[0].x = this.x;
        this.segments[0].y = this.y;
        
        // Reset movedelay
        this.movedelay = 0;
    }
    SnakeEnemy.prototype.move = function()
    {
        // Get the next move and modify the position
        var nextmove = this.nextMove();
        this.x = nextmove.x;
        this.y = nextmove.y;
    
        // Get the position of the last segment
        var lastseg = this.segments[this.segments.length-1];
        var growx = lastseg.x;
        var growy = lastseg.y;
    
        // Move segments to the position of the previous segment
        for (var i=this.segments.length-1; i>=1; i--) 
        {
            this.segments[i].x = this.segments[i-1].x;
            this.segments[i].y = this.segments[i-1].y;
        }
        
        // Grow a segment if needed
        if (this.growsegments > 0) 
        {
            this.segments.push({x:growx, y:growy});
            this.growsegments--;
        }
        
        // Move the first segment
        this.segments[0].x = this.x;
        this.segments[0].y = this.y;
        
        // Reset movedelay
        this.movedelay = 0;
    }
    // Create objects
    var snake = new Snake();
    var snakeEnemy = new Snake();
    snakes.push(snake, snakeEnemy);
    var level = new Level(30, 19, 32, 32);
    
    // Variables
    var score = 0;              // Score
    var scoreEnemy = 0;
    var gameover = true;        // Game is over
    var gameovertime = 1;       // How long we have been game over
    var gameoverdelay = 0.5;    // Waiting time after game over
    
    // Initialize the game
    function init()
    {
        //sockets are ready
        initSocket();
        
        // Load images
        images = loadImages(["img/snake-graphics.png"]);
        tileimage = images[0];
    
        // Add mouse events
        canvas.addEventListener("mousedown", onMouseDown);
        
        // Add keyboard events
        document.addEventListener("keydown", onKeyDown);        
        
        
        // New game
        newGame();
        gameover = true;
    
        // Enter main loop
        main(0);
    }
    
    // Check if we can start a new game
    function tryNewGame() {
        if (gameovertime > gameoverdelay) 
        {
            newGame();
            gameover = false;
            if (firststartgame)
            {
                firststartgame = false;
            }
        }
    }
    
    function newGame()
    {
        // Initialize the snake
        snake.init(5, 10, 1, 10, 4);
        snakeEnemy.init(24, 10, 3, 10, 4);
        
        // Generate the default level
        level.generate();
        
        // Add an apple
        addApple();
        
        // Initialize the score
        score = 0;
        
        // Initialize variables
        gameover = false;
    }
    
    // Add an apple to the level at an empty position
    function addApple()
    {
        
        socket.emit('createXYapple', snakes, level);
    }
        
    function sendScoreAfterDeath(score)
    {
        $.ajax(
        {
            url: "web/one_player.php?score=" + score + "",          
            success: function(data){/*console.log(data);*/}
        });
        //console.log(score);
    }
        
    function renewScoreAndLeaderPosition(score)
    {
        $("#userBestScore").empty();
        $.ajax(
        {
            url: "web/get_best_score_curr_player.php",    
            success: function(data){$("#userBestScore").append(data);}
        });
        $("#leaderTable").empty();
        $.ajax(
        {
            url: "web/rewrite_one_player_leaderboard.php",    
            success: function(data){$("#leaderTable").append(data);}
        });
    }
    
    // Main loop
    function main(tframe) 
    {
        // Request animation frames
        window.requestAnimationFrame(main);
        
        if (!initialized) 
        {          
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw a progress bar
            var loadpercentage = loadcount/loadtotal;
            context.strokeStyle = "#ff8080";
            context.lineWidth=3;
            context.strokeRect(18.5, 0.5 + canvas.height - 51, canvas.width-37, 32);
            context.fillStyle = "#ff8080";
            context.fillRect(18.5, 0.5 + canvas.height - 51, loadpercentage*(canvas.width-37), 32);
            
            // Draw the progress text
            var loadtext = "Loaded " + loadcount + "/" + loadtotal + " images";
            context.fillStyle = "#000000";
            context.font = "16px Verdana";
            context.fillText(loadtext, 18, 0.5 + canvas.height - 63);
            
            if (preloaded)
            {
                initialized = true;
            }
        } else 
        {
            // Update and render the game
            update(tframe);
            render();
        }
    }
    
    // Update the game state
    function update(tframe) 
    {
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;
        
        // Update the fps counter
        updateFps(dt);
        
        if (!gameover)
        {
            updateGame(dt);
        } else 
        {
            gameovertime += dt;
        }
    }
    
    function updateGame(dt)
    {
        // Move the snake
        if (snake.tryMove(dt) || snakeEnemy.tryMove(dt) )
        {
            // Check snake collisions
            
            // Get the coordinates of the next move
            var nextmove = snake.nextMove();
            var nx = nextmove.x;
            var ny = nextmove.y;
            
            var nextmoveEnemy = snakeEnemy.nextMove();
            var nxEnemy = nextmoveEnemy.x;
            var nyEnemy = nextmoveEnemy.y;
            
            if ((nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) && (nxEnemy >= 0 && nxEnemy < level.columns && nyEnemy >= 0 && nyEnemy < level.rows))
            {
                if ((level.tiles[nx][ny] == 1) || (level.tiles[nxEnemy][nyEnemy] == 1))
                {
                    // Collision with a wall
                    gameover = true;
                   // sendScoreAfterDeath(score);
                   // renewScoreAndLeaderPosition(score);
                }
                
                // Collisions with the snake itself
                for (var j = 0; j < snakes.length; j++)
                {
                    for (var i=0; i < snakes[j].segments.length; i++)
                    {   
                        var sx = snakes[j].segments[i].x;
                        var sy = snakes[j].segments[i].y;
                        
                        if ((nx == sx && ny == sy) || (nxEnemy == sx && nyEnemy == sy))
                        {
                            // Found a snake part
                            gameover = true;
                        //   sendScoreAfterDeath(score);
                        //   renewScoreAndLeaderPosition(score);
                            break;
                        }
                    }
                }
                
                if (!gameover) 
                {
                    // The snake is allowed to move

                    // Move the snake
                    snake.move();
                    snakeEnemy.move();
                    // Check collision with an apple
                    if (level.tiles[nx][ny] == 2)
                    {
                        // Remove the apple
                        level.tiles[nx][ny] = 0;
                        
                        // Add a new apple
                        addApple();
                        
                        // Grow the snake
                        snake.grow();
                        
                        // Add a point to the score
                        score++;
                    } else if (level.tiles[nxEnemy][nyEnemy] == 2)
                    {
                        // Remove the apple
                        level.tiles[nxEnemy][nyEnemy] = 0;
                        
                        // Add a new apple
                        addApple();
                        
                        // Grow the snake
                        snakeEnemy.grow();
                        
                        // Add a point to the score
                        scoreEnemy++;
                    }  
                    

                }
            } else
            {
                // Out of bounds
                gameover = true;
                //sendScoreAfterDeath(score);
                //renewScoreAndLeaderPosition(score);
            }
            
            if (gameover) 
            {
                gameovertime = 0;
            }
        }
    }
    
    function updateFps(dt)
    {
        if (fpstime > 0.25)
        {
            // Calculate fps
            fps = Math.round(framecount / fpstime);
            
            // Reset time and framecount
            fpstime = 0;
            framecount = 0;
        }
        
        // Increase time and framecount
        fpstime += dt;
        framecount++;
    }
    
    function drawScore(score)
    {
        context.fillStyle = backgroundColor;
        context.font = "24px Lasco-Bold";
        context.fillStyle = "#00F";
        context.fillText("SCORE: " + score, 35, 50);
    }

    function drawSnakes()
    {
        for(var i = 0; i < snakes.length; i++)
        {
            drawSnake(snakes[i]);
        }
    }
    
    
    // Render the game
    function render() 
    {
        
        
        drawLevel();
        drawSnakes();
        drawScore(score);        
        
        //Game over
        if (gameover)
        {            
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            if (firststartgame)
            {
                context.fillStyle = "#fff";
                context.font = "40px Lasco-Bold";
                drawCenterText("Press any key", 0, canvas.height/2, canvas.width);
                drawCenterText("When you are ready to start", 0, canvas.height/1.7, canvas.width);
            } else
            {            
                context.fillStyle = backgroundColor;
                context.fillStyle = "#E8000C";
                context.font = "45px Lasco-Bold";
                drawCenterText("Sorry you died", 0,     canvas.height/4, canvas.width);
                context.fillStyle = "#00F";
                drawCenterText("SCORE: " + score, 0,    2*canvas.height/4, canvas.width);
                context.fillStyle = "#fff";
                context.font = "24px Lasco-Bold";
                drawCenterText("Press any key to start!", 0,    3*canvas.height/4, canvas.width);
                //sendScoreAfterDeath(score);              
            }            
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
        // Loop over every snake segment
        for (var i=0; i<snake.segments.length; i++)
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
                if (pseg.y < segy) {
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
            // Draw the image of the snake part
            context.drawImage(tileimage, tx*64, ty*64, 64, 64, tilex, tiley, level.tilewidth, level.tileheight);
        }
    }
    function drawSnakeEnemy() 
    {
        // Loop over every snake segment
        for (var i=0; i< snakeEnemy.segments.length; i++)
        {
            var segment = snakeEnemy.segments[i];
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
                var nseg = snakeEnemy.segments[i+1]; // Next segment
                if (segy < nseg.y)
                {
                    // Up
                    tx = 3; 
                    ty = 0;
                } else if (segx > nseg.x)
                {
                    // Right
                    tx = 4; 
                    ty = 0;
                } else if (segy > nseg.y)
                {
                    // Down
                    tx = 4; 
                    ty = 1;
                } else if (segx < nseg.x)
                {
                    // Left
                    tx = 3;
                    ty = 1;
                }
            } else if (i == snakeEnemy.segments.length-1)
              {
                // Tail; Determine the correct image
                var pseg = snakeEnemy.segments[i-1]; // Prev segment
                if (pseg.y < segy) {
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
            } else {
                // Body; Determine the correct image
                var pseg = snakeEnemy.segments[i-1]; // Previous segment
                var nseg = snakeEnemy.segments[i+1]; // Next segment
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
            
            // Draw the image of the snake part
            context.drawImage(tileimage, tx*64, ty*64, 64, 64, tilex, tiley,
                              level.tilewidth, level.tileheight);
        }
    }
    
    // Draw text that is centered
    function drawCenterText(text, x, y, width)
    {
        var textdim = context.measureText(text);
        context.fillText(text, x + (width-textdim.width)/2, y);
    }
    
    
    
    // Mouse event handlers
    function onMouseDown(e) {
        // Get the mouse position
        var pos = getMousePos(canvas, e);
        
        if (gameover)
        {
            // Start a new game
            tryNewGame();
        } 
    }
    
    
    function CHEATScoreAndLeght(e)
    {
        if (e.keyCode == 16) 
        {
            snake.grow();
            score++;
        }   
    }
    
    // Keyboard event handler
    function onKeyDown(e) 
    {
        if (gameover) 
        {
            tryNewGame();
        } else 
        {
            if (e.keyCode == 37 || e.keyCode == 65) 
            {
                // Left or A
                if (snakes[playerId].direction != 1)
                {
                    snakes[playerId].direction = 3;
                    console.log(playerId);
                    socket.emit('playerLeftKeyDown', {playerId: snakes[playerId].playerId, direction: snakes[playerId].direction});
                }
            } else if (e.keyCode == 38 || e.keyCode == 87)
            {
                // Up or W
                if (snakes[playerId].direction != 2)  
                {
                    snakes[playerId].direction = 0;
                    socket.emit('playerUpKeyDown', {playerId: snakes[playerId].playerId, direction: snakes[playerId].direction});
                }
            } else if (e.keyCode == 39 || e.keyCode == 68)
            {
                // Right or D
                if (snakes[playerId].direction != 3)  
                {
                    snakes[playerId].direction = 1;
                    socket.emit('playerRightKeyDown', {playerId: snakes[playerId].playerId, direction: snakes[playerId].direction});
                }
            } else if (e.keyCode == 40 || e.keyCode == 83)
            {
                // Down or S
                if (snakes[playerId].direction != 0)  
                {
                    snakes[playerId].direction = 2;
                    socket.emit('playerDownKeyDown', {playerId: snakes[playerId].playerId, direction: snakes[playerId].direction});
                }
            }
//            if (e.keyCode == 75) 
//            {
//                // Left or A
//                if (snakeEnemy.direction != 1)
//                {
//                    snakeEnemy.direction = 3;
//                }
//            } else if (e.keyCode == 79)
//            {
//                // Up or W
//                if (snakeEnemy.direction != 2)  
//                {
//                    snakeEnemy.direction = 0;
//                }
//            } else if (e.keyCode == 186)
//            {
//                // Right or D
//                if (snakeEnemy.direction != 3)  
//                {
//                    snakeEnemy.direction = 1;
//                }
//            } else if (e.keyCode == 76)
//            {
//                // Down or S
//                if (snakeEnemy.direction != 0)  
//                {
//                    snakeEnemy.direction = 2;
//                }
//            }
            
            // Grow for demonstration purposes *****CHEATS!!!!*****
            CHEATScoreAndLeght(e);
        }
    }
       
        
    // Get the mouse position
    function getMousePos(canvas, e)
    {
        var rect = canvas.getBoundingClientRect();
        return{
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }
    
    // Call init to start the game
       init();
