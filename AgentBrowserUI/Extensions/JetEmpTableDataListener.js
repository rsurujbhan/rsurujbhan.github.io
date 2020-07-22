// Analytics Report ID
var REPORT_ID = 100123;

function addTableHandler() {

    ORACLE_SERVICE_CLOUD.extension_loader.load("JetEmpsVirtualTable", "1.0").then(function (extensionProvider) {

        extensionProvider.registerAnalyticsExtension(function (analyticsContext) {

            /**
             * Open Command
             */
            var reportCommandOpenIcon = analyticsContext.createIcon();
            reportCommandOpenIcon.setIconClass("fa fa-eye");
            reportCommandOpenIcon.setIconColor("red");

            var reportCommandOpen = analyticsContext.createRecordCommandContext("MyOpenCommand");
            reportCommandOpen.setLabel("Do Something...");
            reportCommandOpen.setTooltip("Open this Record");
            reportCommandOpen.setIcon(reportCommandOpenIcon);
            reportCommandOpen.setRecordId(REPORT_ID);
            reportCommandOpen.showAsLink(true);
            reportCommandOpen.showLinkAsIcon(false);

            // should the record command be enabled into the report or workspace?
            reportCommandOpen.addInjectionValidatorCallback(function (reportInfo) {
                return true;
            });

            // should the record command be enabled for the specific row?
            reportCommandOpen.addValidatorCallback(function (reportRow) {
                //console.log("addValidatorCallback", reportRow); //ExtensionReportRow
                //var rowId = reportRow[0].getRowId();
                var rowCells = reportRow[0].getCells();  // ExtensionReportCells array
                var cellValue = rowCells[0].getValue();  // specific ExtensionReportCell @ idx=0

                // enable the record command for this row if this condition is true
                if (!isEmpty(cellValue) && cellValue.localeCompare("TURNER") === 0) {
                    return true;
                }
                // otherwise, disable the record command for this row
                return false;
            });

            // once invoked by user, action for executing the report command logic for the specific row
            reportCommandOpen.addExecutorCallback(function (reportRow) {
                //console.log("addExecutorCallback", reportRow);
                var rowCells = reportRow[0].getCells();  // ExtensionReportCells array
                var cellValue = rowCells[3].getValue();  // specific ExtensionReportCell @ idx=3

                var incidentId = parseInt(cellValue);
                //console.log("incidentId", incidentId);

                // open the Incident
                extensionProvider.registerWorkspaceExtension(function (workspaceRecord) {
                    workspaceRecord.editWorkspaceRecord('Incident', incidentId, function () {
                        // any logic to run after opening ws record
                    });
                });

                return true;
            });

            // register the report command
            analyticsContext.registerRecordCommand(reportCommandOpen);


            /**
             * External Data Handler
             */
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
                        window.parent.window.$.each(columnDefinitionList, function (i, obj) {
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

function isEmpty(str) {
    return (!str || 0 === str.length || str === undefined);
}

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
