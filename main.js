
function randomNumber (n) {
  return Math.floor(Math.random() * n)
}

class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
}

class Rectangle {
  constructor (point, w, h) {
    this.point = point
    this.w = w
    this.h = h
  }
}

class QuadTree {
  constructor (boundary, capacity) {
    this.boundary = boundary
    this.capacity = capacity || 4
    this.quadTree = []
    this.points = []
  }

  addPoint (point) {
    this.points.push(point)

    if (this.points.length >= this.capacity) {
      this.subDivide(point)
    }
  }

  isPointInTree (point) {
    if (point.x < this.boundary.point.x) {
      return false
    }
    
    if (point.x > this.boundary.point.x + this.boundary.w) {
      return false
    }

    if (point.y < this.boundary.point.y) {
      return false
    }

    if (point.y > this.boundary.point.y + this.boundary.h) {
      return false
    }

    return true
  }

  subDivide (point) {
    if (this.quadTree.lenght > 0) {
      console.log('find right subdivide and add point')
      return
    }

    this.quadTree = []
    
    // NW
    this.quadTree.push(new QuadTree(new Rectangle(new Point(0, 0), this.boundary.w / 2, this.boundary.h / 2), this.capacity))

    // NE
    this.quadTree.push(new QuadTree(new Rectangle(new Point(this.boundary.w/2, 0), this.boundary.w / 2, this.boundary.h / 2), this.capacity))
    // SE
    this.quadTree.push(new QuadTree(new Rectangle(new Point(this.boundary.w/2, this.boundary.h/2), this.boundary.w / 2, this.boundary.h / 2), this.capacity))

    // SW
    this.quadTree.push(new QuadTree(new Rectangle(new Point(0, this.boundary.h/2), this.boundary.w / 2, this.boundary.h / 2), this.capacity))

    let remainingPoints = this.points.slice(0)

    this.quadTree.forEach((tree) => {
      let notInTree = []
      remainingPoints.forEach((point) => {
        if (tree.isPointInTree(point)) {
          tree.addPoint(point)
        } else {
          notInTree.push(point)
        }
      })

      remainingPoints = notInTree.slice(0)
    })

    this.point = remainingPoints

    // newPoints.forEach((point) => {
      
    // })
  }

  draw (ctx) {
    ctx.strokeRect(this.boundary.point.x, this.boundary.point.y, this.boundary.w, this.boundary.h)

    this.points.forEach((point) => {
      ctx.fillRect(point.x,point.y,1,1)
    })

    this.quadTree.forEach((tree) => {
      tree.draw(ctx)
    })
  }
}

const WIDTH = 400
const HEIGHT = 400
let canvas = document.getElementById('main')
let ctx = canvas.getContext('2d')

canvas.width = WIDTH
canvas.height = HEIGHT

let quadtree = new QuadTree(new Rectangle(new Point(0, 0), WIDTH, HEIGHT), 4)

for (let i = 0; i < 20; i += 1) {
  quadtree.addPoint(new Point(randomNumber(WIDTH), randomNumber(HEIGHT)))
}


quadtree.draw(ctx)

console.log('QUAD TREE', quadtree)