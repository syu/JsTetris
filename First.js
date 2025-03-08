console.log("Hi Me");

// ?import { Point } from './Point.js';
class Point
{
    x=0;
    y=0;
    constructor(x, y)
    {
        this.x=x;
        this.y=y;
    }

    add(other)
    {
        return new Point(this.x + other.x, this.y + other.y);
    }

    move(other)
    {
        this.x = this.x + other.x;
        this.y = this.y + other.y;
    }
    clone()
    {
        return new Point(this.x, this.y)
    }
}

class Shape
{
    constructor(datas, color)
    {
        this.datas = []
        for (let data of datas)
        {
            let dataCopy = [];
            for (let point of data)
                dataCopy.push(point.clone());
            this.datas.push(dataCopy);
        }
        this.dataIndex = 0;
        this.color = color;
    }

    move (direction)
    {
        for (let data of this.datas)
            for (let point of data)
                point.move(direction);
    }

    data()
    {
        return this.datas[this.dataIndex];
    }

    draw(ctx)
    {
        for (let point of this.data())
        {
            drawItem(ctx, point, this.color);
        }
    }

    clone()
    {
        let res = new Shape(this.datas, this.color);
        res.dataIndex = this.dataIndex;
        return res;
    }

    rotateLeft()
    {
        this.dataIndex++;
        if (this.dataIndex >= this.datas.length)
            this.dataIndex = 0;
    }

    rotateRight()
    {
        this.dataIndex--;
        if (this.dataIndex < 0)
            this.dataIndex = this.datas.length-1;
    }
}

const Shapes = [new Shape([[new Point(-1,0), new Point(0, 0), new Point(1, 0), new Point(2, 0)],
                           [new Point(0,-1), new Point(0, 0), new Point(0, 1), new Point(0, 2)]], "green"),
                new Shape([[new Point(0,0),  new Point(1, 0), new Point(0, 1), new Point(1, 1)]], "blue"),
                new Shape([[new Point(-1,0), new Point(0, 0), new Point(1, 0), new Point(1, 1)],
                           [new Point(0,-1), new Point(0, 0), new Point(0, 1), new Point(-1, 1)],
                           [new Point(-1,0), new Point(0, 0), new Point(1, 0), new Point(-1, -1)],
                           [new Point(0,-1), new Point(0, 0), new Point(0, 1), new Point(1, -1)]], "red"),
                new Shape([[new Point(-1,0), new Point(0, 0), new Point(0, 1), new Point(1, 1)],
                           [new Point(1,0), new Point(0, 1), new Point(1, 1), new Point(0, 2)]], "yellow")];
const BoardSize = new Point( 10, 20 );
var Scale = 10;
const EmptyColor = "white";


function drawItem(ctx, start, color)
{
    if (color == EmptyColor)
    {
        ctx.clearRect(
            start.x * Scale,
            start.y * Scale,
            Scale,
            Scale);
        return;
    }
    ctx.fillStyle = color;
    ctx.fillRect(
        start.x * Scale,
        start.y * Scale,
        Scale,
        Scale);

    //ctx.strokeStyle = "red"
    ctx.strokeRect(
        start.x * Scale,
        start.y * Scale,
        Scale,
        Scale)    

}


class Board
{
    constructor(size)
    {
        this.size = size;
        this.data = Array(size.y);
        for (let y = 0; y < this.size.y; ++y)
            this.data[y] = Array(size.x).fill(EmptyColor);
    }

    getData(point)
    {
        return this.data[point.y][point.x]
    }
    setData(point, color)
    {
        this.data[point.y][point.x] = color;
    }
    draw(ctx)
    {
        for (let y = 0; y < this.size.y; ++y)
        {
            for (let x = 0; x < this.size.x; ++x)
            {
                let point = new Point(x, y);                
                drawItem(ctx, point, this.getData(point))
            }
        }
    }
    
    isOnBoard(point)
    {
        return point.x >= 0 && point.x < this.size.x &&
               point.y >= 0 && point.y < this.size.y;
    }

    hasIntersections(shape)
    {
        for (let point of shape.data())
        {
            if (!this.isOnBoard(point))
            {
                if (point.y < 0) // allow exit on top
                    continue;
                else
                    return true;
            }
            if (this.getData(point) != EmptyColor)
                return true;
        }
        return false;
    }

    apply(shape)
    {
        for (let point of shape.data())
        {
            if(!this.isOnBoard(point))
                continue;
            this.setData(point, shape.color);
        }
    }
}

class Game
{
    constructor(ctx)
    {
        this.ctx = ctx;
        this.board = new Board(BoardSize);
        this.createShare();
        this.ended = false;
    }

    draw()
    {
        this.board.draw(this.ctx)
        this.shape.draw(this.ctx);
    }

    createShare()
    {
        this.shape = Shapes[Math.floor(Math.random() * Shapes.length)].clone();
        this.shape.move(new Point(4, 0))
    }

    rotate(direction)
    {
        let copy = this.shape.clone();
        if (direction)
            copy.rotateLeft(); 
        else
            copy.rotateRight(); 
        if (this.board.hasIntersections(copy))
            return;
        this.shape = copy;
        this.draw();
    }

    move(direction)
    {
        if (this.ended)
            return false;
        let copy = this.shape.clone();
        copy.move(direction);
        if (this.board.hasIntersections(copy))
           return false;
        this.shape = copy;
        this.draw();
        return true;
    }

    update()
    {
        if (this.ended)
            return;
        if (this.move(new Point(0, 1)))
            return;
        this.board.apply(this.shape);
        this.createShare(); // TODO: check before
        if (this.board.hasIntersections(this.shape))
            this.ended = true; // the end
        this.draw();
    }
}
function main()
{
    const myCanvas = document.getElementById("mainCanvas");
    const ctx = myCanvas.getContext("2d");
    Scale = myCanvas.width / 10;
    console.log("Scale:", Scale);

    game = new Game(ctx);
    game.draw();

    let interval = window.setInterval(() => {
            game.update();
            if(game.ended)
            {
                window.clearInterval(interval);
                document.querySelector('h1').textContent = 'The End';
            }
        }, 1000);


    document.addEventListener("keydown", (e) => {
        if(game.ended)
            return;
        if (e.code == "ArrowUp")
            game.rotate(true);
        else if (e.code == "ArrowRight")
            game.move(new Point(1, 0));
        else if (e.code == "ArrowLeft")
            game.move(new Point(-1, 0));
        else if (e.code == "ArrowDown")
            game.move(new Point(0, 1));
        else if (e.code == "Space")
        {
            while(game.move(new Point(0, 1))) 
            {
            }
        }
        console.log(e.code);
    });

}

