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
    
        // Add mouse events
       // canvas.addEventListener("mousedown", onMouseDown);
        
        // Add keyboard events
        document.addEventListener("keydown", onKeyDown);        
        
        
        // New game
        newGame();
       // snake.changeGameover(true);
       gameover = true;
        
        // Enter main loop
        main(0);
    }
    
        var level = new Level(30, 19, 32, 32);
    
    // Variables
    var score = 0;              // Score
    //   var scoreEnemy = 0;
    //var snakes[playerId].gameover = true;        // Game is over
    var gameover = true
    var gameovertime = 1;       // How long we have been game over
    var gameoverdelay = 3;    // Waiting time after game over
    
    
    
    // Check if we can start a new game
    function tryNewGame() {
        if (gameovertime > gameoverdelay) 
        {
            newGame();
           // snakes[playerId].changeGameover(false);
            gameover = false;
            if (firststartgame)
            {
                firststartgame = false;
            }
        }
    }
    
    function getStartPlayerXY(playerId)
    {
        if (playerId == 0)
        {
            snakes[playerId].init(5, 10, 1, 10, 4);
        } else if (playerId == 1)
        {
            
            snakes[playerId].init(24, 10, 3, 10, 4);   
        }
    }

    function newGame()
    {
        // Initialize the snake
//        snakes[playerId].init(5, 10, 1, 10, 4);        
//        snakeEnemy.init(24, 10, 3, 10, 4);             
        getStartPlayerXY(playerId);        
       
        level.generate();
        if (playerId  == 0)
        {
            // Generate the default level
            
            
            // Add an apple
            addApple();
        }        
        
        // Initialize the score
        snakes[playerId].score = 0;       
        
        // Initialize variables
        //snakes[playerId].change(false);
        gameover = false;
    }

    // Add an apple to the level at an empty position
    function addApple()
    {            
        socket.emit('createXYapple', snakes, level);
       // appleCount++;
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
        if (snakes[playerId].tryMove(dt))//|| snakeEnemy.tryMove(dt))
        {
            // Check snake collisions
            
            // Get the coordinates of the next move
            var nextmove = snakes[playerId].nextMove();
            var nx = nextmove.x;
            var ny = nextmove.y;
            
            if ((nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows))//&& (nxEnemy >= 0 && nxEnemy < level.columns && nyEnemy >= 0 && nyEnemy < level.rows))
            {
                if ((level.tiles[nx][ny] == 1))// || (level.tiles[nxEnemy][nyEnemy] == 1))
                {
                    // Collision with a wall
                    //snakes[playerId].changeGameover(true);
                    gameover = true;
                    socket.emit('sendGameover', gameover);
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
                        
                        if ((nx == sx && ny == sy))// || (nxEnemy == sx && nyEnemy == sy))
                        {
                            // Found a snake part
                           // snakes[playerId].changeGameover(true);
                            gameover = true;
                            socket.emit('sendGameover', gameover);
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
                    snakes[playerId].move();
                    //snakeEnemy.move();
                    // Check collision with an apple
                    if (level.tiles[nx][ny] == 2)
                    {
                        // Remove the apple                        
                        socket.emit('deleteXYapple', level, nx, ny);
                        
                        // Add a new apple                        
                        addApple();                          
                        
                        // Grow the snake
                        snakes[playerId].grow();
                        
                        // Add a point to the score
                        snakes[playerId].growScore;
                        
                  //  socket.emit('playerAteApple', {playerId: snakes[playerId].playerId, growscore: snakes[playerId].growscore});
                    } 
//                    else if (level.tiles[nxEnemy][nyEnemy] == 2)
//                    {
//                        // Remove the apple
//                        level.tiles[nxEnemy][nyEnemy] = 0;
//                        
//                        // Add a new apple
//                        if ((playerId % 2) == 0)
//                        {
//                            addApple();
//                        }  
//                        
//                        // Grow the snake
//                        snakeEnemy.grow();
//                        
//                        // Add a point to the score
//                       // scoreEnemy++;
//                    }  
                    

                }
            } else
            {
                // Out of bounds
                //snakes[playerId].changeGameover(true);
                gameover = true;
                socket.emit('sendGameover', gameover);
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
    
    // Render the game
    function render() 
    {       
        drawLevel();
        drawSnakes();
        drawScore(snake.score);        
        //Game over
        if (gameover)
        {            
            context.fillStyle = "rgba(0, 0, 0, 0.5)";
            context.fillRect(0, 0, canvas.width, canvas.height);
            
//            if (firststartgame)
//            {
//                context.fillStyle = "#fff";
//                context.font = "40px Lasco-Bold";
//                drawCenterText("Press any key", 0, canvas.height/2, canvas.width);
//                drawCenterText("When you are ready to start", 0, canvas.height/1.7, canvas.width);
//            } else
//            {            
                context.fillStyle = backgroundColor;
                context.fillStyle = "#E8000C";
                context.font = "45px Lasco-Bold";  
                changeTimer();
                timerToStartNewGame = Math.floor(g_timerToStartAfterDeath / 1000);
                drawCenterText("Game starts in " + timerToStartNewGame, 0, canvas.height/4, canvas.width);
                context.fillStyle = "#00F";
                drawCenterText("SCORE: " + snakes[playerId].score, 0, 2*canvas.height/4, canvas.width);
                context.fillStyle = "#fff";
                context.font = "24px Lasco-Bold";
                drawCenterText("Press any key to start!", 0, 3 * canvas.height/4, canvas.width);
                if (timerToStartNewGame == 0)
                {
                    socket.emit("startNewGame", timerToStartNewGame);
                }                    
                //sendScoreAfterDeath(score);              
           // }            
        }
    }
    
    function changeTimer()
    {
        if (g_timerToStartAfterDeath > 0)
        {
            g_timerToStartAfterDeath = g_timerToStartAfterDeath - 10;
        }       
    }    
    
    // Mouse event handlers
//    function onMouseDown(e)
//    {
//        // Get the mouse position
//        var pos = getMousePos(canvas, e);
//        
//        if ((gameover) && (g_timerToStartAfterDeath == 0))
//        {
//            // Start a new game
//            tryNewGame();
//        } 
//    }
    
    
    function CHEATScoreAndLeght(e)
    {
        if (e.keyCode == 16) 
        {
            snakes[playerId].grow();
            snakes[playerId].growScore();
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
                if (snakes[playerId].direction != 1)
                {
                    //snakes[playerId].direction = 3;
                    //console.log(playerId);
                    socket.emit('playerLeftKeyDown', {playerId: snakes[playerId].playerId, direction: snakes[playerId].direction});
                }
            } else if (e.keyCode == 38 || e.keyCode == 87)
            {
                // Up or W
                if (snakes[playerId].direction != 2)  
                {
                   // snakes[playerId].direction = 0;
                    socket.emit('playerUpKeyDown', {playerId: snakes[playerId].playerId, direction: snakes[playerId].direction});
                }
            } else if (e.keyCode == 39 || e.keyCode == 68)
            {
                // Right or D
                if (snakes[playerId].direction != 3)  
                {
                  //  snakes[playerId].direction = 1;
                    socket.emit('playerRightKeyDown', {playerId: snakes[playerId].playerId, direction: snakes[playerId].direction});
                }
            } else if (e.keyCode == 40 || e.keyCode == 83)
            {
                // Down or S
                if (snakes[playerId].direction != 0)  
                {
                   // snakes[playerId].direction = 2;
                    socket.emit('playerDownKeyDown', {playerId: snakes[playerId].playerId, direction: snakes[playerId].direction});
                }
            }
            // Grow for demonstration purposes *****CHEATS!!!!*****
            CHEATScoreAndLeght(e);
        }
    }       
        
    // Get the mouse position
//    function getMousePos(canvas, e)
//    {
//        var rect = canvas.getBoundingClientRect();
//        return
//        {
//            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
//            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
//        };
//    }
    
// Call init to start the game

//window.onload = function() {}


   
//setTimeout(tryStartGame, 2000);
initSocket();
setTimeout(init, 2000);

//init();