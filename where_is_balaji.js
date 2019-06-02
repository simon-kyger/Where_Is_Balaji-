const start = () => {
    document.body.style.margin = 0
    document.body.style.overflow = `hidden`
    const controlwrapper = document.createElement(`div`)
    document.body.appendChild(controlwrapper)
    controlwrapper.style.backgroundColor = `black`;
    const regeneratemaze = document.createElement(`button`)
    regeneratemaze.innerHTML = `Regenerate`
    regeneratemaze.style.backgroundColor = `black`;
    regeneratemaze.style.color = `white`
    controlwrapper.appendChild(regeneratemaze)
    const canvas = document.createElement(`canvas`)
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas)
    const ctx = canvas.getContext(`2d`);

    const Cell = function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.offx = this.x * this.width;
        this.offy = this.y * this.height;
        this.color = `white`;
        this.sides = {
            'up': 1,
            'left': 1,
            'right': 1,
            'down': 1
        };
        this.visited = false;
        this.potentials = grid => {
            const top = grid[this.x] ? grid[this.x][this.y - 1] : null;
            const right = grid[this.x + 1] ? grid[this.x + 1][this.y] : null;
            const bottom = grid[this.x] ? grid[this.x][this.y + 1] : null;
            const left = grid[this.x - 1] ? grid[this.x - 1][this.y] : null;
            const p = []
            if (top && !top.visited)
                p.push(top)
            if (right && !right.visited)
                p.push(right)
            if (bottom && !bottom.visited)
                p.push(bottom)
            if (left && !left.visited)
                p.push(left)

            if (p.length) {
                const r = Math.floor(Math.random() * p.length)
                return p[r]
            }
        }
        this.draw = () => {
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            if (this.sides.up) {
                ctx.moveTo(this.offx, this.offy)
                ctx.lineTo(this.offx + this.width, this.offy)
            }
            if (this.sides.left) {
                ctx.moveTo(this.offx, this.offy)
                ctx.lineTo(this.offx, this.offy + this.height)
            }
            if (this.sides.down) {
                ctx.moveTo(this.offx, this.offy + this.height)
                ctx.lineTo(this.offx + this.width, this.offy + this.height)
            }
            if (this.sides.right) {
                ctx.moveTo(this.offx + this.width, this.offy)
                ctx.lineTo(this.offx + this.width, this.offy + this.height)
            }
            //debug
            // if (this.visited) {
            //     ctx.fillStyle = 'purple';
            //     ctx.fillRect(this.offx, this.offy, this.width, this.height)
            // }
            ctx.stroke();
        }
    }

    const Maze = function(width, height, cellwidth, cellheight) {
        if (width <= 0 || height <= 0 || cellwidth <= 0 || cellheight <= 0)
            throw new Exception(`invalid maze dimensions and/or cellwidth/heights`)
        this.gen_stage = () => {
            this.stack = [];
            this.width = width;
            this.height = height;
            this.grid = [];
            for (let x = 0; x < this.width; x++) {
                this.grid[x] = [];
                for (let y = 0; y < this.height; y++) {
                    this.grid[x][y] = new Cell(x, y, cellwidth, cellheight)
                }
            }
            this.current = this.grid[Math.floor(Math.random() * width)][Math.floor(Math.random() * height)]
            this.current.visited = true;
        }
        this.clear = () => {
            ctx.fillStyle = `black`;
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
        }
        this.remove_walls = (c1, c2) => {
            if (c1.x < c2.x) {
                c1.sides.right = 0;
                c2.sides.left = 0;
            }
            if (c1.x > c2.x) {
                c1.sides.left = 0;
                c2.sides.right = 0;
            }
            if (c1.y > c2.y) {
                c1.sides.up = 0;
                c2.sides.down = 0;
            }
            if (c1.y < c2.y) {
                c1.sides.down = 0;
                c2.sides.up = 0;
            }
        }
        this.draw = time => {
            this.clear()
            this.grid.forEach(row => {
                row.forEach(c => {
                    c.draw()
                })
            })
            const next = this.current.potentials(this.grid)
            if (next) {
                next.visited = true;
                this.stack.push(this.current)
                this.remove_walls(this.current, next)
                this.current = next;
            } else if (this.stack.length) {
                this.current = this.stack.pop();
            }
            requestAnimationFrame(this.draw);
        }
    }
    const m = new Maze(25, 15, 20, 20);
    m.gen_stage();
    m.draw(0);
    window.addEventListener('resize', e => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })
    regeneratemaze.addEventListener('click', e=>{
    	m.gen_stage()
    })
}

const bootstrap = () => start()

document.addEventListener(`DOMContentLoaded`, bootstrap, false)
