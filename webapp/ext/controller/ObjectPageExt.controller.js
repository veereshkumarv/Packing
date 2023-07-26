sap.ui.define([
    "sap/m/MessageToast",
    'sap/ui/comp/library',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/type/String',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/SearchField',
	'sap/m/Token',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/table/Column',
	'sap/m/Column',
	'sap/m/Text'
], function(MessageToast, compLibrary, Controller, TypeString, ColumnListItem, Label, SearchField, Token, Filter, FilterOperator, ODataModel, UIColumn, MColumn, Text) {
    'use strict';
   
    return {
        onInit: function () {
            var oJson = new sap.ui.model.json.JSONModel({
                "items": []
            });
    
            var oitems = [];
            var oItem = {
                "materialText": "",
                "serialNumber": "",
                "materialNumber": "",
                "dayOwned": "",
                "lastRecievedDate": "",
                "userStatustext": ""
            };

            oitems.push(JSON.parse(JSON.stringify(oItem)));
    
            this.getOwnerComponent().setModel(oJson, "item");
            this.getOwnerComponent().getModel("item").setProperty("/items", oitems);

            var oJson1 = new sap.ui.model.json.JSONModel({
                "items1": []
            });
    
            var oitems1 = [];
            var oItem1 = {
                "operation": "",
                "operationtext": ""
            };

            oitems1.push(JSON.parse(JSON.stringify(oItem1)));
    
            this.getOwnerComponent().setModel(oJson1, "item1");
            this.getOwnerComponent().getModel("item1").setProperty("/items1", oitems1);
            var packURL = sap.ui.getCore().packURL;

        },
        CreateG: function (oEvent) {
            var manOrder = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            manOrder = manOrder.substr(manOrder.length - 12);
            var oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");
            // trigger navigation
            var hash = oCrossAppNav.hrefForExternal({
                target: { semanticObject: "HandlingUnit", action: "enterGoodsReceiptForProductionOrder" },
                params: { "CAUFVD-AUFNR": manOrder }
            });

            var url = window.location.href.split('#')[0] + hash;

            sap.m.URLHelper.redirect(url, true);  
        },
        createHU: function(oEvent) {
            //Open busy dialog
            var busy = new sap.m.BusyDialog();
            //busy.open();
            const Event = oEvent;
            //Get Values Selected by User
            var salesOrderType = oEvent.getSource().getParent().getParent().getBindingContext().getObject().salesOrderType;
            var salesOrder = oEvent.getSource().getParent().getParent().getBindingContext().getObject().salesOrder;
            var customer = oEvent.getSource().getParent().getParent().getBindingContext().getObject().customer;
            var packCustomerType = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packCustomerType;
            var packStockType = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packStockType;
            var packInst = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstObj;
            var packMaterialCust = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialCustr;
            var plant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().plant;
            var batch = oEvent.getSource().getParent().getParent().getBindingContext().getObject().batch;
            var StorLoc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().StorLoc;
            var cancel = 0;
            var oObjectevent = oEvent.getSource().getParent().getParent().getBindingContext().getObject();
            console.log(oObjectevent)
            //determine selected packaging instructions
            if (packInst == oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstru) {
                var packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstructionsKey;
            } else {
                var packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstructionsCustKey;
            }

            //add leading zeroes 
            // var packMaterial = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialObj;
            // packMaterial = packMaterial.substr(packMaterial.length-18);
            var packMaterial = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialObj;           
            var packInstQuant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstQuantObj;
            var product = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().product;
            product = product.substr(product.length-18);
            var auxMat = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialObj;
            auxMat = auxMat.substr(auxMat.length-18);
            var manOrder = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            var carrier = oEvent.getSource().getParent().getParent().getBindingContext().getObject().carrier;
            manOrder = manOrder.substr(manOrder.length-12);
            var matType;
            // var storeThis = this;

            console.log(oObjectevent);

            //determine selected packaging material
            // if (packMaterialCust == oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialObj) 
            if (packMaterialCust == oObjectevent.packagingMaterialObj)             
            {
                matType = packCustomerType
            } 
            // else if (packMaterial == oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialObj) 
            else if (packMaterial == oObjectevent.packagingMaterialObj) 
            {
                matType = packStockType
            }
            console.log(matType)
//          moved it below to process the above condition 
            packMaterial =  "000000000000000000" + packMaterial;
            packMaterial = packMaterial.substr(packMaterial.length-18);
            var storeThis = this;
            //If packaging material is a container
            // if (matType == '0004' || matType == '0005') { New changes
            if (matType == '0004') {
                //Check RFP validation field and carrier
                var event = oEvent
                //get sales order on sales order and ZZ1_RFPRequired_SDH eq true"
                var oModelSO = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/API_SALES_ORDER_SRV");

                oModelSO.read("/A_SalesOrder/?$filter=SalesOrder eq \'" + salesOrder + "\' and ZZ1_RFPRequired_SDH eq true", {
                    success: function(oData, oResponse) {
                        console.log(oData.results)
                        var RFPvalidation= 0
                        var RFPStat = ''
                                                    
                        if ((oData.results.length) > 0) {
                            if (oData.results[0].ZZ1_RFPStatus_SDH != undefined) {
                                if ((oData.results[0].ZZ1_RFPStatus_SDH) == 103 || (oData.results[0].ZZ1_RFPStatus_SDH) == 104) {
                                    RFPvalidation = 1 
                                } else {
                                    sap.m.MessageBox.error('RFP status is not Initial or Final, HU creation is not possible');
                                    busy.close();
                                }
                            }
                            else {
                                sap.m.MessageBox.error('RFP status is not Initial or Final, HU creation is not possible');
                                busy.close();
                            }
                        } 
                        else {
                            RFPvalidation = 1  
                        }
                        console.log(RFPvalidation)
                        console.log(carrier)
                        var payload = "{\"items\":["
                        if (RFPvalidation == 1 && carrier != null && carrier != "" && carrier != 0 ) {
                            // var stat6 = oEvent.getSource().getParent().getParent().getBindingContext().getObject().stat6
                            // var stat7 = oEvent.getSource().getParent().getParent().getBindingContext().getObject().stat7
                            // var stat8 = oEvent.getSource().getParent().getParent().getBindingContext().getObject().stat8
                            // var stat9 = oEvent.getSource().getParent().getParent().getBindingContext().getObject().stat9
                            var oObjecty = this.getView().getParent().getBindingContext().getObject();
                            var stat6 = oObjecty.stat6;
                            var stat7 = oObjecty.stat7;
                            var stat8 = oObjecty.stat8;
                            var stat9 = oObjecty.stat9;
                            var serialNumberList = []

                            var oModelCarrCont = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSCM_CONTAINER_EMPTY_SRV");

                            oModelCarrCont.read("/ZSCM_CONTAINER_L4/?$filter=materialNumber eq \'" + packMaterial + "\'and manufacturer eq \'"+ carrier + "\'and plant eq \'" + plant + "\'", {
                                success: function(oData, oResponse) {  
                                    console.log(oData)    
                                    for(let i=0; i<(oData.results.length); i++) {
                                        var serial = oData.results[i].serialNumber;
                                        if (serialNumberList.includes(serial) == false) {
                                            serialNumberList.push(serial)
                                        }
                                        // removing array elements when not required
                                        else {
                                           if ((serial == oData.results[i].serialNumber && oData.results[i].checkstatus == 'Y')) {
                                            oData.results.splice( i, 1);
                                            i -=1;
                                           }
                                           else if ((serial == oData.results[i-1].serialNumber && oData.results[i-1].checkstatus == 'Y')) {
                                            oData.results.splice( i-1, 1); 
                                            if( i > 1)  {
                                            i -=2;        
                                            } else if( i == 1) {
                                                i = 0;
                                            }
                                           }else if ((serial == oData.results[i+1].serialNumber && oData.results[i+1].checkstatus == 'Y')) {
                                            oData.results.splice( i+1, 1);
                                           }
                                        }
                                    }

                                    //   Process the order for specific statuses 
                                    for(let i=0; i<serialNumberList.length; i++) {
                                      var validate =  serialNumberList[i]
                                      for (let j=0; j<(oData.results.length); j++) {
                                        if ((serial == oData.results[j].serialNumber && oData.results[j].userStatustext != undefined))
                                        {
                                            if ( oData.results[j].status == 'E0003' || oData.results[j].status == 'E0006'  )
                                            {
                                                // remove the item from results table

                                            }

                                        }
                                      }
                                    }    

                                    var count = 0
                                    for(let i=0; i<serialNumberList.length; i++) {
                                        var addToList = 0
                                        var statComp = 0
                                        var unuFlag = 0
                                        var materialText = oData.results[i].materialText
                                        var serialNumber = oData.results[i].serialNumber
                                        var materialNumber = oData.results[i].materialNumber
                                        var dayOwned = oData.results[i].dayOwned
                                        var lastRecievedDate = oData.results[i].lastRecievedDate
                                        var userStatustext = oData.results[i].userStatustext
                                        var totalUserStat = ""

                                        //check status of container matches customer status
                                        if (stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                            statComp += 1
                                        } else if (stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                            statComp += 1
                                        } else if (stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                            statComp += 1
                                        } else if (stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                            statComp += 1
                                        }
                                        // Addition as nodevalue remains empty if (userStatustext.nodeValue != undefined) {
                                        if (userStatustext != undefined) {
                                            if (userStatustext.nodeValue != undefined) {
                                                userStatustext = userStatustext.nodeValue
                                            }
                                        } else {
                                            userStatustext = ""
                                        }

                                        serial = serialNumberList[i]
                                        for(let j=0; j<(oData.results.length); j++){
                                            if ((serial == oData.results[j].serialNumber && oData.results[j].userStatustext != undefined)) {
                                                totalUserStat += oData.results[i].userStatustext + " " 
                                                // totalUserStat += oData.results[j].userStatustext + " " Incorrect array index addressing
                                            }
                                        }
                                        for (let j=0; j<4; j++) {
                                            for(let k=0; k<(oData.results.length); k++){
                                                if (serial == oData.results[k].serialNumber) {
                                                    var userStat = oData.results[k].userStatCode
                                                    console.log("userStat:" + userStat)
                                                    console.log("serial:" + serial)
                                                    if (userStat != undefined) {
                                                        if (userStat.nodeValue != undefined) {
                                                            userStat = userStat.nodeValue
                                                        }
                                                    } else {
                                                        userStat = ''
                                                    }
                                                    if(userStat == 'UNU') {
                                                        unuFlag = 1
                                                    }

                                                    //check status of container matches customer status
                                                    if (j == 0 && stat6 != '' && stat6 != null && stat6 != 'FUM') {
                                                        if (stat6 == userStat || stat6 == 'GP') {
                                                            addToList += 1
                                                        }
                                                    } else if (j == 1 && stat7 != '' && stat7 != null && stat7 != 'FUM') {
                                                        if (stat7 == userStat || stat7 == 'GP') {
                                                            addToList += 1
                                                        }
                                                    } else if (j == 2 && stat8 != '' && stat8 != null && stat8 != 'FUM') {
                                                        if (stat8 == userStat || stat8 == 'GP') {
                                                            addToList += 1
                                                        }
                                                    } else if (j == 3 && stat9 != '' && stat9 != null && stat9 != 'FUM') {
                                                        console.log(stat9)
                                                        if (stat9 == userStat || stat9 == 'GP') {
                                                            addToList += 1
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if (stat6 == '' && stat7 == '' && stat8 == '' && stat9 == '') {
                                            addToList = 1
                                            statComp = 1
                                        }
                                        console.log("addToList:" + addToList)
                                        if (statComp == addToList && unuFlag != 1) {
                                            if (count >= 1 ) {
                                                payload += ","
                                            }
                                            payload += "{\"materialText\":\"" + materialText + "\",\"serialNumber\":\"" + serial + "\",\"materialNumber\":\"" + materialNumber + 
                                            "\",\"dayOwned\":\"" + dayOwned + "\",\"lastRecievedDate\":\"" + lastRecievedDate + "\",\"userStatustext\":\"" + 
                                            totalUserStat + "\"}"
                                            count += 1
                                            console.log(payload)
                                        }
                                    }
                                    payload += "]}"
                                    console.log(payload)
                                    console.log(payload.length)
                                    console.log(RFPvalidation)
                                    if ( RFPvalidation == 1 && payload.length > 10 ) { 
                                        console.log("here")
                                        //var oModelDialog = new sap.ui.model.json.JSONModel();
                                        //oModelDialog.setData(oDialogData);
                                
                                        // create the data to be shown in the table
                                        var oVHData = JSON.parse(payload)
                                        console.log(oVHData)

                                        // create the model to hold the data
                                        var oModel1 = new sap.ui.model.json.JSONModel();
                                        oModel1.setDefaultBindingMode("OneWay");
                                        oModel1.setData(oVHData);
                                
                                        // create the template for the items binding
                                        console.log(storeThis.getOwnerComponent().getModel("item"))
                                        storeThis.getOwnerComponent().getModel("item").setData(oVHData)
                                        console.log(storeThis.getOwnerComponent().getModel("item"))
                                        storeThis._DialogGenerate = sap.ui.xmlfragment("packingapp.packingapp.ext.fragment.CreateHUDialog", storeThis);
                                        storeThis.getView().addDependent(storeThis._DialogGenerate);
                                        storeThis._DialogGenerate.open();
                                        
                                    }
                                }, 
                                error: function(oError){
                                    console.log(oError)
                                }
                            })

                        } else if ( RFPvalidation == 1 && (carrier == 0 || carrier == "" || carrier == null) ) {

                            var oModelNoCarrCont = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSCM_CONTAINER_EMPTY_SRV");

                            oModelNoCarrCont.read("/ZSCM_CONTAINER_L4/?$filter=materialNumber eq \'" + packMaterial + "\'and plant eq \'" + plant + "\'", {
                                success: function(oData, oResponse) {
                                    var serialNumberList = []

                                    for(let i=0; i<(oData.results.length); i++) {
                                        var serial = oData.results[i].serialNumber
                                        if (serialNumberList.includes(serial) == false) {
                                            serialNumberList.push(serial)
                                        }
                                    }
                                    var count = 0
                                    for(let i=0; i<serialNumberList.length; i++) {
                                        var materialText = oData.results[i].materialText
                                        var serialNumber = oData.results[i].serialNumber
                                        var materialNumber = oData.results[i].materialNumber
                                        var dayOwned = oData.results[i].dayOwned
                                        var lastRecievedDate = oData.results[i].lastRecievedDate
                                        var userStatustext = oData.results[i].userStatustext
                                        var totalUserStat = ""

                                        if (userStatustext != undefined) {
                                            userStatustext = userStatustext.nodeValue
                                        } else {
                                            userStatustext = ""
                                        }
                                        serial = serialNumberList[i]
                                        for(let j=0; j<(oData.results.length); j++){
                                            if (serial == oData.results[j].serialNumber && oData.results[j].userStatustext != undefined) {
                                                totalUserStat += (oData.results[j].userStatustext + " ")
                                            }
                                        }
                                        if (count >= 1 ) {
                                            payload += ","
                                        }
                                        
                                        payload += "{\"materialText\":\"" + materialText + "\",\"serialNumber\":\"" + serial + "\",\"materialNumber\":\"" + materialNumber + 
                                        "\",\"dayOwned\":\"" + dayOwned + "\",\"lastRecievedDate\":\"" + lastRecievedDate + "\",\"userStatustext\":\"" + 
                                        totalUserStat + "\"}"
                                        count +=1

                                    }
                                    payload += "]}"

                                    console.log(payload.length)
                                    console.log(RFPvalidation)
                                    if ( RFPvalidation == 1 && payload.length > 10 ) { 
                                        console.log("here")
                                        //var oModelDialog = new sap.ui.model.json.JSONModel();
                                        //oModelDialog.setData(oDialogData);
                                
                                        // create the data to be shown in the table
                                        var oVHData = JSON.parse(payload)
                                        console.log(oVHData)

                                        // create the model to hold the data
                                        var oModel1 = new sap.ui.model.json.JSONModel();
                                        oModel1.setDefaultBindingMode("OneWay");
                                        oModel1.setData(oVHData);
                                
                                        // create the template for the items binding
                                        console.log(storeThis.getOwnerComponent().getModel("item"))
                                        storeThis.getOwnerComponent().getModel("item").setData(oVHData)
                                        console.log(storeThis.getOwnerComponent().getModel("item"))
                                        storeThis._DialogGenerate = sap.ui.xmlfragment("packingapp.packingapp.ext.fragment.CreateHUDialog", storeThis);
                                        storeThis.getView().addDependent(storeThis._DialogGenerate);
                                        storeThis._DialogGenerate.open();
                                        
                                    }
                                },
                                error: function(oError){
                                    console.log(oError)
                                    sap.m.MessageBox.error(oError);
                                }
                            })        
                        }
                        
                    }.bind(this), 
                    error: function(oError){
                        sap.m.MessageBox.error(oError);
                    }

                })
                console.log(this.getOwnerComponent().getModel());

            } 
            
            //If packaging material is a container
            else if  (matType == '0006') {


                if (sap.ui.getCore().byId("OK") === undefined) {
                    var oButton1 = new sap.m.Button("OK", {
                        text: "OK"
                    });
                }
                else if (sap.ui.getCore().byId("OK") != undefined) {
                    var oButton1 = sap.ui.getCore().byId("OK");
                }

            if (sap.ui.getCore().byId("Cancel") === undefined) {
                var oButton2 = new sap.m.Button("Cancel", {
                    text: "Cancel"
                });
            }
            else if (sap.ui.getCore().byId("Cancel") != undefined) {
                var oButton2 = sap.ui.getCore().byId("Cancel");
            }

            oButton2.attachPress(function (evt) {
                if (sap.ui.getCore().byId("Dialog1") != undefined) {
                    sap.ui.getCore().byId("Dialog1").close();
                    sap.ui.getCore().byId("Dialog1").destroy();
                }
            });

          var oDialog = new sap.m.Dialog("Dialog1", {
                title: "Select Seal Number",
                contentWidth: "20%",
                closeOnNavigation: true,
                buttons: [oButton1, oButton2],
                content: [
                    new sap.m.Label({ text: "Seal Number:", required: true }),
                    new sap.m.Input({ maxLength: 8, id: "SealNumber" })
                ]
            });

            oDialog.addStyleClass("sapUiContentPadding");
            oDialog.open()

            oButton1.attachPress(function (evt) {
                var sealn = sap.ui.getCore().byId("SealNumber").getValue()
                if (sap.ui.getCore().byId("Dialog1") != undefined) {
                    sap.ui.getCore().byId("Dialog1").close();
                    sap.ui.getCore().byId("Dialog1").destroy();
                }
                var oModelCreate = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");

                oModelCreate.callFunction("/CreateHU", {
                    method: "POST",
                    urlParameters: {                    
                        manOrder: manOrder,
                        batch: batch,
                        packMaterial: packMaterial, 
                        plant: plant,
                        packInst: packInstructionsKey,
                        product: product, 
                        sealNumber: sealn,
                        serialNumber: '',
                        storLocItem: StorLoc,
                        auxMaterial: auxMat,
                        customer: customer,
                        packInstQuant: packInstQuant
                    },
                    success: function(oData, oResponse) {
                        console.log(oData)
                        var message = oData.Message
                        var messageType = oData.Type
                        if (messageType == 'S') {
                            console.log(message)
                            sap.m.MessageToast.show(message);
                        } else {
                            sap.m.MessageBox.error(message);
                        }
                        
                    }.bind(this),
                    error: function(oError) {
                        console.log(oError)
                        sap.m.MessageBox.error(oError);

                    }, 
                })

            });
            
            }
            else {

                var oModelCreateHU = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");

                oModelCreateHU.callFunction("/CreateHU", {
                    method: "POST",
                    urlParameters: {                    
                        manOrder: manOrder,
                        batch: batch,
                        packMaterial: packMaterial, 
                        plant: plant,
                        // packInst: encodeURI(packInstructionsKey), 
                        // commenting as only curly braces will be used in the field as per latest discussion if any new special charater pops-up 
                        // then addition changes required in future
                        packInst: packInstructionsKey,
                        product: product, 
                        sealNumber: '',
                        serialNumber: '',
                        storLocItem: StorLoc,
                        auxMaterial: auxMat,
                        customer: customer,
                        packInstQuant: packInstQuant
                    },
                    success: function(oData, oResponse) {
                        console.log(oData)
                        var message = oData.Message
                        var messageType = oData.Type
                        if (messageType == 'S') {
                            console.log(message)
                            sap.m.MessageToast.show(message);
                        } else {
                            sap.m.MessageBox.error(message);
                        }
                        
                    },
                    error: function(oError) {
                        console.log(oError)
                        sap.m.MessageBox.error(oError);

                    }, 
                })
            }



            //CREATE HU IF NOT CONT
            
        },


        createSample: function(oEvent) {
            console.log("here")

            var manOrder = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            manOrder = manOrder.substr(manOrder.length-12);
            var material = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().product;
            material = material.substr(material.length-18);
            var plant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().plant;
            var operationvhURL = "/packingapplication/sap/opu/odata/sap/ZSCM_PACKINGAPP_SB_V02/ZSCM_I_SampleOperationVH_L1?$filter=prodorder eq \'" + manOrder + "\'" ;
            var payload = "{\"items\":["
            var operation
            var shortText
            var storeThis = this;

            var oModelSO = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSCM_PACKAPP_SRV");

            oModelSO.read("/ZSCM_I_SampleOperationVH_L1?$filter=prodorder eq \'" + manOrder + "\'", {
                success: function(oData, oResponse) {
                    console.log(oData)
                    for(let i=0; i<(oData.results.length); i++) {
                        operation = oData.results[i].activity
                        shortText = oData.results[i].shortText
                        payload += "{\"operation\":\"" + operation + "\",\"operationText\":\"" + shortText + "\"}"
                        if ((i+1)<(oData.results.length)) {
                            payload += ","
                        }
                    }
                    payload += "]}"
                    console.log(payload)
                    // create the data to be shown in the table
                    var oVHData = JSON.parse(payload)
                    console.log(oVHData)

                    // create the model to hold the data
                    var oModel1 = new sap.ui.model.json.JSONModel();
                    oModel1.setDefaultBindingMode("OneWay");
                    oModel1.setData(oVHData);
            
                    // create the template for the items binding
                    console.log(storeThis.getOwnerComponent().getModel("item1"))
                    storeThis.getOwnerComponent().getModel("item1").setData(oVHData)
                    console.log(storeThis.getOwnerComponent().getModel("item1"))
                    storeThis._DialogGenerate = sap.ui.xmlfragment("packingapp.packingapp.ext.fragment.CreateSampleDialog", storeThis);
                    storeThis.getView().addDependent(storeThis._DialogGenerate);
                    storeThis._DialogGenerate.open();
                },
                error: function(oError) {
                    console.log(oError)
                    sap.m.MessageBox.error(oError);
                }, 
            })

            // var oModelCreateSample = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");

            // oModelCreateSample.callFunction("/updateManuDate", {
            //     method: "POST",
            //     urlParameters: {                    
            //         manOrder: manOrder,
            //         batch: batch,
            //         plant: plant,
            //         product: product
            //     },
            //     success: function(oData, oResponse) {
            //         console.log(oData)
            //         var message = oData.Message
            //         var messageType = oData.Type
            //         if (messageType == 'S') {
            //             console.log(message)
            //             sap.m.MessageToast.show(message);
            //         } else {
            //             sap.m.MessageBox.error(message);
            //         }
                    
            //     },
            //     error: function(oError) {
            //         console.log(oError)
            //         sap.m.MessageBox.error(oError);
            //     }, 
            // })

            // $.ajax({
            //     url: operationvhURL,
            //     type: "get",
            //     contentType: "application/json",
            //     async: false,
            //     success: function(data, textStatus, jqXHR) {
            //         console.log(data)
            //         for(let i=0; i<(data.getElementsByTagName("d:activity").length); i++) {
            //             operation = data.getElementsByTagName("d:activity")[i].childNodes[0].nodeValue
            //             shortText = data.getElementsByTagName("d:shortText")[i].childNodes[0].nodeValue
            //             payload += "{\"operation\":\"" + operation + "\",\"operationText\":\"" + shortText + "\"}"
            //             if ((i+1)<(data.getElementsByTagName("d:activity").length)) {
            //                 payload += ","
            //             }
            //         }
            //         payload += "]}"
            //         console.log(payload)
            //     }
            // })


            //var oModelDialog = new sap.ui.model.json.JSONModel();
            //oModelDialog.setData(oDialogData);
    
            
        },

        sendToCoLos: function(oEvent) {
            var product = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().product;
            product = product.substr(product.length-18);
            var manOrder = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            manOrder = manOrder.substr(manOrder.length-12);
            var plant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().plant;
            var batch = oEvent.getSource().getParent().getParent().getBindingContext().getObject().batch;
            var oModelSendToCoLos = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");

            oModelSendToCoLos.callFunction("/updateManuDate", {
                method: "POST",
                urlParameters: {                    
                    manOrder: manOrder,
                    batch: batch,
                    plant: plant,
                    product: product
                },
                success: function(oData, oResponse) {
                    console.log(oData)
                    var message = oData.Message
                    var messageType = oData.Type
                    if (messageType == 'S') {
                        console.log(message)
                        sap.m.MessageToast.show(message);
                    } else {
                        sap.m.MessageBox.error(message);
                    }
                    
                },
                error: function(oError) {
                    console.log(oError)
                    sap.m.MessageBox.error(oError);
                }, 
            })
            //var callIflow = "/packingapplication/cpi/http/COLOS/ProductionOrder"
            // $.ajax({
            //     url: callIflow,
            //     type: "get",
            //     contentType: "application/json",
            //     async: false,
            //     headers: {
            //         "productionOrder": manOrder,
            //         "TransactionType": 'I'

            //     },
            //     success: function(data, textStatus, request) {
            //         sap.m.MessageToast.show('Send to Printer Success');
            //     },
            //     error: function (data) {   
            //         sap.m.MessageToast.show('Send to Printer Failed');
            //     }
            // })
        },

        addToExisting: function(oEvent) {

            this._DialogGenerate = sap.ui.xmlfragment("packingapp.packingapp.ext.fragment.AddToExistingDialog", this);
            this.getView().addDependent(this._DialogGenerate);
            this._DialogGenerate.open();

        },

        displyPackInst: function(oEvent) {
            // var packInstURL = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstURL255;
            var packInstURL = sap.ui.getCore().packURL;
            if ( packInstURL != "" ) {
            console.log(packInstURL);
            window.open(packInstURL);  
            }
            if ( packInstURL == "" ) {
                sap.m.MessageToast.show('There is no link for this packing instruction');
            }
        },

        packToOrder: function(oEvent) {

            var PackingInstructionsSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().PackingInstructionsSO;
            var PackingInstDescSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().PackingInstDescSO;
            var PackingInstQuantSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().PackingInstQuantSO;
            var packagingMaterialSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().packagingMaterialSO;
            var packagingMaterialDescriptionSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().packagingMaterialDescriptionSO;
            var auxMaterialSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().auxMaterialSO;
            var auxMaterialDescSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().auxMaterialDescSO;
            var StackingPatternSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().StackingPatternSO;
            var HeightSettingSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().HeightSettingSO;
            var AlternateSO = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().AlternateSO;
            // var productCust = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().product;
            // var customer = oEvent.getSource().getParent().getParent().getSelectedContexts()[0].getObject().customer;
            // if (customer == null || customer == "")
            // {
            //     customer = 0;   
            // }
            // if (productCust == null || productCust == "")
            // {
            //     productCust = 0;   
            // }
            if (PackingInstructionsSO == "" || PackingInstructionsSO == null) {
                sap.m.MessageBox.error("No Packaging Instructions Associated With This Order", {
                        title: "Error",                                      // default
                        onClose: null,                                       // default
                        styleClass: "",                                      // default
                        actions: sap.m.MessageBox.Action.CLOSE,              // default
                        emphasizedAction: null,                              // default
                        initialFocus: null,                                  // default
                        textDirection: sap.ui.core.TextDirection.Inherit     // default
                });
            } else {
                // Get new packing instruction for the selected material and customer 
                // var oupdateSequence = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");
                // oupdateSequence.callFunction("/updatePackingInst", {
                //     method: "GET",
                //     urlParameters: {   
                //         product: productCust, 
                //         customer: customer                        
                //     } ,
                //     success: function(oData, oResponse) {
                //         console.log(oData)
                        
                //         var oObject = this.getView().getParent().getBindingContext().getObject();
                //         var ordert = oObject.orderNumber;
                //         var productt = oObject.product;
                //         var plantt = oObject.plant;
                //         // var tempt = `/ZSCM_C_PACKING_APP(orderNumber='${ordert}',plant='${plantt}',product='${productt}')/PackingInstDescObj`;
                //         // var setvalues = this.getOwnerComponent().getModel().setProperty(tempt,oData.packInst);
                //         var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSCM_PACKAPP_SRV");
                //         if (oModel != undefined ){
                //         var sPath = oModel.createKey("/ZSCM_C_PACKING_APP", {orderNumber: ordert,
                //             plant:plantt,
                //             product: productt });
                //         }
                //         let q =sap.ui.getCore().byId("smartformImportance");
                //            let oView = this;
                //            let testt = oView.getOwnerComponent().getModel();


                //         // tempt = `/ZSCM_C_PACKING_APP(orderNumber='${ordert}',plant='${plantt}',product='${productt}')/quantID`;
                //         // setvalues = this.getOwnerComponent().getModel().setProperty(tempt,PackingInstQuantSO);

                //         // tempt = `/ZSCM_C_PACKING_APP(orderNumber='${ordert}',plant='${plantt}',product='${productt}')/packMaterialID`;
                //         // setvalues = this.getOwnerComponent().getModel().setProperty(tempt,packagingMaterialSO);

                //         // tempt = `/ZSCM_C_PACKING_APP(orderNumber='${ordert}',plant='${plantt}',product='${productt}')/packMaterialDescID`;
                //         // setvalues = this.getOwnerComponent().getModel().setProperty(tempt,packagingMaterialDescriptionSO);

                //         // tempt = `/ZSCM_C_PACKING_APP(orderNumber='${ordert}',plant='${plantt}',product='${productt}')/heightSettingID`;
                //         // setvalues = this.getOwnerComponent().getModel().setProperty(tempt,HeightSettingSO);

                //         // tempt = `/ZSCM_C_PACKING_APP(orderNumber='${ordert}',plant='${plantt}',product='${productt}')/alternateID`;
                //         // setvalues = this.getOwnerComponent().getModel().setProperty(tempt,AlternateSO);

                //         // tempt = `/ZSCM_C_PACKING_APP(orderNumber='${ordert}',plant='${plantt}',product='${productt}')/stackingPatternID`;
                //         // setvalues = this.getOwnerComponent().getModel().setProperty(tempt,StackingPatternSO);

                //         // tempt = `/ZSCM_C_PACKING_APP(orderNumber='${ordert}',plant='${plantt}',product='${productt}')/auxMatID`;
                //         // setvalues = this.getOwnerComponent().getModel().setProperty(tempt,auxMaterialSO);

                //         // tempt = `/ZSCM_C_PACKING_APP(orderNumber='${ordert}',plant='${plantt}',product='${productt}')/auxMatDescID`;
                //         // setvalues = this.getOwnerComponent().getModel().setProperty(tempt,auxMaterialDescSO);

                //         // sap.ui.getCore().byId("__xmlview1--packInstructionID").setValue(PackingInstructionsSO);
                //         // sap.ui.getCore().byId("__xmlview1--quantID").setValue(PackingInstQuantSO);
                //         // sap.ui.getCore().byId("__xmlview1--packMaterialID").setValue(packagingMaterialSO);
                //         // sap.ui.getCore().byId("__xmlview1--packMaterialDescID").setValue(packagingMaterialDescriptionSO);
                //         // sap.ui.getCore().byId("__xmlview1--heightSettingID").setValue(HeightSettingSO);
                //         // sap.ui.getCore().byId("__xmlview1--alternateID").setValue(AlternateSO);
                //         // sap.ui.getCore().byId("__xmlview1--stackingPatternID").setValue(StackingPatternSO);
                //         // sap.ui.getCore().byId("__xmlview1--auxMatID").setValue(auxMaterialSO);
                //         // sap.ui.getCore().byId("__xmlview1--auxMatDescID").setValue(auxMaterialDescSO);
                //         // oData.packInst  = 500;
                //         // var callt1 = new sap.ui.core.mvc.Controller("packingapp.packingapp.ext.controller.CustomButtons");
                //         // var testt1 = callt1.onPress( undefined, oData.packInst );

                //         if( oData.packInst != "" )
                //         {

                //         tempt = `/ZSCM_C_PACKING_APP(orderNumber='${ordert}',plant='${plantt}',product='${productt}')/packInstructionDescID`;
                //         setvalues = this.getOwnerComponent().getModel().setProperty(tempt,oData.packInst);

                //             // sap.ui.getCore().byId("__xmlview1--packInstructionDescID").setValue(PackingInstDescSO);
                      
                //             // this.onPress( undefined, oData.packInst );
                //         //   var callt = new sap.ui.core.mvc.Controller("packingapp.packingapp.ext.controller.CustomButtons");
                //         //   var testt = callt.onPress( undefined, oData.packInst );
                //         }
                //         else
                //         {
                //             this.onPress( undefined, oData.packInst );
                //             sap.m.MessageToast.show("No customer specific packing instruction available");
                //         }
                        
                //     }.bind(this),
                //     error: function(oError) {
                //         console.log(oError)
                //         // sap.m.MessageToast.show(oError);
                //         sap.m.MessageToast.show("No customer specific packing instruction available");
                //     }, 
                // });

                
                sap.ui.getCore().byId("__xmlview1--packInstructionID").setValue(PackingInstructionsSO);
                sap.ui.getCore().byId("__xmlview1--quantID").setValue(PackingInstQuantSO);
                sap.ui.getCore().byId("__xmlview1--packMaterialID").setValue(packagingMaterialSO);
                sap.ui.getCore().byId("__xmlview1--packMaterialDescID").setValue(packagingMaterialDescriptionSO);
                sap.ui.getCore().byId("__xmlview1--heightSettingID").setValue(HeightSettingSO);
                sap.ui.getCore().byId("__xmlview1--alternateID").setValue(AlternateSO);
                sap.ui.getCore().byId("__xmlview1--stackingPatternID").setValue(StackingPatternSO);
                sap.ui.getCore().byId("__xmlview1--auxMatID").setValue(auxMaterialSO);
                sap.ui.getCore().byId("__xmlview1--auxMatDescID").setValue(auxMaterialDescSO);

            }
        },

        onActionCancel: function () {
            this._DialogGenerate.close();
            this._DialogGenerate.destroy();
            this.getView().removeDependent(this._DialogGenerate);
            this._DialogGenerate = null;
        },

        onActionOKCreateHU: function (oEvent) { 
            var customer = oEvent.getSource().getParent().getParent().getBindingContext().getObject().customer;
            var packCustomerType = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packCustomerType;
            var packStockType = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packStockType;
            var packInst = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstObj;
            var packMaterialCust = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialCustr;
            var plant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().plant;
            var batch = oEvent.getSource().getParent().getParent().getBindingContext().getObject().batch;
            var StorLoc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().StorLoc;

            //determine selected packaging instructions
            if (packInst == oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstru) {
                var packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstructionsKey;
            } else {
                var packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstructionsCustKey;
            }

            //add leading zeroes 
            var packMaterial = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialObj;
            packMaterial = packMaterial.substr(packMaterial.length-18);
            var packInstQuant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstQuantObj;
            var product = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().product;
            product = product.substr(product.length-18);
            var auxMat = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialObj;
            auxMat = auxMat.substr(auxMat.length-18);
            var manOrder = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            manOrder = manOrder.substr(manOrder.length-12);
            console.log(sap.ui.getCore())
            var container = sap.ui.getCore().byId("containerInput").getValue();
            var seal = sap.ui.getCore().byId("sealNumberInput").getValue();

            var oModelCreateHU = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");

            oModelCreateHU.callFunction("/CreateHU", {
                method: "POST",
                urlParameters: {                    
                    manOrder: manOrder,
                    batch: batch,
                    packMaterial: packMaterial, 
                    plant: plant,
                    // packInst: encodeURI(packInstructionsKey), 
                    // commenting as only curly braces will be used in the field as per latest discussion if any new special charater pops-up 
                    // then addition changes required in future
                    packInst: packInstructionsKey,
                    product: product, 
                    sealNumber: seal,
                    serialNumber: container,
                    storLocItem: StorLoc,
                    auxMaterial: auxMat,
                    customer: customer,
                    packInstQuant: packInstQuant
                },
                success: function(oData, oResponse) {
                    console.log(oData)
                    var message = oData.Message
                    var messageType = oData.Type
                    if (messageType == 'S') {
                        console.log(message)
                        sap.m.MessageToast.show(message);
                    } else {
                        sap.m.MessageBox.error(message);
                    }
                    
                },
                error: function(oError) {
                    console.log(oError)
                    sap.m.MessageBox.error(oError);
                }, 
            })

            this._DialogGenerate.close();
            this._DialogGenerate.destroy();
            this.getView().removeDependent(this._DialogGenerate);
            this._DialogGenerate = null;
        },

        onActionOKCreateSample: function (oEvent) {
            var manOrder = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            manOrder = manOrder.substr(manOrder.length-12);
            var material = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().product;
            material = material.substr(material.length-18);
            var plant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().plant;
            var operation = sap.ui.getCore().byId("opNumInput").getValue();
            var container = sap.ui.getCore().byId("palletInput").getValue();

            var oModelCreateSample = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");

            oModelCreateSample.callFunction("/createSample", {
                method: "POST",
                urlParameters: {                    
                    container: container,
                    material: material,
                    operationNumber: operation,
                    plant: plant,
                    palletID: '',
                    order: manOrder
                },
                success: function(oData, oResponse) {
                    console.log(oData)
                    var message = oData.Message
                    var messageType = oData.Type
                    if (messageType == 'S') {
                        console.log(message)
                        sap.m.MessageToast.show(message);
                    } else {
                        sap.m.MessageBox.error(message);
                    }
                    
                },
                error: function(oError) {
                    console.log(oError)
                    sap.m.MessageBox.error(oError);
                }, 
            })
            this._DialogGenerate.close();
            this._DialogGenerate.destroy();
            this.getView().removeDependent(this._DialogGenerate);
            this._DialogGenerate = null;

        },

        onActionOKAddToExisting: function (oEvent) {
            var packInst = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstObj;
            if (packInst == oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstru) {
                var packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstructionsKey;
            } else {
                var packInstructionsKey = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstructionsCustKey;
            }
            var packMaterialCust = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialCustr;
            var s3 = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialObj;
            var packMaterial = s3.substr(s3.length-18);
            var packInstQuant = parseFloat(oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstQuantObj);
            var s1 = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialObj;
            var packMaterial = s1.substr(s1.length-18);
            var s2 = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().product;
            var product = s2.substr(s2.length-18);
            var manOrder = oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            var manOrder1 = "00000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().orderNumber;
            var manOrder2 = manOrder1.substr(manOrder1.length-12);
            var plant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().plant;
            var batch = oEvent.getSource().getParent().getParent().getBindingContext().getObject().batch;
            var StorLoc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().StorLoc;
            var auxMat = "000000000000000000" + oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialObj
            auxMat = auxMat.substr(auxMat.length-18);

            var serialNumber = sap.ui.getCore().byId("containerInput").getValue()
            console.log(serialNumber)

            var oModelCreateHU = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZSCM_PACKINGACTION_SRV_SRV");

            oModelCreateHU.callFunction("/addToExistingHU", {
                method: "POST",
                urlParameters: {                    
                    manOrder: manOrder2,
                    batch: batch,
                    packMaterial: packMaterial, 
                    plant: plant,
                    // packInst: encodeURI(packInstructionsKey), 
                    // commenting as only curly braces will be used in the field as per latest discussion if any new special charater pops-up 
                    // then addition changes required in future
                    packInst: packInstructionsKey,
                    product: product, 
                    serialNumber: serialNumber,
                    storLocItem: StorLoc,
                    packInstQuant: packInstQuant
                },
                success: function(oData, oResponse) {
                    console.log(oData)
                    var message = oData.Message
                    var messageType = oData.Type
                    if (messageType == 'S') {
                        console.log(message)
                        sap.m.MessageToast.show(message);
                    } else {
                        sap.m.MessageBox.error(message);
                    }
                    
                },
                error: function(oError) {
                    console.log(oError)
                    sap.m.MessageBox.error(oError);
                }, 
            })

            this._DialogGenerate.close();
            this._DialogGenerate.destroy();
            this.getView().removeDependent(this._DialogGenerate);
            this._DialogGenerate = null;

        },

        onValueHelpRequestedHUCont: function() {

            var oModel1 = new sap.ui.model.json.JSONModel();
            oModel1.setDefaultBindingMode("OneWay");
            oModel1.setData(this.getOwnerComponent().getModel("item").getData());
            console.log(oModel1)
            console.log(this.getOwnerComponent().getModel("item").getData())

            this._oValueHelpDialog = sap.ui.xmlfragment("packingapp.packingapp.ext.fragment.ContValueHelpDialog", this);
            this.getView().addDependent(this._oValueHelpDialog);
            this._oBasicSearchField = new SearchField();
            var oFilterBar = this._oValueHelpDialog.getFilterBar();
            oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);

            this._oValueHelpDialog.setRangeKeyFields([{
                label: "Serial Number",
                key: "serialNumber",
                type: "string",
                typeInstance: new TypeString({}, {
                    maxLength: 10
                })
            }]);

            // Trigger filter bar search when the basic search is fired
            this._oBasicSearchField.attachSearch(function() {
                oFilterBar.search();
            });

            //console.log(model)
            this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                console.log("here")
                oTable.setModel(oModel1);
                if (oTable.bindRows) {
                    // Bind rows to the ODataModel and add columns
                    oTable.bindAggregation("rows", {
                        path: "/items",
                        events: {
                            dataReceived: function() {
                                oDialog.update();
                            }
                        }
                    });
                    oTable.addColumn(new UIColumn({label: "Serial Number", template: "serialNumber"}));
                    oTable.addColumn(new UIColumn({label: "Material Number", template: "materialNumber"}));
                    oTable.addColumn(new UIColumn({label: "Material Text", template: "materialText"}));
                    oTable.addColumn(new UIColumn({label: "User Status", template: "userStatustext"}));
                    oTable.addColumn(new UIColumn({label: "Last Recieved Date", template: "lastRecievedDate"}));
                    oTable.addColumn(new UIColumn({label: "Days Owned", template: "dayOwned"}));


                    
                }

                // For Mobile the default table is sap.m.Table
                if (oTable.bindItems) {
                    // Bind items to the ODataModel and add columns
                    oTable.bindAggregation("items", {
                        path: "/items",
                        template: new sap.m.ColumnListItem({
                            type : "Active",
                            unread : false,
                            cells : [
                                new sap.m.Label({
                                    text : "{materialNumber}",
                                    wrapping: true
                                }), new sap.m.Label({
                                    text: "{materialText}",
                                    wrapping: true
                                }), new sap.m.Label({
                                    text: "{serialNumber}",
                                    wrapping: true
                                }), new sap.m.Label({
                                    text: "{userStatustext}",
                                    wrapping: true
                                }), new sap.m.Label({
                                    text: "{lastRecievedDate}",
                                    wrapping: true
                                }), new sap.m.Label({
                                    text: "{dayOwned}",
                                    wrapping: true
                                })
                            ]
                        }),
                        events: {
                            dataReceived: function() {
                                oDialog.update();
                            }
                        }
                    });
                    oTable.addColumn(new MColumn({header: new Label({text: "Serial Number"})}));
                    oTable.addColumn(new MColumn({header: new Label({text: "Material Number"})}));
                    oTable.addColumn(new MColumn({header: new Label({text: "Material Text"})}));
                    oTable.addColumn(new MColumn({header: new Label({text: "User Status"})}));
                    oTable.addColumn(new MColumn({header: new Label({text: "Last Recieved Date"})}));
                    oTable.addColumn(new MColumn({header: new Label({text: "Days Owned"})}));
                }
            });
            this._oValueHelpDialog.open();
        },

        onValueHelpRequestedSample: function() {

            var oModel2 = new sap.ui.model.json.JSONModel();
            oModel2.setDefaultBindingMode("OneWay");
            oModel2.setData(this.getOwnerComponent().getModel("item1").getData());
            console.log(oModel2)
            console.log(this.getOwnerComponent().getModel("item1").getData())

            this._oValueHelpDialog = sap.ui.xmlfragment("packingapp.packingapp.ext.fragment.OperationValueHelpDialog", this);
            this.getView().addDependent(this._oValueHelpDialog);
            this._oBasicSearchField = new SearchField();
            var oFilterBar = this._oValueHelpDialog.getFilterBar();
            oFilterBar.setFilterBarExpanded(false);
            oFilterBar.setBasicSearch(this._oBasicSearchField);

            this._oValueHelpDialog.setRangeKeyFields([{
                label: "Operation Number",
                key: "operation",
                type: "string",
                typeInstance: new TypeString({}, {
                    maxLength: 10
                })
            }]);

            // Trigger filter bar search when the basic search is fired
            this._oBasicSearchField.attachSearch(function() {
                oFilterBar.search();
            });

            //console.log(model)
            this._oValueHelpDialog.getTableAsync().then(function (oTable) {
                console.log("here")
                oTable.setModel(oModel2);
                if (oTable.bindRows) {
                    // Bind rows to the ODataModel and add columns
                    oTable.bindAggregation("rows", {
                        path: "/items",
                        events: {
                            dataReceived: function() {
                                oDialog.update();
                            }
                        }
                    });
                    oTable.addColumn(new UIColumn({label: "Activity", template: "operation"}));
                    oTable.addColumn(new UIColumn({label: "Operation Short Text", template: "operationText"}));
                }

                // For Mobile the default table is sap.m.Table
                if (oTable.bindItems) {
                    // Bind items to the ODataModel and add columns
                    oTable.bindAggregation("items", {
                        path: "/items",
                        template: new sap.m.ColumnListItem({
                            type : "Active",
                            unread : false,
                            cells : [
                                new sap.m.Label({
                                    text : "{operation}",
                                    wrapping: true
                                }), new sap.m.Label({
                                    text: "{operationText}",
                                    wrapping: true
                                })
                            ]

                        }),
                        events: {
                            dataReceived: function() {
                                oDialog.update();
                            }
                        }
                    });
                    oTable.addColumn(new MColumn({header: new Label({text: "Activity"})}));
                    oTable.addColumn(new MColumn({header: new Label({text: "Operation Short Text"})}));

                }
            });
            this._oValueHelpDialog.open();
        },

        onValueHelpOkPress: function (oEvent) {
            console.log(oEvent)
            var input = sap.ui.getCore().byId("containerInput");
            var container = oEvent.getParameter("tokens")[0].getKey()
            input.setValue(container)
            console.log(oEvent.getParameter("tokens")[0].getKey())
            this._oValueHelpDialog.close();
            this._oValueHelpDialog.destroy();
        },

        onValueHelpCancelPress: function () {
            this._oValueHelpDialog.close();
            this._oValueHelpDialog.destroy();
            console.log("hii")
        },

        onValueHelpSampleOkPress: function (oEvent) {
            var input = sap.ui.getCore().byId("opNumInput");
            var operation = oEvent.getParameter("tokens")[0].getKey()
            input.setValue(operation)
            console.log(oEvent.getParameter("tokens")[0].getKey())
            this._oValueHelpDialog.close();
            this._oValueHelpDialog.destroy();
            console.log("hii")
        },


        onFilterBarSearch: function (oEvent) {
            var aSelectionSet = oEvent.getParameter("selectionSet");
            var sSearchQuery = this._oBasicSearchField.getValue();
            console.log(aSelectionSet)
            var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                if (oControl.getValue()) {
                    aResult.push(new Filter({
                        path: oControl.getName(),
                        operator: FilterOperator.Contains,
                        value1: oControl.getValue()
                    }));
                }

                return aResult;
            }, []);

            aFilters.push(new Filter({
                filters: [
                    new Filter({ path: "serialNumber", operator: FilterOperator.Contains, value1: sSearchQuery }),
                ],
                and: false
            }));

            this._filterTable(new Filter({
                filters: aFilters,
                and: true
            }));
        },  
        
        onFilterBarSearchSample: function (oEvent) {
            var aSelectionSet = oEvent.getParameter("selectionSet");
            var sSearchQuery = this._oBasicSearchField.getValue();
            console.log(aSelectionSet)
            var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
                if (oControl.getValue()) {
                    aResult.push(new Filter({
                        path: oControl.getName(),
                        operator: FilterOperator.Contains,
                        value1: oControl.getValue()
                    }));
                }

                return aResult;
            }, []);

            aFilters.push(new Filter({
                filters: [
                    new Filter({ path: "operation", operator: FilterOperator.Contains, value1: sSearchQuery }),
                ],
                and: false
            }));

            this._filterTable(new Filter({
                filters: aFilters,
                and: true
            }));
        }, 

        _filterTable: function (oFilter) {
            var oValueHelpDialog = this._oValueHelpDialog;

            oValueHelpDialog.getTableAsync().then(function (oTable) {
                if (oTable.bindRows) {
                    oTable.getBinding("rows").filter(oFilter);
                }

                if (oTable.bindItems) {
                    oTable.getBinding("items").filter(oFilter);
                }

                oValueHelpDialog.update();
            });
        },   

    };
});