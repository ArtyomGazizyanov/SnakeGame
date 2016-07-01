    function tryStartGame()
    {
        while(!gameStarted)
        {
            if (playerId > 0 && playerId == 0)
            {
                
                gameStarted = true;
            }
        }
    }
    function init()
    {
        //sockets are ready
        
        console.log('game has player id ' + window.playerId);
        // Load images
        images = loadImages(["img/snake-graphics.png"]);
        tileimage = images[0];
    
        // Add keyboard events
        document.addEventListener("keydown", onKeyDown);        
        
        g_snakes.push(new Snake());
        g_snakes.push(new Snake());

        // New game
        newGame();     
        gameover = true;
        // Enter main loop
        main(0);
    }    
    var level = new Level(30, 19, 32, 32);
    
//    // Variables
//    var score = 0;              // Score
//    var gameover = true
//    var gameovertime = 1;       // How long we have been game over
//    var gameoverdelay = 3;    // Waiting time after game over   
    
    // Check if we can start a new game
    function tryNewGame() {
        if (gameovertime > gameoverdelay) 
        {
            newGame();
           // g_snakes[playerId].changeGameover(false);
            gameover = false;
            if (firststartgame)
            {
                firststartgame = false;
            }
        }
    }
    
    function setStartPlayerXY(playerId)
    {
        for(var i = 0; i < g_snakes.length; i++)
        {
            if (i == 0)
        {
            g_snakes[i].init(5, 10, 1, 10, 4, i);
        } else if (i == 1)
        {
            g_snakes[i].init(24, 10, 3, 10, 4, i);
        }
        }

    }

    function newGame()
    {
        // Initialize the snake

        setStartPlayerXY(playerId);
        // Generate the default level
        level.generate();

        if (playerId  == 0)
        {
            // Add an apple
            addApple();
        }        
        // Initialize the score
        g_snakes[playerId].score = 0;        
        // Initialize variables
        gameover = false;
    }

    // Add an apple to the level at an empty position
    function addApple()
    {            
        socket.emit('createXYapple', g_snakes, level);
    }
        
    function sendScoreAfterDeath(score)
    {
        $.ajax(
        {
            url: "web/one_player.php?score=" + score + "",          
            success: function(data){/*console.log(data);*/}
        });
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
        for(var k = 0; k < g_snakes.length; k++)
        // Move the snake
        if (g_snakes[k].tryMove(dt))
        {
            // Get the coordinates of the next move
            var nextmove = g_snakes[k].nextMove();
            var nx = nextmove.x;
            var ny = nextmove.y;
            
            if ((nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows))
            {
                if ((level.tiles[nx][ny] == 1))
                {
                    // Collision with a wall
                    gameover = true;
                    socket.emit('sendGameover', gameover);
                }                
                // Collisions with the snake itself
                for (var j = 0; j < g_snakes.length; j++)
                {
                    for (var i=0; i < g_snakes[j].segments.length; i++)
                    {   
                        var sx = g_snakes[j].segments[i].x;
                        var sy = g_snakes[j].segments[i].y;
                        
                        if ((nx == sx && ny == sy))
                        {
                            // Found a snake part
                            gameover = true;
                            socket.emit('sendGameover', gameover);
                            break;                        
                        }
                    }
                }    
                
                if (!gameover) 
                {
                    // Move the snake
                    g_snakes[k].move();
                    // Check collision with an apple
                    if (level.tiles[nx][ny] == 2)
                    {
                      //  console.log(g_snakes[k].playerId + ' - before if');
                        if (g_snakes[k].playerId == playerId)
                        {
                            // Remove the apple                        
                            socket.emit('deleteXYapple', level, nx, ny);
                        
                            // Add a new apple                        
                            addApple();
                        ///    console.log(g_snakes[k].playerId + ' - in if');
                        }
                        //console.log(g_snakes[k].playerId + ' - fater if');
                        // Grow the snake
                        g_snakes[k].grow();
                        //console.log(g_snakes[k].playerId + ' - after grow');
                        // Add a point to the score       
                        
                        socket.emit('playerAteApple', {playerId: k, score: g_snakes[k].score});
                        //console.log(k + ' id has '  + g_snakes[k].score + ' score');
                    } 
                }
            } else
            {
                // Out of bounds
                gameover = true;
                socket.emit('sendGameover', gameover);
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
    
    // Render the game
    function render() 
    {       
        drawLevel();
        drawSnakes();
        drawScore(g_snakes[0].score, g_snakes[1].score);
        //Game over
        if (gameover)
        {            
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fillRect(0, 0, canvas.width, canvas.height);         
            context.fillStyle = backgroundColor;
            context.fillStyle = "#E8000C";
            context.font = "47px Lasco-Bold";  
            changeTimer();
            timerToStartNewGame = Math.floor(g_timerToStartAfterDeath / 1000);
            drawCenterText("Game starts in " + timerToStartNewGame, 0, canvas.height/4, canvas.width);
            context.font = "45px Lasco-Bold";  
            context.fillStyle = "#00F";
            drawCenterText("1`ST PLAYER SCORE: " + g_snakes[0].score, 0, 1.5*canvas.height/4, canvas.width);
            drawCenterText("2`ST PLAYER SCORE: " + g_snakes[1].score, 0, 2.5*canvas.height/4, canvas.width);
            context.fillStyle = "#fff";
            context.font = "24px Lasco-Bold";
            drawCenterText("Press any key to start!", 0, 3 * canvas.height/4, canvas.width);
            if (timerToStartNewGame == 0)
            {
                socket.emit("startNewGame", timerToStartNewGame);
            }                    
        }
    }
    
    function changeTimer()
    {
        if (g_timerToStartAfterDeath > 0)
        {
            g_timerToStartAfterDeath = g_timerToStartAfterDeath - 10;
        }       
    }      
    
    function CHEATScoreAndLeght(e)
    {
        if (e.keyCode == 16) 
        {
            g_snakes[playerId].grow();
        }   
    }
    
    // Keyboard event handler
    function onKeyDown(e) 
    {
        if ((gameover) && (g_timerToStartAfterDeath == 0))
        {
            tryNewGame();
        } else 
        {
            if (e.keyCode == 37 || e.keyCode == 65) 
            {
                // Left or A
                if (g_snakes[playerId].direction != 1)
                {
                    socket.emit('playerLeftKeyDown', {playerId: g_snakes[playerId].playerId, direction: g_snakes[playerId].direction});
                }
            } else if (e.keyCode == 38 || e.keyCode == 87)
            {
                // Up or W
                if (g_snakes[playerId].direction != 2)
                {
                    socket.emit('playerUpKeyDown', {playerId: g_snakes[playerId].playerId, direction: g_snakes[playerId].direction});
                }
            } else if (e.keyCode == 39 || e.keyCode == 68)
            {
                // Right or D
                if (g_snakes[playerId].direction != 3)
                {
                    socket.emit('playerRightKeyDown', {playerId: g_snakes[playerId].playerId, direction: g_snakes[playerId].direction});
                }
            } else if (e.keyCode == 40 || e.keyCode == 83)
            {
                // Down or S
                if (g_snakes[playerId].direction != 0)
                {
                    socket.emit('playerDownKeyDown', {playerId: g_snakes[playerId].playerId, direction: g_snakes[playerId].direction});
                }
            }
            // Grow for demonstration purposes *****CHEATS!!!!*****
            CHEATScoreAndLeght(e);
        }
    }       
        
//include sockets
initSocket();
