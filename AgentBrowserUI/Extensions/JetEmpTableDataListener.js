
function addTableHandler() {

    ORACLE_SERVICE_CLOUD.extension_loader.load("JetEmpsVirtualTable", "1.0").then(function (extensionProvider) {

        extensionProvider.registerAnalyticsExtension(function (analyticsContext) {

            analyticsContext.addTableDataRequestListener('OracleJET$Emps', function (report) {
            
                var dataHandlerPromise = new ORACLE_SERVICE_CLOUD.ExtensionPromise();

                getExternalData().then(function (data) {
                    var tableData = [];
                    tableData = data.items;
                    var recordCount = tableData.length;
                    var reportData = report.createReportData();
                    var columnDefinitionList = report.getReportDefinition().getColumnDefinitions();

                    reportData.setTotalRecordCount(recordCount);

                    for (var i = 0; i < tableData.length; i++) {
                        var row = report.createReportDataRow();
                        //console.log(tableData[i]);
                        var itemData = tableData[i];
                        //console.log(itemData);
                        window.parent.window.$.each(columnDefinitionList, function(i, obj) {
                            var idx = obj["columnReference"].replace("OracleJET$Emps.", "");
                            //console.log("idx", i, idx);
                            var data = itemData[idx];
                            //console.log(idx, data);
                            var cellData = itemData[idx];
                            var cell = report.createReportDataCell();
                            cell.setData(cellData);
                            row.cells.push(cell);
                        });
                        reportData.rows.push(row);
                    }
                    //console.log(reportData);
                    dataHandlerPromise.resolve(reportData);
                }).catch(function (error) {
                    //console.log(error);
                    dataHandlerPromise.reject(error);
                }); // getExternalData

                return dataHandlerPromise;

            }); // addTableDataRequestListener
        }); // registerAnalyticsExtension
    }); // extension_loader
} // addTableHandler

function getExternalData() {
    var apiEndpoint = "https://apex.oracle.com/pls/apex/oraclejet/emp/";
    return new ORACLE_SERVICE_CLOUD.ExtensionPromise((resolve, reject) => {
        window.parent.window.$.ajax({
            url: apiEndpoint,
            method: "GET",
            dataType: "json",
            success: function (data) {
                resolve(data);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

// initialize
addTableHandler();
