const vert = Math.sqrt(3)/2;
var map;
var zoom, width, height;
var GRID;
var OBJECT;
var PLAYER;

const MAP = {
    "k": `
     ...
    .o..
    ..p..
    o...
     ...
    `
}

window.onload = () => {
    GRID = document.getElementById("grid");
    OBJECT = document.getElementById("object");
    PLAYER = document.getElementById("player");
    init("k");
};

function simplePath(svg, path, x, y, size, color) {
    let elem = document.createElement('path')
    svg.appendChild(elem)
    elem.setAttribute('transform', `translate(${x}, ${y}) scale(${size})`);
    elem.setAttribute('fill', color);
    elem.setAttribute('d', path + 'z')
    return elem
}

function init(name) {
    map = mapify(MAP[name]);
    height = map.length; width = map[0]?.length; zoom = Math.max(height, width);
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            let [px, py] = toPixel(i, j);
            for (let o of map[j][i]) switch (o) {
                case TILE_TYPE.floor:
                    simplePath(GRID, "M 0 -0.9 L 0.9 -0.7 L 0.9 0.7 L 0 0.9 L -0.9 0.7 L -0.9 -0.7", px, py, 50 / zoom, "#333");
                    break;
                case TILE_TYPE.player:
                    simplePath(PLAYER, "M -0.5 0.6 L -0.5 -0.2 C -0.5 -0.9 0.5 -0.9 0.5 -0.2 L 0.5 0.6 L 0.3 0.6 C 0.3 0.2 -0.3 0.2 -0.3 0.6 M -0.3 -0.2 Q -0.3 0 0 0 Q 0.3 0 0.3 -0.2 Q 0.3 -0.4 0 -0.4 Q -0.3 -0.4 -0.3 -0.2", px, py, 50 / zoom, "white");
                    break;
                case TILE_TYPE.box:
                    simplePath(OBJECT, "M 0.5 -0.5 L 0.5 0.5 L -0.5 0.5 L -0.5 -0.5", px, py, 50 / zoom, "white");
            }
        }
    }
    GRID.innerHTML += " ";
    OBJECT.innerHTML += " ";
    PLAYER.innerHTML += " "; // refresh svg
}

function toPixel(x, y) {
    let [px, py] = [x, y];
    if (y % 2) px += 0.5;
    px += 0.5; py += 0.5;
    px += (zoom - width) / 2; py += (zoom - height) / 2;
    px *= 100 / zoom; py *= 100 * vert / zoom;
    py += vert / zoom * 100 / 2
    return [px, py];
}

function mapify(spr) {
    let map = spr.split("\n").map(x => x.replace(/^\s*$/g, ""));
    for (let i = map.length - 1; i >= 0; i--) if (map[i] === "") map.splice(i, 1);
    let minsp = map.reduce((prev, cur) => Math.min(prev, cur.match(/^\s+/g)[0].length), 0xFFFFFFFF);
    map = map.map(x => x.slice(minsp));
    let maxsp = map.reduce((prev, cur) => Math.max(prev, cur.length), 0);
    map = map.map(x => (x + " ".repeat(maxsp - x.length)).split("").map(y => ch(y)));
    return map;
}

const TILE_TYPE = {
    "floor": 0,
    "player": 1,
    "box": 2
}

function ch(c) {
    let q = [];
    switch (c) {
        case ".":
            q.push(TILE_TYPE.floor);
            break;
        case "p":
            q.push(TILE_TYPE.floor);
            q.push(TILE_TYPE.player);
            break;
        case "o":
            q.push(TILE_TYPE.floor);
            q.push(TILE_TYPE.box);
            break;
    }
    return q;
}