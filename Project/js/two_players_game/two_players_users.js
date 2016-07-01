var snakes = []; 

// Snake
var Snake = function() 
{
    this.init(0, 0, 1, 10, 1);
}

// Direction table: Up, Right, Down, Left
Snake.prototype.directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

// Initialize the snake at a location
Snake.prototype.init = function(x, y, direction, speed, numsegments, id)
{
    this.x = x;
    this.y = y;
    this.direction = direction; // Up, Right, Down, Left
    this.speed = speed;         // Movement speed in blocks per second
    this.movedelay = 0;
    this.playerId = id;
    //init gameover
    this.gameover = true;
        
    //init score
    this.score = 0;        
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

Snake.prototype.growScore = function() 
{
    this.score++;
};

Snake.prototype.changeGameover = function(value)
{
    this.gameover = value;
}
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
    // Get the position of the next move
Snake.prototype.nextMove = function() 
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


//alert('snakeCreated lenght = ', snakes.length);
