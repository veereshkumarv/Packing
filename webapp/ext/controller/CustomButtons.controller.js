sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    var PageController = Controller.extend("packingapp.ext.controller.ObjectPageExt", {

		onPress: function (oEvent) {
            if(oEvent.getSource().getId() == "__xmlview1--PackToCust") {
                var packInstCustomerNum1 = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingCustomerInstructions;
                console.log(packInstCustomerNum1)
                if (packInstCustomerNum1 == "" || packInstCustomerNum1 == null) {
                    sap.m.MessageBox.error("No Packaging Instructions Associated With This Customer", {
                        title: "Error",                                      // default
                        onClose: null,                                       // default
                        styleClass: "",                                      // default
                        actions: sap.m.MessageBox.Action.CLOSE,              // default
                        emphasizedAction: null,                              // default
                        initialFocus: null,                                  // default
                        textDirection: sap.ui.core.TextDirection.Inherit     // default
                    });
                } else {
                    var packInstCustomerDesc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingCustInstDesc;
                    var custQuant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstCustQuant;
                    var packagingMaterialCustr = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialCustr;
                    var packagingMaterialCustDesc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialCustDesc;
                    var auxPackMaterialCust = oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialCust;
                    var auxPackMaterialCustDesc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialCustDesc;

                    sap.ui.getCore().byId("__xmlview1--packInstructionID").setValue(packInstCustomerNum1);
                    sap.ui.getCore().byId("__xmlview1--packInstructionDescID").setValue(packInstCustomerDesc);
                    sap.ui.getCore().byId("__xmlview1--quantID").setValue(custQuant);
                    sap.ui.getCore().byId("__xmlview1--packMaterialID").setValue(packagingMaterialCustr);
                    sap.ui.getCore().byId("__xmlview1--packMaterialDescID").setValue(packagingMaterialCustDesc);
                    sap.ui.getCore().byId("__xmlview1--auxMatID").setValue(auxPackMaterialCust);
                    sap.ui.getCore().byId("__xmlview1--auxMatDescID").setValue(auxPackMaterialCustDesc);
                }
                var oButtonCust = sap.ui.getCore().byId("__xmlview1--PackToCust");
                var oButtonStock = sap.ui.getCore().byId("__xmlview1--PackToStock");
                oButtonCust.setType("Emphasized")
                oButtonStock.setType("Ghost")

            } else if (oEvent.getSource().getId() == "__xmlview1--PackToStock") {
                var packInstruMaterial1 = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstru;
                console.log(packInstruMaterial1)
                if (packInstruMaterial1 == "" || packInstruMaterial1 == null) {
                    sap.m.MessageBox.error("No Packaging Instructions Associated With This Material", {
                        title: "Error",                                      // default
                        onClose: null,                                       // default
                        styleClass: "",                                      // default
                        actions: sap.m.MessageBox.Action.CLOSE,              // default
                        emphasizedAction: null,                              // default
                        initialFocus: null,                                  // default
                        textDirection: sap.ui.core.TextDirection.Inherit     // default
                    });
                } else {
                    var packInstruMaterialDesc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packInstDescription;
                    var packagingMaterial = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterial;
                    var packagingMaterialDescription = oEvent.getSource().getParent().getParent().getBindingContext().getObject().packagingMaterialDescription;
                    var stockQuant = oEvent.getSource().getParent().getParent().getBindingContext().getObject().PackingInstQuant;
                    var auxPackMaterial = oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterial;
                    var auxPackMaterialDesc = oEvent.getSource().getParent().getParent().getBindingContext().getObject().auxPackMaterialDesc;

                    sap.ui.getCore().byId("__xmlview1--packInstructionID").setValue(packInstruMaterial1);
                    sap.ui.getCore().byId("__xmlview1--packInstructionDescID").setValue(packInstruMaterialDesc);
                    sap.ui.getCore().byId("__xmlview1--quantID").setValue(stockQuant);
                    sap.ui.getCore().byId("__xmlview1--packMaterialID").setValue(packagingMaterial);
                    sap.ui.getCore().byId("__xmlview1--packMaterialDescID").setValue(packagingMaterialDescription);
                    sap.ui.getCore().byId("__xmlview1--auxMatID").setValue(auxPackMaterial);
                    sap.ui.getCore().byId("__xmlview1--auxMatDescID").setValue(auxPackMaterialDesc);
                }
                var oButtonCust = sap.ui.getCore().byId("__xmlview1--PackToCust");
                var oButtonStock = sap.ui.getCore().byId("__xmlview1--PackToStock");
                oButtonCust.setType("Ghost")
                oButtonStock.setType("Emphasized")

            }

		}
	});

	return PageController;

});