/**
 * HTML5 Voronoi Shapes
 * 
 * uses Paper.js
 *
 * modified for circles & offset
 * Gerry Straathof 11/16/16
 */
var voronoi =  new Voronoi();
var sites = generateBeeHivePoints(view.size / 200, true);
var directions = generateHiveDirections();
var bbox, diagram;
var oldSize = view.size;
var spotColor = new Color('red');
var mousePos = view.center;
var selected = false;

onResize();

function onMouseDown(event) {
    sites.push(event.point);
    renderDiagram();
}

function onMouseMove(event) {
    mousePos = event.point;
    addBeehiveDirection();
    if (event.count == 0)
        sites.push(event.point);
    sites[sites.length - 1] = event.point;
    renderDiagram();
}

function renderDiagram() {
    project.activeLayer.children = [];
    var diagram = voronoi.compute(sites, bbox);
    if (diagram) {
        for (var i = 0, l = sites.length; i < l; i++) {
            var cell = diagram.cells[sites[i].voronoiId];
            if (cell) {
                var halfedges = cell.halfedges,
                    length = halfedges.length;
                if (length > 2) {
                    var points = [];
                    for (var j = 0; j < length; j++) {
                        v = halfedges[j].getEndpoint();
                        points.push(new Point(v));
                    }
                    createPath(points, sites[i]);
                }
            }
        }
    }
}

function generateHiveDirections(){
    var velocity = [];
    for (var i=0; i<points.size(); i++){
        var direction = new Point(random(-1,1),random(-1,1));
    }
}

function generateHiveDirections(){
    var direction = [];
    for (var i=0; i<sites.length; i++){
    var xx = Math.floor((Math.random() * 2) -1);
    var yy = Math.floor((Math.random() * 2) -1);
        var direction = new Point(xx,yy);
    }
    return direction;
}

function addBeehiveDirection(){
    for (var i=0; i<sites.length; i++){
        var testPoint = sites[i]+direction[i];
        if (testPoint.x>size.width){
            direction[i].x = -direction[i].x;
        }
        if (testPoint.x<0){
            direction[i].x = -direction[i].x;
        }
        if (testPoint.y<0){
            direction[i].y = -direction[i].y;
        }
        if (testPoint.y>size.height){
            direction[i].y = -direction[i].y;
        }
        sites[i]+=direction[i]
    }
}

function removeSmallBits(path) {
    var averageLength = path.length / path.segments.length;
    var min = path.length / 50;
    for(var i = path.segments.length - 1; i >= 0; i--) {
        var segment = path.segments[i];
        var cur = segment.point;
        var nextSegment = segment.next;
        var next = nextSegment.point + nextSegment.handleIn;
        if (cur.getDistance(next) < min) {
            segment.remove();
        }
    }
}

function generateBeeHivePoints(size, loose) {
    var points = [];
    var col = view.size / size;
    for(var i = -1; i < size.width + 1; i++) {
        for(var j = -1; j < size.height + 1; j++) {
            var point = new Point(i, j) / new Point(size) * view.size + col / 2;
            if(j % 2)
                point += new Point(col.width / 2, 0);
            if(loose)
                point += (col / 4) * Point.random() - col / 4;
            points.push(point);
        }
    }
    return points;
}
function createPath(points, center) {
    var path = new Path();
    if (!selected) { 
        path.fillColor = spotColor;
    } else {
        path.fullySelected = selected;
    }
    path.closed = true;

    for (var i = 0, l = points.length; i < l; i++) {
        var point = points[i];
        var next = points[(i + 1) == points.length ? 0 : i + 1];
        var vector = (next - point) / 2;
        path.add({
            point: point + vector,
            handleIn: -vector,
            handleOut: vector
        });
    }
    path.scale(0.95);
    removeSmallBits(path);
    return path;
}

function onResize() {
    var margin = 20;
    bbox = {
        xl: margin,
        xr: view.bounds.width - margin,
        yt: margin,
        yb: view.bounds.height - margin
    };
    for (var i = 0, l = sites.length; i < l; i++) {
        sites[i] = sites[i] * view.size / oldSize;
    }
    oldSize = view.size;
    renderDiagram();
}

function onKeyDown(event) {
    if (event.key == 'space') {
        selected = !selected;
        renderDiagram();
    }
}
