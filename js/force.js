/**
 * Created by jiang on 2/25/2015.
 */
function Force(svg, width, height, nodes, edges, type/*node|table*/) {
    var linkDistance = 1600;
    var circleR = 100;
    var textDx = 12;
    var textDy = 3;

    // layout, force
    var force = d3.layout.force();

    // nodes, links
    force.nodes(nodes)
        .links(edges);

    // build the arrow.
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 0 12 12")   // You marker's cor-ordinate should within.
        .attr("refX", 30)   // how much space the arrow to the end of the line, x
        .attr("refY", 4)    // how much space the arrow to the end of the line, y
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)    // marker size
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M2,2 L10,6, L2,10 L6,6 L2,2")
        .attr("fill", "grey"); // marker color

    // Above will change the nodes and links
    var svg_edges = svg.selectAll(".line")
        .data(edges)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("stroke","#ddd")
        .attr("stroke-width", 2)// stroke- width == 2 will see the marker, but 1 will be very vague
        .attr("marker-end", "url(#end)");

    var svg_edge_texts = svg.selectAll(".lineText")
        .data(edges)
        .enter()
        .append('text')
        .attr('class', 'lineText')
        .text(function(d){
            return d['relation'];
        });

    // create color, function
    var color = d3.scale.category10();

    if(type === "node") {
        // force.drag
    //    var svg_nodes = svg.selectAll("circle")
    //            .data(nodes)
    //            .enter()
    //            .append("circle")
    //            .attr("r", circleR)
    //            .style("fill", function(data, i){
    //                return color(i);
    //            })
    //            .call(force.drag);
        var svg_nodes = svg.selectAll('.node')
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(force.drag())
            .on("mouseover", function(d, i){
                svg_edge_texts.style('fill-opacity', function(d2, i2){
                    return d2.source == d || d2.target == d ? 1:0;
                });
            })
            .on("mouseout", function(d, i){
                svg_edge_texts.style('fill-opacity', function(d2, i2){
                    return 0;
                });
            });

        svg_nodes.append('circle')
            .attr("r", circleR)
            .attr("fill", function(d, i){
                return color(i);
            });

        svg_nodes.append('text')
            .attr('dx', textDx)
            .attr('dy', textDy)
            .attr('text-anchor', "start") // "end"
            .text(function(d){
                return d.name;
            });

        force.charge(function(node){
            return -circleR*10;
        });

        force.linkDistance(function(d, i){
            console.info("linkDistance() ", d, i);

            return 2*circleR + 50;
        });
    } else if(type === "table") {
        // Table
        var handler = new BigknowTable(svg, nodes);
        var svg_nodes = handler.getTables();
        svg_nodes.call(force.drag());

        force.charge(function(node){
            var w = node.tableWidth;
            var h = node.tableHeight;
            var r = Math.sqrt(w*w + h*h);
            return -r*10;
        });

        force.linkDistance(function(d, i){
            console.info("linkDistance() ", d, i);
            var source = d.source;
            var w = source.tableWidth;
            var h = source.tableHeight;
            var r1 = Math.sqrt(w*w + h*h)/2;

            var target = d.target;
            var w2 = target.tableWidth;
            var h2 = target.tableHeight;
            var r2 = Math.sqrt(w*w + h*h)/2;

            return r1 + r2 + 20;
        });
    }

    // When drag happen, how to redraw line and edges
    var _this = this;

    force.on("tick", function(){

        if(type === "node") {
            // Path
            svg_edges.attr("d", _this.linkArc);

            // Line
            //        svg_edges.attr("x1", function(d){
            //            return d.source.x;
            //        });
            //        svg_edges.attr("y1", function(d){
            //            return d.source.y;
            //        });
            //        svg_edges.attr("x2", function(d){
            //            return d.target.x;
            //        });
            //        svg_edges.attr("y2", function(d){
            //            return d.target.y;
            //        });

            // Items
            svg_edge_texts.attr("x", function (d) {
                return (d.source.x + d.target.x) / 2;
            });
            svg_edge_texts.attr("y", function (d) {
                return (d.source.y + d.target.y) / 2;
            });

            svg_nodes.attr("cx", function (d) {
                return d.x;
            });
            svg_nodes.attr("cy", function (d) {
                return d.y;
            });

            svg_nodes.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; });
        } else if(type==="table") {
            // Path
            svg_edges.attr("d", _this.linkArc2);

            svg_nodes.attr("transform", function(d) {
                var w = d.tableWidth;
                var h = d.tableHeight;

                return "translate(" + (d.x-w/2) + "," + (d.y-h/2) + ")";
            });
        }

        // Collision detect
        //var q = d3.geom.quadtree(nodes), // 4叉树
        //    i = -1,
        //    n = nodes.length;
        //while (++i < n) {
        //    // visit will accept a function
        //    if(type === "node") {
        //        q.visit(_this.collide(nodes[i]), circleR);
        //    } else if(type === "table") {
        //        q.visit(_this.collideTable(nodes[i]));
        //    }
        //}
    });

    // size
    force.size([width, height]);

    // link distance, charge
    force.gravity(0.1);

    // start
    force.start();
}

/**
 * Link arc functions
 * @param d
 * @returns {string}
 */
Force.prototype.linkArc = function(d) {
    var dx = d.target.x - d.source.x;
    var dy = d.target.y - d.source.y;
    var dr = Math.sqrt(dx * dx + dy * dy);

    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
};

Force.prototype.linkArc2 = function(d) {
    var target = d.target;
    var source = d.source;
    var dx = (target.x + target.tableWidth/2) - (source.x + source.tableWidth/2);
    var dy = (target.y + target.tableHeight/2) - (source.y + source.tableHeight/2);
    var dr = Math.sqrt(dx * dx + dy * dy);

    // TODO get shortest line for each table

    return "M" + (source.x) + "," + (source.y)
        + "L" +
        + (target.x) + "," + (target.y);
};

Force.prototype.get4Points = function(x, y, w, h) {
    var points = _.map([[1, 1], [1, -1], [-1, 1], [-1, -1]], function(item, i){
        return {
            x: x + item[0]*w/2,
            y: y + item[1]*h/2
        }
    });

    return points;
};

Force.prototype.collideTable = function(node) {
    var padding = 50;
    var nx1 = node.x - padding,
        nx2 = node.x + node.tableWidth + padding,
        ny1 = node.y - padding,
        ny2 = node.y + node.tableHeight + padding,
        r1 = Math.sqrt(node.tableWidth*node.tableWidth + node.tableHeight*node.tableHeight)/2;

    return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {

            if (this.tableOverlap(node, quad.point)) { // if distance < total radius, collide
                this.setNewTableXY(node, quad.point, padding);
            }
        }

        // function return boolean value
        // right
        // left
        // down
        // up
        return x1 > nx2
            || x2 < nx1
            || y1 > ny2
            || y2 < ny1;
    };
};

Force.prototype.setNewTableXY = function(a, b, padding) {
    if(b.y> a.y) {

    } else {
        var c = b;
        b = a;
        a = c;
    }

    var diff = (a.y + a.tableHeight - b.y)/2;
    a.y = a.y - diff - padding;
    b.y = b.y + diff + padding;
};

Force.prototype.tableOverlap = function(a, b){
    if ((a.x< b.x && b.x < (a.x+ a.tableWidth) && a.y< b.y && b.y< (a.y+ a.tableHeight)) ||
        (a.x< (b.x + b.tableWidth) && (b.x + b.tableWidth) < (a.x+ a.tableWidth) && a.y< (b.y + b.tableHeight) && (b.y+ b.tableHeight)< (a.y+ a.tableHeight))) {
        return true;
    } else {
        return false;
    }
};

Force.prototype.collide = function(node, circleR) {
    node.radius = node.radius || circleR;
    var r = node.radius + 16,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;

    return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,

            // start point distance
                l = Math.sqrt(x * x + y * y),

            // total radius
                r = node.radius + quad.point.radius;

            if (l < r) { // if distance < total radius, collide
                var change = (l - r) / l * .5; // diff/distance/2
                node.x -= x *= change;
                node.y -= y *= change;

                //node.x -= x*0.5;
                //node.y -= y*0.5;

                quad.point.x += x;
                quad.point.y += y;
            }
        }

        // function return boolean value
        // right
        // left
        // down
        // up
        return x1 > nx2
            || x2 < nx1
            || y1 > ny2
            || y2 < ny1;
    };
};