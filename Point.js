
export class Point
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
}

