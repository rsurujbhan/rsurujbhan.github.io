/**
 * @license
 * Copyright (c) 2023 Oracle Corporation. All rights reserved.
 * ***********************************************************
 * @file Interview Extensions - customOptions with async interview.fetch
 * @author robert.surujbhan@oracle.com
 * ***********************************************************
 */


/**
 * reusable utility method to check for empty strings/objects
 */
const isEmpty = (str) => {
    return (!str || 0 === str.length || str === undefined);
};


/**
 * reusable utility method to invoke the Interview Extension Data Connection
 */
const getExternalData = async (text, interview) => {
    console.log(`getExternalData search on: ${text}`);
    try {
        let connOptions = {
            connectionName: "ClearbitCompanyAPI",
            method: "GET",
            relativeUri: `/suggest?query=${text}`,
            contentType: "application/json",
            body: null
        }
        const response = await interview.fetch(connOptions);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            const companyArray = data.map(item => {
                return {
                    text: item.name,
                    value: item.name
                };
            });
            return companyArray;
        }
        else {
            throw new Error(`response NOT ok: ${response.status}`);
        }
    }
    catch (e) {
        console.error(e);
        return [];
    }
}

// init globals
let companyArray1 = [];
let companyArray2 = [];
let companyArray3 = [];
let companyArray4 = [];

OraclePolicyAutomation.AddExtension({
    onChange: async function(event) {
        if (event.control.kind === "input") {
            const fieldName = event.control.getProperty("name");
            console.log(`field change: ${fieldName}`);
            switch (fieldName) {
                case 'field-01':
                    companyArray2 = [];
                    companyArray3 = [];
                    companyArray4 = [];
                    event.interview.update();
                    const fieldOne = event.interview.getValue("fieldOne");
                    if (!isEmpty(fieldOne)) {
                        const response2 = await getExternalData(encodeURIComponent(fieldOne), event.interview);
                        companyArray2 = response2;
                    }
                    break;
                case 'field-02':
                    companyArray3 = [];
                    companyArray4 = [];
                    event.interview.update();
                    const fieldTwo = event.interview.getValue("fieldTwo");
                    if (!isEmpty(fieldTwo)) {
                        const response3 = await getExternalData(encodeURIComponent(fieldTwo), event.interview);
                        companyArray3 = response3;
                    }
                    break;
                case 'field-03':
                    companyArray4 = [];
                    event.interview.update();
                    const fieldThree = event.interview.getValue("fieldThree");
                    if (!isEmpty(fieldThree)) {
                        const response4 = await getExternalData(encodeURIComponent(fieldThree), event.interview);
                        companyArray4 = response4;
                    }
                    break;
                case 'field-04':
                    // do nothing
                    break;
                default:
            }
            event.interview.update();
        }
    },
    customContainer: function (control, interview) {
        if (control.getProperty("type") === "controller") {
            return {
                mount: async function (el) {
                    const response1 = await getExternalData(interview.getValue("seed"), interview);
                    companyArray1 = response1;
                    interview.update();
                },
                update: function (el) {
                    return;
                }
            }
        }
    },
    customOptions: function (control, interview) {

        if (control.getProperty("type") === "my-options") {

            if (control.getProperty("name") === "field-01") {
                return {
                    options: function () {
                        return (companyArray1.length === 0) ? null : companyArray1;
                    },
                    controlType: "Dropdown"
                }
            }
    
            if (control.getProperty("name") === "field-02") {
                return {
                    options: function () {
                        return (companyArray2.length === 0) ? null : companyArray2;
                    },
                    controlType: "Dropdown"
                }
            }
    
            if (control.getProperty("name") === "field-03") {
                return {
                    options: function () {
                        return (companyArray3.length === 0) ? null : companyArray3;
                    },
                    controlType: "Dropdown"
                }
            }
    
            if (control.getProperty("name") === "field-04") {
                return {
                    options: function () {
                        return (companyArray4.length === 0) ? null : companyArray4;
                    },
                    controlType: "Dropdown"
                }
            }
        }
    }
});
