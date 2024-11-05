/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/***/ (() => {

eval("$(document).ready(function () {\n  $('form').on('submit', function (event) {\n    event.preventDefault();\n    var form = $(this);\n    var actionUrl = form.attr('action');\n    var data = form.serialize();\n    $.ajax({\n      url: actionUrl,\n      type: 'POST',\n      data: data,\n      success: function success(response) {\n        alert('Data updated successfully!');\n        location.reload();\n      },\n      error: function error() {\n        alert('An error occurred.');\n      }\n    });\n  });\n});\n\n//# sourceURL=webpack://lab3/./src/js/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/index.js"]();
/******/ 	
/******/ })()
;