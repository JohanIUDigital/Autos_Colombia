sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("iu.digital.autoscolombia.controller.Main", {
            onInit: function () {
            },

            formatTime: function (oDate) {
                if (oDate) {
                    return this.convertMillisecondsToTime(oDate.ms);

                }
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

            changeSalPlaca: function (oEvent) {
                debugger;
                this.getView().byId("salCelda").setValue("");
                var filtro = new sap.ui.model.Filter("placa", "EQ", oEvent.getSource().getSelectedKey());;
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

            onRefrescar: function () {
                this.getView().getModel().refresh(0);
            },

            onSaveIngresoPago: function () {
                var oView = this.getView();
                var oJson = {
                    "Mandt": "001",
                    "Idregpago": "103",
                    "Placa": oView.byId("ingPagoPlaca").getSelectedKey(),
                    "Montopagar": oView.byId("montoPago").getValue(),
                    "Fechapago": new Date(),
                    "Metodopago": oView.byId("metodoPago").getSelectedKey(),
                    "Banco": oView.byId("bancoPago").getSelectedKey(),
                    "Numerocuenta": oView.byId("numCuentaPago").getValue(),
                    "Titular": oView.byId("cedulaTitularPago").getValue()
                    //"Horapago": 120000
                };
                this.crearPago(oJson);
            },

            crearPago: function (oNewEntry) {
                this.getView().getModel().create("/pagoSet", oNewEntry, {
                    success: function (oData) {
                        console.log(oData);
                        this.getView().getModel().refresh(0);

                        sap.m.MessageBox.success(`Se ha registrado el pago correctamente`, {
                            title: "Registro Pago Exitoso"
                        });
                        this.onCloseIngresoPago();
                        sap.ui.core.BusyIndicator.hide();

                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                        sap.ui.core.BusyIndicator.hide();
                        this.onCloseIngresoPago();
                    }.bind(this),
                });
            },

            onSaveIngresoNov: function () {
                var oView = this.getView();
                var oJson = {
                    "placa": oView.byId("ingNovPlaca").getSelectedKey(),
                    "descripcion": oView.byId("descNovedad").getValue(),
                    "reporto": oView.byId("userReport").getValue()
                };
                this.crearNovedad(oJson);
            },

            crearNovedad: function (oNewEntry) {
                this.getView().getModel().create("/novedadSet", oNewEntry, {
                    success: function (oData) {
                        console.log(oData);
                        this.getView().getModel().refresh(0);

                        sap.m.MessageBox.success(`Se ha registrado la novedad correctamente`, {
                            title: "Registro Novedad"
                        });
                        this.onCloseIngresoNov();
                        sap.ui.core.BusyIndicator.hide();

                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                        sap.ui.core.BusyIndicator.hide();
                        this.onCloseIngresoNov();
                    }.bind(this),
                });
            },

            onSaveActualizarUsuario: function () {
                debugger;
                var oView = this.getView();
                var oJson = {
                    "cedula": oView.byId("ingActualizarNumeroDocumento").getSelectedKey(),
                    "tipo_doc": oView.byId("ingActualizarTipoDocumento").getSelectedKey(),
                    "nombres": oView.byId("ingActualizarNombres").getValue(),
                    "apellidos": oView.byId("ingActualizarApellidos").getValue(),
                    "telefono": oView.byId("ingActualizarTelefono").getValue(),
                    "email": oView.byId("ingActualizarCorreoElectronico").getValue(),
                    "placa": oView.byId("ingActualizarPlaca").getValue(),
                    "id_tipo": "",
                    "id_marca": oView.byId("ingActualizarMarca").getSelectedKey(),
                    "id_transmision": oView.byId("ingActualizarTipoVehiculo").getSelectedKey(),
                    "modelo": oView.byId("ingActualizarModelo").getValue(),
                    "id_propietario": oView.byId("ingActualizarNumeroDocumento").getSelectedKey()
                };
                this.actualizarUsuario(oJson);
            },


            actualizarUsuario: function (oNewEntry) {
                this.getView().getModel().update(`/usuariosSet('${oNewEntry.cedula}')`, oNewEntry, {
                    success: function (oData) {
                        console.log(oData);
                        sap.m.MessageBox.information(`El usuario ${oNewEntry.nombres} fue Actualizado correctamente`);
                        this.onCloseActualizarUsuario();
                        sap.ui.core.BusyIndicator.hide();

                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                        sap.ui.core.BusyIndicator.hide();
                        this.onCloseActualizarUsuario();
                    }.bind(this),
                });
            },

            onSaveEliminarUsuario: function () {

                sap.ui.core.BusyIndicator.show(0);
                var oView = this.getView();
                var sKey = oView.byId("ingEliminarNumeroDocumento").getSelectedKey();
                debugger;
                oView.getModel().remove(`/usuariosSet('${sKey}')`, {
                    success: function (oData) {

                        sap.m.MessageBox.information(`El usuario fue eliminado correctamente`);
                        this.onCloseEliminarUsuario();
                        this.onRefrescar();
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (oData) {
                        sap.m.MessageBox.error(`No fue posible eliminar el usuario`);
                        this.onCloseEliminarUsuario();
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this)
                });


            },

            changeEliminarUser: function () {
                sap.ui.core.BusyIndicator.show(0);
                var oView = this.getView();
                var sKey = oView.byId("ingEliminarNumeroDocumento").getSelectedKey();

                if (!sKey) {
                    sap.ui.core.BusyIndicator.hide();
                    return;
                }
                var filtro = new sap.ui.model.Filter("cedula", "EQ", sKey);
                oView.getModel().read(`/ZCDS_UID_USER_VEH`, {
                    filters: [filtro],
                    success: function (oData) {
                        debugger;
                        oView.byId("ingEliminarNombres").setValue(oData.results ? oData.results[0].nombres : "");
                        oView.byId("ingEliminarApellidos").setValue(oData.results ? oData.results[0].apellidos : "");
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                });
            },

            changeActualizarUser: function () {
                sap.ui.core.BusyIndicator.show(0);
                var oView = this.getView();
                var sKey = oView.byId("ingActualizarNumeroDocumento").getSelectedKey();

                if (!sKey) {
                    sap.ui.core.BusyIndicator.hide();
                    return;
                }
                var filtro = new sap.ui.model.Filter("cedula", "EQ", sKey);
                oView.getModel().read(`/ZCDS_UID_USER_VEH`, {
                    filters: [filtro],
                    success: function (oData) {
                        debugger;
                        oView.byId("ingActualizarTipoDocumento").setSelectedKey(oData.results ? oData.results[0].tipo_doc : "");
                        oView.byId("ingActualizarMarca").setSelectedKey(oData.results ? oData.results[0].id_marca : "");
                        oView.byId("ingActualizarTipoVehiculo").setSelectedKey(oData.results ? oData.results[0].id_transmision : "");
                        oView.byId("ingActualizarNombres").setValue(oData.results ? oData.results[0].nombres : "");
                        oView.byId("ingActualizarApellidos").setValue(oData.results ? oData.results[0].apellidos : "");
                        oView.byId("ingActualizarTelefono").setValue(oData.results ? oData.results[0].telefono : "");
                        oView.byId("ingActualizarCorreoElectronico").setValue(oData.results ? oData.results[0].email : "");
                        oView.byId("ingActualizarModelo").setValue(oData.results ? oData.results[0].modelo : "");
                        oView.byId("ingActualizarPlaca").setValue(oData.results ? oData.results[0].placa : "");
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                });
            },

            onCrearUsuario: function () {
                debugger;
                sap.ui.core.BusyIndicator.show(0);
                var oView = this.getView();
                var oNewEntry = {
                    "cedula": oView.byId("ingCrearNumeroDocumento").getValue(),
                    "tipo_doc": oView.byId("ingCrearUserTpDoc").getSelectedKey(),
                    "nombres": oView.byId("ingCrearNombres").getValue(),
                    "apellidos": oView.byId("ingCrearApellidos").getValue(),
                    "telefono": oView.byId("ingCrearTelefono").getValue(),
                    "email": oView.byId("ingCrearCorreoElectronico").getValue(),
                    "placa": oView.byId("ingCrearPlaca").getValue(),
                    "id_tipo": "",
                    "id_marca": oView.byId("ingCrearMarca").getSelectedKey(),
                    "id_transmision": oView.byId("ingCrearuserTipoV").getSelectedKey(),
                    "modelo": oView.byId("ingCrearModelo").getValue(),
                    "id_propietario": oView.byId("ingCrearNumeroDocumento").getValue()
                };

                var filtro = new sap.ui.model.Filter("placa", "EQ", oNewEntry.placa);
                this.getView().getModel().read(`/ZCDS_UID_VEH`, {
                    filters: [filtro],
                    success: function (oData) {
                        debugger;
                        var aData = oData.results ? oData.results : [];
                        if (!aData.length) {
                            this.crearUsuario(oNewEntry);
                        } else {
                            this.onCloseCrearUsuario();
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageBox.error(`No es posible crear el usuario ${oNewEntry.nombres}, el vehículo con placa ${oNewEntry.placa} ya existe en la base de datos, favor validar nuevamente`);
                        }
                    }.bind(this),
                    error: function (oError) {
                        this.onCloseCrearUsuario();
                        sap.ui.core.BusyIndicator.hide();
                    }.bind(this),
                });
            },

            crearUsuario: function (oNewEntry) {
                this.getView().getModel().create("/usuariosSet", oNewEntry, {
                    success: function (oData) {
                        console.log(oData);
                        this.getView().getModel().refresh(0);

                        sap.m.MessageBox.success(`Se ha creado el registro del vehículo ${oNewEntry.nombres} para el usuario ${oNewEntry.nombres} Correctamente`, {
                            title: "Ingreso de Vehículo"
                        });
                        this.onCloseCrearUsuario();
                        sap.ui.core.BusyIndicator.hide();

                    }.bind(this),
                    error: function (oError) {
                        console.log(oError);
                        sap.ui.core.BusyIndicator.hide();
                        this.onCloseCrearUsuario();
                    }.bind(this),
                });
            },

            onPressHistorialPago: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgHistorialPago");
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "iu.digital.autoscolombia.view.fragments.gestionpago.historialpago", this);
                    oView.addDependent(oDialog);
                }
                oDialog.open();
            },

            onCloseHistorialPago: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgHistorialPago");
                oDialog.close();
            },

            onPressHistorialNovedad: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgHistorialNov");
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "iu.digital.autoscolombia.view.fragments.gestionnovedad.historialnovedad", this);
                    oView.addDependent(oDialog);
                }
                oDialog.open();
            },

            onCloseHistorialNov: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgHistorialNov");
                oDialog.close();
            },

            onPressPago: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgPago");
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "iu.digital.autoscolombia.view.fragments.pago", this);
                    oView.addDependent(oDialog);
                }
                oDialog.open();
            },

            onClosePago: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgPago");
                oDialog.close();
            },

            onPressNovedad: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgNovedad");
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "iu.digital.autoscolombia.view.fragments.novedad", this);
                    oView.addDependent(oDialog);
                }
                oDialog.open();
            },

            onCloseNovedad: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgNovedad");
                oDialog.close();
            },

            onPressUsuario: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgUsuario");
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "iu.digital.autoscolombia.view.fragments.usuario", this);
                    oView.addDependent(oDialog);
                }
                oDialog.open();

            },

            onCloseUsuario: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgUsuario");
                oDialog.close();
            },

            onPressIngresarPago: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgIngresoPago");
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "iu.digital.autoscolombia.view.fragments.gestionpago.ingresarpago", this);
                    oView.addDependent(oDialog);
                }
                oView.byId("fechaPago").setDateValue(new Date);
                var sTime = new Date().getHours() + ":" + new Date().getMinutes();
                oView.byId("horaPago").setValue(sTime)
                oDialog.open();

            },

            onCloseIngresoPago: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgIngresoPago");
                oDialog.close();
            },

            onPressIngresarNovedad: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgIngresoNov");
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "iu.digital.autoscolombia.view.fragments.gestionnovedad.ingresarnovedad", this);
                    oView.addDependent(oDialog);
                }
                oDialog.open();

            },

            onCloseIngresoNov: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgIngresoNov");
                oDialog.close();
            },

            onPressCrearUsuario: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgCrearUsuario");
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "iu.digital.autoscolombia.view.fragments.gestionusuario.crearusuario", this);
                    oView.addDependent(oDialog);
                }
                oDialog.open();

            },

            onCloseCrearUsuario: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgCrearUsuario");
                oDialog.close();
            },

            onPressActualizarUsuario: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgActualizarUsuario");
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "iu.digital.autoscolombia.view.fragments.gestionusuario.actualizarusuario", this);
                    oView.addDependent(oDialog);
                }
                oDialog.open();
                this.changeActualizarUser();
            },

            onCloseActualizarUsuario: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgActualizarUsuario");
                oDialog.close();
            },

            onPressEliminarUsuario: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgEliminarUsuario");
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "iu.digital.autoscolombia.view.fragments.gestionusuario.eliminarusuario", this);
                    oView.addDependent(oDialog);
                }
                oDialog.open();

            },

            onCloseEliminarUsuario: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgEliminarUsuario");
                oDialog.close();
            },

            onPressConsultarUsuario: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgConsultarUsuario");
                if (!oDialog) {
                    oDialog = sap.ui.xmlfragment(oView.getId(), "iu.digital.autoscolombia.view.fragments.gestionusuario.consultarusuario", this);
                    oView.addDependent(oDialog);
                }
                oDialog.open();

            },

            onCloseConsultarUsuario: function () {
                var oView = this.getView();
                var oDialog = oView.byId("dlgConsultarUsuario");
                oDialog.close();
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

                if (!this.getView().byId("ingPlaca").getSelectedKey()) {
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
                    placa: this.getView().byId("ingPlaca").getSelectedKey(),
                    celda: this.getView().byId("ingCelda").getSelectedKey(),
                    fechaIngreso: this.getView().byId("ingFecha").getValue().replaceAll("/", ""),
                    horaIngreso: this.getView().byId("ingHora").getValue().replaceAll(":", ""),
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
                    fechaSalida: this.getView().byId("salFecha").getValue().replaceAll("/", ""),
                    horaSalida: this.getView().byId("salHora").getValue().replaceAll(":", ""),
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
                this.getView().byId("ingPlaca").setSelectedKey("");
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
