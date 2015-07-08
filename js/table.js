function BigknowTable(svg, tables, extraOptions) {
    extraOptions = extraOptions || {};

    //tableName, headers, data, xOffset, yOffset

    var padding = extraOptions.padding||10;
    var round = extraOptions.round||3;
    var fontSize = extraOptions.fontSize||16;

    var tableCellHeight = extraOptions.tableCellHeight||26;

    for(var i in tables) {
        var table = tables[i];

        this.getColumnWidth(table.headers, table.data, fontSize);
        table.tableCellWidth = extraOptions.tableCellWidth||200;

        table.tableWidth = 2 * padding + this.getTotalColumnWidth(table.headers);
        table.tableHeight = 2 * padding + (table.data.length+2)*tableCellHeight;

        var headers = table.headers;
        var data = table.data;
        _.map(data, function(row, index){
            row.headers = headers;
        });
    }


    var g = this.g = svg.selectAll(".table-container")
        .data(tables)
        .enter().append("g").attr("class", "table-container");

    // Only set offset if they are valid
    g.attr("transform", function(d){
        if(!!d.xOffset && !!d.yOffset) {
            return "translate("+ d.xOffset+","+ d.yOffset+")";
        }
    });

    var tableBorder = g.append("path")
        .attr("d", function(d){
            return "M "+0 + " " + 0
            + " L " + 0 + " " + d.tableHeight
            + " L " + d.tableWidth + " " + d.tableHeight
            + " L " + d.tableWidth + " " + 0
            + " L " + 0 + " " + 0
            + " z";
        })
        .attr("fill", "rgba(255,255,255,0)")
        .attr("class", "table-border");

    g.append("line").attr("x1", padding)
        .attr("x2", function(d){
            return d.tableWidth - padding;
        })
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
        .text(function(d){
            return d.name;
        });

    // Columns header
    var g2 = g.append("g");
    g2.selectAll("text").data(function(d){ return d.headers; })
        .enter()
        .append("text")
        .attr("x", function(data, i){
            return padding + data['pos'];
        })
        .attr("y", function(d){
            return padding + tableCellHeight + fontSize;
        }) // skip table name
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text(function(data, i){
            return data["name"];
        });

    // Table Content
    var g3 = g.append("g");

    // tr
    var rows = g3.selectAll("text")
        .data(function(d){
            return d.data;
        })
        .enter()
        .append("text")
        .attr("class", "table-row")
        .attr("x", function(data, i){
            return padding;
        })
        .attr("y", function(d, i){
            return padding+ tableCellHeight*(i+2) + fontSize; // skip table name + table column header
        });

    // td for each row
    rows.selectAll("tspan")
        .data(function(dd){
            var headers = dd.headers;
            var arr = [];
            for(var i in headers) {
                var header = headers[i];
                var obj = {};
                obj["v"] = _.clone(dd[header['value']]);
                obj["pos"] = header['pos'];
                arr.push(obj);
            }
            return arr;
        })
        .enter()
        .append("tspan")
        .attr("x", function(d) {
            return padding + d['pos'];
        })
        .text(function (d, j) {
            return d['v'];
        });
}

/**
 * Get the table
 * @returns the table
 */
BigknowTable.prototype.getTables = function() {
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