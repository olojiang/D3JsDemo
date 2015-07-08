function BigknowTable(svg, tableName, headers, data, xOffset, yOffset, extraOptions) {
    extraOptions = extraOptions || {};

    var padding = extraOptions.padding||10;
    var round = extraOptions.round||3;
    var fontSize = extraOptions.fontSize||16;

    var tableCellHeight = extraOptions.tableCellHeight||26;

    this.getColumnWidth(headers, data, fontSize);
    var tableCellWidth = extraOptions.tableCellWidth||200;

    var tableWidth = 2 * padding + this.getTotalColumnWidth(headers);
    var tableHeight = 2 * padding + (data.length+2)*tableCellHeight;

    var g = this.g = svg.append("g").attr("class", "table-container")
        .attr("transform", "translate("+xOffset+","+yOffset+")");
    var tableBorder = g.append("path")
        .attr("d", "M "+0 + " " + 0
        + " L " + 0 + " " + tableHeight
        + " L " + tableWidth + " " + tableHeight
        + " L " + tableWidth + " " + 0
        + " L " + 0 + " " + 0
        + " z")
        .attr("fill", "rgba(255,255,255,0)")
        .attr("class", "table-border");

    g.append("line").attr("x1", padding).attr("x2", tableWidth - padding)
        .attr("y1", padding + fontSize + 10).attr("y2", padding + fontSize + 3)
        .attr("stroke", "rgba(230, 230, 230, 1)")
        .attr("class", "table-separate-line");

    // Table header
    var tableHeader = g.append('text')
            .attr("x", padding)
            .attr("y", padding + fontSize+2)
            .attr("font-size", "18px")
            .attr("font-weight", "bold")
            .attr("fill", "crimson")
    /*.attr("text-anchor", "middle")*/;
    tableHeader.append("tspan")
        .attr("x", padding)
        .text(tableName);

    // Columns header
    var g2 = g.append("g");
    g2.selectAll("text").data(headers)
        .enter()
        .append("text")
        .attr("x", function(data, i){
            return padding + data['pos'];
        })
        .attr("y", padding + tableCellHeight + fontSize) // skip table name
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text(function(data, i){
            return data["name"];
        });

    // Table Content
    var g3 = g.append("g");
    var rows = g3.selectAll("text").data(data)
        .enter()
        .append("text")
        .attr("class", "table-row")
        .attr("x", function(data, i){
            return padding;
        })
        .attr("y", function(data, i){
            return padding+tableCellHeight*(i+2) + fontSize; // skip table name + table column header
        });

    for(var i in headers) {
        var header = headers[i];
        rows.append("tspan")
            .attr("x", padding + header['pos'])
            .text(function (data, j) {
                return data[header['value']]
            });
    }
}

/**
 * Get the table
 * @returns the table
 */
BigknowTable.prototype.getTable = function() {
    return this.g;
};

/**
 * Get the table max width for each column.
 *  - Go through each column.
 * @param headers
 * @param data
 * @param fontSize
 */
BigknowTable.prototype.getColumnWidth = function (headers, data, fontSize){
    var pos = 0;
    for(var i in headers) {
        var header = headers[i];
        var column = header['value'];
        var headerLabel = header['name'];

        header['pos'] = pos;

        header['maxWidth'] = Math.max(headerLabel.length, _.max(data, function(item){
            return item[column].length;
        })[column].length) * fontSize;

        pos += header['maxWidth'];
    }
};

/**
 * Get the total width of all columns
 * @param headers
 * @returns {*}
 */
BigknowTable.prototype.getTotalColumnWidth = function(headers) {
    return _.reduce(headers, function(memo, item){
        return memo + item['maxWidth'];
    }, 0);
};