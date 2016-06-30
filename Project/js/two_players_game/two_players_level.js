// Level properties
var Level = function (columns, rows, tilewidth, tileheight)
{
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
            } else
            {
                // Add empty space
                this.tiles[i][j] = 0;
            }
        }
    }
};   