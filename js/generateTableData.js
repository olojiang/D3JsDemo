/**
 * Created by jiang on 2/27/2015.
 */

/*
Sample Data:
[
 {
 name: "TableName",
 headers: [{name: "Column", value: "column"}, {name: "Type", value: "type"}],
 data: [
 {
 column: "id",
 type: "integer"
 },
 {
 column: "absdf",
 type: "integer"
 },
 {
 column: "name",
 type: "varchar"
 },
 {
 column: "name中文测试，中文测试~~~",
 type: "varchar"
 },
 {
 column: "name",
 type: "varchar"
 }
 ],
 xOffset: 500,
 yOffset: 220
 }]
 */
function generateTableData(number){
    var tables = [];
    var tableNameLimit = 20;
    var colLimit = 30;
    var colItemLimit = 5;
    var rowItemLimit = 30;
    var widthRange = 500;
    var heightRange = 400;

    for(var i =0; i<number; i++) {
        var table = {};

        // Name
        table.name = generateString("Table_", tableNameLimit);

        // Headers
        var colNumber = generateRandomInt(1, colItemLimit);
        var headers = [];
        for(var j = 0; j<colNumber; j++) {
            headers.push({
                name: generateString("TH_", generateRandomInt(1, colLimit)),
                value: "col_" + j
            });
        }

        table.headers = headers;

        // Rows
        var rowNumber = generateRandomInt(1, rowItemLimit);
        var rows = [];
        for(var j = 0; j<rowNumber; j++) {
            var row = {};
            for(var k = 0; k<colNumber; k++) {
                row["col_"+k] = generateString("TD_", generateRandomInt(1, colLimit));
            }

            rows.push(row);
        }

        table.data = rows;

        // Offset
        table.xOffset = generateRandomInt(0, widthRange);
        table.yOffset = generateRandomInt(0, heightRange);

        // yOffset

        // Table out
        tables.push(table);
    }

    return tables;
}