/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"iudigital/autos_colombia/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
