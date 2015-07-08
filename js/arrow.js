/**
 * Created by jiang on 2/25/2015.
 */
function Arrow(svg) {
    var defs = svg.append("defs");
    var arrowMarker = defs.append("marker")
        .attr("id", "arrow")
        .attr("markerUnit", "strokeWidth")
        .attr("markerWidth", "12")
        .attr("markerHeight", "12")
        .attr("viewBox", "0 0 12 12")
        .attr("refX", "6")
        .attr("refY", "6")
        .attr("orient", "auto");

    var arrowPath = "M2,2 L10,6, L2,10 L6,6 L2,2";
    arrowMarker.append("path")
        .attr("d", arrowPath)
        .attr("fill", "#000");
}