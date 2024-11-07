sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("iu.digital.autoscolombia.controller.Main", {
            onInit: function () {
            },

            formatTime:function(oDate){
                return this.convertMillisecondsToTime(oDate.ms);
            },

            convertMillisecondsToTime: function (milliseconds) {
                if (typeof milliseconds !== 'number' || milliseconds <= 0) {
                    return ""; 
                }
            
                // Calcular horas, minutos y segundos
                const totalSeconds = Math.floor(milliseconds / 1000);
                const hours = Math.floor((totalSeconds / 3600) % 24);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
            
                // Determinar AM o PM
                const ampm = hours >= 12 ? 'PM' : 'AM';
            
                // Convertir a formato de 12 horas
                const formattedHours = (hours % 12) || 12; // Si es 0, mostrar como 12
                const formattedMinutes = String(minutes).padStart(2, '0');
            
                // Retornar el resultado en formato hh:mm a
                return `${String(formattedHours).padStart(2, '0')}:${formattedMinutes} ${ampm}`;
            },

            changeSalPlaca:function(oEvent){
                debugger;
                this.getView().byId("salCelda").setValue("");
                var filtro =  new sap.ui.model.Filter("placa", "EQ", oEvent.getSource().getSelectedKey());;
                this.getView().getModel().read(`/ZCDS_UID_AUTOS_COLOMBIA`, {
                    filters: [filtro],
                    success: function (oData) {
                        debugger;
                        this.getView().byId("salCelda").setValue(oData.results[0].id_celda);
                    }.bind(this),
                    error: function (oError) {
                    }.bind(this),
                });
            },

            _toUpperCase: function (oEvent) {
                var oControl = oEvent.getSource();
                var sValue = oControl.getValue().toUpperCase();
                oControl.setValue(sValue);
            },

            onShowMessageBox: function () {
                sap.m.MessageBox.information("En construcción", {
                    title: "Información"
                });
            },

            onRefrescar: function(){
                this.getView().getModel().refresh(0);
            },

            onPressIngreso: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgIngreso");
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "iu.digital.autoscolombia.view.fragments.ingreso", this);
                    oView.addDependent(oDialog);
                }
                oDialog.open();
                this.getView().byId("ingHora").setValue(`${new Date().getHours()}:${new Date().getMinutes()}`);
                this.getView().byId("ingFecha").setDateValue(new Date());
            },

            validarCamposIngreso: function () {

                if (!this.getView().byId("ingPlaca").getValue()) {
                    sap.m.MessageToast.show("Por favor Ingrese la Placa");
                    return false;
                } else if (!this.getView().byId("ingCelda").getSelectedKey()) {
                    sap.m.MessageToast.show("Por favor Ingrese la Celda");
                    return false;
                } else if (!this.getView().byId("ingFecha").getValue()) {
                    sap.m.MessageToast.show("Por favor Ingrese la Fecha");
                    return false;
                } else if (!this.getView().byId("ingHora").getValue()) {
                    sap.m.MessageToast.show("Por favor Ingrese la Hora");
                    return false;
                } else if (!this.getView().byId("ingTipoV").getSelectedKey()) {
                    sap.m.MessageToast.show("Por favor Ingrese el tipo");
                    return false;
                } else {
                    return true;
                }
            },

            validarCamposSalida: function () {

                if (!this.getView().byId("salPlaca").getSelectedKey()) {
                    sap.m.MessageToast.show("Por favor Ingrese la Placa");
                    return false;
                } else if (!this.getView().byId("salCelda").getValue()) {
                    sap.m.MessageToast.show("Por favor Ingrese la Celda");
                    return false;
                } else if (!this.getView().byId("salFecha").getValue()) {
                    sap.m.MessageToast.show("Por favor Ingrese la Fecha");
                    return false;
                } else if (!this.getView().byId("salHora").getValue()) {
                    sap.m.MessageToast.show("Por favor Ingrese la Hora");
                    return false;
                } else {
                    return true;
                }
            },

            onIngreso: function () {
                debugger;
                var bValid = this.validarCamposIngreso();
                if (!bValid) {
                    return;
                }
                sap.ui.core.BusyIndicator.show(0);
                var oNewEntry = {
                    placa: this.getView().byId("ingPlaca").getValue(),
                    celda: this.getView().byId("ingCelda").getSelectedKey(),
                    fechaIngreso: this.getView().byId("ingFecha").getValue().replaceAll("/",""),
                    horaIngreso: this.getView().byId("ingHora").getValue().replaceAll(":",""),
                    tipoVehiculo: this.getView().byId("ingTipoV").getSelectedKey(),
                    ingresoSalida: "Ingreso"                            
                };
                this.getView().getModel().create("/vehiculosSet", oNewEntry, {
                    success: function (oData) {
                        console.log(oData);
                        this.getView().getModel().refresh(0);
                        
                sap.m.MessageBox.success(`Se ha realizado el ingreso del vehículo ${oNewEntry.placa} Correctamente`, {
                    title: "Ingreso de Vehículo"
                });
                        this.onCloseIngreso();
                        sap.ui.core.BusyIndicator.hide();

                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                        sap.ui.core.BusyIndicator.hide();
                        this.onCloseIngreso();
                    }.bind(this),
                });
            },

            onSalida: function () {
                debugger;
                var bValid = this.validarCamposSalida();
                if (!bValid) {
                    return;
                }
                sap.ui.core.BusyIndicator.show(0);
                var oNewEntry = {
                    placa: this.getView().byId("salPlaca").getSelectedKey(),
                    celda: this.getView().byId("salCelda").getValue(),
                    fechaSalida: this.getView().byId("salFecha").getValue().replaceAll("/",""),
                    horaSalida: this.getView().byId("salHora").getValue().replaceAll(":",""),
                    ingresoSalida: "Salida" 
                };
                this.getView().getModel().create("/vehiculosSet", oNewEntry, {
                    success: function (oData) {
                        console.log(oData);
                        this.getView().getModel().refresh(0);
                        
                sap.m.MessageBox.success(`Se ha realizado la salida del vehículo ${oNewEntry.placa} Correctamente`, {
                    title: "Salida de Vehículo"
                });
                        this.onCloseSalida();
                        sap.ui.core.BusyIndicator.hide();

                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                        sap.ui.core.BusyIndicator.hide();
                        this.onCloseIngreso();
                    }.bind(this),
                });
            },

            onCloseIngreso: function () {
                this.getView().byId("ingPlaca").setValue("");
                this.getView().byId("dlgIngreso").close();
            },


            onPressSalida: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgSalida");
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "iu.digital.autoscolombia.view.fragments.salida", this);
                    oView.addDependent(oDialog);
                }
                oDialog.open();
                this.getView().byId("salHora").setValue(`${new Date().getHours()}:${new Date().getMinutes()}`);
                this.getView().byId("salFecha").setDateValue(new Date());
            },

            onCloseSalida: function () {
                this.getView().byId("salPlaca").setSelectedKey("");
                this.getView().byId("salCelda").setValue("");
                this.getView().byId("dlgSalida").close();
            }

        });
    });
