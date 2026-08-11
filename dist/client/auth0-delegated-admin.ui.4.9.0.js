/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		0: 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/app/";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([1046,1]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1016:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 410,
	"./af.js": 410,
	"./ar": 411,
	"./ar-dz": 412,
	"./ar-dz.js": 412,
	"./ar-kw": 413,
	"./ar-kw.js": 413,
	"./ar-ly": 414,
	"./ar-ly.js": 414,
	"./ar-ma": 415,
	"./ar-ma.js": 415,
	"./ar-ps": 416,
	"./ar-ps.js": 416,
	"./ar-sa": 417,
	"./ar-sa.js": 417,
	"./ar-tn": 418,
	"./ar-tn.js": 418,
	"./ar.js": 411,
	"./az": 419,
	"./az.js": 419,
	"./be": 420,
	"./be.js": 420,
	"./bg": 421,
	"./bg.js": 421,
	"./bm": 422,
	"./bm.js": 422,
	"./bn": 423,
	"./bn-bd": 424,
	"./bn-bd.js": 424,
	"./bn.js": 423,
	"./bo": 425,
	"./bo.js": 425,
	"./br": 426,
	"./br.js": 426,
	"./bs": 427,
	"./bs.js": 427,
	"./ca": 428,
	"./ca.js": 428,
	"./cs": 429,
	"./cs.js": 429,
	"./cv": 430,
	"./cv.js": 430,
	"./cy": 431,
	"./cy.js": 431,
	"./da": 432,
	"./da.js": 432,
	"./de": 433,
	"./de-at": 434,
	"./de-at.js": 434,
	"./de-ch": 435,
	"./de-ch.js": 435,
	"./de.js": 433,
	"./dv": 436,
	"./dv.js": 436,
	"./el": 437,
	"./el.js": 437,
	"./en-au": 438,
	"./en-au.js": 438,
	"./en-ca": 439,
	"./en-ca.js": 439,
	"./en-gb": 440,
	"./en-gb.js": 440,
	"./en-ie": 441,
	"./en-ie.js": 441,
	"./en-il": 442,
	"./en-il.js": 442,
	"./en-in": 443,
	"./en-in.js": 443,
	"./en-nz": 444,
	"./en-nz.js": 444,
	"./en-sg": 445,
	"./en-sg.js": 445,
	"./eo": 446,
	"./eo.js": 446,
	"./es": 447,
	"./es-do": 448,
	"./es-do.js": 448,
	"./es-mx": 449,
	"./es-mx.js": 449,
	"./es-us": 450,
	"./es-us.js": 450,
	"./es.js": 447,
	"./et": 451,
	"./et.js": 451,
	"./eu": 452,
	"./eu.js": 452,
	"./fa": 453,
	"./fa.js": 453,
	"./fi": 454,
	"./fi.js": 454,
	"./fil": 455,
	"./fil.js": 455,
	"./fo": 456,
	"./fo.js": 456,
	"./fr": 457,
	"./fr-ca": 458,
	"./fr-ca.js": 458,
	"./fr-ch": 459,
	"./fr-ch.js": 459,
	"./fr.js": 457,
	"./fy": 460,
	"./fy.js": 460,
	"./ga": 461,
	"./ga.js": 461,
	"./gd": 462,
	"./gd.js": 462,
	"./gl": 463,
	"./gl.js": 463,
	"./gom-deva": 464,
	"./gom-deva.js": 464,
	"./gom-latn": 465,
	"./gom-latn.js": 465,
	"./gu": 466,
	"./gu.js": 466,
	"./he": 467,
	"./he.js": 467,
	"./hi": 468,
	"./hi.js": 468,
	"./hr": 469,
	"./hr.js": 469,
	"./hu": 470,
	"./hu.js": 470,
	"./hy-am": 471,
	"./hy-am.js": 471,
	"./id": 472,
	"./id.js": 472,
	"./is": 473,
	"./is.js": 473,
	"./it": 474,
	"./it-ch": 475,
	"./it-ch.js": 475,
	"./it.js": 474,
	"./ja": 476,
	"./ja.js": 476,
	"./jv": 477,
	"./jv.js": 477,
	"./ka": 478,
	"./ka.js": 478,
	"./kk": 479,
	"./kk.js": 479,
	"./km": 480,
	"./km.js": 480,
	"./kn": 481,
	"./kn.js": 481,
	"./ko": 482,
	"./ko.js": 482,
	"./ku": 483,
	"./ku-kmr": 484,
	"./ku-kmr.js": 484,
	"./ku.js": 483,
	"./ky": 485,
	"./ky.js": 485,
	"./lb": 486,
	"./lb.js": 486,
	"./lo": 487,
	"./lo.js": 487,
	"./lt": 488,
	"./lt.js": 488,
	"./lv": 489,
	"./lv.js": 489,
	"./me": 490,
	"./me.js": 490,
	"./mi": 491,
	"./mi.js": 491,
	"./mk": 492,
	"./mk.js": 492,
	"./ml": 493,
	"./ml.js": 493,
	"./mn": 494,
	"./mn.js": 494,
	"./mr": 495,
	"./mr.js": 495,
	"./ms": 496,
	"./ms-my": 497,
	"./ms-my.js": 497,
	"./ms.js": 496,
	"./mt": 498,
	"./mt.js": 498,
	"./my": 499,
	"./my.js": 499,
	"./nb": 500,
	"./nb.js": 500,
	"./ne": 501,
	"./ne.js": 501,
	"./nl": 502,
	"./nl-be": 503,
	"./nl-be.js": 503,
	"./nl.js": 502,
	"./nn": 504,
	"./nn.js": 504,
	"./oc-lnc": 505,
	"./oc-lnc.js": 505,
	"./pa-in": 506,
	"./pa-in.js": 506,
	"./pl": 507,
	"./pl.js": 507,
	"./pt": 508,
	"./pt-br": 509,
	"./pt-br.js": 509,
	"./pt.js": 508,
	"./ro": 510,
	"./ro.js": 510,
	"./ru": 511,
	"./ru.js": 511,
	"./sd": 512,
	"./sd.js": 512,
	"./se": 513,
	"./se.js": 513,
	"./si": 514,
	"./si.js": 514,
	"./sk": 515,
	"./sk.js": 515,
	"./sl": 516,
	"./sl.js": 516,
	"./sq": 517,
	"./sq.js": 517,
	"./sr": 518,
	"./sr-cyrl": 519,
	"./sr-cyrl.js": 519,
	"./sr.js": 518,
	"./ss": 520,
	"./ss.js": 520,
	"./sv": 521,
	"./sv.js": 521,
	"./sw": 522,
	"./sw.js": 522,
	"./ta": 523,
	"./ta.js": 523,
	"./te": 524,
	"./te.js": 524,
	"./tet": 525,
	"./tet.js": 525,
	"./tg": 526,
	"./tg.js": 526,
	"./th": 527,
	"./th.js": 527,
	"./tk": 528,
	"./tk.js": 528,
	"./tl-ph": 529,
	"./tl-ph.js": 529,
	"./tlh": 530,
	"./tlh.js": 530,
	"./tr": 531,
	"./tr.js": 531,
	"./tzl": 532,
	"./tzl.js": 532,
	"./tzm": 533,
	"./tzm-latn": 534,
	"./tzm-latn.js": 534,
	"./tzm.js": 533,
	"./ug-cn": 535,
	"./ug-cn.js": 535,
	"./uk": 536,
	"./uk.js": 536,
	"./ur": 537,
	"./ur.js": 537,
	"./uz": 538,
	"./uz-latn": 539,
	"./uz-latn.js": 539,
	"./uz.js": 538,
	"./vi": 540,
	"./vi.js": 540,
	"./x-pseudo": 541,
	"./x-pseudo.js": 541,
	"./yo": 542,
	"./yo.js": 542,
	"./zh-cn": 543,
	"./zh-cn.js": 543,
	"./zh-hk": 544,
	"./zh-hk.js": 544,
	"./zh-mo": 545,
	"./zh-mo.js": 545,
	"./zh-tw": 546,
	"./zh-tw.js": 546
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 1016;

/***/ }),

/***/ 1017:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1021:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1022:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1023:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1024:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1029:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1030:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1034:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1037:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1038:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1039:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1044:
/***/ (function(module, exports, __webpack_require__) {

if (true) {
  module.exports = __webpack_require__(1045);
} else {}

/***/ }),

/***/ 1045:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(React) {/* harmony default export */ __webpack_exports__["default"] = (function () {
  return /*#__PURE__*/React.createElement("div", null);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)))

/***/ }),

/***/ 1046:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// NAMESPACE OBJECT: ./client/actions/auth.js
var auth_namespaceObject = {};
__webpack_require__.r(auth_namespaceObject);
__webpack_require__.d(auth_namespaceObject, "login", function() { return login; });
__webpack_require__.d(auth_namespaceObject, "logout", function() { return logout; });
__webpack_require__.d(auth_namespaceObject, "loadCredentials", function() { return loadCredentials; });
__webpack_require__.d(auth_namespaceObject, "getAccessLevel", function() { return getAccessLevel; });
__webpack_require__.d(auth_namespaceObject, "getAppSettings", function() { return getAppSettings; });
__webpack_require__.d(auth_namespaceObject, "toggleStyleSettings", function() { return toggleStyleSettings; });
__webpack_require__.d(auth_namespaceObject, "getStyleSettings", function() { return getStyleSettings; });

// NAMESPACE OBJECT: ./client/actions/application.js
var application_namespaceObject = {};
__webpack_require__.r(application_namespaceObject);
__webpack_require__.d(application_namespaceObject, "fetchApplications", function() { return fetchApplications; });

// NAMESPACE OBJECT: ./client/actions/connection.js
var connection_namespaceObject = {};
__webpack_require__.r(connection_namespaceObject);
__webpack_require__.d(connection_namespaceObject, "fetchConnections", function() { return fetchConnections; });

// NAMESPACE OBJECT: ./client/actions/log.js
var log_namespaceObject = {};
__webpack_require__.r(log_namespaceObject);
__webpack_require__.d(log_namespaceObject, "fetchLogs", function() { return fetchLogs; });
__webpack_require__.d(log_namespaceObject, "fetchLog", function() { return fetchLog; });
__webpack_require__.d(log_namespaceObject, "clearLog", function() { return clearLog; });

// NAMESPACE OBJECT: ./client/actions/user.js
var user_namespaceObject = {};
__webpack_require__.r(user_namespaceObject);
__webpack_require__.d(user_namespaceObject, "clearUsers", function() { return clearUsers; });
__webpack_require__.d(user_namespaceObject, "fetchUsers", function() { return fetchUsers; });
__webpack_require__.d(user_namespaceObject, "createUser", function() { return createUser; });
__webpack_require__.d(user_namespaceObject, "requestCreateUser", function() { return requestCreateUser; });
__webpack_require__.d(user_namespaceObject, "cancelCreateUser", function() { return cancelCreateUser; });
__webpack_require__.d(user_namespaceObject, "changeFields", function() { return changeFields; });
__webpack_require__.d(user_namespaceObject, "requestFieldsChange", function() { return requestFieldsChange; });
__webpack_require__.d(user_namespaceObject, "cancelChangeFields", function() { return cancelChangeFields; });
__webpack_require__.d(user_namespaceObject, "fetchUserDetail", function() { return fetchUserDetail; });
__webpack_require__.d(user_namespaceObject, "fetchUser", function() { return fetchUser; });
__webpack_require__.d(user_namespaceObject, "requestRemoveMultiFactor", function() { return requestRemoveMultiFactor; });
__webpack_require__.d(user_namespaceObject, "cancelRemoveMultiFactor", function() { return user_cancelRemoveMultiFactor; });
__webpack_require__.d(user_namespaceObject, "removeMultiFactor", function() { return removeMultiFactor; });
__webpack_require__.d(user_namespaceObject, "requestBlockUser", function() { return requestBlockUser; });
__webpack_require__.d(user_namespaceObject, "cancelBlockUser", function() { return user_cancelBlockUser; });
__webpack_require__.d(user_namespaceObject, "updateUser", function() { return updateUser; });
__webpack_require__.d(user_namespaceObject, "blockUser", function() { return blockUser; });
__webpack_require__.d(user_namespaceObject, "requestUnblockUser", function() { return requestUnblockUser; });
__webpack_require__.d(user_namespaceObject, "requestRemoveBlockedIPs", function() { return requestRemoveBlockedIPs; });
__webpack_require__.d(user_namespaceObject, "cancelUnblockUser", function() { return user_cancelUnblockUser; });
__webpack_require__.d(user_namespaceObject, "cancelRemoveBlocks", function() { return user_cancelRemoveBlocks; });
__webpack_require__.d(user_namespaceObject, "unblockUser", function() { return unblockUser; });
__webpack_require__.d(user_namespaceObject, "removeUserBlocks", function() { return removeUserBlocks; });
__webpack_require__.d(user_namespaceObject, "requestDeleteUser", function() { return requestDeleteUser; });
__webpack_require__.d(user_namespaceObject, "cancelDeleteUser", function() { return user_cancelDeleteUser; });
__webpack_require__.d(user_namespaceObject, "deleteUser", function() { return deleteUser; });
__webpack_require__.d(user_namespaceObject, "requestPasswordReset", function() { return requestPasswordReset; });
__webpack_require__.d(user_namespaceObject, "cancelPasswordReset", function() { return user_cancelPasswordReset; });
__webpack_require__.d(user_namespaceObject, "resetPassword", function() { return resetPassword; });
__webpack_require__.d(user_namespaceObject, "requestPasswordChange", function() { return requestPasswordChange; });
__webpack_require__.d(user_namespaceObject, "cancelPasswordChange", function() { return user_cancelPasswordChange; });
__webpack_require__.d(user_namespaceObject, "changePassword", function() { return changePassword; });
__webpack_require__.d(user_namespaceObject, "requestUsernameChange", function() { return requestUsernameChange; });
__webpack_require__.d(user_namespaceObject, "cancelUsernameChange", function() { return user_cancelUsernameChange; });
__webpack_require__.d(user_namespaceObject, "changeUsername", function() { return changeUsername; });
__webpack_require__.d(user_namespaceObject, "requestEmailChange", function() { return requestEmailChange; });
__webpack_require__.d(user_namespaceObject, "cancelEmailChange", function() { return user_cancelEmailChange; });
__webpack_require__.d(user_namespaceObject, "changeEmail", function() { return changeEmail; });
__webpack_require__.d(user_namespaceObject, "requestResendVerificationEmail", function() { return requestResendVerificationEmail; });
__webpack_require__.d(user_namespaceObject, "cancelResendVerificationEmail", function() { return user_cancelResendVerificationEmail; });
__webpack_require__.d(user_namespaceObject, "resendVerificationEmail", function() { return resendVerificationEmail; });

// NAMESPACE OBJECT: ./client/actions/script.js
var script_namespaceObject = {};
__webpack_require__.r(script_namespaceObject);
__webpack_require__.d(script_namespaceObject, "fetchScript", function() { return fetchScript; });
__webpack_require__.d(script_namespaceObject, "updateScript", function() { return updateScript; });

// EXTERNAL MODULE: ./node_modules/babel-polyfill/lib/index.js
var lib = __webpack_require__(562);

// EXTERNAL MODULE: ./node_modules/string.prototype.endswith/endswith.js
var endswith = __webpack_require__(764);

// EXTERNAL MODULE: ./node_modules/axios/lib/axios.js + 43 modules
var axios = __webpack_require__(1047);

// EXTERNAL MODULE: ./node_modules/react/react.js
var react = __webpack_require__(0);
var react_default = /*#__PURE__*/__webpack_require__.n(react);

// EXTERNAL MODULE: ./node_modules/react-dom/index.js
var react_dom = __webpack_require__(33);
var react_dom_default = /*#__PURE__*/__webpack_require__.n(react_dom);

// EXTERNAL MODULE: ./node_modules/react-redux/lib/index.js
var react_redux_lib = __webpack_require__(35);

// EXTERNAL MODULE: ./node_modules/query-string/index.js
var query_string = __webpack_require__(279);
var query_string_default = /*#__PURE__*/__webpack_require__.n(query_string);

// EXTERNAL MODULE: ./node_modules/react-router/lib/index.js
var react_router_lib = __webpack_require__(50);

// EXTERNAL MODULE: ./node_modules/history/lib/index.js
var history_lib = __webpack_require__(550);

// EXTERNAL MODULE: ./node_modules/react-router-redux/lib/index.js
var react_router_redux_lib = __webpack_require__(49);

// EXTERNAL MODULE: ./node_modules/jwt-decode/build/jwt-decode.esm.js
var jwt_decode_esm = __webpack_require__(551);

// EXTERNAL MODULE: ./client/constants.js
var constants = __webpack_require__(4);

// CONCATENATED MODULE: ./client/actions/auth.js




var webAuthOptions = {
  domain: window.config.AUTH0_CUSTOM_DOMAIN || window.config.AUTH0_DOMAIN,
  clientID: window.config.AUTH0_CLIENT_ID,
  scope: 'openid roles',
  responseType: 'id_token',
  redirectUri: "".concat(window.config.BASE_URL, "/login")
};
var webAuth = new auth0.WebAuth(webAuthOptions); // eslint-disable-line no-undef

function login(returnUrl, locale) {
  sessionStorage.setItem('delegated-admin:returnTo', returnUrl || '/users');
  webAuth.authorize({
    ui_locales: locale
  });
  return {
    type: constants["sc" /* SHOW_LOGIN */]
  };
}

/** Checks if a decoded token is expired **/
function isTokenExpired(decodedToken) {
  return isDateExpired(decodedToken.exp);
}

/** Checks if a given token exp is expired **/
function isDateExpired(exp) {
  // if there is no expiration date, return
  if (typeof exp === 'undefined') return true;

  // convert to date and store
  var d = new Date(0);
  d.setUTCSeconds(exp);

  // check if date is expired
  var isExpired = !(d.valueOf() > new Date().valueOf() + 30);
  return isExpired;
}
function logout(logoutUrl) {
  return function (dispatch) {
    sessionStorage.clear();
    localStorage.clear();
    if (logoutUrl) {
      window.location.href = logoutUrl;
    } else if (window.config.FEDERATED_LOGOUT) {
      window.location.href = "https://".concat(window.config.AUTH0_CUSTOM_DOMAIN || window.config.AUTH0_DOMAIN, "/v2/logout?federated&client_id=").concat(window.config.AUTH0_CLIENT_ID, "&returnTo=").concat(encodeURIComponent(window.config.BASE_URL));
    } else {
      window.location.href = "https://".concat(window.config.AUTH0_CUSTOM_DOMAIN || window.config.AUTH0_DOMAIN, "/v2/logout?client_id=").concat(window.config.AUTH0_CLIENT_ID, "&returnTo=").concat(encodeURIComponent(window.config.BASE_URL));
    }
    dispatch({
      type: constants["Jb" /* LOGOUT_PENDING */]
    });
  };
}

// calls checkSession to refresh idToken
function refreshToken() {
  return new Promise(function (resolve, reject) {
    // invoke check session to get a new token
    webAuth.checkSession({}, function (err, result) {
      if (err) {
        // there was an error
        reject(err);
      } else {
        // we got a token
        resolve(result);
      }
    });
  });
}
var _processTokens = function processTokens(dispatch, apiToken, returnTo) {
  return new Promise(function (resolve, reject) {
    // check token expiration date
    var decodedToken = Object(jwt_decode_esm["a" /* default */])(apiToken);
    if (isTokenExpired(decodedToken)) {
      return;
    }
    axios["a" /* default */].defaults.headers.common.Authorization = "Bearer ".concat(apiToken);
    axios["a" /* default */].defaults.headers.common['dae-locale'] = window.config.LOCALE || 'en';
    sessionStorage.setItem('delegated-admin:apiToken:exp', decodedToken.exp);

    // creates an interceptor to refresh token if needed
    axios["a" /* default */].interceptors.request.use(function (config) {
      // get token expiration from storage
      var exp = sessionStorage.getItem('delegated-admin:apiToken:exp');

      // if there is no token, or it is expired, try to get one
      if (isDateExpired(exp)) {
        return refreshToken().then(function (tokenResponse) {
          // we got one, store and load credentials
          return _processTokens(dispatch, tokenResponse.idToken).then(function () {
            config.headers.Authorization = axios["a" /* default */].defaults.headers.common.Authorization;
            return Promise.resolve(config);
          });
        }).catch(function (error) {
          login(returnTo, window.config.LOCALE || 'en');
          return Promise.reject(error);
        });
      }

      // token is not expired, move on.
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
    axios["a" /* default */].interceptors.response.use(function (response) {
      return response;
    }, function (error) {
      var value = error.response;
      if (value && value.status === 401 && value.data.message === 'TokenExpired') {
        // renewToken performs authentication using username/password saved in sessionStorage/sessionStorage
        return refreshToken().then(function (tokenResponse) {
          // we got one, store and load credentials
          return _processTokens(dispatch, tokenResponse.idToken).then(function () {
            error.config.headers.Authorization = axios["a" /* default */].defaults.headers.common.Authorization;
            return axios["a" /* default */].request(error.config);
          });
        });
      }
      return Promise.reject(error);
    });
    dispatch({
      type: constants["Fb" /* LOADED_TOKEN */],
      payload: {
        token: apiToken
      }
    });
    dispatch({
      type: constants["Ib" /* LOGIN_SUCCESS */],
      payload: {
        token: apiToken,
        decodedToken: decodedToken,
        user: decodedToken,
        returnTo: returnTo
      }
    });
    if (returnTo) {
      dispatch(Object(react_router_redux_lib["push"])(returnTo));
    }
    resolve();
  });
};
function loadCredentials() {
  return function (dispatch) {
    if (window.location.hash) {
      dispatch({
        type: constants["Hb" /* LOGIN_PENDING */]
      });
      return webAuth.parseHash({
        hash: window.location.hash
      }, function (err, hash) {
        if (err || !hash || !hash.idToken) {
          /* Must have had hash, but didn't get an idToken in the hash */
          console.error('login error: ', err);
          return dispatch({
            type: constants["Gb" /* LOGIN_FAILED */],
            payload: {
              error: err && err.error ? "".concat(err.error, ": ").concat(err.errorDescription) : 'UnknownError: Unknown Error'
            }
          });
        }
        var returnTo = sessionStorage.getItem('delegated-admin:returnTo') || '/users';
        sessionStorage.removeItem('delegated-admin:returnTo');
        return _processTokens(dispatch, hash.idToken, returnTo);
      });
    }
    var token = sessionStorage.getItem('delegated-admin:apiToken');
    sessionStorage.removeItem('delegated-admin:apiToken');
    if (token) {
      return _processTokens(dispatch, token);
    }
  };
}
function getAccessLevel(onSuccess) {
  return {
    type: constants["E" /* FETCH_ACCESS_LEVEL */],
    meta: {
      onSuccess: onSuccess
    },
    payload: {
      promise: axios["a" /* default */].get('/api/me', {
        responseType: 'json',
        timeout: 8000,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  };
}
function getAppSettings(_onSuccess) {
  return function (dispatch) {
    return dispatch({
      type: constants["gb" /* FETCH_SETTINGS */],
      meta: {
        onSuccess: function onSuccess(response) {
          return dispatch(getLanguageDictionary(response, _onSuccess));
        }
      },
      payload: {
        promise: Object(axios["a" /* default */])('/api/settings', {
          responseType: 'json'
        })
      }
    });
  };
}
function toggleStyleSettings() {
  return function (dispatch, getState) {
    var settings = getState().settings.get('record').toJS();
    settings = settings.settings || settings || {};
    var useAlt = localStorage.getItem('delegated-admin:use-alt-css') === 'true';
    var path = useAlt ? settings.css : settings.altcss;
    localStorage.setItem('delegated-admin:use-alt-css', (!useAlt).toString());
    dispatch({
      type: constants["tc" /* TOGGLE_STYLE_SETTINGS */],
      payload: {
        useAlt: !useAlt,
        path: path
      }
    });
  };
}
function getStyleSettings() {
  return function (dispatch, getState) {
    var settings = getState().settings.get('record').toJS();
    settings = settings.settings || settings || {};
    var useAlt = localStorage.getItem('delegated-admin:use-alt-css') === 'true';
    var path = !useAlt ? settings.css : settings.altcss;
    dispatch({
      type: constants["Eb" /* GET_STYLE_SETTINGS */],
      payload: {
        useAlt: useAlt,
        path: path
      }
    });
  };
}
function getLanguageDictionary(response, _onSuccess2) {
  var settings = _.get(response, 'data.settings', {});
  var promise = Promise.resolve({
    data: {}
  });
  if (settings.languageDictionary) {
    if (_.isObject(settings.languageDictionary)) {
      promise = Promise.resolve({
        data: settings.languageDictionary
      });
    } else if (_.isString(settings.languageDictionary) && settings.languageDictionary.startsWith('http')) {
      // Setting Authorization to None because we don't want to ship the token to some undeclared endpoint,
      // especially if not enforcing https
      var oldAuth = axios["a" /* default */].defaults.headers.common['Authorization'];
      var oldLocale = axios["a" /* default */].defaults.headers.common['dae-locale'];
      delete axios["a" /* default */].defaults.headers.common['Authorization']; // and create your own headers
      delete axios["a" /* default */].defaults.headers.common['dae-locale']; // and create your own headers

      promise = axios["a" /* default */].get(settings.languageDictionary, {
        responseType: 'json'
      }).then(function (response) {
        if (response.data) return response;
        return Promise.reject(new Error("Language Dictionary endpoint: ".concat(settings.languageDictionary, " returned no data")));
      });

      // TODO: Race condition?  I hope not!
      axios["a" /* default */].defaults.headers.common['Authorization'] = oldAuth;
      axios["a" /* default */].defaults.headers.common['dae-locale'] = oldLocale;
    } // ignore else, bad languageDictionary
  }
  return {
    type: constants["Q" /* FETCH_LANGUAGE_DICTIONARY */],
    meta: {
      onSuccess: function onSuccess() {
        return _onSuccess2 && _onSuccess2(response);
      }
    },
    payload: {
      promise: promise
    }
  };
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/classCallCheck.js
var classCallCheck = __webpack_require__(17);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/createClass.js
var createClass = __webpack_require__(18);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/possibleConstructorReturn.js
var possibleConstructorReturn = __webpack_require__(19);
var possibleConstructorReturn_default = /*#__PURE__*/__webpack_require__.n(possibleConstructorReturn);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/getPrototypeOf.js
var getPrototypeOf = __webpack_require__(15);
var getPrototypeOf_default = /*#__PURE__*/__webpack_require__.n(getPrototypeOf);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/inherits.js
var inherits = __webpack_require__(20);
var inherits_default = /*#__PURE__*/__webpack_require__.n(inherits);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/defineProperty.js
var defineProperty = __webpack_require__(2);
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty);

// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(1);
var prop_types_default = /*#__PURE__*/__webpack_require__.n(prop_types);

// CONCATENATED MODULE: ./client/actions/application.js


function fetchApplications() {
  // eslint-disable-line import/prefer-default-export
  return {
    type: constants["I" /* FETCH_APPLICATIONS */],
    payload: {
      promise: axios["a" /* default */].get('/api/applications', {
        responseType: 'json'
      })
    }
  };
}
// CONCATENATED MODULE: ./client/actions/connection.js


function fetchConnections() {
  // eslint-disable-line import/prefer-default-export
  return {
    type: constants["M" /* FETCH_CONNECTIONS */],
    payload: {
      promise: axios["a" /* default */].get('/api/connections', {
        responseType: 'json'
      })
    }
  };
}
// CONCATENATED MODULE: ./client/actions/log.js


function fetchLogs() {
  var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return {
    type: constants["V" /* FETCH_LOGS */],
    meta: {
      page: page
    },
    payload: {
      promise: axios["a" /* default */].get('/api/logs', {
        params: {
          page: page
        },
        responseType: 'json'
      })
    }
  };
}
function fetchLog(logId) {
  return {
    type: constants["U" /* FETCH_LOG */],
    meta: {
      logId: logId
    },
    payload: {
      promise: axios["a" /* default */].get("/api/logs/".concat(logId), {
        responseType: 'json'
      })
    }
  };
}
function clearLog() {
  return {
    type: constants["q" /* CLEAR_LOG */]
  };
}
// CONCATENATED MODULE: ./client/actions/userLog.js


function fetchUserLogs(userId) {
  // eslint-disable-line import/prefer-default-export
  return {
    type: constants["ub" /* FETCH_USER_LOGS */],
    meta: {
      userId: userId
    },
    payload: {
      promise: axios["a" /* default */].get("/api/users/".concat(userId, "/logs"), {
        responseType: 'json'
      })
    }
  };
}
// CONCATENATED MODULE: ./client/actions/userDevice.js


function fetchUserDevices(userId) {
  // eslint-disable-line import/prefer-default-export
  return {
    type: constants["pb" /* FETCH_USER_DEVICES */],
    meta: {
      userId: userId
    },
    payload: {
      promise: axios["a" /* default */].get("/api/users/".concat(userId, "/devices"), {
        responseType: 'json'
      })
    }
  };
}
// CONCATENATED MODULE: ./client/actions/user.js






var addRequiredTextParam = function addRequiredTextParam(url, languageDictionary) {
  languageDictionary = languageDictionary || {};
  if (languageDictionary.requiredErrorText) return "".concat(url, "?requiredErrorText=").concat(encodeURIComponent(languageDictionary.requiredErrorText));
  return url;
};

/*
 * Search for users.
 */
function clearUsers() {
  return {
    type: constants["r" /* CLEAR_USERS */]
  };
}
function fetchUsers(search) {
  var reset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var page = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var filterBy = arguments.length > 3 ? arguments[3] : undefined;
  var sort = arguments.length > 4 ? arguments[4] : undefined;
  var onSuccess = arguments.length > 5 ? arguments[5] : undefined;
  return function (dispatch, getState) {
    var _getState$users$toJS = getState().users.toJS(),
      sortProperty = _getState$users$toJS.sortProperty,
      sortOrder = _getState$users$toJS.sortOrder,
      searchValue = _getState$users$toJS.searchValue,
      selectedFilter = _getState$users$toJS.selectedFilter;
    var meta = {
      page: page,
      sortProperty: sortProperty,
      sortOrder: sortOrder,
      searchValue: searchValue,
      onSuccess: onSuccess
    };
    meta.searchValue = reset ? '' : search || searchValue;
    // filterBy is only meaningful to the API when paired with a search term.
    meta.selectedFilter = reset || !meta.searchValue ? '' : filterBy || selectedFilter;
    if (sort) {
      meta.sortProperty = sort.property;
      meta.sortOrder = sort.order;
    }
    dispatch({
      type: constants["lb" /* FETCH_USERS */],
      payload: {
        promise: axios["a" /* default */].get('/api/users', {
          params: {
            search: meta.searchValue,
            page: page,
            filterBy: meta.selectedFilter,
            sortOrder: meta.sortOrder,
            sortProperty: meta.sortProperty
          },
          responseType: 'json'
        })
      },
      meta: meta
    });
  };
}

/*
 * Create a user.
 */
function createUser(user, languageDictionary) {
  return function (dispatch) {
    dispatch({
      type: constants["s" /* CREATE_USER */],
      meta: {
        user: user,
        onSuccess: function onSuccess() {
          // Give indexing some time when we reload users.
          setTimeout(function () {
            return dispatch(fetchUsers());
          }, 1000);
          dispatch(getAccessLevel());
        }
      },
      payload: {
        promise: axios["a" /* default */].post(addRequiredTextParam('/api/users/', languageDictionary), user, {
          responseType: 'json'
        })
      }
    });
  };
}

/*
 * Show dialog to create a user.
 */
function requestCreateUser(memberships) {
  return function (dispatch, getState) {
    var connections = getState().connections.get('records').toJS();
    var connection = connections.length === 0 ? null : connections && connections.length && connections[0].name;
    dispatch({
      type: constants["cc" /* REQUEST_CREATE_USER */],
      payload: {
        connection: connection,
        memberships: memberships && memberships.length === 1 ? [memberships[0]] : []
      }
    });
  };
}

/*
 * Cancel creating a user.
 */
function cancelCreateUser() {
  return {
    type: constants["f" /* CANCEL_CREATE_USER */]
  };
}

/*
 * Create a user.
 */
function changeFields(userId, user, languageDictionary) {
  return function (dispatch) {
    dispatch({
      type: constants["Ab" /* FIELDS_CHANGE */],
      meta: {
        userId: userId,
        user: user,
        onSuccess: function onSuccess() {
          dispatch(fetchUser(userId));
        }
      },
      payload: {
        promise: axios["a" /* default */].patch(addRequiredTextParam("/api/users/".concat(userId), languageDictionary), user, {
          responseType: 'json'
        })
      }
    });
  };
}

/*
 * Show dialog to create a user.
 */
function requestFieldsChange(user) {
  return function (dispatch) {
    dispatch({
      type: constants["fc" /* REQUEST_FIELDS_CHANGE */],
      payload: {
        user: user
      }
    });
  };
}

/*
 * Cancel creating a user.
 */
function cancelChangeFields() {
  return {
    type: constants["i" /* CANCEL_FIELDS_CHANGE */]
  };
}

/*
 * Fetch the user details.
 */
function fetchUserDetail(userId, onSuccess) {
  return {
    type: constants["kb" /* FETCH_USER */],
    meta: {
      userId: userId,
      onSuccess: onSuccess
    },
    payload: {
      promise: axios["a" /* default */].get("/api/users/".concat(userId), {
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'json'
      })
    }
  };
}

/*
 * Fetch the complete user object.
 */
function fetchUser(userId) {
  return function (dispatch) {
    dispatch(fetchUserDetail(userId));
    dispatch(fetchUserLogs(userId));
    dispatch(fetchUserDevices(userId));
  };
}

/*
 * Get confirmation to remove MFA from a user.
 */
function requestRemoveMultiFactor(user) {
  return {
    type: constants["jc" /* REQUEST_REMOVE_MULTIFACTOR */],
    user: user
  };
}

/*
 * Cancel the removal process.
 */
function user_cancelRemoveMultiFactor() {
  return {
    type: constants["m" /* CANCEL_REMOVE_MULTIFACTOR */]
  };
}

/*
 * Remove multi factor from a user.
 */
function removeMultiFactor(userId, provider) {
  return function (dispatch) {
    dispatch({
      type: constants["Xb" /* REMOVE_MULTIFACTOR */],
      payload: {
        promise: axios["a" /* default */].delete("/api/users/".concat(userId, "/multifactor/").concat(provider))
      },
      meta: {
        userId: userId,
        onSuccess: function onSuccess() {
          dispatch(fetchUserDetail(userId));
        }
      }
    });
  };
}

/*
 * Get confirmation to block a user.
 */
function requestBlockUser(user) {
  return {
    type: constants["bc" /* REQUEST_BLOCK_USER */],
    user: user
  };
}

/*
 * Cancel blocking a user.
 */
function user_cancelBlockUser() {
  return {
    type: constants["e" /* CANCEL_BLOCK_USER */]
  };
}

/*
 * Update the user details.
 */
function updateUser(userId, data, _onSuccess, languageDictionary) {
  return function (dispatch) {
    dispatch({
      type: constants["Cc" /* UPDATE_USER */],
      meta: {
        userId: userId,
        onSuccess: function onSuccess() {
          if (_onSuccess) {
            _onSuccess();
          }
          dispatch(fetchUserDetail(userId));
        }
      },
      payload: {
        promise: axios["a" /* default */].put(addRequiredTextParam("/api/users/".concat(userId), languageDictionary), data, {
          responseType: 'json'
        })
      }
    });
  };
}
/*
 * Block a user.
 */
function blockUser() {
  return function (dispatch, getState) {
    var userId = getState().block.get('user').get('user_id');
    dispatch({
      type: constants["a" /* BLOCK_USER */],
      payload: {
        promise: axios["a" /* default */].put("/api/users/".concat(userId, "/block"))
      },
      meta: {
        userId: userId,
        onSuccess: function onSuccess() {
          dispatch(fetchUserDetail(userId));
        }
      }
    });
  };
}

/*
 * Get confirmation to unblock a user.
 */
function requestUnblockUser(user) {
  return {
    type: constants["lc" /* REQUEST_UNBLOCK_USER */],
    user: user
  };
}

/*
 * Get confirmation to remove user blocks.
 */
function requestRemoveBlockedIPs(user) {
  return {
    type: constants["ic" /* REQUEST_REMOVE_BLOCKED_IPS */],
    user: user
  };
}

/*
 * Cancel unblocking a user.
 */
function user_cancelUnblockUser() {
  return {
    type: constants["o" /* CANCEL_UNBLOCK_USER */]
  };
}

/*
 * Cancel removing user blocks.
 */
function user_cancelRemoveBlocks() {
  return {
    type: constants["l" /* CANCEL_REMOVE_BLOCKED_IPS */]
  };
}

/*
 * Unblock a user.
 */
function unblockUser() {
  return function (dispatch, getState) {
    var userId = getState().unblock.get('user').get('user_id');
    dispatch({
      type: constants["uc" /* UNBLOCK_USER */],
      payload: {
        promise: axios["a" /* default */].put("/api/users/".concat(userId, "/unblock"))
      },
      meta: {
        userId: userId,
        onSuccess: function onSuccess() {
          dispatch(fetchUserDetail(userId));
        }
      }
    });
  };
}

/*
 * Unblock a user.
 */
function removeUserBlocks() {
  return function (dispatch, getState) {
    var userId = getState().removeBlockedIPs.get('user').get('user_id');
    dispatch({
      type: constants["Tb" /* REMOVE_BLOCKED_IPS */],
      payload: {
        promise: axios["a" /* default */].delete("/api/users/".concat(userId, "/blocks"))
      },
      meta: {
        userId: userId,
        onSuccess: function onSuccess() {
          dispatch(fetchUserDetail(userId));
        }
      }
    });
  };
}

/*
 * Get confirmation to delete a user.
 */
function requestDeleteUser(user) {
  return {
    type: constants["dc" /* REQUEST_DELETE_USER */],
    user: user
  };
}

/*
 * Cancel the delete process.
 */
function user_cancelDeleteUser() {
  return {
    type: constants["g" /* CANCEL_DELETE_USER */]
  };
}

/*
 * Delete user.
 */
function deleteUser() {
  return function (dispatch, getState) {
    var _getState$userDelete$ = getState().userDelete.toJS(),
      user_id = _getState$userDelete$.user.user_id;
    dispatch({
      type: constants["w" /* DELETE_USER */],
      payload: {
        promise: axios["a" /* default */].delete("/api/users/".concat(user_id))
      },
      meta: {
        userId: user_id,
        onSuccess: function onSuccess() {
          dispatch(Object(react_router_redux_lib["push"])('/users'));
        }
      }
    });
  };
}

/*
 * Get confirmation to reset a password.
 */
function requestPasswordReset(user, connection) {
  return {
    type: constants["hc" /* REQUEST_PASSWORD_RESET */],
    user: user,
    connection: connection
  };
}

/*
 * Cancel the password reset process.
 */
function user_cancelPasswordReset() {
  return {
    type: constants["k" /* CANCEL_PASSWORD_RESET */]
  };
}

/*
 * Reset password.
 */
function resetPassword(application) {
  return function (dispatch, getState) {
    var _getState$passwordRes = getState().passwordReset.toJS(),
      user_id = _getState$passwordRes.user.user_id,
      connection = _getState$passwordRes.connection;
    var clientId = application.client ? application.client.value || application.client : null;
    dispatch({
      type: constants["Pb" /* PASSWORD_RESET */],
      payload: {
        promise: axios["a" /* default */].post("/api/users/".concat(user_id, "/password-reset"), {
          connection: connection,
          clientId: clientId
        })
      },
      meta: {
        userId: user_id
      }
    });
  };
}

/*
 * Get confirmation to change a password.
 */
function requestPasswordChange(user, connection) {
  return {
    type: constants["gc" /* REQUEST_PASSWORD_CHANGE */],
    user: user,
    connection: connection
  };
}

/*
 * Cancel the password change process.
 */
function user_cancelPasswordChange() {
  return {
    type: constants["j" /* CANCEL_PASSWORD_CHANGE */]
  };
}

/*
 * Change password.
 */
function changePassword(formData, languageDictionary) {
  return function (dispatch, getState) {
    var _getState$passwordCha = getState().passwordChange.toJS(),
      user_id = _getState$passwordCha.user.user_id,
      connection = _getState$passwordCha.connection;
    dispatch({
      type: constants["Lb" /* PASSWORD_CHANGE */],
      payload: {
        promise: axios["a" /* default */].put(addRequiredTextParam("/api/users/".concat(user_id, "/change-password"), languageDictionary), {
          connection: connection,
          password: formData.password,
          repeatPassword: formData.repeatPassword
        })
      },
      meta: {
        userId: user_id
      }
    });
  };
}

/*
 * Get confirmation to change a username.
 */
function requestUsernameChange(user, connection, customField) {
  return {
    type: constants["mc" /* REQUEST_USERNAME_CHANGE */],
    user: user,
    connection: connection,
    customField: customField
  };
}

/*
 * Cancel the username change process.
 */
function user_cancelUsernameChange() {
  return {
    type: constants["p" /* CANCEL_USERNAME_CHANGE */]
  };
}

/*
 * Change username.
 */
function changeUsername(userId, data, languageDictionary) {
  return function (dispatch, getState) {
    var user = getState().user.get('record').toJS();
    user.username = data.username;
    dispatch({
      type: constants["Dc" /* USERNAME_CHANGE */],
      meta: {
        user: user,
        onSuccess: function onSuccess() {
          dispatch(fetchUserDetail(userId));
        }
      },
      payload: {
        promise: axios["a" /* default */].put(addRequiredTextParam("/api/users/".concat(userId, "/change-username"), languageDictionary), data, {
          responseType: 'json'
        })
      }
    });
  };
}

/*
 * Get confirmation to change a email.
 */
function requestEmailChange(user, connection, customField) {
  return {
    type: constants["ec" /* REQUEST_EMAIL_CHANGE */],
    user: user,
    connection: connection,
    customField: customField
  };
}

/*
 * Cancel the email change process.
 */
function user_cancelEmailChange() {
  return {
    type: constants["h" /* CANCEL_EMAIL_CHANGE */]
  };
}

/*
 * Change email.
 */
function changeEmail(user, data, languageDictionary) {
  return function (dispatch) {
    var userId = user.user_id;
    user.email = data.email;
    dispatch({
      type: constants["A" /* EMAIL_CHANGE */],
      meta: {
        user: user,
        onSuccess: function onSuccess() {
          dispatch(fetchUserDetail(userId));
        }
      },
      payload: {
        promise: axios["a" /* default */].put(addRequiredTextParam("/api/users/".concat(userId, "/change-email"), languageDictionary), data, {
          responseType: 'json'
        })
      }
    });
  };
}

/*
 * Get confirmation to change a email.
 */
function requestResendVerificationEmail(user, connection) {
  return {
    type: constants["kc" /* REQUEST_RESEND_VERIFICATION_EMAIL */],
    user: user,
    connection: connection
  };
}

/*
 * Cancel the email change process.
 */
function user_cancelResendVerificationEmail() {
  return {
    type: constants["n" /* CANCEL_RESEND_VERIFICATION_EMAIL */]
  };
}

/*
 * Resend verification email.
 */
function resendVerificationEmail(userId) {
  return function (dispatch) {
    var data = {
      user_id: userId
    };
    dispatch({
      type: constants["nc" /* RESEND_VERIFICATION_EMAIL */],
      meta: {
        userId: userId,
        onSuccess: function onSuccess() {
          dispatch(fetchUserDetail(userId));
        }
      },
      payload: {
        promise: axios["a" /* default */].post("/api/users/".concat(userId, "/send-verification-email"), data, {
          responseType: 'json'
        })
      }
    });
  };
}
// CONCATENATED MODULE: ./client/actions/script.js



function fetchScript(name) {
  return {
    type: constants["cb" /* FETCH_SCRIPT */],
    payload: {
      promise: axios["a" /* default */].get("/api/scripts/".concat(name), {
        responseType: 'json'
      })
    },
    meta: {
      name: name
    }
  };
}
function updateScript(name, script) {
  return function (dispatch) {
    dispatch({
      type: constants["yc" /* UPDATE_SCRIPT */],
      meta: {
        name: name,
        script: script,
        onSuccess: function onSuccess() {
          if (name === 'settings') {
            return dispatch(getAppSettings());
          }
        }
      },
      payload: {
        promise: axios["a" /* default */].post("/api/scripts/".concat(name), {
          script: script
        }, {
          responseType: 'json'
        })
      }
    });
  };
}
// CONCATENATED MODULE: ./client/actions/index.js
















// EXTERNAL MODULE: ./node_modules/auth0-extension-ui/dist/index.js
var dist = __webpack_require__(14);

// EXTERNAL MODULE: ./client/components/Header.styles.css
var Header_styles = __webpack_require__(946);

// CONCATENATED MODULE: ./client/components/Header.jsx






function _callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }




var Header_Header = /*#__PURE__*/function (_Component) {
  function Header() {
    var _this;
    classCallCheck_default()(this, Header);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, Header, [].concat(args));
    defineProperty_default()(_this, "onKeyUp", function (event) {
      if (event && event.key === 'Enter') {
        event.target.click();
      }
    });
    defineProperty_default()(_this, "renderTitle", function (isAdmin) {
      if (isAdmin && window.config.AUTH0_MANAGE_URL) {
        return /*#__PURE__*/react_default.a.createElement("a", {
          className: "navbar-brand",
          href: window.config.AUTH0_MANAGE_URL
        }, _this.props.getDictValue('title', window.config.TITLE));
      }
      return /*#__PURE__*/react_default.a.createElement("span", {
        className: "navbar-brand"
      }, _this.props.getDictValue('title', window.config.TITLE));
    });
    return _this;
  }
  inherits_default()(Header, _Component);
  return createClass_default()(Header, [{
    key: "getName",
    value: function getName(iss, user) {
      var thisMenuName = this.props.getDictValue('menuName');
      thisMenuName = thisMenuName || user && user.get('name');
      thisMenuName = thisMenuName || user && user.get('nickname');
      thisMenuName = thisMenuName || user && user.get('email');
      thisMenuName = thisMenuName || iss;
      return thisMenuName.length >= 21 ? thisMenuName.substr(0, 18) + '...' : thisMenuName;
    }
  }, {
    key: "getPicture",
    value: function getPicture(iss, user) {
      if (user && user.get('picture')) {
        return user.get('picture');
      }
      if (user && user.get('nickname')) {
        return "https://cdn.auth0.com/avatars/".concat(user.get('nickname').slice(0, 2).toLowerCase(), ".png");
      }
      return "https://cdn.auth0.com/avatars/".concat(iss.slice(0, 2).toLowerCase(), ".png");
    }
  }, {
    key: "showOnFocus",
    value: function showOnFocus() {
      document.querySelector('#navbar-collapse li.dropdown').classList.add('open');
    }
  }, {
    key: "hideOnBlur",
    value: function hideOnBlur() {
      document.querySelector('#navbar-collapse li.dropdown').classList.remove('open');
    }
  }, {
    key: "renderCssSwitcher",
    value: function renderCssSwitcher(languageDictionary) {
      if (this.props.renderCssToggle) {
        var toggleTextDefault = languageDictionary.toggleStyleSetDefault || 'Use Default Style';
        var toggleTextAlt = languageDictionary.toggleStyleSetAlternative || 'Use Alternative Style';
        var text = this.props.styleSettings.get('useAlt') ? toggleTextDefault : toggleTextAlt;
        return /*#__PURE__*/react_default.a.createElement("li", {
          role: "presentation"
        }, /*#__PURE__*/react_default.a.createElement("a", {
          role: "menuitem",
          onClick: this.props.onCssToggle,
          onFocus: this.showOnFocus,
          onBlur: this.hideOnBlur,
          onKeyUp: this.onKeyUp,
          tabIndex: "0"
        }, text));
      }
      return '';
    }
  }, {
    key: "getMenu",
    value: function getMenu(isAdmin, languageDictionary) {
      if (!isAdmin) {
        return /*#__PURE__*/react_default.a.createElement("ul", {
          role: "menu",
          className: "dropdown-menu"
        }, this.renderCssSwitcher(languageDictionary), /*#__PURE__*/react_default.a.createElement("li", {
          role: "presentation"
        }, /*#__PURE__*/react_default.a.createElement("a", {
          role: "menuitem",
          onClick: this.props.onLogout,
          onFocus: this.showOnFocus,
          onBlur: this.hideOnBlur,
          onKeyUp: this.onKeyUp,
          tabIndex: "0"
        }, languageDictionary.logoutMenuItemText || 'Logout')));
      }
      return /*#__PURE__*/react_default.a.createElement("ul", {
        role: "menu",
        className: "dropdown-menu"
      }, /*#__PURE__*/react_default.a.createElement("li", {
        role: "presentation"
      }, /*#__PURE__*/react_default.a.createElement(react_router_lib["Link"], {
        to: "/users",
        onFocus: this.showOnFocus,
        onBlur: this.hideOnBlur
      }, languageDictionary.usersAndLogsMenuItemText || 'Users & Logs')), /*#__PURE__*/react_default.a.createElement("li", {
        role: "presentation"
      }, /*#__PURE__*/react_default.a.createElement(react_router_lib["Link"], {
        to: "/configuration",
        onFocus: this.showOnFocus,
        onBlur: this.hideOnBlur
      }, languageDictionary.configurationMenuItemText || 'Configuration')), this.renderCssSwitcher(languageDictionary), /*#__PURE__*/react_default.a.createElement("li", {
        role: "presentation"
      }, /*#__PURE__*/react_default.a.createElement("a", {
        role: "menuitem",
        onClick: this.props.onLogout,
        onFocus: this.showOnFocus,
        onBlur: this.hideOnBlur,
        onKeyUp: this.onKeyUp,
        tabIndex: "0"
      }, languageDictionary.logoutMenuItemText || 'Logout')));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        user = _this$props.user,
        issuer = _this$props.issuer,
        accessLevel = _this$props.accessLevel;
      var languageDictionary = this.props.languageDictionary || {};
      var isAdmin = accessLevel.role === 3;
      return /*#__PURE__*/react_default.a.createElement("header", {
        className: "dashboard-header"
      }, /*#__PURE__*/react_default.a.createElement("nav", {
        title: "header",
        role: "navigation",
        className: "navbar navbar-default"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "container"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        id: "header",
        className: "navbar-header",
        style: {
          width: '800px'
        }
      }, this.renderTitle(isAdmin)), /*#__PURE__*/react_default.a.createElement("div", {
        id: "navbar-collapse",
        className: "collapse navbar-collapse"
      }, /*#__PURE__*/react_default.a.createElement("ul", {
        className: "nav navbar-nav navbar-right"
      }, /*#__PURE__*/react_default.a.createElement("li", {
        className: "dropdown"
      }, /*#__PURE__*/react_default.a.createElement("span", {
        role: "button",
        "data-toggle": "dropdown",
        "data-target": "#",
        className: "btn-dro btn-username"
      }, /*#__PURE__*/react_default.a.createElement("img", {
        role: "presentation",
        src: this.getPicture(issuer, user),
        className: "picture avatar",
        alt: languageDictionary.adminAvatarTitle || 'Avatar',
        title: languageDictionary.adminAvatarTitle || 'Avatar'
      }), /*#__PURE__*/react_default.a.createElement("span", {
        className: "username-text"
      }, this.getName(issuer, user)), /*#__PURE__*/react_default.a.createElement("i", {
        className: "icon-budicon-460"
      })), this.getMenu(isAdmin, languageDictionary)))))));
    }
  }]);
}(react["Component"]);
defineProperty_default()(Header_Header, "propTypes", {
  user: prop_types_default.a.object,
  getDictValue: prop_types_default.a.func,
  accessLevel: prop_types_default.a.object,
  issuer: prop_types_default.a.string,
  onLogout: prop_types_default.a.func.isRequired,
  onCssToggle: prop_types_default.a.func.isRequired,
  renderCssToggle: prop_types_default.a.bool,
  styleSettings: prop_types_default.a.object.isRequired,
  languageDictionary: prop_types_default.a.object
});

// CONCATENATED MODULE: ./client/containers/App.jsx






function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function App_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, App_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function App_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (App_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }







var App_App = /*#__PURE__*/function (_Component) {
  function App() {
    var _this;
    classCallCheck_default()(this, App);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = App_callSuper(this, App, [].concat(args));
    defineProperty_default()(_this, "getDictValue", function (index, defaultValue) {
      var appSettings = _this.props.settings;
      var val = '';
      if (appSettings.get('settings') && appSettings.get('settings').get('dict')) {
        val = appSettings.get('settings').get('dict').get(index);
      }
      return val || defaultValue;
    });
    defineProperty_default()(_this, "onLogout", function () {
      var appSettings = _this.props.settings;
      var logoutUrl;
      if (appSettings.get('settings') && appSettings.get('settings').get('dict')) {
        logoutUrl = appSettings.get('settings').get('dict').get('logoutUrl');
      }
      _this.props.logout(logoutUrl);
    });
    return _this;
  }
  inherits_default()(App, _Component);
  return createClass_default()(App, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.props.getAppSettings();
      this.props.fetchApplications();
      this.props.fetchConnections();
      this.props.getAccessLevel();
      this.props.getStyleSettings();
    }
  }, {
    key: "render",
    value: function render() {
      var settingsLoading = this.props.settingsLoading;
      var languageDictionary = this.props.languageDictionary ? this.props.languageDictionary.toJS() : {};
      var settings = this.props.settings.get('settings') && this.props.settings.get('settings').toJS();
      var renderCssToggle = !!(settings && settings.css && settings.altcss);
      if (settingsLoading) {
        return /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
          show: settingsLoading
        });
      }
      return /*#__PURE__*/react_default.a.createElement("div", null, /*#__PURE__*/react_default.a.createElement(Header_Header, {
        user: this.props.user,
        issuer: this.props.issuer,
        getDictValue: this.getDictValue,
        onLogout: this.onLogout,
        onCssToggle: this.props.toggleStyleSettings,
        accessLevel: this.props.accessLevel.toJSON(),
        styleSettings: this.props.styleSettings,
        languageDictionary: languageDictionary,
        renderCssToggle: renderCssToggle
      }), /*#__PURE__*/react_default.a.createElement("div", {
        className: "container"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react_default.a.createElement("section", {
        className: "content-page current"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        id: "content-area",
        className: "tab-content"
      }, /*#__PURE__*/react_default.a.cloneElement(this.props.children, {
        accessLevel: this.props.accessLevel.toJSON(),
        appSettings: this.props.settings.toJSON(),
        getDictValue: this.getDictValue
      })))))));
    }
  }]);
}(react["Component"]);
defineProperty_default()(App_App, "propTypes", {
  user: prop_types_default.a.object,
  settings: prop_types_default.a.object,
  issuer: prop_types_default.a.string,
  logout: prop_types_default.a.func,
  settingsLoading: prop_types_default.a.bool,
  styleSettings: prop_types_default.a.bool,
  fetchApplications: prop_types_default.a.func.isRequired,
  fetchConnections: prop_types_default.a.func.isRequired,
  getAccessLevel: prop_types_default.a.func.isRequired,
  getAppSettings: prop_types_default.a.func.isRequired,
  toggleStyleSettings: prop_types_default.a.func.isRequired,
  languageDictionary: prop_types_default.a.object.isRequired
});
function App_select(state) {
  return {
    issuer: state.auth.get('issuer'),
    user: state.auth.get('user'),
    accessLevel: state.accessLevel.get('record'),
    settings: state.settings.get('record'),
    styleSettings: state.styleSettings,
    settingsLoading: state.settings.get('loading'),
    languageDictionary: state.languageDictionary.get('record')
  };
}
/* harmony default export */ var containers_App = (Object(react_redux_lib["connect"])(App_select, _objectSpread(_objectSpread(_objectSpread({
  logout: logout
}, application_namespaceObject), connection_namespaceObject), auth_namespaceObject))(App_App));
// CONCATENATED MODULE: ./client/containers/Login.jsx






function Login_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, Login_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function Login_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (Login_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }






var Login_LoginContainer = /*#__PURE__*/function (_Component) {
  function LoginContainer() {
    classCallCheck_default()(this, LoginContainer);
    return Login_callSuper(this, LoginContainer, arguments);
  }
  inherits_default()(LoginContainer, _Component);
  return createClass_default()(LoginContainer, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      if (this.props.auth.isAuthenticated) {
        this.props.push(this.props.auth.returnTo || '/users');
      } else if (!this.props.auth.isAuthenticating && !this.props.auth.error) {
        // reset the local storage for locale
        this.props.login(this.props.location.query.returnUrl, window.config.LOCALE || 'en');
      }
    }
  }, {
    key: "login",
    value: function login() {
      this.props.login(this.props.location.query.returnUrl, window.config.LOCALE || 'en');
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        auth = _this$props.auth,
        languageDictionary = _this$props.languageDictionary;
      if (auth.error) {
        return /*#__PURE__*/react_default.a.createElement("div", {
          className: "row"
        }, /*#__PURE__*/react_default.a.createElement(dist["Confirm"], {
          dialogClassName: "login-error",
          confirmMessage: languageDictionary.loginErrorButtonText || "Login",
          loading: false,
          title: languageDictionary.loginErrorTitle || "Login Error",
          show: this.props.auth.error,
          onConfirm: this.login.bind(this)
        }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
          show: true,
          message: this.props.auth.error
        })));
      }
      if (!auth.isAuthenticating) {
        return /*#__PURE__*/react_default.a.createElement("div", null);
      }
      return /*#__PURE__*/react_default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12 wrapper"
      }, /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], null)));
    }
  }]);
}(react["Component"]);
defineProperty_default()(Login_LoginContainer, "propTypes", {
  login: prop_types_default.a.func.isRequired,
  push: prop_types_default.a.func.isRequired,
  auth: prop_types_default.a.object.isRequired,
  location: prop_types_default.a.object.isRequired,
  languageDictionary: prop_types_default.a.object.isRequired
});
function mapStateToProps(state) {
  return {
    auth: state.auth.toJS(),
    languageDictionary: state.languageDictionary.get('record').toJS()
  };
}
/* harmony default export */ var Login = (Object(react_redux_lib["connect"])(mapStateToProps, {
  login: login,
  push: react_router_redux_lib["push"]
})(Login_LoginContainer));
// EXTERNAL MODULE: ./node_modules/react-bootstrap/es/index.js + 96 modules
var es = __webpack_require__(22);

// EXTERNAL MODULE: ./node_modules/lodash/lodash.js
var lodash = __webpack_require__(12);
var lodash_default = /*#__PURE__*/__webpack_require__.n(lodash);

// CONCATENATED MODULE: ./client/utils/getErrorMessage.js
var defaultMessages = {
  defaultErrorMessage: 'Unknown Error',
  FETCH_ACCESS_LEVEL: {
    default: 'An error occurred while loading the settings: {message}'
  },
  FETCH_APPLICATIONS: {
    default: 'An error occurred while loading the applications: {message}'
  },
  BLOCK_USER: {
    default: 'An error occurred while blocking the user: {message}'
  },
  FETCH_CONNECTIONS: {
    default: 'An error occurred while loading the connections: {message}'
  },
  EMAIL_CHANGE: {
    default: 'An error occurred while changing the email: {message}'
  },
  FIELDS_CHANGE: {
    default: 'An error occurred while changing the users fields: {message}'
  },
  FETCH_LANGUAGE_DICTIONARY: {
    default: 'An error occurred while loading the language dictionary: {message}'
  },
  FETCH_LOG: {
    default: 'An error occurred while loading the log record: {message}'
  },
  FETCH_LOGS: {
    default: 'An error occurred while loading the logs list: {message}'
  },
  REMOVE_MULTIFACTOR: {
    default: 'An error occurred while removing multi factor authentication for the user: {message}'
  },
  PASSWORD_CHANGE: {
    default: 'An error occurred while changing the password: {message}'
  },
  PASSWORD_RESET: {
    default: 'An error occurred while resetting the password: {message}'
  },
  FETCH_SCRIPT: {
    default: 'An error occurred while loading the script: {message}'
  },
  UPDATE_SCRIPT: {
    default: 'An error occurred while saving the script: {message}'
  },
  FETCH_SETTINGS: {
    default: 'An error occurred while loading the settings: {message}'
  },
  UNBLOCK_USER: {
    default: 'An error occurred while unblocking the user: {message}'
  },
  REMOVE_BLOCKS: {
    default: 'An error occurred while removing anomaly blocks: {message}'
  },
  FETCH_USER_LOGS: {
    default: 'An error occurred while loading the user logs: {message}'
  },
  FETCH_USER_DEVICES: {
    default: 'An error occurred while loading the user devices: {message}'
  },
  FETCH_USER: {
    default: 'An error occurred while loading the user: {message}'
  },
  CREATE_USER: {
    default: 'An error occurred while creating the user: {message}'
  },
  DELETE_USER: {
    default: 'An error occurred while deleting the user: {message}'
  },
  USERNAME_CHANGE: {
    default: 'An error occurred while changing the username: {message}'
  },
  FETCH_USERS: {
    default: 'An error occurred while loading the users list: {message}'
  },
  RESEND_VERIFICATION_EMAIL: {
    default: 'An error occurred while sending verification email: {message}'
  }
};
/* harmony default export */ var getErrorMessage = (function (languageDictionary, error, translator) {
  languageDictionary = languageDictionary || {};
  var errors = languageDictionary.errors || {};
  if (!error) {
    return null;
  }
  error = error.toJS ? error.toJS() : error;
  var messages = Object.assign({}, defaultMessages, errors);
  var message = messages[error.type] && messages[error.type][error.status] || messages[error.type].default;
  if (translator) {
    return message.replace('{message}', translator(error, languageDictionary) || messages.defaultErrorMessage);
  }
  return message.replace('{message}', error.message || messages.defaultErrorMessage);
});
// CONCATENATED MODULE: ./client/components/Logs/LogDialog.jsx






function LogDialog_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, LogDialog_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function LogDialog_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (LogDialog_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }






var LogDialog_LogDialog = /*#__PURE__*/function (_Component) {
  function LogDialog() {
    classCallCheck_default()(this, LogDialog);
    return LogDialog_callSuper(this, LogDialog, arguments);
  }
  inherits_default()(LogDialog, _Component);
  return createClass_default()(LogDialog, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        logId = _this$props.logId,
        error = _this$props.error,
        loading = _this$props.loading,
        onClose = _this$props.onClose,
        settings = _this$props.settings;
      if (logId === null) {
        return /*#__PURE__*/react_default.a.createElement("div", null);
      }
      var languageDictionary = this.props.languageDictionary || {};
      var log = this.props.log.toJS();
      var logType = lodash_default.a.get(languageDictionary, "logTypes.".concat(log.shortType, ".event"), log.type);
      return /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */], {
        show: logId !== null,
        onHide: onClose
      }, /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */].Header, {
        closeButton: !loading
      }, /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */].Title, null, languageDictionary.logDialogTitleText || 'Log', " - ", /*#__PURE__*/react_default.a.createElement("span", null, logType || languageDictionary.logDialogDefaultLogRecordText || 'Log Record'))), /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */].Body, null, /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: loading,
        spinnerStyle: {
          height: '16px',
          width: '16px'
        },
        animationStyle: {
          paddingTop: '0px',
          paddingBottom: '0px',
          marginTop: '0px',
          marginBottom: '10px'
        }
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }, /*#__PURE__*/react_default.a.createElement(dist["Json"], {
        jsonObject: log
      })))), /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */].Footer, null, /*#__PURE__*/react_default.a.createElement(es["b" /* Button */], {
        disabled: loading,
        onClick: onClose
      }, /*#__PURE__*/react_default.a.createElement("i", {
        className: "icon icon-budicon-501"
      }), " ", languageDictionary.closeButtonText || 'Close')));
    }
  }]);
}(react["Component"]);
defineProperty_default()(LogDialog_LogDialog, "propTypes", {
  onClose: prop_types_default.a.func.isRequired,
  log: prop_types_default.a.object.isRequired,
  settings: prop_types_default.a.object.isRequired,
  error: prop_types_default.a.string,
  loading: prop_types_default.a.bool.isRequired,
  logId: prop_types_default.a.string,
  languageDictionary: prop_types_default.a.object
});

// EXTERNAL MODULE: ./node_modules/moment/moment.js
var moment = __webpack_require__(11);
var moment_default = /*#__PURE__*/__webpack_require__.n(moment);

// CONCATENATED MODULE: ./client/components/Logs/LogsTable.jsx






function LogsTable_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, LogsTable_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function LogsTable_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (LogsTable_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }






var LogsTable_LogsTable = /*#__PURE__*/function (_Component) {
  function LogsTable() {
    classCallCheck_default()(this, LogsTable);
    return LogsTable_callSuper(this, LogsTable, arguments);
  }
  inherits_default()(LogsTable, _Component);
  return createClass_default()(LogsTable, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.logs !== this.props.logs || nextProps.loading !== this.props.loading;
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;
      var _this$props = this.props,
        error = _this$props.error,
        loading = _this$props.loading,
        settings = _this$props.settings;
      var languageDictionary = this.props.languageDictionary || {};
      var suppressRawData = settings && settings.suppressRawData === true;
      if (!error && this.props.logs.size === 0) {
        return /*#__PURE__*/react_default.a.createElement("div", null, languageDictionary.noLogsMessage || 'No logs found');
      }
      var logs = this.props.logs.toJS();
      return /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: loading,
        animationStyle: {
          paddingTop: '5px',
          paddingBottom: '5px'
        }
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement(dist["Table"], null, /*#__PURE__*/react_default.a.createElement(dist["TableHeader"], null, /*#__PURE__*/react_default.a.createElement(dist["TableColumn"], {
        width: "3%"
      }), /*#__PURE__*/react_default.a.createElement(dist["TableColumn"], {
        width: "20%"
      }, languageDictionary.logEventColumnHeader || 'Event'), /*#__PURE__*/react_default.a.createElement(dist["TableColumn"], {
        width: "25%"
      }, languageDictionary.logDescriptionColumnHeader || 'Description'), /*#__PURE__*/react_default.a.createElement(dist["TableColumn"], {
        width: "12%"
      }, languageDictionary.logDateColumnHeader || 'Date'), /*#__PURE__*/react_default.a.createElement(dist["TableColumn"], {
        width: "15%"
      }, languageDictionary.logConnectionColumnHeader || 'Connection'), /*#__PURE__*/react_default.a.createElement(dist["TableColumn"], {
        width: "15%"
      }, languageDictionary.logApplicationColumnHeader || 'Application')), /*#__PURE__*/react_default.a.createElement(dist["TableBody"], null, logs.map(function (log, index) {
        var icon = log.type.icon;
        var onClick = suppressRawData ? null : function () {
          return _this.props.onOpen(log._id);
        };
        var logType = lodash_default.a.get(languageDictionary, "logTypes.".concat(log.shortType, ".event"), log.type.event);
        var logDescription = lodash_default.a.get(languageDictionary, "logTypes.".concat(log.shortType, ".description"), languageDictionary.logTableDefaultLogRecordDescription || log.description || log.type.description);
        var descriptionText = _this.props.isUserLogs ? logDescription || log.user_name : log.user_name || logDescription;
        log.time_ago = moment_default()(log.date).locale(languageDictionary.momentLocale || 'en').fromNow();
        return /*#__PURE__*/react_default.a.createElement(dist["TableRow"], {
          key: index
        }, /*#__PURE__*/react_default.a.createElement(dist["TableIconCell"], {
          color: icon.color,
          icon: icon.name,
          title: logType
        }), /*#__PURE__*/react_default.a.createElement(dist["TableTextCell"], {
          onClick: onClick
        }, logType || languageDictionary.logDialogDefaultLogRecordText || 'Log Record'), /*#__PURE__*/react_default.a.createElement(dist["TableTextCell"], null, descriptionText), /*#__PURE__*/react_default.a.createElement(dist["TableTextCell"], null, log.time_ago), /*#__PURE__*/react_default.a.createElement(dist["TableTextCell"], null, log.connection || languageDictionary.notApplicableLabel || 'N/A'), /*#__PURE__*/react_default.a.createElement(dist["TableTextCell"], null, log.client_name || languageDictionary.notApplicableLabel || 'N/A'));
      }))));
    }
  }]);
}(react["Component"]);
defineProperty_default()(LogsTable_LogsTable, "propTypes", {
  onOpen: prop_types_default.a.func.isRequired,
  error: prop_types_default.a.string,
  loading: prop_types_default.a.bool.isRequired,
  logs: prop_types_default.a.object.isRequired,
  settings: prop_types_default.a.object.isRequired,
  isUserLogs: prop_types_default.a.bool,
  languageDictionary: prop_types_default.a.object
});

;
// CONCATENATED MODULE: ./client/components/TabsHeader.jsx






function TabsHeader_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, TabsHeader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function TabsHeader_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (TabsHeader_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var TabsHeader_TabsHeader = /*#__PURE__*/function (_Component) {
  function TabsHeader() {
    classCallCheck_default()(this, TabsHeader);
    return TabsHeader_callSuper(this, TabsHeader, arguments);
  }
  inherits_default()(TabsHeader, _Component);
  return createClass_default()(TabsHeader, [{
    key: "render",
    value: function render() {
      var hasLogsAccess = this.props.role >= 2;
      var languageDictionary = this.props.languageDictionary || {};
      return /*#__PURE__*/react_default.a.createElement("div", {
        className: "widget-title title-with-nav-bars"
      }, /*#__PURE__*/react_default.a.createElement("ul", {
        className: "nav nav-tabs"
      }, /*#__PURE__*/react_default.a.createElement(dist["TabPane"], {
        title: languageDictionary.userUsersTabTitle || "Users",
        route: "users"
      }), hasLogsAccess ? /*#__PURE__*/react_default.a.createElement(dist["TabPane"], {
        title: languageDictionary.userLogsTabTitle || "Logs",
        route: "logs"
      }) : null));
    }
  }]);
}(react["Component"]);
defineProperty_default()(TabsHeader_TabsHeader, "propTypes", {
  role: prop_types_default.a.number,
  languageDictionary: prop_types_default.a.object
});

// CONCATENATED MODULE: ./client/containers/Logs.jsx






function Logs_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, Logs_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function Logs_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (Logs_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }










var Logs_LogsContainer = /*#__PURE__*/function (_Component) {
  function LogsContainer() {
    var _this;
    classCallCheck_default()(this, LogsContainer);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = Logs_callSuper(this, LogsContainer, [].concat(args));
    defineProperty_default()(_this, "refresh", function () {
      _this.props.fetchLogs();
    });
    defineProperty_default()(_this, "loadMore", function () {
      _this.props.fetchLogs(_this.props.logs.nextPage);
    });
    return _this;
  }
  inherits_default()(LogsContainer, _Component);
  return createClass_default()(LogsContainer, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.props.fetchLogs();
    }
  }, {
    key: "createToolbar",
    value: function createToolbar() {
      var isBottom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var languageDictionary = this.props.languageDictionary;
      if (isBottom && (!this.props.logs.records || this.props.logs.records.size <= 20)) {
        return /*#__PURE__*/react_default.a.createElement("div", null);
      }
      return /*#__PURE__*/react_default.a.createElement(es["c" /* ButtonToolbar */], {
        className: "pull-right"
      }, /*#__PURE__*/react_default.a.createElement(es["b" /* Button */], {
        bsSize: "small",
        onClick: this.refresh,
        disabled: this.props.logs.loading
      }, /*#__PURE__*/react_default.a.createElement("i", {
        className: "icon icon-budicon-257"
      }), " ", languageDictionary.logsRefreshButtonText || 'Refresh'), /*#__PURE__*/react_default.a.createElement(es["b" /* Button */], {
        bsStyle: "primary",
        bsSize: "small",
        disabled: this.props.logs.loading,
        onClick: this.loadMore
      }, /*#__PURE__*/react_default.a.createElement("i", {
        className: "icon icon-budicon-686"
      }), " ", languageDictionary.logsLoadMoreButtonText || 'Load More'));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        log = _this$props.log,
        logs = _this$props.logs,
        accessLevel = _this$props.accessLevel,
        languageDictionary = _this$props.languageDictionary,
        settings = _this$props.settings;
      var originalTitle = settings.dict && settings.dict.title || window.config.TITLE || 'User Management';
      document.title = "".concat(languageDictionary.userLogsTabTitle || 'Logs', " - ").concat(originalTitle);
      return /*#__PURE__*/react_default.a.createElement("div", null, /*#__PURE__*/react_default.a.createElement(TabsHeader_TabsHeader, {
        role: accessLevel.role,
        languageDictionary: languageDictionary
      }), /*#__PURE__*/react_default.a.createElement(LogDialog_LogDialog, {
        onClose: this.props.clearLog,
        error: log.error,
        loading: log.loading,
        log: log.record,
        logId: log.id,
        settings: settings,
        languageDictionary: languageDictionary
      }), /*#__PURE__*/react_default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12 wrapper"
      }, this.createToolbar(false))), /*#__PURE__*/react_default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12 wrapper"
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, logs.error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: logs.loading
      }, /*#__PURE__*/react_default.a.createElement(LogsTable_LogsTable, {
        onOpen: this.props.fetchLog,
        loading: logs.loading,
        logs: logs.records,
        settings: settings,
        languageDictionary: languageDictionary
      })))), /*#__PURE__*/react_default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12 wrapper"
      }, this.createToolbar(true))));
    }
  }]);
}(react["Component"]);
defineProperty_default()(Logs_LogsContainer, "propTypes", {
  clearLog: prop_types_default.a.func.isRequired,
  fetchLog: prop_types_default.a.func.isRequired,
  fetchLogs: prop_types_default.a.func.isRequired,
  log: prop_types_default.a.object,
  accessLevel: prop_types_default.a.object,
  logs: prop_types_default.a.object.isRequired,
  settings: prop_types_default.a.object.isRequired,
  languageDictionary: prop_types_default.a.object.isRequired
});
function Logs_mapStateToProps(state) {
  return {
    logs: {
      error: state.logs.get('error'),
      loading: state.logs.get('loading'),
      records: state.logs.get('records'),
      total: state.logs.get('total'),
      nextPage: state.logs.get('nextPage')
    },
    log: {
      record: state.log.get('record'),
      id: state.log.get('logId'),
      error: state.log.get('error'),
      loading: state.log.get('loading')
    },
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    languageDictionary: state.languageDictionary.get('record').toJS()
  };
}
/* harmony default export */ var Logs = (Object(react_redux_lib["connect"])(Logs_mapStateToProps, log_namespaceObject)(Logs_LogsContainer));
// CONCATENATED MODULE: ./client/containers/RequireAuthentication.jsx






function RequireAuthentication_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, RequireAuthentication_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function RequireAuthentication_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (RequireAuthentication_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }





function RequireAuthentication(InnerComponent) {
  var RequireAuthenticationContainer = /*#__PURE__*/function (_React$Component) {
    function RequireAuthenticationContainer() {
      classCallCheck_default()(this, RequireAuthenticationContainer);
      return RequireAuthentication_callSuper(this, RequireAuthenticationContainer, arguments);
    }
    inherits_default()(RequireAuthenticationContainer, _React$Component);
    return createClass_default()(RequireAuthenticationContainer, [{
      key: "componentWillMount",
      value: function componentWillMount() {
        this.requireAuthentication();
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps() {
        this.requireAuthentication();
      }
    }, {
      key: "requireAuthentication",
      value: function requireAuthentication() {
        if (!this.props.auth.isAuthenticated && !this.props.auth.isAuthenticating) {
          if (!this.props.location) {
            this.props.push('/login');
          } else {
            // Encode the full return path so nested query params (e.g. search & filterBy)
            // are not parsed as separate /login query params after the Auth0 redirect.
            var returnPath = "".concat(this.props.location.pathname).concat(this.props.location.search || '');
            this.props.push("/login?returnUrl=".concat(encodeURIComponent(returnPath)));
          }
        }
        axios["a" /* default */].defaults.headers.common['dae-locale'] = window.config.LOCALE;
      }
    }, {
      key: "render",
      value: function render() {
        if (this.props.auth.isAuthenticated) {
          return /*#__PURE__*/react_default.a.createElement(InnerComponent, this.props);
        }
        return /*#__PURE__*/react_default.a.createElement("div", null);
      }
    }]);
  }(react_default.a.Component);
  defineProperty_default()(RequireAuthenticationContainer, "propTypes", {
    push: prop_types_default.a.func.isRequired,
    auth: prop_types_default.a.object.isRequired,
    location: prop_types_default.a.object.isRequired
  });
  return Object(react_redux_lib["connect"])(function (state) {
    return {
      auth: state.auth.toJS()
    };
  }, {
    push: react_router_redux_lib["push"]
  })(RequireAuthenticationContainer);
}
// EXTERNAL MODULE: ./node_modules/redux-static/lib/index.js
var redux_static_lib = __webpack_require__(34);
var redux_static_lib_default = /*#__PURE__*/__webpack_require__.n(redux_static_lib);

// EXTERNAL MODULE: ./client/containers/Users/User.styles.css
var User_styles = __webpack_require__(1017);

// CONCATENATED MODULE: ./client/containers/Users/Dialogs/getDialogMessage.js
var getDialogMessage = function getDialogMessage(message, fieldName, value) {
  var regexp = /^([^{]*){([^}]*)}(.*)$/; // rudimentary string replacement
  var match = regexp.exec(message);
  if (match && match[2].trim() === fieldName) {
    return "".concat(match[1]).concat(value).concat(match[3]);
  }
  return "".concat(message).concat(value);
};
/* harmony default export */ var Dialogs_getDialogMessage = (getDialogMessage);
// CONCATENATED MODULE: ./client/utils/display.js


var getProperty = function getProperty(obj, path) {
  var args = path.split('.'),
    i,
    l;
  for (i = 0, l = args.length; i < l; i++) {
    if (!obj.hasOwnProperty(args[i])) return;
    obj = obj[args[i]];
  }
  return obj;
};
var display_getName = function getName(user, fields, languageDictionary) {
  fields = fields || [];
  var field = lodash_default.a.find(fields, {
    property: 'name'
  });
  if (field) {
    return display_getValue(user, field, languageDictionary);
  }
  return user && (user.name || user.user_name || user.email);
};
var display_getValueForType = function getValueForType(type, user, field) {
  var languageDictionary = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var additionalData = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var mergedField = lodash_default.a.assign({}, field, field[type]);
  return display_getValue(user, mergedField, languageDictionary, additionalData);
};
var display_getValue = function getValue(user, field) {
  var languageDictionary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var additionalData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  if (!user || user.size === 0) {
    return null;
  }
  if (lodash_default.a.isFunction(field.display)) {
    try {
      return field.display(user, lodash_default.a.at(user, field.property), languageDictionary, additionalData);
    } catch (e) {
      /* Swallow eval errors */
      console.log("Could not display ".concat(field.property, " because: ").concat(e.message));
      return null;
    }
  }
  var value = getProperty(user, field.property);
  if (value === undefined) return null;
  if (field.type && field.type === 'elapsedTime') {
    value = moment_default()(value).locale(languageDictionary.momentLocale || 'en').fromNow();
  }
  if (lodash_default.a.isObject(value)) {
    value = JSON.stringify(value);
  }
  if (lodash_default.a.isBoolean(value)) {
    value = value ? languageDictionary.trueLabel || 'TRUE' : languageDictionary.falseLabel || 'FALSE';
  }
  return value;
};
var display_mapValues = function mapValues(user, fieldNames, fields, type) {
  var languageDictionary = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var additionalData = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var mappedUser = {};
  if (user) {
    fieldNames.forEach(function (fieldName) {
      var field = lodash_default.a.find(fields, {
        property: fieldName
      });
      if (field) {
        var value = display_getValueForType(type, user, field, languageDictionary, additionalData);
        if (value) mappedUser[fieldName] = value;
        return;
      }
      if (user[fieldName]) mappedUser[fieldName] = user[fieldName];
    });
  }
  return mappedUser;
};
// CONCATENATED MODULE: ./client/containers/Users/Dialogs/BlockDialog.jsx






var BlockDialog_Class;
function BlockDialog_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function BlockDialog_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? BlockDialog_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : BlockDialog_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function BlockDialog_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, BlockDialog_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function BlockDialog_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (BlockDialog_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }








/* harmony default export */ var BlockDialog = (redux_static_lib_default()((BlockDialog_Class = /*#__PURE__*/function (_Component) {
  function _Class() {
    var _this;
    classCallCheck_default()(this, _Class);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = BlockDialog_callSuper(this, _Class, [].concat(args));
    defineProperty_default()(_this, "onConfirm", function () {
      _this.props.blockUser();
    });
    return _this;
  }
  inherits_default()(_Class, _Component);
  return createClass_default()(_Class, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.block !== this.props.block || nextProps.languageDictionary !== this.props.languageDictionary;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        cancelBlockUser = _this$props.cancelBlockUser,
        settings = _this$props.settings;
      var _this$props$block$toJ = this.props.block.toJS(),
        user = _this$props$block$toJ.user,
        error = _this$props$block$toJ.error,
        requesting = _this$props$block$toJ.requesting,
        loading = _this$props$block$toJ.loading;
      var userFields = settings.userFields || [];
      var languageDictionary = this.props.languageDictionary.get('record').toJS();
      var messageFormat = languageDictionary.blockDialogMessage || 'Do you really want to block {username}? ' + 'After doing so the user will not be able to sign in anymore.';
      var message = Dialogs_getDialogMessage(messageFormat, 'username', display_getName(user, userFields, languageDictionary));
      return /*#__PURE__*/react_default.a.createElement(dist["Confirm"], {
        title: languageDictionary.blockDialogTitle || 'Block User?',
        show: requesting,
        loading: loading,
        confirmMessage: languageDictionary.dialogConfirmText,
        cancelMessage: languageDictionary.dialogCancelText,
        onCancel: cancelBlockUser,
        onConfirm: this.onConfirm,
        closeLabel: languageDictionary.closeButtonText
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement("p", null, message));
    }
  }]);
}(react["Component"]), defineProperty_default()(BlockDialog_Class, "stateToProps", function (state) {
  return {
    block: state.block,
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    languageDictionary: state.languageDictionary
  };
}), defineProperty_default()(BlockDialog_Class, "actionsToProps", BlockDialog_objectSpread({}, user_namespaceObject)), defineProperty_default()(BlockDialog_Class, "propTypes", {
  cancelBlockUser: prop_types_default.a.func.isRequired,
  blockUser: prop_types_default.a.func.isRequired,
  block: prop_types_default.a.object.isRequired,
  settings: prop_types_default.a.object.isRequired,
  languageDictionary: prop_types_default.a.object
}), BlockDialog_Class)));
// EXTERNAL MODULE: ./client/utils/createReducer.js
var createReducer = __webpack_require__(23);

// EXTERNAL MODULE: ./node_modules/immutable/dist/immutable.es.js
var immutable_es = __webpack_require__(16);

// CONCATENATED MODULE: ./client/reducers/removeBlockedIPs.js

function removeBlockedIPs_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function removeBlockedIPs_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? removeBlockedIPs_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : removeBlockedIPs_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var removeBlockedIPs_initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null
};
var removeBlockedIPs = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(removeBlockedIPs_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["ic" /* REQUEST_REMOVE_BLOCKED_IPS */], function (state, action) {
  return state.merge({
    user: Object(immutable_es["d" /* fromJS */])(action.user),
    requesting: true
  });
}), constants["l" /* CANCEL_REMOVE_BLOCKED_IPS */], function (state) {
  return state.merge(removeBlockedIPs_objectSpread({}, removeBlockedIPs_initialState));
}), constants["Vb" /* REMOVE_BLOCKED_IPS_PENDING */], function (state) {
  return state.merge({
    loading: true
  });
}), constants["Wb" /* REMOVE_BLOCKED_IPS_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["Ub" /* REMOVE_BLOCKED_IPS_FULFILLED */], function (state) {
  return state.merge(removeBlockedIPs_objectSpread({}, removeBlockedIPs_initialState));
}));
// CONCATENATED MODULE: ./client/components/Users/UserActions.jsx






function UserActions_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UserActions_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UserActions_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UserActions_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }






var UserActions_UserActions = /*#__PURE__*/function (_Component) {
  function UserActions(props) {
    var _this;
    classCallCheck_default()(this, UserActions);
    _this = UserActions_callSuper(this, UserActions, [props]);
    defineProperty_default()(_this, "getDeleteAction", function (user, loading) {
      var deleteField = lodash_default.a.filter(_this.props.userFields, function (field) {
        return field.property === 'delete' && field.edit === false;
      });
      if (deleteField.length > 0) return null;
      return /*#__PURE__*/react_default.a.createElement(es["e" /* MenuItem */], {
        disabled: loading || false,
        onClick: _this.deleteUser
      }, _this.state.languageDictionary.deleteUserMenuItemText || 'Delete User');
    });
    defineProperty_default()(_this, "getChangeFieldsAction", function (user, loading) {
      if (!_this.props.userFields || !_this.props.userFields.length) {
        return null;
      }

      /* Only display this if there are editable fields */
      var fieldsWithEdit = lodash_default.a.filter(_this.props.userFields, function (field) {
        return !lodash_default.a.includes(constants["rc" /* RESERVED_USER_FIELDS */], field.property) && field.edit;
      });
      if (fieldsWithEdit.length <= 0) return null;
      return /*#__PURE__*/react_default.a.createElement(es["e" /* MenuItem */], {
        disabled: loading || false,
        onClick: _this.changeFields
      }, _this.state.languageDictionary.changeFieldsMenuItemText || 'Change Profile');
    });
    defineProperty_default()(_this, "getResetPasswordAction", function (user, loading) {
      if (!_this.state.databaseConnections || !_this.state.databaseConnections.length) {
        return null;
      }

      /* Check if settings are disabling the editing of password */
      var falsePasswordEditFields = lodash_default.a.filter(_this.props.userFields, function (field) {
        return field.property === 'password' && field.edit === false;
      });
      var trueResetPasswordEditFields = lodash_default.a.filter(_this.props.userFields, function (field) {
        return field.property === 'resetPassword' && field.edit === true;
      });
      if (falsePasswordEditFields.length > 0 && trueResetPasswordEditFields.length <= 0) return null;
      return /*#__PURE__*/react_default.a.createElement(es["e" /* MenuItem */], {
        disabled: loading || false,
        onClick: _this.resetPassword
      }, _this.state.languageDictionary.resetPasswordMenuItemText || 'Reset Password');
    });
    defineProperty_default()(_this, "getChangePasswordAction", function (user, loading) {
      if (!_this.state.databaseConnections || !_this.state.databaseConnections.length) {
        return null;
      }

      /* Check if settings are disabling the editing of password */
      var falsePasswordEditFields = lodash_default.a.filter(_this.props.userFields, function (field) {
        return field.property === 'password' && field.edit === false;
      });
      if (falsePasswordEditFields.length > 0) return null;
      return /*#__PURE__*/react_default.a.createElement(es["e" /* MenuItem */], {
        disabled: loading || false,
        onClick: _this.changePassword
      }, _this.state.languageDictionary.changePasswordMenuItemText || 'Change Password');
    });
    defineProperty_default()(_this, "getChangeUsernameAction", function (user, loading) {
      if (!_this.state.databaseConnections || !_this.state.databaseConnections.length || !user.username) {
        return null;
      }

      /* Check if settings are disabling the editing of username */
      var falseUsernameEditFields = lodash_default.a.filter(_this.props.userFields, function (field) {
        return field.property === 'username' && field.edit === false;
      });
      if (falseUsernameEditFields.length > 0) return null;
      return /*#__PURE__*/react_default.a.createElement(es["e" /* MenuItem */], {
        disabled: loading || false,
        onClick: _this.changeUsername
      }, _this.state.languageDictionary.changeUsernameMenuItemText || 'Change Username');
    });
    defineProperty_default()(_this, "getChangeEmailAction", function (user, loading) {
      if (!_this.state.databaseConnections || !_this.state.databaseConnections.length) {
        return null;
      }

      /* Check if settings are disabling the editing of username */
      var falseEmailEditFields = lodash_default.a.filter(_this.props.userFields, function (field) {
        return field.property === 'email' && field.edit === false;
      });
      if (falseEmailEditFields.length > 0) return null;
      return /*#__PURE__*/react_default.a.createElement(es["e" /* MenuItem */], {
        disabled: loading || false,
        onClick: _this.changeEmail
      }, _this.state.languageDictionary.changeEmailMenuItemText || 'Change Email');
    });
    defineProperty_default()(_this, "getResendEmailVerificationAction", function (user, loading) {
      if (!_this.state.databaseConnections || !_this.state.databaseConnections.length || user.email_verified) {
        return null;
      }

      /* Check if resending verification email option is enabled */
      var falseTriggerEmailVerified = lodash_default.a.filter(_this.props.userFields, function (field) {
        return field.property === 'email_verified' && field.edit === false;
      });
      if (falseTriggerEmailVerified.length > 0) return null;
      return /*#__PURE__*/react_default.a.createElement(es["e" /* MenuItem */], {
        disabled: loading || false,
        onClick: _this.resendVerificationEmail
      }, _this.state.languageDictionary.resendVerificationEmailMenuItemText || "Resend Verification Email");
    });
    defineProperty_default()(_this, "getMultifactorAction", function (user, loading) {
      if (!user.multifactor || !user.multifactor.length) {
        return null;
      }
      return /*#__PURE__*/react_default.a.createElement(es["e" /* MenuItem */], {
        disabled: loading || false,
        onClick: _this.removeMfa
      }, _this.state.languageDictionary.removeMfaMenuItemText || "Remove MFA");
    });
    defineProperty_default()(_this, "getBlockedAction", function (user, loading) {
      if (user.blocked) {
        return /*#__PURE__*/react_default.a.createElement(es["e" /* MenuItem */], {
          disabled: loading || false,
          onClick: _this.unblockUser
        }, _this.state.languageDictionary.unblockUserMenuItemText || "Unblock User");
      }
      return /*#__PURE__*/react_default.a.createElement(es["e" /* MenuItem */], {
        disabled: loading || false,
        onClick: _this.blockUser
      }, _this.state.languageDictionary.blockUserMenuItemText || "Block User");
    });
    defineProperty_default()(_this, "getUserBlocksAction", function (user, loading) {
      if (user.blocked_for && user.blocked_for.length) {
        return /*#__PURE__*/react_default.a.createElement(es["e" /* MenuItem */], {
          disabled: loading || false,
          onClick: _this.removeBlockedIPs
        }, _this.state.languageDictionary.removeBlockedIPsMenuItemText || "Unblock for all IPs");
      }
      return null;
    });
    defineProperty_default()(_this, "deleteUser", function () {
      _this.props.deleteUser(_this.state.user);
    });
    defineProperty_default()(_this, "changeFields", function () {
      var languageDictionary = _this.props.languageDictionary;
      var ignoreFields = ['username', 'memberships', 'connection', 'password', 'email', 'repeatPassword'];
      var customFields = lodash_default.a.filter(_this.props.userFields, function (field) {
        return !lodash_default.a.includes(ignoreFields, field.property) && field.edit && lodash_default.a.isFunction(field.edit.display);
      });
      var user = Object.assign({}, _this.state.user);
      lodash_default.a.each(customFields, function (field) {
        try {
          lodash_default.a.update(user, field.property, function (value) {
            return field.edit.display(_this.state.user, value, languageDictionary);
          });
        } catch (e) {
          /* Swallow eval errors */
          console.log("Could not display ".concat(field.property, " because: ").concat(e.message));
        }
      });
      _this.props.changeFields(user);
    });
    defineProperty_default()(_this, "resetPassword", function () {
      _this.props.resetPassword(_this.state.user, _this.state.databaseConnections[0]);
    });
    defineProperty_default()(_this, "changePassword", function () {
      _this.props.changePassword(_this.state.user, _this.state.databaseConnections[0]);
    });
    defineProperty_default()(_this, "changeUsername", function () {
      var usernameEditFields = lodash_default.a.filter(_this.props.userFields, function (field) {
        return field.property === 'username' && field.edit !== false && field.edit;
      });
      _this.props.changeUsername(_this.state.user, _this.state.databaseConnections[0], UserActions.getDisplayObject(_this.state.user, usernameEditFields));
    });
    defineProperty_default()(_this, "changeEmail", function () {
      var emailEditFields = lodash_default.a.filter(_this.props.userFields, function (field) {
        return field.property === 'email' && field.edit !== false && field.edit;
      });
      _this.props.changeEmail(_this.state.user, _this.state.databaseConnections[0], UserActions.getDisplayObject(_this.state.user, emailEditFields));
    });
    defineProperty_default()(_this, "resendVerificationEmail", function () {
      _this.props.resendVerificationEmail(_this.state.user, _this.state.databaseConnections[0]);
    });
    defineProperty_default()(_this, "blockUser", function () {
      _this.props.blockUser(_this.state.user);
    });
    defineProperty_default()(_this, "unblockUser", function () {
      _this.props.unblockUser(_this.state.user);
    });
    defineProperty_default()(_this, "removeBlockedIPs", function () {
      _this.props.removeBlockedIPs(_this.state.user);
    });
    defineProperty_default()(_this, "removeMfa", function () {
      _this.props.removeMfa(_this.state.user);
    });
    if (props.user) {
      _this.state = {
        user: props.user.toJS(),
        loading: props.loading
      };
      if (props.databaseConnections) {
        _this.state.databaseConnections = props.databaseConnections.toJS();
      }
    } else {
      _this.state = {
        user: null,
        loading: false
      };
    }
    _this.state.languageDictionary = props.languageDictionary || {};
    return _this;
  }
  inherits_default()(UserActions, _Component);
  return createClass_default()(UserActions, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.user) {
        var _nextProps$user$toJS = nextProps.user.toJS(),
          record = _nextProps$user$toJS.record,
          loading = _nextProps$user$toJS.loading;
        this.setState({
          user: record,
          loading: loading
        });
      }
      if (nextProps.databaseConnections) {
        this.setState({
          databaseConnections: nextProps.databaseConnections.toJS()
        });
      }
      if (nextProps.languageDictionary) {
        this.setState({
          languageDictionary: nextProps.languageDictionary
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.state.user || this.props.role < 1) {
        return null;
      }
      var languageDictionary = this.props.languageDictionary || {};
      var buttonTitle = languageDictionary.userActionsButton || 'Actions';
      return /*#__PURE__*/react_default.a.createElement(es["d" /* DropdownButton */], {
        bsStyle: "success",
        title: buttonTitle,
        id: "user-actions"
      }, this.getMultifactorAction(this.state.user, this.state.loading), this.getBlockedAction(this.state.user, this.state.loading), this.getUserBlocksAction(this.state.user, this.state.loading), this.getResetPasswordAction(this.state.user, this.state.loading), this.getResendEmailVerificationAction(this.state.user, this.state.loading), this.getChangeUsernameAction(this.state.user, this.state.loading), this.getChangeEmailAction(this.state.user, this.state.loading), this.getChangePasswordAction(this.state.user, this.state.loading), this.getChangeFieldsAction(this.state.user, this.state.loading), this.getDeleteAction(this.state.user, this.state.loading));
    }
  }], [{
    key: "getDisplayObject",
    value: function getDisplayObject(user, fields) {
      if (fields.length > 0) {
        var displayFunction = undefined;
        if (lodash_default.a.isFunction(fields[0].edit.display)) displayFunction = fields[0].edit.display;else if (!fields[0].edit.display && fields[0].edit.display !== false && lodash_default.a.isFunction(fields[0].display)) displayFunction = fields[0].display;
        if (displayFunction) return {
          display: displayFunction,
          user: user
        };
      }
      return null;
    }
  }]);
}(react["Component"]);
defineProperty_default()(UserActions_UserActions, "propTypes", {
  blockUser: prop_types_default.a.func.isRequired,
  changeEmail: prop_types_default.a.func.isRequired,
  changePassword: prop_types_default.a.func.isRequired,
  changeUsername: prop_types_default.a.func.isRequired,
  databaseConnections: prop_types_default.a.object.isRequired,
  deleteUser: prop_types_default.a.func.isRequired,
  changeFields: prop_types_default.a.func.isRequired,
  removeMfa: prop_types_default.a.func.isRequired,
  resendVerificationEmail: prop_types_default.a.func.isRequired,
  resetPassword: prop_types_default.a.func.isRequired,
  unblockUser: prop_types_default.a.func.isRequired,
  removeBlockedIPs: prop_types_default.a.func.isRequired,
  user: prop_types_default.a.object.isRequired,
  role: prop_types_default.a.number.isRequired,
  userFields: prop_types_default.a.array.isRequired,
  languageDictionary: prop_types_default.a.object
});

// EXTERNAL MODULE: ./node_modules/redux-form/es/index.js + 219 modules
var redux_form_es = __webpack_require__(56);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/extends.js
var helpers_extends = __webpack_require__(284);
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);

// CONCATENATED MODULE: ./client/utils/requiredValidationFunction.js


var requiredValidationFunction_ValidationFunctionInstance = /*#__PURE__*/function () {
  function ValidationFunctionInstance(languageDictionary) {
    classCallCheck_default()(this, ValidationFunctionInstance);
    this.languageDictionary = languageDictionary;
  }
  return createClass_default()(ValidationFunctionInstance, [{
    key: "requiredValidationFunction",
    value: function requiredValidationFunction(value) {
      var languageDictionary = this.languageDictionary || {};
      var error = languageDictionary.requiredErrorText || 'required';
      return !value || value === '' ? error : false;
    }
  }]);
}();
/* harmony default export */ var requiredValidationFunction = (function (languageDictionary) {
  var instance = new requiredValidationFunction_ValidationFunctionInstance(languageDictionary);
  return instance.requiredValidationFunction.bind(instance);
});
// CONCATENATED MODULE: ./client/components/Users/UserFormField.jsx







function UserFormField_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UserFormField_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UserFormField_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UserFormField_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }






var UserFormField_UserFormField = /*#__PURE__*/function (_Component) {
  function UserFormField() {
    classCallCheck_default()(this, UserFormField);
    return UserFormField_callSuper(this, UserFormField, arguments);
  }
  inherits_default()(UserFormField, _Component);
  return createClass_default()(UserFormField, [{
    key: "getFieldComponent",
    value: function getFieldComponent(field, component, additionalOptions) {
      var languageDictionary = this.props.languageDictionary || {};
      var requiredLabel = languageDictionary.requiredFieldLabel || ' (required)';
      var label = languageDictionary.labels && languageDictionary.labels[field.property] || field.label;
      return /*#__PURE__*/react_default.a.createElement(redux_form_es["a" /* Field */], extends_default()({
        name: field.property,
        type: field.type,
        label: label + (field.required ? requiredLabel : ''),
        placeholder: field.placeholder,
        component: component
      }, additionalOptions));
    }
  }, {
    key: "getFieldByComponentName",
    value: function getFieldByComponentName(field, componentName) {
      var _this = this;
      var validate = field.required || field.validationFunction ? [] : undefined;
      if (field.required) validate.push(requiredValidationFunction(this.props.languageDictionary || {}));
      if (field.validationFunction) {
        validate.push(function (value, values, context) {
          return field.validationFunction(value, values, context, _this.props.languageDictionary || {});
        });
      }
      switch (componentName) {
        case 'InputCombo':
          {
            var additionalOptions = {
              options: field.options ? lodash_default.a.map(field.options, function (option) {
                return {
                  value: option.value,
                  text: option.label
                };
              }) : null
            };
            if (validate) additionalOptions.validate = validate;
            return this.getFieldComponent(field, dist["InputCombo"], additionalOptions);
          }
        case 'InputMultiCombo':
          {
            var _additionalOptions = {
              loadOptions: function loadOptions(input, callback) {
                return callback(null, {
                  options: field.options || [],
                  complete: true
                });
              },
              multi: true,
              displayLabelOnly: field.displayLabelOnly
            };
            if (validate) _additionalOptions.validate = validate;
            return this.getFieldComponent(field, dist["Multiselect"], _additionalOptions);
          }
        case 'InputSelectCombo':
          {
            var _additionalOptions2 = {
              loadOptions: function loadOptions(input, callback) {
                return callback(null, {
                  options: field.options || [],
                  complete: true
                });
              },
              multi: false
            };
            if (validate) _additionalOptions2.validate = validate;
            return this.getFieldComponent(field, dist["Select"], _additionalOptions2);
          }
        case 'InputVirtualizedSelect':
          {
            var _additionalOptions3 = {
              options: field.options,
              multi: field.multi,
              displayLabelOnly: field.displayLabelOnly
            };
            if (validate) _additionalOptions3.validate = validate;
            return this.getFieldComponent(field, dist["VirtualizedSelect"], _additionalOptions3);
          }
        default:
          {
            var _additionalOptions4 = {
              disabled: field.disabled || false
            };
            if (validate) _additionalOptions4.validate = validate;
            return this.getFieldComponent(field, dist["InputText"], _additionalOptions4);
          }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        field = _this$props.field,
        isEditField = _this$props.isEditField;
      var formType = isEditField ? 'edit' : 'create';

      /* End early if property is not defined or edit/create is not defined */
      if (field.disable) return null;
      if (!field.property || !field[formType]) return null;

      /* Add some default behavior */
      if (!field.label) field.label = field.property;
      if (field[formType].type === 'hidden') field.label = '';
      if (!lodash_default.a.isFunction(field[formType].validationFunction) && field[formType].validationFunction) {
        console.warn("WARNING: validation function for field: ".concat(field.label, "(").concat(field.property, ") is not a function"));
        delete field[formType].validationFunction;
      }
      var finalField = lodash_default.a.isBoolean(field[formType]) ? Object.assign({}, field, {
        type: 'text',
        component: 'InputText'
      }) : Object.assign({}, field, field[formType]);
      return /*#__PURE__*/react_default.a.createElement("div", null, this.getFieldByComponentName(finalField, finalField.component));
    }
  }]);
}(react["Component"]);
defineProperty_default()(UserFormField_UserFormField, "propTypes", {
  field: prop_types_default.a.object.isRequired,
  isEditField: prop_types_default.a.bool.isRequired,
  languageDictionary: prop_types_default.a.object
});

;
// CONCATENATED MODULE: ./client/components/Users/UserCustomFormFields.jsx






function UserCustomFormFields_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UserCustomFormFields_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UserCustomFormFields_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UserCustomFormFields_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }




var UserCustomFormFields_UserCustomFormFields = /*#__PURE__*/function (_Component) {
  function UserCustomFormFields() {
    classCallCheck_default()(this, UserCustomFormFields);
    return UserCustomFormFields_callSuper(this, UserCustomFormFields, arguments);
  }
  inherits_default()(UserCustomFormFields, _Component);
  return createClass_default()(UserCustomFormFields, [{
    key: "render",
    value: function render() {
      var _this = this;
      var _this$props = this.props,
        fields = _this$props.fields,
        isEditForm = _this$props.isEditForm;
      return /*#__PURE__*/react_default.a.createElement("div", null, lodash_default.a.map(fields, function (field, index) {
        return /*#__PURE__*/react_default.a.createElement(UserFormField_UserFormField, {
          key: index,
          field: field,
          isEditField: isEditForm,
          languageDictionary: _this.props.languageDictionary
        });
      }));
    }
  }]);
}(react["Component"]);
defineProperty_default()(UserCustomFormFields_UserCustomFormFields, "propTypes", {
  fields: prop_types_default.a.array.isRequired,
  isEditForm: prop_types_default.a.bool.isRequired,
  languageDictionary: prop_types_default.a.object
});

;
// CONCATENATED MODULE: ./client/components/Users/UserFieldsChangeForm.jsx






function UserFieldsChangeForm_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UserFieldsChangeForm_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UserFieldsChangeForm_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UserFieldsChangeForm_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }







var UserFieldsChangeForm_UserFieldsChangeForm = /*#__PURE__*/function (_Component) {
  function UserFieldsChangeForm() {
    classCallCheck_default()(this, UserFieldsChangeForm);
    return UserFieldsChangeForm_callSuper(this, UserFieldsChangeForm, arguments);
  }
  inherits_default()(UserFieldsChangeForm, _Component);
  return createClass_default()(UserFieldsChangeForm, [{
    key: "render",
    value: function render() {
      var fields = this.props.customFields || [];
      if (fields.length === 0) return null;
      var languageDictionary = this.props.languageDictionary || {};
      var filteredCustomFields = lodash_default.a.filter(fields, function (field) {
        return !lodash_default.a.includes(constants["rc" /* RESERVED_USER_FIELDS */], field.property) && field.edit;
      });
      if (filteredCustomFields.length === 0) return null;
      var loading = this.props.loading;
      return /*#__PURE__*/react_default.a.createElement("div", null, /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */].Body, null, this.props.children, /*#__PURE__*/react_default.a.createElement("div", {
        className: "form-horizontal"
      }, /*#__PURE__*/react_default.a.createElement(UserCustomFormFields_UserCustomFormFields, {
        isEditForm: true,
        fields: filteredCustomFields,
        languageDictionary: languageDictionary
      }))), /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */].Footer, null, /*#__PURE__*/react_default.a.createElement(es["b" /* Button */], {
        bsSize: "large",
        bsStyle: "default",
        disabled: loading,
        onClick: this.props.onClose
      }, languageDictionary.cancelButtonText || 'Cancel'), /*#__PURE__*/react_default.a.createElement(es["b" /* Button */], {
        bsSize: "large",
        bsStyle: "primary",
        disabled: loading,
        onClick: this.props.handleSubmit
      }, loading ? languageDictionary.savingText || 'Saving....' : languageDictionary.updateButtonText || 'Update')));
    }
  }]);
}(react["Component"]);
defineProperty_default()(UserFieldsChangeForm_UserFieldsChangeForm, "propTypes", {
  initialValues: prop_types_default.a.object,
  getDictValue: prop_types_default.a.func,
  onClose: prop_types_default.a.func.isRequired,
  handleSubmit: prop_types_default.a.func.isRequired,
  submitting: prop_types_default.a.bool,
  customFields: prop_types_default.a.array,
  languageDictionary: prop_types_default.a.object,
  loading: prop_types_default.a.bool
});
var reduxFormDecorator = Object(redux_form_es["d" /* reduxForm */])({
  form: 'user'
});
/* harmony default export */ var Users_UserFieldsChangeForm = (reduxFormDecorator(UserFieldsChangeForm_UserFieldsChangeForm));
// CONCATENATED MODULE: ./client/components/Users/UserDevices.jsx






function UserDevices_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UserDevices_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UserDevices_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UserDevices_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }




var UserDevices_UserDevices = /*#__PURE__*/function (_Component) {
  function UserDevices() {
    classCallCheck_default()(this, UserDevices);
    return UserDevices_callSuper(this, UserDevices, arguments);
  }
  inherits_default()(UserDevices, _Component);
  return createClass_default()(UserDevices, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.devices !== this.props.devices || nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        error = _this$props.error,
        loading = _this$props.loading,
        settings = _this$props.settings;
      if (loading) {
        return /*#__PURE__*/react_default.a.createElement("div", null);
      }
      var languageDictionary = this.props.languageDictionary || {};
      if (!error && this.props.devices.size === 0) {
        return /*#__PURE__*/react_default.a.createElement("div", null, languageDictionary.noDevicesMessage || 'This user does not have any registered devices.');
      }
      var devices = this.props.devices.toJS();
      return /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: loading,
        animationStyle: {
          paddingTop: '5px',
          paddingBottom: '5px'
        }
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement(dist["Table"], null, /*#__PURE__*/react_default.a.createElement(dist["TableHeader"], null, /*#__PURE__*/react_default.a.createElement(dist["TableColumn"], {
        width: "3%"
      }), /*#__PURE__*/react_default.a.createElement(dist["TableColumn"], {
        width: "70%"
      }, languageDictionary.deviceNameColumnHeader || 'Device'), /*#__PURE__*/react_default.a.createElement(dist["TableColumn"], {
        width: "27%"
      }, languageDictionary.deviceNumberTokensColumnHeader || '# of Tokens/Public Keys')), /*#__PURE__*/react_default.a.createElement(dist["TableBody"], null, Object.keys(devices).sort().map(function (device) {
        return /*#__PURE__*/react_default.a.createElement(dist["TableRow"], {
          key: device
        }, /*#__PURE__*/react_default.a.createElement(dist["TableIconCell"], {
          color: "green",
          icon: "243"
        }), /*#__PURE__*/react_default.a.createElement(dist["TableTextCell"], null, device), /*#__PURE__*/react_default.a.createElement(dist["TableTextCell"], null, devices[device]));
      }))));
    }
  }]);
}(react["Component"]);
defineProperty_default()(UserDevices_UserDevices, "propTypes", {
  user: prop_types_default.a.object,
  error: prop_types_default.a.string,
  devices: prop_types_default.a.object.isRequired,
  loading: prop_types_default.a.bool.isRequired,
  settings: prop_types_default.a.object.isRequired,
  languageDictionary: prop_types_default.a.object
});

// CONCATENATED MODULE: ./client/utils/useDefaultFields.js


var useDefaultFields_applyDefaults = function applyDefaults(type, fields, property, defaults) {
  var field = lodash_default.a.find(fields, {
    property: property
  });
  if (field) {
    if (lodash_default.a.isBoolean(field[type]) && field[type] === false) return lodash_default.a.remove(fields, {
      property: property
    });
    return lodash_default.a.defaults(field, defaults);
  }
  return fields.unshift(defaults);
};
var useDefaultFields_useUsernameField = function useUsernameField(isEditField, fields, connections, hasSelectedConnection, initialValues) {
  var type = isEditField ? 'edit' : 'create';
  var selectedConnection = lodash_default.a.find(connections, function (conn) {
    return conn.name === hasSelectedConnection;
  });
  var requireUsername = selectedConnection && selectedConnection.options ? selectedConnection.options.requires_username : false;
  var noUsername = connections && connections.length > 0 ? !requireUsername && (!initialValues || !initialValues.username)
  // if we have no connections, we *might* need a username field, we don't know - 
  // because we don't have the connections to check
  : false;
  var defaults = defineProperty_default()({
    property: 'username',
    label: 'Username',
    disable: noUsername
  }, type, {
    type: 'text',
    // if we have no connections we should show the field but not require it
    required: connections && connections.length > 0
  });
  return useDefaultFields_applyDefaults(type, fields, 'username', defaults);
};
var useDefaultFields_useMembershipsField = function useMembershipsField(isEditField, fields, hasMembership, memberships, createMemberships, getDictValue) {
  var type = isEditField ? 'edit' : 'create';
  var allMemberships = lodash_default()(memberships || []).concat(hasMembership).uniq().sort().value();
  if (allMemberships.length <= 1 && !createMemberships) {
    return lodash_default.a.remove(fields, {
      property: 'memberships'
    });
  }
  var defaults = defineProperty_default()({
    property: 'memberships',
    label: getDictValue('memberships', 'Memberships')
  }, type, {
    type: 'select',
    component: 'InputMultiCombo',
    options: allMemberships.map(function (m) {
      return {
        value: m,
        label: m
      };
    })
  });
  return useDefaultFields_applyDefaults(type, fields, 'memberships', defaults);
};
var useDefaultFields_useConnectionsField = function useConnectionsField(isEditField, fields, connections, onConnectionChange) {
  var type = isEditField ? 'edit' : 'create';
  // if we have exactly one connection then don't show this field and use that connection
  // however if we have zero connections, we should show the free text connections field
  if (!connections || connections.length === 1) {
    return lodash_default.a.remove(fields, {
      property: 'connection'
    });
  }
  var isConnectionLimitExceeded = connections.length === 0;
  var defaults = defineProperty_default()({
    property: 'connection',
    label: isConnectionLimitExceeded ? 'Connection Name' : 'Connection'
  }, type, {
    required: true,
    type: isConnectionLimitExceeded ? 'text' : 'select',
    component: isConnectionLimitExceeded ? 'InputText' : 'InputCombo',
    options: isConnectionLimitExceeded ? undefined : connections.map(function (conn) {
      return {
        value: conn.name,
        label: conn.name
      };
    }),
    onChange: onConnectionChange
  });
  return useDefaultFields_applyDefaults(type, fields, 'connection', defaults);
};
var useDefaultFields_useMfaField = function useMfaField(isEditField, fields, providers, onProviderChange) {
  var type = isEditField ? 'edit' : 'create';
  var providerList = providers && providers.toJS ? providers.toJS() : providers || [];
  var hasPasskey = providerList.includes('passkey');
  var options = providerList.map(function (prov) {
    return {
      value: prov,
      label: prov
    };
  });
  if (providerList.length > 1 && !hasPasskey) {
    options.push({
      value: 'all',
      label: 'all'
    });
  }
  var defaults = defineProperty_default()({
    property: 'multifactor',
    label: 'MFA Provider'
  }, type, {
    required: true,
    type: 'select',
    component: 'InputCombo',
    options: options,
    onChange: onProviderChange
  });
  useDefaultFields_applyDefaults(type, fields, 'multifactor', defaults);
  var field = lodash_default.a.find(fields, {
    property: 'multifactor'
  });
  if (field && field[type]) {
    field[type].options = options;
  }
};
var useDefaultFields_useDisabledConnectionField = function useDisabledConnectionField(isEditField, fields, connection, connections) {
  var type = isEditField ? 'edit' : 'create';
  if (!connection || !connections || connections.length < 2) {
    return lodash_default.a.remove(fields, {
      property: 'connection'
    });
  }
  var defaults = defineProperty_default()({
    property: 'connection',
    label: 'Connection'
  }, type, {
    type: 'text',
    disabled: true
  });
  useDefaultFields_applyDefaults(type, fields, 'connection', defaults);
  var field = lodash_default.a.find(fields, {
    property: 'connection'
  });
  // If connection is an editable field, we need to display it on other pages, but only as disabled
  if (field && (lodash_default.a.isObject(field[type]) && field[type].disabled !== true || lodash_default.a.isBoolean(field[type]))) field[type] = defaults[type];
};
var useDefaultFields_usePasswordFields = function usePasswordFields(isEditField, fields) {
  var type = isEditField ? 'edit' : 'create';
  var repeatPasswordDefaults = defineProperty_default()({
    property: 'repeatPassword',
    label: 'Repeat Password'
  }, type, {
    required: true,
    type: 'password',
    component: 'InputText',
    validationFunction: function validationFunction(value, values) {
      return value !== values.password ? 'passwords must match' : false;
    }
  });
  var passwordDefaults = defineProperty_default()({
    property: 'password',
    label: 'Password'
  }, type, {
    required: true,
    type: 'password',
    component: 'InputText'
  });
  useDefaultFields_applyDefaults(type, fields, 'repeatPassword', repeatPasswordDefaults);
  useDefaultFields_applyDefaults(type, fields, 'password', passwordDefaults);
};
var useDefaultFields_useEmailField = function useEmailField(isEditField, fields) {
  var type = isEditField ? 'edit' : 'create';
  var defaults = defineProperty_default()({
    property: 'email',
    label: 'Email'
  }, type, {
    type: 'text',
    component: 'InputText',
    required: true
  });
  useDefaultFields_applyDefaults(type, fields, 'email', defaults);
};
var useDefaultFields_useClientField = function useClientField(isEditField, fields, clients) {
  var type = isEditField ? 'edit' : 'create';
  var defaults = defineProperty_default()({
    property: 'client',
    label: 'Client'
  }, type, {
    type: 'select',
    component: 'InputCombo',
    required: false,
    options: clients.map(function (option) {
      return {
        value: option.client_id,
        label: option.name
      };
    })
  });
  useDefaultFields_applyDefaults(type, fields, 'client', defaults);
};
var useDefaultFields_useDisabledEmailField = function useDisabledEmailField(isEditField, fields) {
  var type = isEditField ? 'edit' : 'create';
  var defaults = defineProperty_default()({
    property: 'email',
    label: 'Email'
  }, type, {
    type: 'text',
    component: 'InputText',
    disabled: true
  });
  useDefaultFields_applyDefaults(type, fields, 'email', defaults);
  var field = lodash_default.a.find(fields, {
    property: 'email'
  });
  // If connection is an editable field, we need to display it on other pages, but only as disabled
  if (field && (lodash_default.a.isObject(field[type]) && field[type].disabled !== true || lodash_default.a.isBoolean(field[type]))) field[type] = defaults[type];
};
// CONCATENATED MODULE: ./client/components/Users/UserForm.jsx






function UserForm_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UserForm_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UserForm_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UserForm_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }








var UserForm_AddUserForm = /*#__PURE__*/function (_Component) {
  function AddUserForm() {
    classCallCheck_default()(this, AddUserForm);
    return UserForm_callSuper(this, AddUserForm, arguments);
  }
  inherits_default()(AddUserForm, _Component);
  return createClass_default()(AddUserForm, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        submitting = _this$props.submitting,
        customFields = _this$props.customFields,
        connections = _this$props.connections,
        hasSelectedConnection = _this$props.hasSelectedConnection,
        initialValues = _this$props.initialValues,
        hasMembership = _this$props.hasMembership,
        memberships = _this$props.memberships,
        createMemberships = _this$props.createMemberships,
        getDictValue = _this$props.getDictValue,
        loading = _this$props.loading;
      var languageDictionary = this.props.languageDictionary || {};

      /* First let's add field to the top if not in the list of fields */
      var fields = lodash_default.a.cloneDeep(customFields) || [];
      useDefaultFields_useConnectionsField(false, fields, connections, this.onConnectionsChange);
      useDefaultFields_usePasswordFields(false, fields);
      useDefaultFields_useUsernameField(false, fields, connections, hasSelectedConnection, initialValues);
      useDefaultFields_useEmailField(false, fields);
      useDefaultFields_useMembershipsField(false, fields, hasMembership, memberships, createMemberships, getDictValue);
      var createFields = lodash_default.a.filter(fields, function (field) {
        return field.create;
      });
      return /*#__PURE__*/react_default.a.createElement("div", null, /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */].Body, null, this.props.children, /*#__PURE__*/react_default.a.createElement("div", {
        className: "form-horizontal"
      }, /*#__PURE__*/react_default.a.createElement(UserCustomFormFields_UserCustomFormFields, {
        isEditForm: false,
        fields: createFields,
        languageDictionary: languageDictionary
      }))), /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */].Footer, null, /*#__PURE__*/react_default.a.createElement(es["b" /* Button */], {
        bsSize: "large",
        bsStyle: "default",
        disabled: loading,
        onClick: this.props.onClose
      }, languageDictionary.cancelButtonText || 'Cancel'), /*#__PURE__*/react_default.a.createElement(es["b" /* Button */], {
        bsSize: "large",
        bsStyle: "primary",
        disabled: loading,
        onClick: this.props.handleSubmit
      }, loading ? languageDictionary.savingText || 'Saving....' : languageDictionary.createButtonText || 'Create')));
    }
  }]);
}(react["Component"]);
defineProperty_default()(UserForm_AddUserForm, "propTypes", {
  initialValues: prop_types_default.a.object,
  connections: prop_types_default.a.array.isRequired,
  memberships: prop_types_default.a.array.isRequired,
  createMemberships: prop_types_default.a.bool,
  getDictValue: prop_types_default.a.func,
  hasSelectedConnection: prop_types_default.a.string,
  hasMembership: prop_types_default.a.array,
  onClose: prop_types_default.a.func.isRequired,
  handleSubmit: prop_types_default.a.func.isRequired,
  submitting: prop_types_default.a.bool,
  customFields: prop_types_default.a.array,
  customFieldGetter: prop_types_default.a.func.isRequired,
  languageDictionary: prop_types_default.a.object,
  loading: prop_types_default.a.bool
});
var UserForm_reduxFormDecorator = Object(redux_form_es["d" /* reduxForm */])({
  form: 'user'
});

// Decorate with connect to read form values
var selector = Object(redux_form_es["b" /* formValueSelector */])('user');
var connectDecorator = Object(react_redux_lib["connect"])(function (state) {
  var hasSelectedConnection = selector(state, 'connection');
  var hasMembership = selector(state, 'memberships');
  return {
    hasSelectedConnection: hasSelectedConnection,
    hasMembership: hasMembership
  };
});
/* harmony default export */ var UserForm = (connectDecorator(UserForm_reduxFormDecorator(UserForm_AddUserForm)));
// CONCATENATED MODULE: ./client/components/Users/UserHeader.jsx






function UserHeader_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UserHeader_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UserHeader_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UserHeader_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var UserHeader_UserHeader = /*#__PURE__*/function (_Component) {
  function UserHeader() {
    classCallCheck_default()(this, UserHeader);
    return UserHeader_callSuper(this, UserHeader, arguments);
  }
  inherits_default()(UserHeader, _Component);
  return createClass_default()(UserHeader, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
    }
  }, {
    key: "getName",
    value: function getName(user, userFields) {
      var nameField = lodash_default.a.find(userFields, function (field) {
        return field.property === 'name';
      });
      if (nameField && lodash_default.a.isFunction(nameField.display)) {
        /* Custom Name Field function, use that instead of email address */
        return nameField.display(user);
      }
      return user.name || user.nickname || user.email;
    }
  }, {
    key: "getPicture",
    value: function getPicture(user, userFields) {
      var pictureField = lodash_default.a.find(userFields, function (field) {
        return field.property === 'picture';
      });
      if (pictureField && lodash_default.a.isFunction(pictureField.display)) {
        /* Custom Name Field function, use that instead of email address */
        return pictureField.display(user);
      }
      return user.picture;
    }
  }, {
    key: "getEmail",
    value: function getEmail(user, userFields) {
      // Check for user.email right away to make sure the user has been initialized
      if (!user.email) return /*#__PURE__*/react_default.a.createElement("div", null);
      var email = user.email;
      var emailField = lodash_default.a.find(userFields, function (field) {
        return field.property === 'email';
      });
      if (emailField && lodash_default.a.isFunction(emailField.display)) {
        /* Custom Name Field function, use that instead of email address */
        email = emailField.display(user);
      }
      if (!email || email.length === 0) {
        return /*#__PURE__*/react_default.a.createElement("div", null);
      }
      return /*#__PURE__*/react_default.a.createElement("span", {
        className: "user-label user-head-email"
      }, email);
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.loading || this.props.error) {
        return /*#__PURE__*/react_default.a.createElement("div", null);
      }
      var user = this.props.user.toJS();
      var userFields = this.props.userFields || [];
      var languageDictionary = this.props.languageDictionary || {};
      return /*#__PURE__*/react_default.a.createElement("div", {
        className: "user-header"
      }, /*#__PURE__*/react_default.a.createElement("img", {
        role: "presentation",
        className: "img-polaroid",
        src: this.getPicture(user, userFields),
        alt: languageDictionary.userImageTitle || 'User Image',
        title: languageDictionary.userImageTitle || 'User Image'
      }), /*#__PURE__*/react_default.a.createElement("div", {
        className: "user-bg-box",
        style: {
          position: 'relative',
          height: '120px',
          overflow: 'hidden'
        }
      }, /*#__PURE__*/react_default.a.createElement("img", {
        role: "presentation",
        className: "user-bg",
        src: this.getPicture(user, userFields),
        alt: languageDictionary.userImageTitle || 'User Image',
        title: languageDictionary.userImageTitle || 'User Image'
      }), /*#__PURE__*/react_default.a.createElement("div", {
        className: "box-content"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "login-count"
      }, /*#__PURE__*/react_default.a.createElement("span", {
        className: "lined-text"
      }, languageDictionary.loginsCountLabel || 'Logins Count:'), /*#__PURE__*/react_default.a.createElement("strong", null, user.logins_count || 0)), /*#__PURE__*/react_default.a.createElement("div", {
        className: "username-area"
      }, /*#__PURE__*/react_default.a.createElement("h2", null, /*#__PURE__*/react_default.a.createElement("span", {
        className: "name user-head-nickname"
      }, this.getName(user, userFields)), this.getEmail(user, userFields))))));
    }
  }]);
}(react["Component"]);
defineProperty_default()(UserHeader_UserHeader, "propTypes", {
  error: prop_types_default.a.string,
  loading: prop_types_default.a.bool.isRequired,
  user: prop_types_default.a.object.isRequired,
  userFields: react_default.a.PropTypes.array.isRequired,
  languageDictionary: react_default.a.PropTypes.object
});

// EXTERNAL MODULE: ./node_modules/lucene/lib/lucene.js
var lucene = __webpack_require__(556);
var lucene_default = /*#__PURE__*/__webpack_require__.n(lucene);

// CONCATENATED MODULE: ./client/utils/userSearchParams.js


var MAX_LUCENE_SEARCH_LENGTH = 256;
function getFilterableUserFields(userFields) {
  return lodash_default()(userFields).filter(function (field) {
    return lodash_default.a.isObject(field.search) && field.search.filter === true;
  }).map(function (field) {
    return {
      title: field.label,
      value: field.property,
      filterBy: field.property
    };
  }).value();
}

// Auth0 Management API remains the ultimate authority; this is only to support rejection of obviously malformed input.
function validateLuceneQuery(query) {
  if (typeof query !== 'string') {
    return {
      valid: false,
      error: 'Invalid search query'
    };
  }
  var trimmed = query.trim();
  if (!trimmed) {
    return {
      valid: false,
      error: 'Empty search query'
    };
  }
  if (trimmed.length > MAX_LUCENE_SEARCH_LENGTH) {
    return {
      valid: false,
      error: 'Search query is too long'
    };
  }
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(trimmed)) {
    return {
      valid: false,
      error: 'Invalid search query characters'
    };
  }
  try {
    lucene_default.a.parse(trimmed);
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid Lucene search syntax'
    };
  }
  return {
    valid: true
  };
}
// EXTERNAL MODULE: ./client/components/Users/UserOverview.styles.css
var UserOverview_styles = __webpack_require__(1021);

// CONCATENATED MODULE: ./client/components/Users/UserOverview.jsx






function UserOverview_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function UserOverview_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? UserOverview_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : UserOverview_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function UserOverview_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UserOverview_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UserOverview_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UserOverview_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }









var UserOverview_UserOverview = /*#__PURE__*/function (_React$Component) {
  function UserOverview(props) {
    var _this;
    classCallCheck_default()(this, UserOverview);
    _this = UserOverview_callSuper(this, UserOverview, [props]);
    defineProperty_default()(_this, "getSelectedFilterOption", function (filterBy) {
      if (!filterBy) {
        return _this.defaultFilter;
      }
      return lodash_default.a.find(_this.searchOptions, {
        filterBy: filterBy
      }) || _this.defaultFilter;
    });
    defineProperty_default()(_this, "onSearch", function (query, filter) {
      _this.props.onSearch(query, filter, _this.focusSearchResults);
    });
    defineProperty_default()(_this, "onKeyPress", function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var query = e.target.value;
        _this.onSearch(query, _this.state.selectedFilter.filterBy);
      }
    });
    defineProperty_default()(_this, "focusSearchResults", function () {
      var searchResults = Object(react_dom["findDOMNode"])(_this.refs.searchResults);
      var element = searchResults.querySelector('a') || searchResults.querySelector('label');
      element.focus();
    });
    _this.searchOptions = getFilterableUserFields(_this.props.userFields);
    _this.defaultFilter = _this.searchOptions[0];
    _this.state = {
      searchValue: _this.props.searchValue,
      selectedFilter: _this.getSelectedFilterOption(_this.props.selectedFilter),
      // auth0-extension-ui SearchBar only reads searchValue or selectedFilter props on mount.
      // when the user clicks [Reset] button, the searchValue and selectedFilter are reset,
      // but SearchBar ignores it and keeps the previous value. So we need to force a re-render.
      // Here's a simple auto-incrementing key to force a re-render when searchValue or selectedFilter change
      searchBarKey: 0
    };
    _this.onKeyPress = _this.onKeyPress.bind(_this);
    _this.onReset = _this.onReset.bind(_this);
    _this.onHandleOptionChange = _this.onHandleOptionChange.bind(_this);
    return _this;
  }
  inherits_default()(UserOverview, _React$Component);
  return createClass_default()(UserOverview, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var updates = {};

      // Sync URL/Redux-driven search and filter into local state after mount.
      if (nextProps.searchValue !== this.props.searchValue) {
        updates.searchValue = nextProps.searchValue;
      }
      if (nextProps.selectedFilter !== this.props.selectedFilter) {
        updates.selectedFilter = this.getSelectedFilterOption(nextProps.selectedFilter);
      }
      if (Object.keys(updates).length > 0) {
        // auth0-extension-ui SearchBar only reads searchValue/selectedFilter on mount.
        this.setState(function (prevState) {
          return UserOverview_objectSpread(UserOverview_objectSpread({}, updates), {}, {
            searchBarKey: prevState.searchBarKey + 1
          });
        });
      }
    }
  }, {
    key: "onReset",
    value: function onReset() {
      var _this2 = this;
      this.props.onReset();
      this.setState(function (prevState) {
        return {
          searchValue: '',
          selectedFilter: _this2.defaultFilter,
          searchBarKey: prevState.searchBarKey + 1
        };
      });
    }
  }, {
    key: "onHandleOptionChange",
    value: function onHandleOptionChange(option) {
      this.setState({
        selectedFilter: option
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;
      var _this$props = this.props,
        loading = _this$props.loading,
        sortProperty = _this$props.sortProperty,
        sortOrder = _this$props.sortOrder,
        error = _this$props.error,
        settings = _this$props.settings;
      var languageDictionary = this.props.languageDictionary || {};
      var labels = languageDictionary.labels || {};
      var searchOptions = this.searchOptions.map(function (option) {
        return UserOverview_objectSpread(UserOverview_objectSpread({}, option), {}, {
          title: labels[option.value] || option.title || option.value,
          selected: option.filterBy === _this3.state.selectedFilter.filterBy
        });
      });
      return /*#__PURE__*/react_default.a.createElement("div", null, /*#__PURE__*/react_default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12 wrapper"
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message:
        // Client-side search validation errors use a plain message; API errors go through getErrorMessage.
        error && error.searchValidation ? error.message : getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }))), /*#__PURE__*/react_default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12"
      }, /*#__PURE__*/react_default.a.createElement("label", {
        className: "hidden-label",
        htmlFor: "search-bar"
      }, languageDictionary.searchBarPlaceholder || 'Search for users using the Lucene syntax'), searchOptions.length > 0 ? /*#__PURE__*/react_default.a.createElement(dist["SearchBar"], {
        key: this.state.searchBarKey,
        inputId: "search-bar",
        onReset: this.props.onReset,
        enabled: !loading,
        handleKeyPress: this.onKeyPress,
        handleReset: this.onReset,
        handleOptionChange: this.onHandleOptionChange,
        searchOptions: searchOptions,
        searchValue: this.state.searchValue,
        placeholder: languageDictionary.searchBarPlaceholder,
        resetButtonText: languageDictionary.searchBarReset,
        instructionsText: languageDictionary.searchBarInstructions
      }) : /*#__PURE__*/react_default.a.createElement(LuceneSearchBar_SearchBar, {
        inputId: "search-bar",
        onReset: this.props.onReset,
        onSearch: this.onSearch,
        searchValue: this.state.searchValue,
        enabled: !loading,
        languageDictionary: languageDictionary
      }))), /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: loading
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12",
        ref: "searchResults"
      }, /*#__PURE__*/react_default.a.createElement(UsersTable_UsersTable, {
        loading: loading,
        users: this.props.users,
        userFields: this.props.userFields,
        onColumnSort: this.props.onColumnSort,
        sortOrder: sortOrder,
        sortProperty: sortProperty,
        languageDictionary: languageDictionary
      })))));
    }
  }]);
}(react_default.a.Component);
defineProperty_default()(UserOverview_UserOverview, "propTypes", {
  onReset: prop_types_default.a.func.isRequired,
  onSearch: prop_types_default.a.func.isRequired,
  onPageChange: prop_types_default.a.func.isRequired,
  error: prop_types_default.a.object,
  users: prop_types_default.a.array.isRequired,
  loading: prop_types_default.a.bool.isRequired,
  userFields: prop_types_default.a.array.isRequired,
  onColumnSort: prop_types_default.a.func.isRequired,
  sortOrder: prop_types_default.a.number.isRequired,
  searchValue: prop_types_default.a.string,
  selectedFilter: prop_types_default.a.string,
  sortProperty: prop_types_default.a.string.isRequired,
  settings: prop_types_default.a.object.isRequired,
  languageDictionary: prop_types_default.a.object
});

// CONCATENATED MODULE: ./client/components/Users/UserProfile.jsx






function UserProfile_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UserProfile_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UserProfile_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UserProfile_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var UserProfile_UserProfile = /*#__PURE__*/function (_Component) {
  function UserProfile() {
    classCallCheck_default()(this, UserProfile);
    return UserProfile_callSuper(this, UserProfile, arguments);
  }
  inherits_default()(UserProfile, _Component);
  return createClass_default()(UserProfile, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.error !== this.props.error || nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        user = _this$props.user,
        error = _this$props.error,
        loading = _this$props.loading,
        settings = _this$props.settings;
      return /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: loading,
        animationStyle: {
          paddingTop: '5px',
          paddingBottom: '5px'
        }
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: this.props.languageDictionary.errorTitle,
        message: getErrorMessage(this.props.languageDictionary, error, settings.errorTranslator)
      }, /*#__PURE__*/react_default.a.createElement(dist["Json"], {
        jsonObject: user.toJS()
      })));
    }
  }]);
}(react["Component"]);
defineProperty_default()(UserProfile_UserProfile, "propTypes", {
  error: react["PropTypes"].string,
  loading: react["PropTypes"].bool.isRequired,
  user: react["PropTypes"].object.isRequired,
  settings: react["PropTypes"].object.isRequired,
  languageDictionary: react["PropTypes"].object
});

// EXTERNAL MODULE: ./client/components/Users/UserInfo.styles.css
var UserInfo_styles = __webpack_require__(1022);

// EXTERNAL MODULE: ./client/components/Users/UserInfoField.styles.css
var UserInfoField_styles = __webpack_require__(1023);

// CONCATENATED MODULE: ./client/components/Users/UserInfoField.jsx






function UserInfoField_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UserInfoField_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UserInfoField_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UserInfoField_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }


var UserInfoField_UserInfoField = /*#__PURE__*/function (_Component) {
  function UserInfoField() {
    classCallCheck_default()(this, UserInfoField);
    return UserInfoField_callSuper(this, UserInfoField, arguments);
  }
  inherits_default()(UserInfoField, _Component);
  return createClass_default()(UserInfoField, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.title !== this.props.title || nextProps.children !== this.props.children;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        title = _this$props.title,
        children = _this$props.children;
      return /*#__PURE__*/react_default.a.createElement("div", {
        className: "user-info-field"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "user-info-field-title"
      }, title), /*#__PURE__*/react_default.a.createElement("span", null, children));
    }
  }]);
}(react["Component"]);
defineProperty_default()(UserInfoField_UserInfoField, "propTypes", {
  title: react["PropTypes"].string.isRequired
});

// CONCATENATED MODULE: ./client/components/Users/UserInfo.jsx






function UserInfo_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UserInfo_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UserInfo_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UserInfo_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }








var UserInfo_UserInfo = /*#__PURE__*/function (_Component) {
  function UserInfo() {
    var _this;
    classCallCheck_default()(this, UserInfo);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = UserInfo_callSuper(this, UserInfo, [].concat(args));
    defineProperty_default()(_this, "getMemberships", function (memberships) {
      var meta = memberships || [];
      return meta.join(', ');
    });
    defineProperty_default()(_this, "getIdentities", function (user) {
      if (user.size === 0) return {};
      return user.get('identities').toJS()[0];
    });
    defineProperty_default()(_this, "getBlocked", function (user, languageDictionary) {
      if (user.size === 0) return '';
      return user.get('blocked') ? languageDictionary.yesLabel || 'Yes' : languageDictionary.noLabel || 'No';
    });
    return _this;
  }
  inherits_default()(UserInfo, _Component);
  return createClass_default()(UserInfo, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.user !== this.props.user || nextProps.memberships !== this.props.memberships || nextProps.userFields !== this.props.userFields || nextProps.loading !== this.props.loading || nextProps.error !== this.props.error;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        user = _this$props.user,
        error = _this$props.error,
        loading = _this$props.loading,
        memberships = _this$props.memberships,
        settings = _this$props.settings;
      var languageDictionary = this.props.languageDictionary || {};
      var labels = languageDictionary.labels || {};

      /* First let's grab the custom fields */
      var customDisplayFields = lodash_default()(this.props.userFields || []).filter(function (field) {
        return field.display;
      }).map(function (field) {
        return {
          title: labels[field.property] || field.label || field.property,
          property: field.property,
          display: field.display
        };
      }).value();

      /* We will need to know which fields are explicitly rejected for display */
      var nonDisplayFieldProperties = lodash_default()(this.props.userFields || []).filter(function (field) {
        return field.display === false;
      }).groupBy(function (field) {
        return field.property;
      }).value();
      var customDisplayFieldProperties = lodash_default()(customDisplayFields).groupBy(function (field) {
        return field.property;
      }).value();
      var mfaDefaultDisplay = function mfaDefaultDisplay(user) {
        return user.multifactor.join(', ');
      };
      var defaultFields = [{
        title: 'User ID',
        property: 'user_id'
      }, {
        title: 'Name',
        property: 'name'
      }, {
        title: 'Username',
        property: 'username'
      }, {
        title: 'Email',
        property: 'email'
      }, {
        title: 'Identity',
        property: 'identity.connection'
      }, {
        title: 'Blocked',
        property: 'isBlocked'
      }, {
        title: 'Last IP',
        property: 'last_ip'
      }, {
        title: 'Logins Count',
        property: 'logins_count'
      }, {
        title: 'Memberships',
        property: 'currentMemberships'
      }, {
        title: 'Multifactor',
        property: 'multifactor',
        display: mfaDefaultDisplay
      }, {
        title: 'Signed Up',
        property: 'created_at',
        type: 'elapsedTime'
      }, {
        title: 'Updated',
        property: 'updated_at',
        type: 'elapsedTime'
      }, {
        title: 'Last Login',
        property: 'last_login',
        type: 'elapsedTime'
      }];
      var defaultFieldInfo = defaultFields.map(function (field) {
        field.title = labels[field.property] || field.title;
        return field;
      });
      var standardFields = lodash_default()(defaultFieldInfo).reject(function (field) {
        return field.property in customDisplayFieldProperties || field.property in nonDisplayFieldProperties;
      }).value();
      var standardFieldProperties = lodash_default()(standardFields).groupBy(function (field) {
        return field.property;
      }).value();

      /* Now allow for the extra fields that show up from identities */
      var excludeProperties = lodash_default()(customDisplayFieldProperties) // ignore the custom fields
      .keys().concat(Object.keys(standardFieldProperties)) // ignore the standard fields
      .concat(Object.keys(nonDisplayFieldProperties)) // ignore fields that have explicitly been rejected
      .concat(['identity', 'identities', 'app_metadata', 'picture', 'user_metadata']) // always ignore these
      .value();

      /* Prepare the user object */
      var userObject = user.toJS();
      if (!userObject || Object.keys(userObject).length === 0) {
        return /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
          show: loading,
          animationStyle: {
            paddingTop: '5px',
            paddingBottom: '5px'
          }
        }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
          title: languageDictionary.errorTitle,
          message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
        }));
      }
      userObject.currentMemberships = this.getMemberships(memberships);
      userObject.identity = this.getIdentities(user);
      userObject.isBlocked = this.getBlocked(user, languageDictionary);

      /* Grab all user properties that haven't been rejected or already used */
      var extraFieldProperties = lodash_default.a.keys(lodash_default.a.omit(userObject, excludeProperties));

      /* Turn those properties into new field display objects */
      var extraFields = lodash_default.a.map(extraFieldProperties, function (property) {
        return {
          title: property,
          property: property
        };
      });

      /* Now put all fields together */
      var fields = lodash_default()(customDisplayFields).concat(standardFields).concat(extraFields).filter(function (field) {
        return field.property !== 'picture';
      }).sortBy(function (field) {
        return field.title;
      }).value();
      var fieldsAndValues = lodash_default.a.map(fields, function (field) {
        field.value = display_getValue(userObject, field, languageDictionary);
        return field;
      });
      var nonNullFields = lodash_default.a.filter(fieldsAndValues, function (field) {
        return field.value;
      }) || [];
      return /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: loading,
        animationStyle: {
          paddingTop: '5px',
          paddingBottom: '5px'
        }
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement("div", {
        className: "user-info"
      }, nonNullFields.map(function (field, index) {
        return /*#__PURE__*/react_default.a.createElement(UserInfoField_UserInfoField, {
          key: index,
          title: field.title
        }, field.value);
      })));
    }
  }]);
}(react["Component"]);
defineProperty_default()(UserInfo_UserInfo, "propTypes", {
  error: prop_types_default.a.string,
  loading: prop_types_default.a.bool.isRequired,
  user: prop_types_default.a.object.isRequired,
  settings: prop_types_default.a.object.isRequired,
  memberships: prop_types_default.a.array,
  userFields: prop_types_default.a.array,
  languageDictionary: prop_types_default.a.object
});

// EXTERNAL MODULE: ./client/components/Users/UserTable.styles.css
var UserTable_styles = __webpack_require__(1024);

// CONCATENATED MODULE: ./client/components/Users/UsersTable.jsx






function UsersTable_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UsersTable_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UsersTable_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UsersTable_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }






var UsersTable_UsersTable = /*#__PURE__*/function (_Component) {
  function UsersTable(props) {
    var _this;
    classCallCheck_default()(this, UsersTable);
    _this = UsersTable_callSuper(this, UsersTable, [props]);
    var listFields = _this.getListFields(props);
    _this.state = {
      listFields: listFields
    };
    return _this;
  }
  inherits_default()(UsersTable, _Component);
  return createClass_default()(UsersTable, [{
    key: "getListFields",
    value: function getListFields(props) {
      var userFields = props.userFields;
      var defaultListFields = [{
        listOrder: 0,
        listSize: '6%',
        property: 'picture',
        label: '',
        display: function display(user) {
          return user.picture || '';
        },
        search: {
          sort: true
        }
      }, {
        listOrder: 1,
        listSize: '20%',
        property: 'name',
        label: 'Name',
        display: function display(user) {
          return user.nickname || user.email || user.user_id;
        },
        search: {
          sort: true
        }
      }, {
        listOrder: 2,
        listSize: '29%',
        property: 'email',
        label: 'Email',
        display: function display(user) {
          return user.email || 'N/A';
        }
      }, {
        listOrder: 3,
        listSize: '15%',
        property: 'last_login_relative',
        sortProperty: 'last_login',
        label: 'Latest Login',
        search: {
          sort: true
        }
      }, {
        listOrder: 4,
        listSize: '15%',
        property: 'logins_count',
        label: 'Logins',
        search: {
          sort: true
        }
      }];
      var connectionField = lodash_default.a.find(userFields, {
        property: 'connection'
      });
      if (!connectionField) {
        defaultListFields.push({
          listOrder: 5,
          listSize: '25%',
          property: 'identities',
          label: 'Connection',
          display: function display(user) {
            return user.identities[0].connection;
          }
        });
      } else if (lodash_default.a.isFunction(connectionField.display) || lodash_default.a.isBoolean(connectionField.display) && connectionField.display === true) {
        defaultListFields.push({
          listOrder: 5,
          listSize: '25%',
          property: 'identities',
          label: 'Connection',
          display: function display(user) {
            return lodash_default.a.isFunction(connectionField.display) ? connectionField.display(user) : user.identities[0].connection;
          }
        });
      }
      var listFields = defaultListFields;

      // Apply some customization
      if (userFields.length > 0) {
        // Figure out if we have any user list fields
        var customListFields = lodash_default()(userFields).filter(function (field) {
          return lodash_default.a.isObject(field.search) || lodash_default.a.isBoolean(field.search) && field.search === true;
        }).map(function (field) {
          if (lodash_default.a.isBoolean(field.search) && field.search === true) {
            var defaultField = Object.assign({}, field, {
              listOrder: 1000,
              listSize: '25%'
            });
            return defaultField;
          }
          var customField = Object.assign({}, field, field.search);
          return customField;
        }).value();

        // If we do, allow the userFields to override the existing search fields
        if (Array.isArray(customListFields) && customListFields.length > 0) {
          // First filter out defaultListFields from userField entries
          var customFieldProperties = lodash_default()(userFields).filter(function (field) {
            return lodash_default.a.isObject(field.search) || lodash_default.a.isBoolean(field.search) && field.search === true;
          }).map('property').value();
          listFields = lodash_default()(defaultListFields).filter(function (field) {
            return customFieldProperties.indexOf(field.property) < 0;
          }).concat(customListFields).sortBy(function (field) {
            return field.listOrder;
          }).filter(function (field) {
            return field.display !== false;
          }) // Remove any fields that have display set to false
          .value();
        }

        /* Now filter out any fields that are set to search === false, this should kill custom fields that are
         * overriding default fields
         */
        var falseSearchFields = lodash_default()(userFields).filter(function (field) {
          return field.search === false;
        }).map('property').value();
        listFields = lodash_default()(listFields).filter(function (field) {
          return falseSearchFields.indexOf(field.property) < 0;
        }).value();
      }
      return listFields;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (!lodash_default.a.isEqual(this.props.userFields, nextProps.userFields)) {
        var listFields = this.getListFields(nextProps);
        this.setState({
          listFields: listFields
        });
      }
    }
  }, {
    key: "onColumnSort",
    value: function onColumnSort(property, sortOrder) {
      var sort = {
        property: property,
        order: sortOrder === -1 ? 1 : -1
      };
      this.props.onColumnSort(sort);
    }
  }, {
    key: "returnToSearch",
    value: function returnToSearch(event) {
      if (event && event.key === 'Enter') {
        event.target.click();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props = this.props,
        users = _this$props.users,
        loading = _this$props.loading,
        sortProperty = _this$props.sortProperty,
        sortOrder = _this$props.sortOrder;
      var languageDictionary = this.props.languageDictionary || {};
      var labels = languageDictionary.labels || {};
      var listFields = this.state.listFields;
      if (!users.length && !loading) {
        return /*#__PURE__*/react_default.a.createElement("label", {
          className: "user-search-no-results",
          tabIndex: "0",
          htmlFor: "search-bar",
          onKeyUp: this.returnToSearch
        }, languageDictionary.userSearchNoResults || 'No users found by given parameters.');
      }
      return /*#__PURE__*/react_default.a.createElement(dist["Table"], null, /*#__PURE__*/react_default.a.createElement(dist["TableHeader"], null, listFields.map(function (field) {
        var sort = lodash_default.a.isObject(field.search) && lodash_default.a.isBoolean(field.search.sort) && field.search.sort === true;
        if (sort) {
          return /*#__PURE__*/react_default.a.createElement(dist["TableColumn"], {
            key: field.property,
            width: field.listSize
          }, /*#__PURE__*/react_default.a.createElement("div", {
            className: "table-column-div",
            onClick: _this2.onColumnSort.bind(_this2, field.sortProperty || field.property, sortOrder)
          }, labels[field.property] || field.label, (field.sortProperty || field.property) === sortProperty && /*#__PURE__*/react_default.a.createElement("i", {
            className: sortOrder === -1 ? 'icon-budicon-462 icon' : 'icon-budicon-460 icon',
            "aria-hidden": "true"
          })));
        }
        return /*#__PURE__*/react_default.a.createElement(dist["TableColumn"], {
          key: field.property,
          width: field.listSize
        }, labels[field.property] || field.label);
      })), /*#__PURE__*/react_default.a.createElement(dist["TableBody"], null, users.map(function (user) {
        return /*#__PURE__*/react_default.a.createElement(dist["TableRow"], {
          key: user.user_id
        }, listFields.map(function (field, index) {
          var key = "".concat(user.user_id, "_").concat(field.property);
          if (field.property === 'picture') {
            return /*#__PURE__*/react_default.a.createElement(dist["TableCell"], null, /*#__PURE__*/react_default.a.createElement("img", {
              className: "img-circle",
              src: display_getValueForType('search', user, field, languageDictionary) || '(empty)',
              alt: user.name || user.user_name || user.email,
              title: user.name || user.user_name || user.email,
              width: "32"
            }));
          }
          if (field.property === 'name') {
            return /*#__PURE__*/react_default.a.createElement(dist["TableRouteCell"], {
              key: key,
              route: "/users/".concat(user.user_id)
            }, display_getValueForType('search', user, field, languageDictionary) || '(empty)');
          }
          return /*#__PURE__*/react_default.a.createElement(dist["TableTextCell"], {
            key: key
          }, display_getValueForType('search', user, field, languageDictionary));
        }));
      })));
    }
  }]);
}(react["Component"]);
defineProperty_default()(UsersTable_UsersTable, "propTypes", {
  users: prop_types_default.a.array.isRequired,
  loading: prop_types_default.a.bool.isRequired,
  userFields: prop_types_default.a.array.isRequired,
  onColumnSort: prop_types_default.a.func.isRequired,
  sortOrder: prop_types_default.a.number.isRequired,
  sortProperty: prop_types_default.a.string.isRequired,
  languageDictionary: prop_types_default.a.object
});

// CONCATENATED MODULE: ./client/components/Users/LuceneSearchBar.jsx






function LuceneSearchBar_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, LuceneSearchBar_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function LuceneSearchBar_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (LuceneSearchBar_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }



var LuceneSearchBar_SearchBar = /*#__PURE__*/function (_Component) {
  function SearchBar(props) {
    var _this;
    classCallCheck_default()(this, SearchBar);
    _this = LuceneSearchBar_callSuper(this, SearchBar, [props]);
    defineProperty_default()(_this, "onKeyPress", function (e) {
      if (e.key === 'Enter') {
        _this.props.onSearch(Object(react_dom["findDOMNode"])(_this.refs.search).value);
      }
    });
    defineProperty_default()(_this, "handleChange", function (event) {
      _this.setState({
        searchValue: event.target.value
      });
    });
    defineProperty_default()(_this, "onResetSearch", function () {
      _this.setState({
        searchValue: ''
      });
      Object(react_dom["findDOMNode"])(_this.refs.search).value = '';
      _this.props.onReset();
    });
    defineProperty_default()(_this, "renderInstructions", function (searchBarInstructions) {
      if (searchBarInstructions) {
        return /*#__PURE__*/react_default.a.createElement("div", {
          className: "help-block"
        }, searchBarInstructions);
      }
      return /*#__PURE__*/react_default.a.createElement("div", {
        className: "help-block"
      }, "To perform your search, press ", /*#__PURE__*/react_default.a.createElement("span", {
        className: "keyboard-button"
      }, "enter"), ". You can also search for specific fields, eg: ", /*#__PURE__*/react_default.a.createElement("strong", null, "email:\"john@doe.com\""), ".");
    });
    _this.state = {
      searchValue: props.searchValue
    };
    _this.handleChange = _this.handleChange.bind(_this);
    return _this;
  }
  inherits_default()(SearchBar, _Component);
  return createClass_default()(SearchBar, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.searchValue !== this.props.searchValue) {
        this.setState({
          searchValue: nextProps.searchValue
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var languageDictionary = this.props.languageDictionary || {};
      return /*#__PURE__*/react_default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "advanced-search-control"
      }, /*#__PURE__*/react_default.a.createElement("span", {
        className: "search-area"
      }, /*#__PURE__*/react_default.a.createElement("i", {
        className: "icon-budicon-489"
      }), /*#__PURE__*/react_default.a.createElement("input", {
        className: "user-input",
        type: "text",
        ref: "search",
        placeholder: languageDictionary.searchBarPlaceholder || 'Search for users using the Lucene syntax',
        spellCheck: "false",
        style: {
          marginLeft: '10px'
        },
        onChange: this.handleChange,
        onKeyPress: this.onKeyPress,
        value: this.state.searchValue,
        id: this.props.inputId || ''
      })), /*#__PURE__*/react_default.a.createElement("span", {
        className: "controls pull-right"
      }, /*#__PURE__*/react_default.a.createElement("button", {
        onClick: this.onResetSearch,
        type: "reset",
        disabled: !this.props.enabled
      }, languageDictionary.searchBarReset || 'Reset', " ", /*#__PURE__*/react_default.a.createElement("i", {
        className: "icon-budicon-471"
      }))))), /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12"
      }, this.renderInstructions(languageDictionary.searchBarInstructions)));
    }
  }]);
}(react["Component"]);
defineProperty_default()(LuceneSearchBar_SearchBar, "propTypes", {
  enabled: prop_types_default.a.bool.isRequired,
  onReset: prop_types_default.a.func.isRequired,
  onSearch: prop_types_default.a.func.isRequired,
  languageDictionary: prop_types_default.a.object,
  searchValue: prop_types_default.a.string,
  inputId: prop_types_default.a.string
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/toConsumableArray.js
var toConsumableArray = __webpack_require__(202);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray);

// CONCATENATED MODULE: ./client/components/Users/UserPaginator.jsx







function UserPaginator_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UserPaginator_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UserPaginator_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UserPaginator_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }

var UserPaginator_UserPaginator = /*#__PURE__*/function (_React$Component) {
  function UserPaginator() {
    var _this;
    classCallCheck_default()(this, UserPaginator);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = UserPaginator_callSuper(this, UserPaginator, [].concat(args));
    defineProperty_default()(_this, "onPreviousPage", function () {
      _this.props.onPageChange(_this.props.nextPage - 1);
    });
    defineProperty_default()(_this, "onNextPage", function () {
      _this.props.onPageChange(_this.props.nextPage + 1);
    });
    defineProperty_default()(_this, "changePage", function (page) {
      _this.props.onPageChange(page);
    });
    return _this;
  }
  inherits_default()(UserPaginator, _React$Component);
  return createClass_default()(UserPaginator, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return this.props.nextPage !== nextProps.nextPage;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props = this.props,
        nextPage = _this$props.nextPage,
        pages = _this$props.pages;
      return /*#__PURE__*/react_default.a.createElement("nav", {
        className: "pull-right"
      }, /*#__PURE__*/react_default.a.createElement("ul", {
        className: "pagination pull-right"
      }, /*#__PURE__*/react_default.a.createElement("li", {
        style: {
          cursor: 'pointer'
        },
        onClick: function onClick() {
          return _this2.onPreviousPage();
        },
        className: nextPage - 2 < 0 ? 'disabled' : ''
      }, /*#__PURE__*/react_default.a.createElement("a", null, /*#__PURE__*/react_default.a.createElement("span", null, "\xAB"))), toConsumableArray_default()(Array(pages)).map(function (item, i) {
        var page = i + 1;
        return /*#__PURE__*/react_default.a.createElement("li", {
          key: i,
          style: {
            cursor: 'pointer'
          },
          className: nextPage === page ? 'active' : '',
          onClick: function onClick() {
            return _this2.changePage(page);
          }
        }, /*#__PURE__*/react_default.a.createElement("a", null, page));
      }), /*#__PURE__*/react_default.a.createElement("li", {
        style: {
          cursor: 'pointer'
        },
        onClick: function onClick() {
          return _this2.onNextPage();
        },
        className: nextPage + 1 > pages ? 'disabled' : ''
      }, /*#__PURE__*/react_default.a.createElement("a", null, /*#__PURE__*/react_default.a.createElement("span", null, "\xBB")))));
    }
  }]);
}(react_default.a.Component);
defineProperty_default()(UserPaginator_UserPaginator, "propTypes", {
  onPageChange: react_default.a.PropTypes.func.isRequired,
  nextPage: react_default.a.PropTypes.number.isRequired,
  pages: react_default.a.PropTypes.number.isRequired
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/typeof.js
var helpers_typeof = __webpack_require__(162);
var typeof_default = /*#__PURE__*/__webpack_require__.n(helpers_typeof);

// EXTERNAL MODULE: ./client/components/Users/ValidationError.styles.css
var ValidationError_styles = __webpack_require__(1029);

// CONCATENATED MODULE: ./client/components/Users/ValidationError.jsx







function ValidationError_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, ValidationError_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function ValidationError_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (ValidationError_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }





var ValidationError_ValidationError = /*#__PURE__*/function (_Component) {
  function ValidationError() {
    var _this;
    classCallCheck_default()(this, ValidationError);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = ValidationError_callSuper(this, ValidationError, [].concat(args));
    defineProperty_default()(_this, "getPlainFields", function (data) {
      var fields = [];
      lodash_default.a.forEach(data, function (item, name) {
        return fields.push(_this.getField(item, name));
      });
      return lodash_default.a.flattenDeep(fields);
    });
    defineProperty_default()(_this, "getField", function (item, name, parentName) {
      var property = parentName ? "".concat(parentName, ".").concat(name) : name;
      var customField = lodash_default.a.find(_this.props.customFields, {
        property: property
      });
      var label = customField && customField.label || name;
      if (typeof item === 'string') {
        return {
          property: property,
          label: label
        };
      }
      if (typeof_default()(item) === 'object') {
        var result = [];
        lodash_default.a.forEach(item, function (value, key) {
          return result.push(_this.getField(value, key, property));
        });
        return result;
      }
    });
    defineProperty_default()(_this, "renderLabel", function (property, label, index) {
      return /*#__PURE__*/react_default.a.createElement("li", {
        key: index
      }, /*#__PURE__*/react_default.a.createElement("label", {
        htmlFor: property
      }, label));
    });
    return _this;
  }
  inherits_default()(ValidationError, _Component);
  return createClass_default()(ValidationError, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      if (this.props.userForm && this.props.userForm.user && this.props.userForm.user.submitFailed && this.props.userForm.user.syncErrors) {
        var fields = this.getPlainFields(this.props.userForm.user.syncErrors);
        return /*#__PURE__*/react_default.a.createElement(es["a" /* Alert */], {
          bsStyle: "danger",
          className: "validation-error"
        }, /*#__PURE__*/react_default.a.createElement("h4", null, this.props.errorMessage || 'Validation Error'), /*#__PURE__*/react_default.a.createElement("ul", {
          className: "validation-error-fields-list"
        }, fields.map(function (field, index) {
          return _this2.renderLabel(field.property, field.label, index);
        })));
      }
      return /*#__PURE__*/react_default.a.createElement("div", null);
    }
  }]);
}(react["Component"]);
ValidationError_ValidationError.propTypes = {
  userForm: prop_types_default.a.object.required,
  customFields: prop_types_default.a.array.required,
  errorMessage: prop_types_default.a.string
};
/* harmony default export */ var Users_ValidationError = (ValidationError_ValidationError);
// CONCATENATED MODULE: ./client/components/Users/index.js












// CONCATENATED MODULE: ./client/containers/Users/Dialogs/CreateDialog.jsx






var CreateDialog_Class;
function CreateDialog_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function CreateDialog_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? CreateDialog_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : CreateDialog_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function CreateDialog_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, CreateDialog_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function CreateDialog_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (CreateDialog_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }








/* harmony default export */ var CreateDialog = (redux_static_lib_default()((CreateDialog_Class = /*#__PURE__*/function (_Component) {
  function _Class() {
    var _this;
    classCallCheck_default()(this, _Class);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = CreateDialog_callSuper(this, _Class, [].concat(args));
    defineProperty_default()(_this, "onSubmit", function (user) {
      var languageDictionary = _this.props.languageDictionary.get('record').toJS();
      _this.props.createUser(user, languageDictionary);
    });
    return _this;
  }
  inherits_default()(_Class, _Component);
  return createClass_default()(_Class, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.userCreate !== this.props.userCreate || nextProps.languageDictionary !== this.props.languageDictionary || nextProps.connections !== this.props.connections || nextProps.accessLevel !== this.props.accessLevel || nextProps.userFields !== this.props.userFields;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props$userCreat = this.props.userCreate.toJS(),
        error = _this$props$userCreat.error,
        loading = _this$props$userCreat.loading,
        record = _this$props$userCreat.record;
      var connections = this.props.connections.toJS();
      var accessLevel = this.props.accessLevel.get('record').toJS();
      var languageDictionary = this.props.languageDictionary.get('record').toJS();
      return /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */], {
        show: record !== null,
        className: "modal-overflow-visible",
        onHide: this.props.cancelCreateUser
      }, /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */].Header, {
        closeButton: !loading,
        className: "has-border",
        closeLabel: languageDictionary.closeButtonText
      }, /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */].Title, null, languageDictionary.createDialogTitle || 'Create User')), /*#__PURE__*/react_default.a.createElement(UserForm, {
        customFields: this.props.userFields || [],
        customFieldGetter: function customFieldGetter(field) {
          return field.create;
        },
        connections: connections.records,
        initialValues: record,
        createMemberships: accessLevel.createMemberships,
        memberships: accessLevel.memberships,
        getDictValue: this.props.getDictValue,
        onClose: this.props.cancelCreateUser,
        onSubmit: this.onSubmit,
        loading: loading,
        languageDictionary: languageDictionary
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, this.props.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement(Users_ValidationError, {
        userForm: this.props.userForm,
        customFields: this.props.userFields || [],
        errorMessage: languageDictionary.validationError
      })));
    }
  }]);
}(react["Component"]), defineProperty_default()(CreateDialog_Class, "stateToProps", function (state) {
  return {
    userCreate: state.userCreate,
    accessLevel: state.accessLevel,
    connections: state.connections,
    languageDictionary: state.languageDictionary,
    userForm: state.form
  };
}), defineProperty_default()(CreateDialog_Class, "actionsToProps", CreateDialog_objectSpread(CreateDialog_objectSpread({}, user_namespaceObject), script_namespaceObject)), defineProperty_default()(CreateDialog_Class, "propTypes", {
  accessLevel: prop_types_default.a.object.isRequired,
  connections: prop_types_default.a.object.isRequired,
  userCreate: prop_types_default.a.object.isRequired,
  userForm: prop_types_default.a.object.isRequired,
  createUser: prop_types_default.a.func.isRequired,
  getDictValue: prop_types_default.a.func.isRequired,
  cancelCreateUser: prop_types_default.a.func.isRequired,
  userFields: prop_types_default.a.array.isRequired,
  errorTranslator: prop_types_default.a.func,
  languageDictionary: prop_types_default.a.object
}), CreateDialog_Class)));
// CONCATENATED MODULE: ./client/containers/Users/Dialogs/DeleteDialog.jsx






var DeleteDialog_Class;
function DeleteDialog_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function DeleteDialog_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? DeleteDialog_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : DeleteDialog_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function DeleteDialog_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, DeleteDialog_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function DeleteDialog_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (DeleteDialog_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }








/* harmony default export */ var DeleteDialog = (redux_static_lib_default()((DeleteDialog_Class = /*#__PURE__*/function (_Component) {
  function _Class() {
    var _this;
    classCallCheck_default()(this, _Class);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = DeleteDialog_callSuper(this, _Class, [].concat(args));
    defineProperty_default()(_this, "onConfirm", function () {
      _this.props.deleteUser();
    });
    return _this;
  }
  inherits_default()(_Class, _Component);
  return createClass_default()(_Class, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.userDelete !== this.props.userDelete || nextProps.languageDictionary !== this.props.languageDictionary;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        cancelDeleteUser = _this$props.cancelDeleteUser,
        settings = _this$props.settings;
      var _this$props$userDelet = this.props.userDelete.toJS(),
        user = _this$props$userDelet.user,
        error = _this$props$userDelet.error,
        requesting = _this$props$userDelet.requesting,
        loading = _this$props$userDelet.loading;
      var userFields = settings.userFields || [];
      var languageDictionary = this.props.languageDictionary.get('record').toJS();
      var messageFormat = languageDictionary.deleteDialogMessage || 'Do you really want to delete {username}? ' + 'This will completely remove the user and cannot be undone.';
      var message = Dialogs_getDialogMessage(messageFormat, 'username', display_getName(user, userFields, languageDictionary));
      return /*#__PURE__*/react_default.a.createElement(dist["Confirm"], {
        title: languageDictionary.deleteDialogTitle || "Delete User?",
        show: requesting,
        loading: loading,
        confirmMessage: languageDictionary.dialogConfirmText,
        cancelMessage: languageDictionary.dialogCancelText,
        onCancel: cancelDeleteUser,
        onConfirm: this.onConfirm,
        closeLabel: languageDictionary.closeButtonText
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement("p", null, message));
    }
  }]);
}(react["Component"]), defineProperty_default()(DeleteDialog_Class, "stateToProps", function (state) {
  return {
    userDelete: state.userDelete,
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    languageDictionary: state.languageDictionary
  };
}), defineProperty_default()(DeleteDialog_Class, "actionsToProps", DeleteDialog_objectSpread({}, user_namespaceObject)), defineProperty_default()(DeleteDialog_Class, "propTypes", {
  cancelDeleteUser: prop_types_default.a.func.isRequired,
  deleteUser: prop_types_default.a.func.isRequired,
  userDelete: prop_types_default.a.object.isRequired,
  languageDictionary: prop_types_default.a.object
}), DeleteDialog_Class)));
// CONCATENATED MODULE: ./client/containers/Users/Dialogs/FieldsChangeDialog.jsx






var FieldsChangeDialog_Class;
function FieldsChangeDialog_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function FieldsChangeDialog_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? FieldsChangeDialog_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : FieldsChangeDialog_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function FieldsChangeDialog_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, FieldsChangeDialog_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function FieldsChangeDialog_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (FieldsChangeDialog_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }







/* harmony default export */ var FieldsChangeDialog = (redux_static_lib_default()((FieldsChangeDialog_Class = /*#__PURE__*/function (_Component) {
  function _Class() {
    var _this;
    classCallCheck_default()(this, _Class);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = FieldsChangeDialog_callSuper(this, _Class, [].concat(args));
    defineProperty_default()(_this, "onSubmit", function (user) {
      var submitFields = _([]).concat(_.map(_.filter(_this.props.userFields, function (field) {
        return field.property && field.edit && field.edit !== false;
      }), function (field) {
        return field.property.split('.')[0];
      })).uniq().value();
      _this.props.changeFields(_this.props.userId, _.pick(user, submitFields), _this.props.languageDictionary.get('record').toJS());
    });
    return _this;
  }
  inherits_default()(_Class, _Component);
  return createClass_default()(_Class, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.fieldsChange !== this.props.fieldsChange || nextProps.userFields !== this.props.userFields || nextProps.languageDictionary !== this.props.languageDictionary;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props$fieldsCha = this.props.fieldsChange.toJS(),
        error = _this$props$fieldsCha.error,
        loading = _this$props$fieldsCha.loading,
        record = _this$props$fieldsCha.record;
      var languageDictionary = this.props.languageDictionary.get('record').toJS();
      return /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */], {
        show: record !== null,
        className: "modal-overflow-visible",
        onHide: this.props.cancelChangeFields
      }, /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */].Header, {
        closeButton: !loading,
        className: "has-border",
        closeLabel: languageDictionary.closeButtonText
      }, /*#__PURE__*/react_default.a.createElement(es["f" /* Modal */].Title, null, languageDictionary.changeProfileDialogTitle || 'Change Profile')), /*#__PURE__*/react_default.a.createElement(Users_UserFieldsChangeForm, {
        customFields: this.props.userFields || [],
        customFieldGetter: function customFieldGetter(field) {
          return field.edit;
        },
        initialValues: record,
        onClose: this.props.cancelChangeFields,
        onSubmit: this.onSubmit,
        loading: loading,
        languageDictionary: languageDictionary
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, this.props.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement(Users_ValidationError, {
        userForm: this.props.userForm,
        customFields: this.props.userFields || [],
        errorMessage: languageDictionary.validationError
      })));
    }
  }]);
}(react["Component"]), defineProperty_default()(FieldsChangeDialog_Class, "stateToProps", function (state) {
  return {
    fieldsChange: state.fieldsChange,
    userId: state.fieldsChange.toJS().userId,
    languageDictionary: state.languageDictionary,
    userForm: state.form
  };
}), defineProperty_default()(FieldsChangeDialog_Class, "actionsToProps", FieldsChangeDialog_objectSpread(FieldsChangeDialog_objectSpread({}, user_namespaceObject), script_namespaceObject)), defineProperty_default()(FieldsChangeDialog_Class, "propTypes", {
  fieldsChange: react["PropTypes"].object.isRequired,
  changeFields: react["PropTypes"].func.isRequired,
  cancelChangeFields: react["PropTypes"].func.isRequired,
  userFields: react["PropTypes"].array.isRequired,
  userForm: react["PropTypes"].object.isRequired,
  userId: react["PropTypes"].string.isRequired,
  languageDictionary: react["PropTypes"].object,
  errorTranslator: react["PropTypes"].func
}), FieldsChangeDialog_Class)));
// CONCATENATED MODULE: ./client/actions/submitForm.js

var submitForm_submitForm = function submitForm(formName) {
  return function (dispatch) {
    dispatch(Object(redux_form_es["e" /* submit */])(formName));
  };
};
/* harmony default export */ var actions_submitForm = (submitForm_submitForm);
// CONCATENATED MODULE: ./client/components/Users/UserFieldsForm.jsx






function UserFieldsForm_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UserFieldsForm_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UserFieldsForm_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UserFieldsForm_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }




var UserFieldsForm_UserFieldsFormBase = /*#__PURE__*/function (_Component) {
  function UserFieldsFormBase() {
    classCallCheck_default()(this, UserFieldsFormBase);
    return UserFieldsForm_callSuper(this, UserFieldsFormBase, arguments);
  }
  inherits_default()(UserFieldsFormBase, _Component);
  return createClass_default()(UserFieldsFormBase, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        fields = _this$props.fields,
        isEditForm = _this$props.isEditForm;
      var languageDictionary = this.props.languageDictionary || {};
      return /*#__PURE__*/react_default.a.createElement("div", {
        className: "row"
      }, fields.map(function (field, index) {
        return /*#__PURE__*/react_default.a.createElement(UserFormField_UserFormField, {
          key: index,
          field: field,
          isEditField: isEditForm,
          languageDictionary: languageDictionary
        });
      }));
    }
  }]);
}(react["Component"]);
defineProperty_default()(UserFieldsForm_UserFieldsFormBase, "propTypes", {
  isEditForm: prop_types_default.a.bool.isRequired,
  fields: prop_types_default.a.array.isRequired,
  languageDictionary: prop_types_default.a.object
});
;
var UserFieldsForm_UserFieldsForm = function UserFieldsForm(name, submit) {
  return Object(redux_form_es["d" /* reduxForm */])({
    form: name,
    onSubmit: submit
  })(UserFieldsForm_UserFieldsFormBase);
};
/* harmony default export */ var Users_UserFieldsForm = (UserFieldsForm_UserFieldsForm);
// CONCATENATED MODULE: ./client/containers/Users/Dialogs/EmailChangeDialog.jsx






var EmailChangeDialog_Class;
function EmailChangeDialog_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function EmailChangeDialog_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? EmailChangeDialog_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : EmailChangeDialog_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function EmailChangeDialog_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, EmailChangeDialog_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function EmailChangeDialog_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (EmailChangeDialog_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }












/* harmony default export */ var EmailChangeDialog = (redux_static_lib_default()((EmailChangeDialog_Class = /*#__PURE__*/function (_Component) {
  function _Class() {
    var _this;
    classCallCheck_default()(this, _Class);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = EmailChangeDialog_callSuper(this, _Class, [].concat(args));
    defineProperty_default()(_this, "onConfirm", function () {
      _this.props.submitForm('change-email');
    });
    defineProperty_default()(_this, "onSubmit", function (emailForm) {
      var _this$props$emailChan = _this.props.emailChange.toJS(),
        user = _this$props$emailChan.user;
      _this.props.changeEmail(user, emailForm, _this.props.languageDictionary.get('record').toJS());
    });
    return _this;
  }
  inherits_default()(_Class, _Component);
  return createClass_default()(_Class, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.languageDictionary !== this.props.languageDictionary || nextProps.emailChange !== this.props.emailChange;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        cancelEmailChange = _this$props.cancelEmailChange,
        settings = _this$props.settings,
        connections = _this$props.connections;
      var _this$props$emailChan2 = this.props.emailChange.toJS(),
        user = _this$props$emailChan2.user,
        connection = _this$props$emailChan2.connection,
        error = _this$props$emailChan2.error,
        requesting = _this$props$emailChan2.requesting,
        loading = _this$props$emailChan2.loading;
      var userFields = settings.userFields || [];
      var languageDictionary = this.props.languageDictionary.get('record').toJS();
      var messageFormat = languageDictionary.changeEmailMessage || 'Do you really want to change the email for {username}?';
      var message = Dialogs_getDialogMessage(messageFormat, 'username', display_getName(user, userFields, languageDictionary));
      var fields = lodash_default.a.cloneDeep(userFields) || [];
      useDefaultFields_useEmailField(true, fields);
      useDefaultFields_useDisabledConnectionField(true, fields, connection, connections.get('records').toJS());
      var allowedFields = ['email', 'connection'];
      var filteredFields = lodash_default.a.filter(fields, function (field) {
        return lodash_default.a.includes(allowedFields, field.property);
      });
      var UserFieldsFormInstance = Users_UserFieldsForm('change-email', this.onSubmit.bind(this));
      return /*#__PURE__*/react_default.a.createElement(dist["Confirm"], {
        title: languageDictionary.changeEmailTitle || 'Change Email?',
        confirmMessage: languageDictionary.dialogConfirmText,
        cancelMessage: languageDictionary.dialogCancelText,
        show: requesting,
        loading: loading,
        onCancel: cancelEmailChange,
        onConfirm: this.onConfirm,
        closeLabel: languageDictionary.closeButtonText
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement("p", null, message), /*#__PURE__*/react_default.a.createElement(UserFieldsFormInstance, {
        initialValues: display_mapValues(user, allowedFields, filteredFields, 'edit', languageDictionary),
        isEditForm: true,
        fields: filteredFields,
        languageDictionary: languageDictionary
      }));
    }
  }]);
}(react["Component"]), defineProperty_default()(EmailChangeDialog_Class, "stateToProps", function (state) {
  return {
    connections: state.connections,
    emailChange: state.emailChange,
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    languageDictionary: state.languageDictionary
  };
}), defineProperty_default()(EmailChangeDialog_Class, "actionsToProps", EmailChangeDialog_objectSpread({
  submitForm: actions_submitForm
}, user_namespaceObject)), defineProperty_default()(EmailChangeDialog_Class, "propTypes", {
  cancelEmailChange: prop_types_default.a.func.isRequired,
  changeEmail: prop_types_default.a.func.isRequired,
  connections: prop_types_default.a.object.isRequired,
  emailChange: prop_types_default.a.object.isRequired
}), EmailChangeDialog_Class)));
// CONCATENATED MODULE: ./client/containers/Users/Dialogs/PasswordChangeDialog.jsx






var _PasswordChangeDialog;
function PasswordChangeDialog_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function PasswordChangeDialog_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? PasswordChangeDialog_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : PasswordChangeDialog_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function PasswordChangeDialog_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, PasswordChangeDialog_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function PasswordChangeDialog_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (PasswordChangeDialog_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }











/* harmony default export */ var Dialogs_PasswordChangeDialog = (redux_static_lib_default()((_PasswordChangeDialog = /*#__PURE__*/function (_Component) {
  function PasswordChangeDialog() {
    var _this;
    classCallCheck_default()(this, PasswordChangeDialog);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = PasswordChangeDialog_callSuper(this, PasswordChangeDialog, [].concat(args));
    defineProperty_default()(_this, "onConfirm", function () {
      _this.props.submitForm('change-password');
    });
    defineProperty_default()(_this, "onSubmit", function (changeForm) {
      var languageDictionary = _this.props.languageDictionary.get('record').toJS();
      _this.props.changePassword(changeForm, languageDictionary);
    });
    return _this;
  }
  inherits_default()(PasswordChangeDialog, _Component);
  return createClass_default()(PasswordChangeDialog, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.passwordChange !== this.props.passwordChange || nextProps.languageDictionary !== this.props.languageDictionary;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        cancelPasswordChange = _this$props.cancelPasswordChange,
        settings = _this$props.settings,
        connections = _this$props.connections;
      var _this$props$passwordC = this.props.passwordChange.toJS(),
        connection = _this$props$passwordC.connection,
        user = _this$props$passwordC.user,
        error = _this$props$passwordC.error,
        requesting = _this$props$passwordC.requesting,
        loading = _this$props$passwordC.loading;
      var userFields = settings.userFields || [];
      if (!requesting) {
        return null;
      }
      var languageDictionary = this.props.languageDictionary.get('record').toJS();
      var messageFormat = languageDictionary.changePasswordMessage || 'Do you really want to reset the password for {username}? ' + 'You\'ll need a safe way to communicate the new password to your user, never send the user this' + ' new password in clear text.';
      var message = Dialogs_getDialogMessage(messageFormat, 'username', display_getName(user, userFields, languageDictionary));
      var fields = lodash_default.a.cloneDeep(userFields) || [];
      useDefaultFields_usePasswordFields(true, fields);
      useDefaultFields_useDisabledConnectionField(true, fields, connection, connections.get('records').toJS());
      useDefaultFields_useDisabledEmailField(true, fields);
      var allowedFields = ['email', 'connection', 'password', 'repeatPassword'];
      var filteredFields = lodash_default.a.filter(fields, function (field) {
        return lodash_default.a.includes(allowedFields, field.property);
      });
      var UserFieldsFormInstance = Users_UserFieldsForm('change-password', this.onSubmit);
      return /*#__PURE__*/react_default.a.createElement(dist["Confirm"], {
        title: languageDictionary.changePasswordTitle || 'Change Password?',
        show: requesting,
        loading: loading,
        confirmMessage: languageDictionary.dialogConfirmText,
        cancelMessage: languageDictionary.dialogCancelText,
        onCancel: cancelPasswordChange,
        closeLabel: languageDictionary.closeButtonText,
        onConfirm: this.onConfirm
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement("p", null, message), /*#__PURE__*/react_default.a.createElement(UserFieldsFormInstance, {
        initialValues: display_mapValues(user, allowedFields, filteredFields, 'edit', languageDictionary),
        isEditForm: true,
        fields: filteredFields,
        languageDictionary: languageDictionary
      }));
    }
  }]);
}(react["Component"]), defineProperty_default()(_PasswordChangeDialog, "stateToProps", function (state) {
  return {
    connections: state.connections,
    passwordChange: state.passwordChange,
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    languageDictionary: state.languageDictionary
  };
}), defineProperty_default()(_PasswordChangeDialog, "actionsToProps", PasswordChangeDialog_objectSpread({
  submitForm: actions_submitForm
}, user_namespaceObject)), defineProperty_default()(_PasswordChangeDialog, "propTypes", {
  connections: react["PropTypes"].object.isRequired,
  passwordChange: react["PropTypes"].object.isRequired,
  changePassword: react["PropTypes"].func.isRequired,
  cancelPasswordChange: react["PropTypes"].func.isRequired
}), _PasswordChangeDialog)));
// EXTERNAL MODULE: ./node_modules/reselect/lib/index.js
var reselect_lib = __webpack_require__(203);

// CONCATENATED MODULE: ./client/selectors/getAppsForConnection.js

var getApps = function getApps(state) {
  return state.applications.get('records');
};
var getEnabledClients = function getEnabledClients(state) {
  return state.user.get('connection') && state.user.get('connection').get('enabled_clients');
};
var getAppsForConnection = Object(reselect_lib["createSelector"])([getApps, getEnabledClients], function (apps, enabledClients) {
  return apps.filter(function (app) {
    return enabledClients && enabledClients.indexOf(app.get('client_id')) >= 0;
  });
});
/* harmony default export */ var selectors_getAppsForConnection = (getAppsForConnection);
// CONCATENATED MODULE: ./client/containers/Users/Dialogs/PasswordResetDialog.jsx






var PasswordResetDialog_Class;
function PasswordResetDialog_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function PasswordResetDialog_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? PasswordResetDialog_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : PasswordResetDialog_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function PasswordResetDialog_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, PasswordResetDialog_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function PasswordResetDialog_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (PasswordResetDialog_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }













/* harmony default export */ var PasswordResetDialog = (redux_static_lib_default()((PasswordResetDialog_Class = /*#__PURE__*/function (_Component) {
  function _Class() {
    var _this;
    classCallCheck_default()(this, _Class);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = PasswordResetDialog_callSuper(this, _Class, [].concat(args));
    defineProperty_default()(_this, "onConfirm", function () {
      _this.props.submitForm('reset-password');
    });
    defineProperty_default()(_this, "onSubmit", function (formData) {
      _this.props.resetPassword(formData);
    });
    return _this;
  }
  inherits_default()(_Class, _Component);
  return createClass_default()(_Class, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.passwordReset !== this.props.passwordReset || nextProps.languageDictionary !== this.props.languageDictionary ||
      // nextProps.settings !== this.props.settings ||
      nextProps.appsForConnection !== this.props.appsForConnection;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        cancelPasswordReset = _this$props.cancelPasswordReset,
        settings = _this$props.settings,
        connections = _this$props.connections;
      var _this$props$passwordR = this.props.passwordReset.toJS(),
        connection = _this$props$passwordR.connection,
        user = _this$props$passwordR.user,
        error = _this$props$passwordR.error,
        requesting = _this$props$passwordR.requesting,
        loading = _this$props$passwordR.loading;
      if (!requesting) {
        return null;
      }
      var userFields = settings.userFields || [];
      var languageDictionary = this.props.languageDictionary.get('record').toJS();
      var messageFormat = languageDictionary.resetPasswordMessage || 'Do you really want to reset the password for {username}? ' + 'This will send an email to the user allowing them to choose a new password.';
      var message = Dialogs_getDialogMessage(messageFormat, 'username', display_getName(user, userFields, languageDictionary));
      var fields = lodash_default.a.cloneDeep(userFields) || [];
      useDefaultFields_useClientField(true, fields, this.props.appsForConnection.toJS());
      useDefaultFields_useDisabledConnectionField(true, fields, connection, connections.get('records').toJS());
      useDefaultFields_useDisabledEmailField(true, fields);
      var allowedFields = ['email', 'client', 'connection'];
      var filteredFields = lodash_default.a.filter(fields, function (field) {
        return lodash_default.a.includes(allowedFields, field.property);
      });
      var UserFieldsFormInstance = Users_UserFieldsForm('reset-password', this.onSubmit);
      return /*#__PURE__*/react_default.a.createElement(dist["Confirm"], {
        title: languageDictionary.resetPasswordTitle || 'Reset Password?',
        show: requesting,
        loading: loading,
        confirmMessage: languageDictionary.dialogConfirmText,
        cancelMessage: languageDictionary.dialogCancelText,
        onCancel: cancelPasswordReset,
        closeLabel: languageDictionary.closeButtonText,
        onConfirm: this.onConfirm
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement("p", null, message), /*#__PURE__*/react_default.a.createElement(UserFieldsFormInstance, {
        initialValues: display_mapValues(user, allowedFields, filteredFields, 'edit', languageDictionary, {
          applications: this.props.appsForConnection.toJS()
        }),
        isEditForm: true,
        fields: filteredFields,
        languageDictionary: languageDictionary
      }));
    }
  }]);
}(react["Component"]), defineProperty_default()(PasswordResetDialog_Class, "stateToProps", function (state) {
  return {
    connections: state.connections,
    passwordReset: state.passwordReset,
    appsForConnection: selectors_getAppsForConnection(state),
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    languageDictionary: state.languageDictionary
  };
}), defineProperty_default()(PasswordResetDialog_Class, "actionsToProps", PasswordResetDialog_objectSpread({
  submitForm: actions_submitForm
}, user_namespaceObject)), defineProperty_default()(PasswordResetDialog_Class, "propTypes", {
  cancelPasswordReset: prop_types_default.a.func.isRequired,
  resetPassword: prop_types_default.a.func.isRequired,
  connections: prop_types_default.a.object.isRequired,
  passwordReset: prop_types_default.a.object.isRequired,
  appsForConnection: prop_types_default.a.object
}), PasswordResetDialog_Class)));
// CONCATENATED MODULE: ./client/containers/Users/Dialogs/RemoveMultiFactorDialog.jsx






var RemoveMultiFactorDialog_Class;
function RemoveMultiFactorDialog_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function RemoveMultiFactorDialog_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? RemoveMultiFactorDialog_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : RemoveMultiFactorDialog_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function RemoveMultiFactorDialog_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, RemoveMultiFactorDialog_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function RemoveMultiFactorDialog_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (RemoveMultiFactorDialog_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }













/**
 * Normalizes a multifactor value from the user object into an array of provider strings.
 *
 * The value can arrive in three forms depending on how the field was processed:
 * - Already a JS array (normal path)
 * - A JSON-stringified array (e.g. when mapValues serializes the field)
 * - A plain provider string (e.g. a single-provider user with no serialization)
 *
 * @param {string[]|string} value - Raw multifactor value from the user object.
 * @returns {string[]} Array of MFA provider strings.
 */
var parseProviders = function parseProviders(value) {
  if (Array.isArray(value)) {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (_unused) {
    return [value];
  }
};
/* harmony default export */ var RemoveMultiFactorDialog = (redux_static_lib_default()((RemoveMultiFactorDialog_Class = /*#__PURE__*/function (_Component) {
  function _Class() {
    var _this;
    classCallCheck_default()(this, _Class);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = RemoveMultiFactorDialog_callSuper(this, _Class, [].concat(args));
    defineProperty_default()(_this, "onConfirm", function () {
      _this.props.submitForm('remove-mfa');
    });
    defineProperty_default()(_this, "onSubmit", function (form) {
      _this.props.removeMultiFactor(form.user_id, form.multifactor);
    });
    return _this;
  }
  inherits_default()(_Class, _Component);
  return createClass_default()(_Class, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.mfa !== this.props.mfa || nextProps.languageDictionary !== this.props.languageDictionary;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        cancelRemoveMultiFactor = _this$props.cancelRemoveMultiFactor,
        settings = _this$props.settings;
      var _this$props$mfa$toJS = this.props.mfa.toJS(),
        user = _this$props$mfa$toJS.user,
        error = _this$props$mfa$toJS.error,
        requesting = _this$props$mfa$toJS.requesting,
        loading = _this$props$mfa$toJS.loading;
      var userFields = settings.userFields || [];
      var languageDictionary = this.props.languageDictionary.get('record').toJS();
      var messageFormat = languageDictionary.removeMultiFactorMessage || 'Do you really want to remove the multi factor authentication settings for {username}? ' + 'This will allow the user to authenticate and reconfigure a new device.';
      var message = Dialogs_getDialogMessage(messageFormat, 'username', display_getName(user, userFields, languageDictionary));
      var fields = lodash_default.a.cloneDeep(userFields) || [];
      var providers = user && user.multifactor ? user.multifactor : [];
      var hasPasskey = providers.includes('passkey');
      var nonPasskeyProviders = providers.filter(function (p) {
        return p !== 'passkey';
      });
      useDefaultFields_useMfaField(true, fields, providers);
      var allowedFields = ['user_id', 'multifactor'];
      var filteredFields = lodash_default.a.filter(fields, function (field) {
        return lodash_default.a.includes(allowedFields, field.property);
      });
      var UserFieldsFormInstance = Users_UserFieldsForm('remove-mfa', this.onSubmit.bind(this));
      var initialValues = display_mapValues(user, allowedFields, filteredFields, 'edit', languageDictionary);
      if (initialValues.multifactor) {
        initialValues.multifactor = parseProviders(initialValues.multifactor)[0];
      }
      return /*#__PURE__*/react_default.a.createElement(dist["Confirm"], {
        title: languageDictionary.removeMultiFactorTitle || "Remove Multi Factor Authentication?",
        show: requesting,
        loading: loading,
        confirmMessage: languageDictionary.dialogConfirmText,
        cancelMessage: languageDictionary.dialogCancelText,
        onCancel: cancelRemoveMultiFactor,
        closeLabel: languageDictionary.closeButtonText,
        onConfirm: this.onConfirm
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement("p", null, message), hasPasskey && nonPasskeyProviders.length > 0 && /*#__PURE__*/react_default.a.createElement("p", null, /*#__PURE__*/react_default.a.createElement("b", null, "Note:"), " Removing all authentication factors at once is not supported when the user has at least one passkey registered. Remove any passkeys first, and then if multiple types of factors remain, an option to remove all of the remaining types will be added below."), /*#__PURE__*/react_default.a.createElement(UserFieldsFormInstance, {
        initialValues: initialValues,
        isEditForm: true,
        fields: filteredFields,
        languageDictionary: languageDictionary
      }));
    }
  }]);
}(react["Component"]), defineProperty_default()(RemoveMultiFactorDialog_Class, "stateToProps", function (state) {
  return {
    mfa: state.mfa,
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    languageDictionary: state.languageDictionary
  };
}), defineProperty_default()(RemoveMultiFactorDialog_Class, "actionsToProps", RemoveMultiFactorDialog_objectSpread({
  submitForm: actions_submitForm
}, user_namespaceObject)), defineProperty_default()(RemoveMultiFactorDialog_Class, "propTypes", {
  cancelRemoveMultiFactor: prop_types_default.a.func.isRequired,
  removeMultiFactor: prop_types_default.a.func.isRequired,
  mfa: prop_types_default.a.object.isRequired
}), RemoveMultiFactorDialog_Class)));
// CONCATENATED MODULE: ./client/containers/Users/Dialogs/ResendVerificationEmailDialog.jsx






var ResendVerificationEmailDialog_Class;
function ResendVerificationEmailDialog_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function ResendVerificationEmailDialog_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ResendVerificationEmailDialog_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ResendVerificationEmailDialog_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function ResendVerificationEmailDialog_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, ResendVerificationEmailDialog_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function ResendVerificationEmailDialog_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (ResendVerificationEmailDialog_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }








/* harmony default export */ var ResendVerificationEmailDialog = (redux_static_lib_default()((ResendVerificationEmailDialog_Class = /*#__PURE__*/function (_Component) {
  function _Class() {
    var _this;
    classCallCheck_default()(this, _Class);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = ResendVerificationEmailDialog_callSuper(this, _Class, [].concat(args));
    defineProperty_default()(_this, "onConfirm", function () {
      _this.props.resendVerificationEmail(_this.props.verificationEmail.toJS().user.user_id);
    });
    return _this;
  }
  inherits_default()(_Class, _Component);
  return createClass_default()(_Class, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.verificationEmail !== this.props.verificationEmail || nextProps.languageDictionary !== this.props.languageDictionary;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        cancelResendVerificationEmail = _this$props.cancelResendVerificationEmail,
        settings = _this$props.settings;
      var _this$props$verificat = this.props.verificationEmail.toJS(),
        user = _this$props$verificat.user,
        error = _this$props$verificat.error,
        requesting = _this$props$verificat.requesting,
        loading = _this$props$verificat.loading;
      var userFields = settings.userFields || [];
      var languageDictionary = this.props.languageDictionary.get('record').toJS();
      var messageFormat = languageDictionary.resendVerificationEmailMessage || 'Do you really want to resend verification email to {username}?';
      var message = Dialogs_getDialogMessage(messageFormat, 'username', display_getName(user, userFields, languageDictionary));
      return /*#__PURE__*/react_default.a.createElement(dist["Confirm"], {
        title: languageDictionary.resendVerificationEmailTitle || "Resend Verification Email?",
        show: requesting,
        loading: loading,
        confirmMessage: languageDictionary.dialogConfirmText,
        cancelMessage: languageDictionary.dialogCancelText,
        onCancel: cancelResendVerificationEmail,
        closeLabel: languageDictionary.closeButtonText,
        onConfirm: this.onConfirm
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement("p", null, message));
    }
  }]);
}(react["Component"]), defineProperty_default()(ResendVerificationEmailDialog_Class, "stateToProps", function (state) {
  return {
    verificationEmail: state.verificationEmail,
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    languageDictionary: state.languageDictionary
  };
}), defineProperty_default()(ResendVerificationEmailDialog_Class, "actionsToProps", ResendVerificationEmailDialog_objectSpread({}, user_namespaceObject)), defineProperty_default()(ResendVerificationEmailDialog_Class, "propTypes", {
  cancelResendVerificationEmail: prop_types_default.a.func.isRequired,
  resendVerificationEmail: prop_types_default.a.func.isRequired,
  verificationEmail: prop_types_default.a.object.isRequired
}), ResendVerificationEmailDialog_Class)));
// CONCATENATED MODULE: ./client/containers/Users/Dialogs/UnblockDialog.jsx






var UnblockDialog_Class;
function UnblockDialog_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function UnblockDialog_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? UnblockDialog_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : UnblockDialog_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function UnblockDialog_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UnblockDialog_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UnblockDialog_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UnblockDialog_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }









/* harmony default export */ var UnblockDialog = (redux_static_lib_default()((UnblockDialog_Class = /*#__PURE__*/function (_Component) {
  function _Class() {
    var _this;
    classCallCheck_default()(this, _Class);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = UnblockDialog_callSuper(this, _Class, [].concat(args));
    defineProperty_default()(_this, "onConfirm", function () {
      _this.props.unblockUser();
    });
    return _this;
  }
  inherits_default()(_Class, _Component);
  return createClass_default()(_Class, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.unblock !== this.props.unblock || nextProps.languageDictionary !== this.props.languageDictionary;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        cancelUnblockUser = _this$props.cancelUnblockUser,
        settings = _this$props.settings;
      var _this$props$unblock$t = this.props.unblock.toJS(),
        user = _this$props$unblock$t.user,
        error = _this$props$unblock$t.error,
        requesting = _this$props$unblock$t.requesting,
        loading = _this$props$unblock$t.loading;
      var userFields = settings.userFields || [];
      var languageDictionary = this.props.languageDictionary.get('record').toJS();
      var messageFormat = languageDictionary.unblockDialogMessage || 'Do you really want to unblock {username}? ' + 'After doing so the user will be able to sign in again.';
      var message = Dialogs_getDialogMessage(messageFormat, 'username', display_getName(user, userFields, languageDictionary));
      return /*#__PURE__*/react_default.a.createElement(dist["Confirm"], {
        title: languageDictionary.unblockDialogTitle || "Unblock User?",
        show: requesting,
        loading: loading,
        confirmMessage: languageDictionary.dialogConfirmText,
        cancelMessage: languageDictionary.dialogCancelText,
        onCancel: cancelUnblockUser,
        closeLabel: languageDictionary.closeButtonText,
        onConfirm: this.onConfirm
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement("p", null, message));
    }
  }]);
}(react["Component"]), defineProperty_default()(UnblockDialog_Class, "stateToProps", function (state) {
  return {
    unblock: state.unblock,
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    languageDictionary: state.languageDictionary
  };
}), defineProperty_default()(UnblockDialog_Class, "actionsToProps", UnblockDialog_objectSpread({}, user_namespaceObject)), defineProperty_default()(UnblockDialog_Class, "propTypes", {
  cancelUnblockUser: prop_types_default.a.func.isRequired,
  unblockUser: prop_types_default.a.func.isRequired,
  unblock: prop_types_default.a.object.isRequired
}), UnblockDialog_Class)));
// CONCATENATED MODULE: ./client/containers/Users/Dialogs/RemoveBlocksDialog.jsx






var RemoveBlocksDialog_Class;
function RemoveBlocksDialog_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function RemoveBlocksDialog_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? RemoveBlocksDialog_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : RemoveBlocksDialog_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function RemoveBlocksDialog_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, RemoveBlocksDialog_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function RemoveBlocksDialog_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (RemoveBlocksDialog_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }









/* harmony default export */ var RemoveBlocksDialog = (redux_static_lib_default()((RemoveBlocksDialog_Class = /*#__PURE__*/function (_Component) {
  function _Class() {
    var _this;
    classCallCheck_default()(this, _Class);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = RemoveBlocksDialog_callSuper(this, _Class, [].concat(args));
    defineProperty_default()(_this, "onConfirm", function () {
      _this.props.removeUserBlocks();
    });
    return _this;
  }
  inherits_default()(_Class, _Component);
  return createClass_default()(_Class, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.removeBlockedIPs !== this.props.removeBlockedIPs || nextProps.languageDictionary !== this.props.languageDictionary;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        cancelRemoveBlocks = _this$props.cancelRemoveBlocks,
        settings = _this$props.settings;
      var _this$props$removeBlo = this.props.removeBlockedIPs.toJS(),
        user = _this$props$removeBlo.user,
        error = _this$props$removeBlo.error,
        requesting = _this$props$removeBlo.requesting,
        loading = _this$props$removeBlo.loading;
      var userFields = settings.userFields || [];
      var languageDictionary = this.props.languageDictionary.get('record').toJS();
      var messageFormat = languageDictionary.removeBlockedIPsDialogMessage || 'Do you really want to remove all Anomaly Detection blocks from {username}? ' + 'After doing so the user will be able to sign in again.';
      var message = Dialogs_getDialogMessage(messageFormat, 'username', display_getName(user, userFields, languageDictionary));
      return /*#__PURE__*/react_default.a.createElement(dist["Confirm"], {
        title: languageDictionary.removeBlockedIPsDialogTitle || 'Remove all blocked IPs?',
        show: requesting,
        loading: loading,
        confirmMessage: languageDictionary.dialogConfirmText,
        cancelMessage: languageDictionary.dialogCancelText,
        onCancel: cancelRemoveBlocks,
        closeLabel: languageDictionary.closeButtonText,
        onConfirm: this.onConfirm
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement("p", null, message));
    }
  }]);
}(react["Component"]), defineProperty_default()(RemoveBlocksDialog_Class, "stateToProps", function (state) {
  return {
    removeBlockedIPs: state.removeBlockedIPs,
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    languageDictionary: state.languageDictionary
  };
}), defineProperty_default()(RemoveBlocksDialog_Class, "actionsToProps", RemoveBlocksDialog_objectSpread({}, user_namespaceObject)), defineProperty_default()(RemoveBlocksDialog_Class, "propTypes", {
  cancelRemoveBlocks: prop_types_default.a.func.isRequired,
  removeUserBlocks: prop_types_default.a.func.isRequired,
  removeBlockedIPs: prop_types_default.a.object.isRequired
}), RemoveBlocksDialog_Class)));
// CONCATENATED MODULE: ./client/containers/Users/Dialogs/UsernameChangeDialog.jsx






var UsernameChangeDialog_Class;
function UsernameChangeDialog_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function UsernameChangeDialog_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? UsernameChangeDialog_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : UsernameChangeDialog_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function UsernameChangeDialog_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, UsernameChangeDialog_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function UsernameChangeDialog_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (UsernameChangeDialog_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }











/* harmony default export */ var UsernameChangeDialog = (redux_static_lib_default()((UsernameChangeDialog_Class = /*#__PURE__*/function (_Component) {
  function _Class() {
    var _this;
    classCallCheck_default()(this, _Class);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = UsernameChangeDialog_callSuper(this, _Class, [].concat(args));
    defineProperty_default()(_this, "onConfirm", function () {
      _this.props.submitForm('change-username');
    });
    defineProperty_default()(_this, "onSubmit", function (formData) {
      var languageDictionary = _this.props.languageDictionary.get('record').toJS();
      _this.props.changeUsername(_this.props.usernameChange.toJS().user.user_id, formData, languageDictionary);
    });
    return _this;
  }
  inherits_default()(_Class, _Component);
  return createClass_default()(_Class, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.languageDictionary !== this.props.languageDictionary || nextProps.usernameChange !== this.props.usernameChange;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        cancelUsernameChange = _this$props.cancelUsernameChange,
        connections = _this$props.connections,
        settings = _this$props.settings;
      var _this$props$usernameC = this.props.usernameChange.toJS(),
        user = _this$props$usernameC.user,
        connection = _this$props$usernameC.connection,
        error = _this$props$usernameC.error,
        requesting = _this$props$usernameC.requesting,
        loading = _this$props$usernameC.loading;
      if (!requesting) {
        return null;
      }
      var userFields = settings.userFields || [];
      var languageDictionary = this.props.languageDictionary.get('record').toJS();
      var messageFormat = languageDictionary.changeUsernameMessage || 'Do you really want to change the username for {username}?';
      var message = Dialogs_getDialogMessage(messageFormat, 'username', display_getName(user, userFields, languageDictionary));
      var allowedFields = ['username', 'connection'];
      var initialValues = display_mapValues(user, allowedFields, userFields, 'edit', languageDictionary);
      var fields = lodash_default.a.cloneDeep(userFields) || [];
      useDefaultFields_useUsernameField(true, fields, connections.get('records').toJS(), connection, initialValues);
      useDefaultFields_useDisabledConnectionField(true, fields, connection, connections.get('records').toJS());
      var filteredFields = lodash_default.a.filter(fields, function (field) {
        return lodash_default.a.includes(allowedFields, field.property);
      });
      var UserFieldsFormInstance = Users_UserFieldsForm('change-username', this.onSubmit);
      return /*#__PURE__*/react_default.a.createElement(dist["Confirm"], {
        title: languageDictionary.changeUsernameTitle || 'Change Username?',
        show: requesting,
        loading: loading,
        confirmMessage: languageDictionary.dialogConfirmText,
        cancelMessage: languageDictionary.dialogCancelText,
        onCancel: cancelUsernameChange,
        closeLabel: languageDictionary.closeButtonText,
        onConfirm: this.onConfirm
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, error, settings.errorTranslator)
      }), /*#__PURE__*/react_default.a.createElement("p", null, message), /*#__PURE__*/react_default.a.createElement(UserFieldsFormInstance, {
        initialValues: initialValues,
        isEditForm: true,
        fields: filteredFields,
        languageDictionary: languageDictionary
      }));
    }
  }]);
}(react["Component"]), defineProperty_default()(UsernameChangeDialog_Class, "stateToProps", function (state) {
  return {
    usernameChange: state.usernameChange,
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    connections: state.connections,
    languageDictionary: state.languageDictionary
  };
}), defineProperty_default()(UsernameChangeDialog_Class, "actionsToProps", UsernameChangeDialog_objectSpread({
  submitForm: actions_submitForm
}, user_namespaceObject)), defineProperty_default()(UsernameChangeDialog_Class, "propTypes", {
  cancelUsernameChange: react["PropTypes"].func.isRequired,
  changeUsername: react["PropTypes"].func.isRequired,
  connections: react["PropTypes"].object.isRequired,
  usernameChange: react["PropTypes"].object.isRequired
}), UsernameChangeDialog_Class)));
// CONCATENATED MODULE: ./client/containers/Users/Dialogs/index.js












// CONCATENATED MODULE: ./client/selectors/getUserDatabaseConnections.js

var getUserIdentities = function getUserIdentities(state) {
  return state.user.get('record') && state.user.get('record').get('identities');
};
var getUserDatabaseConnections = Object(reselect_lib["createSelector"])([getUserIdentities], function (identities) {
  return identities && identities.filter(function (identity) {
    return identity.get('provider') === 'auth0';
  }).map(function (identity) {
    return identity.get('connection');
  });
});
/* harmony default export */ var selectors_getUserDatabaseConnections = (getUserDatabaseConnections);
// CONCATENATED MODULE: ./client/containers/Users/User.jsx






var User_Class;
function User_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function User_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? User_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : User_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function User_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, User_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function User_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (User_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }












/* harmony default export */ var User = (redux_static_lib_default()((User_Class = /*#__PURE__*/function (_Component) {
  function _Class() {
    classCallCheck_default()(this, _Class);
    return User_callSuper(this, _Class, arguments);
  }
  inherits_default()(_Class, _Component);
  return createClass_default()(_Class, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.props.fetchUser(this.props.params.id);
    }
  }, {
    key: "renderProfile",
    value: function renderProfile(suppressRawData, user, languageDictionary, settings) {
      if (suppressRawData) return null;
      return /*#__PURE__*/react_default.a.createElement(es["g" /* Tab */], {
        eventKey: 4,
        title: languageDictionary.userProfileTabTitle || 'Profile'
      }, /*#__PURE__*/react_default.a.createElement(UserProfile_UserProfile, {
        loading: user.get('loading'),
        user: user.get('record'),
        error: user.get('error'),
        languageDictionary: languageDictionary,
        settings: settings
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
        user = _this$props.user,
        databaseConnections = _this$props.databaseConnections,
        log = _this$props.log,
        logs = _this$props.logs,
        devices = _this$props.devices,
        settings = _this$props.settings,
        languageDictionary = _this$props.languageDictionary;
      var userFields = settings && settings.userFields || [];
      var allowedUserFields = userFields.filter(function (field) {
        return field.property !== 'picture' && field.property !== 'client';
      });
      var suppressRawData = settings && settings.suppressRawData === true;
      var role = this.props.accessLevel.role;
      var originalTitle = settings.dict && settings.dict.title || window.config.TITLE || 'User Management';
      document.title = "".concat(languageDictionary.userTitle || 'User Details', " - ").concat(originalTitle);
      return /*#__PURE__*/react_default.a.createElement("div", {
        className: "user"
      }, /*#__PURE__*/react_default.a.createElement(TabsHeader_TabsHeader, {
        role: role,
        languageDictionary: languageDictionary
      }), /*#__PURE__*/react_default.a.createElement("div", {
        className: "row content-header"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12"
      }, /*#__PURE__*/react_default.a.createElement("h1", {
        className: "pull-left"
      }, languageDictionary.userTitle || 'User Details'), /*#__PURE__*/react_default.a.createElement("div", {
        className: "pull-right"
      }, /*#__PURE__*/react_default.a.createElement(UserActions_UserActions, {
        role: role,
        user: user,
        userFields: allowedUserFields,
        databaseConnections: databaseConnections,
        deleteUser: this.props.requestDeleteUser,
        changeFields: this.props.requestFieldsChange,
        resetPassword: this.props.requestPasswordReset,
        changePassword: this.props.requestPasswordChange,
        removeMfa: this.props.requestRemoveMultiFactor,
        blockUser: this.props.requestBlockUser,
        unblockUser: this.props.requestUnblockUser,
        removeBlockedIPs: this.props.requestRemoveBlockedIPs,
        changeUsername: this.props.requestUsernameChange,
        changeEmail: this.props.requestEmailChange,
        resendVerificationEmail: this.props.requestResendVerificationEmail,
        languageDictionary: languageDictionary
      })))), /*#__PURE__*/react_default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12"
      }, /*#__PURE__*/react_default.a.createElement(UserHeader_UserHeader, {
        loading: user.get('loading'),
        user: user.get('record'),
        error: user.get('error'),
        userFields: allowedUserFields,
        languageDictionary: languageDictionary
      }))), /*#__PURE__*/react_default.a.createElement("div", {
        className: "row user-tabs"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12"
      }, /*#__PURE__*/react_default.a.createElement(es["h" /* Tabs */], {
        defaultActiveKey: 1,
        animation: false,
        id: "user-info-tabs"
      }, /*#__PURE__*/react_default.a.createElement(es["g" /* Tab */], {
        eventKey: 1,
        title: languageDictionary.userUserInfoTabTitle || 'User Information'
      }, /*#__PURE__*/react_default.a.createElement(UserInfo_UserInfo, {
        loading: user.get('loading'),
        user: user.get('record'),
        memberships: user.get('memberships') && user.get('memberships').toJSON(),
        userFields: allowedUserFields,
        error: user.get('error'),
        settings: settings,
        languageDictionary: languageDictionary
      })), /*#__PURE__*/react_default.a.createElement(es["g" /* Tab */], {
        eventKey: 2,
        title: languageDictionary.userDevicesTabTitle || 'Devices'
      }, /*#__PURE__*/react_default.a.createElement(UserDevices_UserDevices, {
        loading: devices.get('loading'),
        devices: devices.get('records'),
        languageDictionary: languageDictionary,
        settings: settings,
        error: devices.get('error')
      })), /*#__PURE__*/react_default.a.createElement(es["g" /* Tab */], {
        eventKey: 3,
        title: languageDictionary.userLogsTabTitle || 'Logs'
      }, /*#__PURE__*/react_default.a.createElement(LogDialog_LogDialog, {
        onClose: this.props.clearLog,
        error: log.get('error'),
        loading: log.get('loading'),
        log: log.get('record'),
        languageDictionary: languageDictionary,
        settings: settings,
        logId: log.get('logId')
      }), /*#__PURE__*/react_default.a.createElement(LogsTable_LogsTable, {
        onOpen: this.props.fetchLog,
        loading: logs.get('loading'),
        logs: logs.get('records'),
        languageDictionary: languageDictionary,
        error: logs.get('error'),
        settings: settings,
        isUserLogs: true
      })), this.renderProfile(suppressRawData, user, languageDictionary, settings)))), /*#__PURE__*/react_default.a.createElement(DeleteDialog, null), /*#__PURE__*/react_default.a.createElement(FieldsChangeDialog, {
        getDictValue: this.props.getDictValue,
        userFields: allowedUserFields,
        errorTranslator: settings.errorTranslator
      }), /*#__PURE__*/react_default.a.createElement(EmailChangeDialog, null), /*#__PURE__*/react_default.a.createElement(PasswordResetDialog, null), /*#__PURE__*/react_default.a.createElement(Dialogs_PasswordChangeDialog, null), /*#__PURE__*/react_default.a.createElement(UsernameChangeDialog, null), /*#__PURE__*/react_default.a.createElement(ResendVerificationEmailDialog, null), /*#__PURE__*/react_default.a.createElement(BlockDialog, null), /*#__PURE__*/react_default.a.createElement(UnblockDialog, null), /*#__PURE__*/react_default.a.createElement(RemoveBlocksDialog, null), /*#__PURE__*/react_default.a.createElement(RemoveMultiFactorDialog, null));
    }
  }]);
}(react["Component"]), defineProperty_default()(User_Class, "stateToProps", function (state) {
  return {
    user: state.user,
    databaseConnections: selectors_getUserDatabaseConnections(state),
    log: state.log,
    logs: state.user.get('logs'),
    devices: state.user.get('devices'),
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    languageDictionary: state.languageDictionary.get('record').toJS() || {}
  };
}), defineProperty_default()(User_Class, "actionsToProps", User_objectSpread(User_objectSpread({}, log_namespaceObject), user_namespaceObject)), defineProperty_default()(User_Class, "propTypes", {
  languageDictionary: react["PropTypes"].object.isRequired,
  accessLevel: react["PropTypes"].object.isRequired,
  settings: react["PropTypes"].object.isRequired,
  user: react["PropTypes"].object,
  log: react["PropTypes"].object,
  logs: react["PropTypes"].object,
  devices: react["PropTypes"].object,
  params: react["PropTypes"].object,
  clearLog: react_default.a.PropTypes.func.isRequired,
  fetchLog: react_default.a.PropTypes.func.isRequired,
  fetchUser: react_default.a.PropTypes.func.isRequired,
  getDictValue: react_default.a.PropTypes.func.isRequired
}), User_Class)));
// EXTERNAL MODULE: ./client/containers/Users/Users.styles.css
var Users_styles = __webpack_require__(1030);

// CONCATENATED MODULE: ./client/containers/Users/Users.jsx






function Users_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function Users_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? Users_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Users_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function Users_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, Users_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function Users_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (Users_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }











var Users_Users = /*#__PURE__*/function (_Component) {
  function Users(props) {
    var _this;
    classCallCheck_default()(this, Users);
    _this = Users_callSuper(this, Users, [props]);
    defineProperty_default()(_this, "componentWillMount", function () {
      if (!_this.props.connectionsLoading) {
        _this.props.fetchConnections();
      }
      // At the time, when this component mounts first, the settings may not be loaded yet.
      // The userFields (from settings) determine the search mode.
      // So, let's defer prefetch until they are loaded.
      if (!_this.props.settingsLoading) {
        _this.prefetchUsers();
      }
    });
    defineProperty_default()(_this, "componentDidUpdate", function (prevProps) {
      if (prevProps.settingsLoading && !_this.props.settingsLoading) {
        _this.prefetchUsers();
      }
    });
    defineProperty_default()(_this, "onPageChange", function (page) {
      _this.props.fetchUsers('', false, page - 1);
    });
    defineProperty_default()(_this, "onSearch", function (query, filterBy, onSuccess) {
      if (query && query.length > 0) {
        _this.setState({
          urlSearchValidationError: null
        });
        _this.updateSearchInUrl(query, filterBy);
        _this.props.fetchUsers(query, false, 0, filterBy, null, onSuccess);
      }
    });
    defineProperty_default()(_this, "onReset", function () {
      _this.setState({
        urlSearchValidationError: null
      });
      _this.updateSearchInUrl('', '');
      _this.props.fetchUsers('', true);
    });
    defineProperty_default()(_this, "getUserFields", function () {
      var _this$props$settings;
      return ((_this$props$settings = _this.props.settings) === null || _this$props$settings === void 0 ? void 0 : _this$props$settings.userFields) || [];
    });
    defineProperty_default()(_this, "prefetchUsers", function () {
      // The concept:
      // - The URL may provide the initial search query and filterBy field, when valid it's used to as the initial search query and filterBy field in the Redux state
      // - As the user updates the search query and filterBy field, the changes first are reflected in the Redux state and the URL just mirrors the changes
      var _this$props = _this.props,
        searchValue = _this$props.searchValue,
        selectedFilter = _this$props.selectedFilter;
      var resolvedFromUrl = _this.readSearchTermsFromUrl();
      if (!resolvedFromUrl.valid) {
        // Keep URL params visible; show validation error; do not search or show stale results.
        _this.setState({
          urlSearchValidationError: resolvedFromUrl.error
        });
        _this.props.clearUsers();
        return;
      }
      if (resolvedFromUrl.search) {
        // Search term is present in the URL, so it takes precedence over the Redux state
        var search = resolvedFromUrl.search,
          filterBy = resolvedFromUrl.filterBy;
        _this.setState({
          urlSearchValidationError: null
        });
        _this.updateSearchInUrl(search, filterBy);
        _this.props.fetchUsers(search, false, 0, filterBy);
      } else if (searchValue) {
        // Search term is present in the Redux state, let's use it and reflect it in the URL
        _this.setState({
          urlSearchValidationError: null
        });
        _this.updateSearchInUrl(searchValue, selectedFilter);
        _this.props.fetchUsers(searchValue, false, 0, selectedFilter);
      } else {
        // No search term is present, let's do the initial fetch without any search terms
        _this.setState({
          urlSearchValidationError: null
        });
        _this.props.fetchUsers();
      }
    });
    defineProperty_default()(_this, "updateSearchInUrl", function (search, filterBy) {
      var trimmedSearch = typeof search === 'string' ? search.trim() : '';
      _this.props.replace({
        pathname: '/users',
        query: Users_objectSpread(Users_objectSpread({}, trimmedSearch ? {
          search: trimmedSearch
        } : {}), filterBy ? {
          filterBy: filterBy
        } : {})
      });
    });
    defineProperty_default()(_this, "createUser", function () {
      _this.props.requestCreateUser(_this.props.accessLevel.get('record').get('memberships') && _this.props.accessLevel.get('record').get('memberships').toJS());
    });
    defineProperty_default()(_this, "onColumnSort", function (sort) {
      _this.props.fetchUsers('', false, 0, null, sort);
    });
    _this.state = {
      showCreateForm: false,
      urlSearchValidationError: null
    };
    return _this;
  }
  inherits_default()(Users, _Component);
  return createClass_default()(Users, [{
    key: "readSearchTermsFromUrl",
    value: function readSearchTermsFromUrl() {
      var _this$props$location;
      var _ref = ((_this$props$location = this.props.location) === null || _this$props$location === void 0 ? void 0 : _this$props$location.query) || {},
        search = _ref.search,
        filterBy = _ref.filterBy;
      var userFields = this.getUserFields();
      var trimmedSearch = typeof search === 'string' ? search.trim() : '';

      // This is a subtle security consideration.
      //
      // The Auth0 Management API is the authoritative source for validating the query syntax,
      // so we rely on it to validate the query syntax and show the user the error message if any.
      //
      // Previously, search queries could only originate from the application's interactive search
      // input. While malformed or intentionally malicious queries were still possible, they however
      // required a deliberate user action within the application (and could not be injected externally),
      // which used to lower the risk of exploitation due to the user's awareness.
      //
      // Introducing support for supplying the search query via the URL changes the trust boundary.
      // URL parameters are untrusted input and may be crafted or manipulated by a malicious actor
      // (e.g. through a shared or embedded link), allowing invalid or malicious queries to reach
      // the API without any deliberate user input/awareness.
      //
      // To reduce this attack surface, the client-side performs proactive validation before sending
      // the query to the backend. This acts as an additional defensive layer while the backend (with the
      // underlying Auth0 Management API) remains the ultimate authority for query validation.
      //
      var filterableFields = getFilterableUserFields(userFields);
      // Two search modes: filterable userFields => plain field value + filterBy dropdown;
      // otherwise free-text must be valid Lucene (see LuceneSearchBar vs auth0-extension-ui SearchBar).
      if (filterableFields.length > 0) {
        var validFieldName = filterableFields.some(function (field) {
          return field.filterBy === filterBy;
        });
        if (trimmedSearch && !filterBy) {
          return {
            valid: false,
            error: 'Filter field is required when search term is present in the URL',
            search: trimmedSearch,
            filterBy: filterBy
          };
        }
        if (filterBy && !validFieldName) {
          return {
            valid: false,
            error: 'Unsupported filter field in the URL "' + filterBy + '"',
            search: trimmedSearch,
            filterBy: filterBy
          };
        }
        return {
          valid: true,
          search: trimmedSearch,
          filterBy: validFieldName ? filterBy : ''
        };
      }
      // now we expect a Lucene query only (no filterBy)

      if (!trimmedSearch) {
        return {
          valid: true,
          search: '',
          filterBy: ''
        };
      }
      var luceneResult = validateLuceneQuery(trimmedSearch);
      if (!luceneResult.valid) {
        return {
          valid: false,
          error: luceneResult.error,
          search: trimmedSearch,
          filterBy: ''
        };
      }
      return {
        valid: true,
        search: trimmedSearch,
        filterBy: ''
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
        loading = _this$props2.loading,
        error = _this$props2.error,
        users = _this$props2.users,
        total = _this$props2.total,
        connectionsLoading = _this$props2.connectionsLoading,
        accessLevel = _this$props2.accessLevel,
        nextPage = _this$props2.nextPage,
        pages = _this$props2.pages,
        settings = _this$props2.settings,
        sortProperty = _this$props2.sortProperty,
        sortOrder = _this$props2.sortOrder,
        searchValue = _this$props2.searchValue,
        selectedFilter = _this$props2.selectedFilter,
        languageDictionary = _this$props2.languageDictionary,
        settingsLoading = _this$props2.settingsLoading;
      var urlSearchValidationError = this.state.urlSearchValidationError;
      var userFields = this.getUserFields();
      var showCreateUser = settings.canCreateUser !== undefined ? settings.canCreateUser : true;
      var role = accessLevel.get('record').get('role');
      var originalTitle = settings.dict && settings.dict.title || window.config.TITLE || 'User Management';
      document.title = "".concat(languageDictionary.userUsersTabTitle || 'Users', " - ").concat(originalTitle);
      return /*#__PURE__*/react_default.a.createElement("div", {
        className: "users"
      }, /*#__PURE__*/react_default.a.createElement(TabsHeader_TabsHeader, {
        languageDictionary: languageDictionary,
        role: role
      }), /*#__PURE__*/react_default.a.createElement("div", {
        className: "row content-header"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12 user-table-content"
      }, /*#__PURE__*/react_default.a.createElement("h1", null, languageDictionary.usersTitle || 'Users'), !connectionsLoading && role > 0 && showCreateUser ? /*#__PURE__*/react_default.a.createElement("button", {
        id: "create-user-button",
        className: "btn btn-success pull-right new",
        onClick: this.createUser
      }, /*#__PURE__*/react_default.a.createElement("i", {
        className: "icon-budicon-473"
      }), languageDictionary.createUserButtonText || 'Create User') : '')), /*#__PURE__*/react_default.a.createElement(CreateDialog, {
        getDictValue: this.props.getDictValue,
        userFields: userFields,
        errorTranslator: settings && settings.errorTranslator
      }), !settingsLoading ? /*#__PURE__*/react_default.a.createElement(UserOverview_UserOverview, {
        onReset: this.onReset,
        onSearch: this.onSearch,
        onPageChange: this.onPageChange,
        error: urlSearchValidationError ? {
          searchValidation: true,
          message: urlSearchValidationError
        } : error,
        users: users,
        total: total,
        nextPage: nextPage,
        pages: pages,
        loading: loading,
        role: accessLevel.role,
        userFields: userFields,
        sortProperty: sortProperty,
        sortOrder: sortOrder,
        searchValue: searchValue,
        selectedFilter: selectedFilter,
        onColumnSort: this.onColumnSort,
        settings: settings,
        languageDictionary: languageDictionary
      }) : /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: true
      }, /*#__PURE__*/react_default.a.createElement("div", null)), /*#__PURE__*/react_default.a.createElement("div", {
        className: "row"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12"
      }, pages > 1 ? /*#__PURE__*/react_default.a.createElement(dist["Pagination"], {
        totalItems: total,
        handlePageChange: this.onPageChange,
        perPage: 10,
        textFormat: languageDictionary.paginationTextFormat
      }) : /*#__PURE__*/react_default.a.createElement(dist["TableTotals"], {
        currentCount: users.length,
        totalCount: total,
        textFormat: languageDictionary.tableTotalsTextFormat
      }))));
    }
  }]);
}(react["Component"]);
defineProperty_default()(Users_Users, "propTypes", {
  loading: prop_types_default.a.bool.isRequired,
  connectionsLoading: prop_types_default.a.bool.isRequired,
  error: prop_types_default.a.string,
  users: prop_types_default.a.array,
  connections: prop_types_default.a.array,
  userCreateError: prop_types_default.a.string,
  userCreateLoading: prop_types_default.a.bool,
  validationErrors: prop_types_default.a.object,
  accessLevel: prop_types_default.a.object,
  total: prop_types_default.a.number,
  fetchUsers: prop_types_default.a.func.isRequired,
  clearUsers: prop_types_default.a.func.isRequired,
  getDictValue: prop_types_default.a.func.isRequired,
  createUser: prop_types_default.a.func.isRequired,
  fetchConnections: prop_types_default.a.func.isRequired,
  requestCreateUser: prop_types_default.a.func.isRequired,
  replace: prop_types_default.a.func.isRequired,
  location: prop_types_default.a.object.isRequired,
  settings: prop_types_default.a.object.isRequired,
  settingsLoading: prop_types_default.a.bool.isRequired,
  sortOrder: prop_types_default.a.number.isRequired,
  sortProperty: prop_types_default.a.string.isRequired,
  searchValue: prop_types_default.a.string,
  selectedFilter: prop_types_default.a.string,
  languageDictionary: prop_types_default.a.object.isRequired
});
function Users_mapStateToProps(state) {
  return {
    accessLevel: state.accessLevel,
    error: state.users.get('error'),
    userCreateError: state.userCreate.get('error'),
    userCreateLoading: state.userCreate.get('loading'),
    validationErrors: state.userCreate.get('validationErrors'),
    loading: state.users.get('loading'),
    users: state.users.get('records').toJS(),
    connections: state.connections.get('records').toJS(),
    connectionsLoading: state.connections.get('loading'),
    total: state.users.get('total'),
    nextPage: state.users.get('nextPage'),
    pages: state.users.get('pages'),
    sortProperty: state.users.get('sortProperty'),
    sortOrder: state.users.get('sortOrder'),
    searchValue: state.users.get('searchValue'),
    selectedFilter: state.users.get('selectedFilter'),
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    settingsLoading: state.settings.get('loading'),
    languageDictionary: state.languageDictionary.get('record').toJS()
  };
}
var UsersContainer = Object(react_redux_lib["connect"])(Users_mapStateToProps, Users_objectSpread(Users_objectSpread(Users_objectSpread({}, connection_namespaceObject), user_namespaceObject), {}, {
  replace: react_router_redux_lib["replace"]
}))(Users_Users);
/* harmony default export */ var containers_Users_Users = (UsersContainer);
// EXTERNAL MODULE: ./node_modules/react-codemirror/lib/Codemirror.js
var Codemirror = __webpack_require__(557);
var Codemirror_default = /*#__PURE__*/__webpack_require__.n(Codemirror);

// EXTERNAL MODULE: ./node_modules/codemirror/lib/codemirror.js
var codemirror = __webpack_require__(137);

// EXTERNAL MODULE: ./node_modules/codemirror/mode/javascript/javascript.js
var javascript = __webpack_require__(1032);

// EXTERNAL MODULE: ./node_modules/codemirror/addon/lint/lint.js
var lint = __webpack_require__(1033);

// EXTERNAL MODULE: ./node_modules/codemirror/addon/lint/lint.css
var lint_lint = __webpack_require__(1034);

// EXTERNAL MODULE: ./node_modules/codemirror/addon/lint/javascript-lint.js
var javascript_lint = __webpack_require__(1035);

// EXTERNAL MODULE: ./node_modules/codemirror/addon/lint/json-lint.js
var json_lint = __webpack_require__(1036);

// EXTERNAL MODULE: ./node_modules/codemirror/addon/hint/show-hint.css
var show_hint = __webpack_require__(1037);

// EXTERNAL MODULE: ./client/components/Editor/editor.css
var editor = __webpack_require__(1038);

// CONCATENATED MODULE: ./client/components/Editor/index.jsx






function Editor_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, Editor_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function Editor_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (Editor_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }










var Editor_Editor = /*#__PURE__*/function (_Component) {
  function Editor(props) {
    var _this;
    classCallCheck_default()(this, Editor);
    _this = Editor_callSuper(this, Editor, [props]);
    defineProperty_default()(_this, "onChange", function (code) {
      _this.setState({
        value: code
      });
      if (_this.props.onChange) {
        _this.props.onChange(code);
      }
    });
    _this.state = {
      value: props.value || ''
    };
    return _this;
  }
  inherits_default()(Editor, _Component);
  return createClass_default()(Editor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var editor = this.refs.editor; // eslint-disable-line react/no-string-refs
      editor.getCodeMirror().refresh();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.value !== nextProps.value) {
        this.setState({
          value: nextProps.value
        });
        var editor = this.refs.editor; // eslint-disable-line react/no-string-refs
        if (editor) {
          editor.getCodeMirror().setValue(nextProps.value);
        }
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var editor = this.refs.editor; // eslint-disable-line react/no-string-refs
      editor.getCodeMirror().refresh();
    }
  }, {
    key: "render",
    value: function render() {
      var options = this.props.options;
      return /*#__PURE__*/react_default.a.createElement(Codemirror_default.a, {
        ref: "editor" // eslint-disable-line react/no-string-refs
        ,
        value: this.state.value || '',
        onChange: this.onChange,
        options: options
      });
    }
  }]);
}(react["Component"]);
defineProperty_default()(Editor_Editor, "propTypes", {
  value: react["PropTypes"].string.isRequired,
  options: react["PropTypes"].object.isRequired,
  onChange: react["PropTypes"].func
});
defineProperty_default()(Editor_Editor, "defaultProps", {
  value: '',
  options: {
    mode: 'javascript',
    lineWrapping: true,
    continueComments: 'Enter',
    matchBrackets: true,
    styleActiveLine: true,
    closeBrackets: true,
    indentUnit: 2,
    smartIndent: true,
    autofocus: true,
    tabSize: 2,
    lint: {
      options: {
        sub: true,
        noarg: true,
        undef: true,
        eqeqeq: true,
        laxcomma: true,
        '-W025': true,
        predef: ['module', 'require']
      }
    }
  }
});

// EXTERNAL MODULE: ./client/containers/Configuration/Configuration.css
var Configuration = __webpack_require__(1039);

// CONCATENATED MODULE: ./client/containers/Configuration/Configuration.jsx






var Configuration_Class;
function Configuration_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function Configuration_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? Configuration_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : Configuration_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function Configuration_callSuper(t, o, e) { return o = getPrototypeOf_default()(o), possibleConstructorReturn_default()(t, Configuration_isNativeReflectConstruct() ? Reflect.construct(o, e || [], getPrototypeOf_default()(t).constructor) : o.apply(t, e)); }
function Configuration_isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (Configuration_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }








/* harmony default export */ var Configuration_Configuration = (redux_static_lib_default()((Configuration_Class = /*#__PURE__*/function (_Component) {
  function _Class(props) {
    var _this;
    classCallCheck_default()(this, _Class);
    _this = Configuration_callSuper(this, _Class, [props]);
    defineProperty_default()(_this, "componentWillMount", function () {
      _this.props.fetchScript('access');
      _this.props.fetchScript('filter');
      _this.props.fetchScript('create');
      _this.props.fetchScript('memberships');
      _this.props.fetchScript('settings');
      _this.props.fetchScript('customDomain');
    });
    defineProperty_default()(_this, "saveScript", function (name) {
      return function () {
        _this.props.updateScript(name, _this.state.code[name]);
      };
    });
    defineProperty_default()(_this, "onEditorChanged", function (name) {
      return function (value) {
        var code = _this.state.code;
        code[name] = value;
        _this.setState({
          code: code
        });
      };
    });
    _this.state = {
      activeTab: 1,
      code: {}
    };
    return _this;
  }
  inherits_default()(_Class, _Component);
  return createClass_default()(_Class, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return this.props.scripts !== nextProps.scripts;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.scripts) {
        var code = this.state.code;
        var scripts = nextProps.scripts.toJS();
        Object.keys(scripts).forEach(function (scriptName) {
          if (!code[scriptName]) {
            code[scriptName] = scripts[scriptName].script;
          }
        });
        this.setState({
          code: code
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var code = this.state.code;
      var scripts = this.props.scripts.toJS();
      var _this$props = this.props,
        languageDictionary = _this$props.languageDictionary,
        settings = _this$props.settings;
      var originalTitle = settings.dict && settings.dict.title || window.config.TITLE || 'User Management';
      document.title = "".concat(languageDictionary.configurationMenuItemText || 'Configuration', " - ").concat(originalTitle);
      return /*#__PURE__*/react_default.a.createElement("div", {
        className: "configuration"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "row content-header"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12 user-table-content"
      }, /*#__PURE__*/react_default.a.createElement("h2", null, "Configuration"), /*#__PURE__*/react_default.a.createElement("p", null, "This configuration page allows you to fine tune the behavior of the Delegated Administration dashboard. More information and examples of hooks are available ", /*#__PURE__*/react_default.a.createElement("a", {
        href: "https://auth0.com/docs/extensions/delegated-admin"
      }, "on the documentation page"), "."))), /*#__PURE__*/react_default.a.createElement("div", {
        className: "row configuration-tabs"
      }, /*#__PURE__*/react_default.a.createElement("div", {
        className: "col-xs-12"
      }, /*#__PURE__*/react_default.a.createElement(es["h" /* Tabs */], {
        defaultActiveKey: this.state.activeTab,
        animation: false,
        id: "configuration-tabs"
      }, /*#__PURE__*/react_default.a.createElement(es["g" /* Tab */], {
        eventKey: 1,
        title: code.filter && code.filter.length ? /*#__PURE__*/react_default.a.createElement("span", null, "Filter Hook") : /*#__PURE__*/react_default.a.createElement("i", null, "Filter Hook")
      }, /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: scripts.filter && scripts.filter.loading,
        animationStyle: {
          paddingTop: '5px',
          paddingBottom: '5px'
        }
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, scripts.filter && scripts.filter.error)
      }), /*#__PURE__*/react_default.a.createElement("p", null, "The ", /*#__PURE__*/react_default.a.createElement("strong", null, "filter hook"), " allows you to specify which records are shown to the current users when loading the list of users or searching. For example: ", /*#__PURE__*/react_default.a.createElement("i", null, "Only show users from my department"), ". This has to be defined using the lucene syntax."), /*#__PURE__*/react_default.a.createElement(Editor_Editor, {
        value: code.filter || '',
        onChange: this.onEditorChanged('filter')
      }), /*#__PURE__*/react_default.a.createElement("div", {
        className: "save-config"
      }, /*#__PURE__*/react_default.a.createElement("button", {
        onClick: this.saveScript('filter'),
        className: "btn btn-success"
      }, "Save Filter Hook")))), /*#__PURE__*/react_default.a.createElement(es["g" /* Tab */], {
        eventKey: 2,
        title: code.access && code.access.length ? /*#__PURE__*/react_default.a.createElement("span", null, "Access Hook") : /*#__PURE__*/react_default.a.createElement("i", null, "Access Hook")
      }, /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: scripts.access && scripts.access.loading,
        animationStyle: {
          paddingTop: '5px',
          paddingBottom: '5px'
        }
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, scripts.access && scripts.access.error)
      }), /*#__PURE__*/react_default.a.createElement("p", null, "The ", /*#__PURE__*/react_default.a.createElement("strong", null, "access hook"), " will allow you to specify if the current user is allowed to access a specific user (eg: view the details, delete the user, ...)."), /*#__PURE__*/react_default.a.createElement(Editor_Editor, {
        value: code.access || '',
        onChange: this.onEditorChanged('access')
      }), /*#__PURE__*/react_default.a.createElement("div", {
        className: "save-config"
      }, /*#__PURE__*/react_default.a.createElement("button", {
        onClick: this.saveScript('access'),
        className: "btn btn-success"
      }, "Save Access Hook")))), /*#__PURE__*/react_default.a.createElement(es["g" /* Tab */], {
        eventKey: 3,
        title: code.create && code.create.length ? /*#__PURE__*/react_default.a.createElement("span", null, "Write Hook") : /*#__PURE__*/react_default.a.createElement("i", null, "Write Hook")
      }, /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: scripts.create && scripts.create.loading,
        animationStyle: {
          paddingTop: '5px',
          paddingBottom: '5px'
        }
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, scripts.create && scripts.create.error)
      }), /*#__PURE__*/react_default.a.createElement("p", null, "The ", /*#__PURE__*/react_default.a.createElement("strong", null, "write hook"), " will run every time a new user is created. This hook will allow you to shape the user object before it's sent to Auth0. The context object contains the request (with the current user) and the payload sent by the end user."), /*#__PURE__*/react_default.a.createElement(Editor_Editor, {
        value: code.create || '',
        onChange: this.onEditorChanged('create')
      }), /*#__PURE__*/react_default.a.createElement("div", {
        className: "save-config"
      }, /*#__PURE__*/react_default.a.createElement("button", {
        onClick: this.saveScript('create'),
        className: "btn btn-success"
      }, "Save Write Hook")))), /*#__PURE__*/react_default.a.createElement(es["g" /* Tab */], {
        eventKey: 4,
        title: code.memberships && code.memberships.length ? /*#__PURE__*/react_default.a.createElement("span", null, "Memberships Hook") : /*#__PURE__*/react_default.a.createElement("i", null, "Memberships Hook")
      }, /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: scripts.memberships && scripts.memberships.loading,
        animationStyle: {
          paddingTop: '5px',
          paddingBottom: '5px'
        }
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, scripts.memberships && scripts.memberships.error)
      }), /*#__PURE__*/react_default.a.createElement("p", null, "With the ", /*#__PURE__*/react_default.a.createElement("strong", null, "membership query"), " you can specify in which groups the current user can create new users. Only in their own department? Or other departments also?"), /*#__PURE__*/react_default.a.createElement(Editor_Editor, {
        value: code.memberships || '',
        onChange: this.onEditorChanged('memberships')
      }), /*#__PURE__*/react_default.a.createElement("div", {
        className: "save-config"
      }, /*#__PURE__*/react_default.a.createElement("button", {
        onClick: this.saveScript('memberships'),
        className: "btn btn-success"
      }, "Save Memberships Query")))), /*#__PURE__*/react_default.a.createElement(es["g" /* Tab */], {
        eventKey: 5,
        title: code.settings && code.settings.length ? /*#__PURE__*/react_default.a.createElement("span", null, "Settings Query") : /*#__PURE__*/react_default.a.createElement("i", null, "Settings Query")
      }, /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: scripts.settings && scripts.settings.loading,
        animationStyle: {
          paddingTop: '5px',
          paddingBottom: '5px'
        }
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, scripts.settings && scripts.settings.error)
      }), /*#__PURE__*/react_default.a.createElement("p", null, "With the ", /*#__PURE__*/react_default.a.createElement("strong", null, "settings query"), " you can control the title and the look-and-feel of the dashboard after the user has logged in?"), /*#__PURE__*/react_default.a.createElement(Editor_Editor, {
        value: code.settings || '',
        onChange: this.onEditorChanged('settings')
      }), /*#__PURE__*/react_default.a.createElement("div", {
        className: "save-config"
      }, /*#__PURE__*/react_default.a.createElement("button", {
        onClick: this.saveScript('settings'),
        className: "btn btn-success"
      }, "Save Settings Query")))), /*#__PURE__*/react_default.a.createElement(es["g" /* Tab */], {
        eventKey: 6,
        title: code.customDomain && code.customDomain.length ? /*#__PURE__*/react_default.a.createElement("span", null, "Custom Domain Hook") : /*#__PURE__*/react_default.a.createElement("i", null, "Custom Domain Hook")
      }, /*#__PURE__*/react_default.a.createElement(dist["LoadingPanel"], {
        show: scripts.customDomain && scripts.customDomain.loading,
        animationStyle: {
          paddingTop: '5px',
          paddingBottom: '5px'
        }
      }, /*#__PURE__*/react_default.a.createElement(dist["Error"], {
        title: languageDictionary.errorTitle,
        message: getErrorMessage(languageDictionary, scripts.customDomain && scripts.customDomain.error)
      }), /*#__PURE__*/react_default.a.createElement("p", null, "The ", /*#__PURE__*/react_default.a.createElement("strong", null, "Custom Domain Selection hook"), " allows you to specify which Auth0 custom domain should be used for user-facing operations like password resets and email verifications."), /*#__PURE__*/react_default.a.createElement(Editor_Editor, {
        value: code.customDomain || '',
        onChange: this.onEditorChanged('customDomain')
      }), /*#__PURE__*/react_default.a.createElement("div", {
        className: "save-config"
      }, /*#__PURE__*/react_default.a.createElement("button", {
        onClick: this.saveScript('customDomain'),
        className: "btn btn-success"
      }, "Save Custom Domain Hook"))))))));
    }
  }]);
}(react["Component"]), defineProperty_default()(Configuration_Class, "stateToProps", function (state) {
  return {
    scripts: state.scripts,
    settings: state.settings.get('record') && state.settings.get('record').toJS().settings || {},
    languageDictionary: state.languageDictionary && state.languageDictionary.get('record').toJS()
  };
}), defineProperty_default()(Configuration_Class, "actionsToProps", Configuration_objectSpread({}, script_namespaceObject)), defineProperty_default()(Configuration_Class, "propTypes", {
  scripts: react["PropTypes"].object.isRequired,
  settings: react["PropTypes"].object.isRequired,
  fetchScript: react["PropTypes"].func.isRequired,
  updateScript: react["PropTypes"].func.isRequired,
  languageDictionary: react["PropTypes"].object
}), defineProperty_default()(Configuration_Class, "defaultProps", {
  languageDictionary: {}
}), Configuration_Class)));
// CONCATENATED MODULE: ./client/containers/index.js







// CONCATENATED MODULE: ./client/routes.jsx



/* harmony default export */ var routes = (function (history) {
  return /*#__PURE__*/react_default.a.createElement(react_router_lib["Router"], {
    history: history
  }, /*#__PURE__*/react_default.a.createElement(react_router_lib["Route"], {
    path: "/",
    component: RequireAuthentication(containers_App)
  }, /*#__PURE__*/react_default.a.createElement(react_router_lib["IndexRedirect"], {
    to: "/users"
  }), /*#__PURE__*/react_default.a.createElement(react_router_lib["Route"], {
    path: "logs",
    component: Logs
  }), /*#__PURE__*/react_default.a.createElement(react_router_lib["Route"], {
    path: "configuration",
    component: Configuration_Configuration
  }), /*#__PURE__*/react_default.a.createElement(react_router_lib["Route"], {
    path: "users",
    component: containers_Users_Users
  }), /*#__PURE__*/react_default.a.createElement(react_router_lib["Route"], {
    path: "users/:id",
    component: User
  })), /*#__PURE__*/react_default.a.createElement(react_router_lib["Route"], {
    path: "/login",
    component: Login
  }));
});
// EXTERNAL MODULE: ./node_modules/redux-logger/lib/index.js
var redux_logger_lib = __webpack_require__(558);
var redux_logger_lib_default = /*#__PURE__*/__webpack_require__.n(redux_logger_lib);

// EXTERNAL MODULE: ./node_modules/redux-thunk/lib/index.js
var redux_thunk_lib = __webpack_require__(559);
var redux_thunk_lib_default = /*#__PURE__*/__webpack_require__.n(redux_thunk_lib);

// EXTERNAL MODULE: ./node_modules/redux-promise-middleware/dist/es/index.js + 1 modules
var dist_es = __webpack_require__(561);

// EXTERNAL MODULE: ./node_modules/redux/es/index.js + 6 modules
var redux_es = __webpack_require__(38);

// CONCATENATED MODULE: ./client/reducers/accessLevel.js

function accessLevel_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function accessLevel_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? accessLevel_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : accessLevel_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var accessLevel_initialState = {
  loading: false,
  error: null,
  record: Object(immutable_es["d" /* fromJS */])({
    role: 0,
    memberships: [],
    createMemberships: false
  })
};
var accessLevel_accessLevel = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(accessLevel_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["G" /* FETCH_ACCESS_LEVEL_PENDING */], function (state) {
  return state.merge({
    loading: true,
    error: null
  });
}), constants["H" /* FETCH_ACCESS_LEVEL_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData,
    record: Object(immutable_es["d" /* fromJS */])(accessLevel_objectSpread(accessLevel_objectSpread({}, accessLevel_initialState.record.toJS()), {}, {
      role: 2
    }))
  });
}), constants["F" /* FETCH_ACCESS_LEVEL_FULFILLED */], function (state, action) {
  return state.merge({
    loading: false,
    error: null,
    record: Object(immutable_es["d" /* fromJS */])(action.payload.data)
  });
}));
// CONCATENATED MODULE: ./client/reducers/applications.js




var applications_initialState = {
  loading: false,
  error: null,
  records: Object(immutable_es["d" /* fromJS */])([])
};
var applications = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(applications_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["K" /* FETCH_APPLICATIONS_PENDING */], function (state) {
  return state.merge({
    loading: true,
    error: null
  });
}), constants["L" /* FETCH_APPLICATIONS_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["J" /* FETCH_APPLICATIONS_FULFILLED */], function (state, action) {
  return state.merge({
    loading: false,
    error: null,
    records: Object(immutable_es["d" /* fromJS */])(action.payload.data)
  });
}));
// CONCATENATED MODULE: ./client/reducers/auth.js

function auth_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function auth_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? auth_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : auth_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var auth_initialState = {
  error: null,
  isAuthenticated: false,
  isAuthenticating: false,
  issuer: null,
  token: null,
  decodedToken: null,
  user: null
};
var auth_auth = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(auth_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["Hb" /* LOGIN_PENDING */], function (state) {
  return state.merge(auth_objectSpread(auth_objectSpread({}, auth_initialState), {}, {
    isAuthenticating: true
  }));
}), constants["Gb" /* LOGIN_FAILED */], function (state, action) {
  return state.merge({
    isAuthenticating: false,
    error: action.payload && action.payload.error || 'Unknown Error'
  });
}), constants["Ib" /* LOGIN_SUCCESS */], function (state, action) {
  return state.merge({
    isAuthenticated: true,
    isAuthenticating: false,
    user: Object(immutable_es["d" /* fromJS */])(action.payload.user),
    token: action.payload.token,
    decodedToken: action.payload.decodedToken,
    issuer: new URL(action.payload.decodedToken.iss).hostname,
    returnTo: action.payload.returnTo
  });
}), constants["Kb" /* LOGOUT_SUCCESS */], function (state) {
  return state.merge({
    user: null,
    token: null,
    decodedToken: null,
    isAuthenticated: false
  });
}));
// CONCATENATED MODULE: ./client/reducers/block.js

function block_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function block_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? block_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : block_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var block_initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null
};
var block = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(block_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["bc" /* REQUEST_BLOCK_USER */], function (state, action) {
  return state.merge({
    user: Object(immutable_es["d" /* fromJS */])(action.user),
    requesting: true
  });
}), constants["e" /* CANCEL_BLOCK_USER */], function (state) {
  return state.merge(block_objectSpread({}, block_initialState));
}), constants["c" /* BLOCK_USER_PENDING */], function (state) {
  return state.merge({
    loading: true
  });
}), constants["d" /* BLOCK_USER_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["b" /* BLOCK_USER_FULFILLED */], function (state) {
  return state.merge(block_objectSpread({}, block_initialState));
}));
// CONCATENATED MODULE: ./client/reducers/connections.js




var connections_initialState = {
  loading: false,
  error: null,
  records: Object(immutable_es["d" /* fromJS */])([])
};
var connections_connections = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(connections_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["O" /* FETCH_CONNECTIONS_PENDING */], function (state) {
  return state.merge({
    loading: true,
    error: null
  });
}), constants["P" /* FETCH_CONNECTIONS_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["N" /* FETCH_CONNECTIONS_FULFILLED */], function (state, action) {
  return state.merge({
    loading: false,
    error: null,
    records: Object(immutable_es["d" /* fromJS */])(action.payload.data)
  });
}));
// CONCATENATED MODULE: ./client/reducers/emailChange.js

function emailChange_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function emailChange_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? emailChange_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : emailChange_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var emailChange_initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null,
  connection: null
};
var emailChange = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(emailChange_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["ec" /* REQUEST_EMAIL_CHANGE */], function (state, action) {
  return state.merge(emailChange_objectSpread(emailChange_objectSpread({}, emailChange_initialState), {}, {
    user: action.user,
    connection: action.connection,
    requesting: true
  }));
}), constants["h" /* CANCEL_EMAIL_CHANGE */], function (state) {
  return state.merge(emailChange_objectSpread({}, emailChange_initialState));
}), constants["C" /* EMAIL_CHANGE_PENDING */], function (state, action) {
  return state.merge({
    loading: true,
    user: action.meta.user
  });
}), constants["D" /* EMAIL_CHANGE_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["B" /* EMAIL_CHANGE_FULFILLED */], function (state) {
  return state.merge(emailChange_objectSpread({}, emailChange_initialState));
}));
// CONCATENATED MODULE: ./client/reducers/languageDictionary.js

function languageDictionary_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function languageDictionary_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? languageDictionary_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : languageDictionary_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var languageDictionary_initialState = {
  loading: false,
  error: null,
  record: Object(immutable_es["d" /* fromJS */])({})
};
var languageDictionary_languageDictionary = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(languageDictionary_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["S" /* FETCH_LANGUAGE_DICTIONARY_PENDING */], function (state) {
  return state.merge(languageDictionary_objectSpread(languageDictionary_objectSpread({}, languageDictionary_initialState), {}, {
    loading: true,
    error: null
  }));
}), constants["T" /* FETCH_LANGUAGE_DICTIONARY_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["R" /* FETCH_LANGUAGE_DICTIONARY_FULFILLED */], function (state, action) {
  var data = action.payload.data;
  return state.merge({
    loading: false,
    error: null,
    record: Object(immutable_es["d" /* fromJS */])(data)
  });
}));
// CONCATENATED MODULE: ./client/utils/logTypes.js
/* harmony default export */ var logTypes = ({
  s: {
    event: 'Success Login',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  ssa: {
    event: 'Success Silent Auth',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  seacft: {
    event: 'Success Exchange',
    description: 'Authorization Code for Access Token',
    icon: {
      name: '456',
      color: 'green'
    }
  },
  feacft: {
    event: 'Failed Exchange',
    description: 'Authorization Code for Access Token',
    icon: {
      name: '456',
      color: '#A93F3F'
    }
  },
  f: {
    event: 'Failed Login',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  fsa: {
    event: 'Failed Silent Auth',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  w: {
    event: 'Warnings During Login',
    icon: {
      name: '354',
      color: '#FFA500'
    }
  },
  du: {
    event: 'Deleted User',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  fu: {
    event: 'Failed Login (invalid email/username)',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  fp: {
    event: 'Failed Login (wrong password)',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  fc: {
    event: 'Failed by Connector',
    icon: {
      name: '313',
      color: '#A93F3F'
    }
  },
  fco: {
    event: 'Failed by CORS',
    icon: {
      name: '313',
      color: '#A93F3F'
    }
  },
  con: {
    event: 'Connector Online',
    icon: {
      name: '143',
      color: 'green'
    }
  },
  coff: {
    event: 'Connector Offline',
    icon: {
      name: '143',
      color: '#A93F3F'
    }
  },
  fcpro: {
    event: 'Failed Connector Provisioning',
    icon: {
      name: '143',
      color: '#A93F3F'
    }
  },
  ss: {
    event: 'Success Signup',
    icon: {
      name: '314',
      color: 'green'
    }
  },
  fs: {
    event: 'Failed Signup',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  cs: {
    event: 'Code Sent',
    icon: {
      name: '243',
      color: 'green'
    }
  },
  cls: {
    event: 'Code/Link Sent',
    icon: {
      name: '781',
      color: 'green'
    }
  },
  sv: {
    event: 'Success Verification Email',
    icon: {
      name: '781',
      color: 'green'
    }
  },
  fv: {
    event: 'Failed Verification Email',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  scp: {
    event: 'Success Change Password',
    icon: {
      name: '280',
      color: 'green'
    }
  },
  fcp: {
    event: 'Failed Change Password',
    icon: {
      name: '266',
      color: '#A93F3F'
    }
  },
  sce: {
    event: 'Success Change Email',
    icon: {
      name: '266',
      color: 'green'
    }
  },
  fce: {
    event: 'Failed Change Email',
    icon: {
      name: '266',
      color: '#A93F3F'
    }
  },
  scu: {
    event: 'Success Change Username',
    icon: {
      name: '266',
      color: 'green'
    }
  },
  fcu: {
    event: 'Failed Change Username',
    icon: {
      name: '266',
      color: '#A93F3F'
    }
  },
  scpn: {
    event: 'Success Change Phone Number',
    icon: {
      name: '266',
      color: 'green'
    }
  },
  fcpn: {
    event: 'Failed Change Phone Number',
    icon: {
      name: '266',
      color: '#A93F3F'
    }
  },
  svr: {
    event: 'Success Verification Email Request',
    icon: {
      name: '781',
      color: 'green'
    }
  },
  fvr: {
    event: 'Failed Verification Email Request',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  scpr: {
    event: 'Success Change Password Request',
    icon: {
      name: '280',
      color: 'green'
    }
  },
  fcpr: {
    event: 'Failed Change Password Request',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  fn: {
    event: 'Failed Sending Notification',
    icon: {
      name: '782',
      color: '#A93F3F'
    }
  },
  sapi: {
    event: 'API Operation',
    icon: {
      name: '546',
      color: 'green'
    },
    category: 'api'
  },
  fapi: {
    event: 'Failed API Operation',
    icon: {
      name: '546',
      color: '#A93F3F'
    },
    category: 'api'
  },
  limit_wc: {
    event: 'Blocked Account',
    icon: {
      name: '313',
      color: '#A93F3F'
    }
  },
  limit_ui: {
    event: 'Too Many Calls to /userinfo',
    icon: {
      name: '313',
      color: '#A93F3F'
    }
  },
  api_limit: {
    event: 'Rate Limit On API',
    icon: {
      name: '313',
      color: '#A93F3F'
    }
  },
  sdu: {
    event: 'Successful User Deletion',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  fdu: {
    event: 'Failed User Deletion',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  seccft: {
    event: 'Success Exchange (Client Credentials)',
    icon: {
      name: '546',
      color: 'green'
    }
  },
  feccft: {
    event: 'Failed Exchange (Client Credentials)',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  limit_mu: {
    event: 'Blocked IP Address',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  slo: {
    event: 'Success Logout',
    icon: {
      name: '546',
      color: 'green'
    }
  },
  flo: {
    event: 'Failed Logout',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  sd: {
    event: 'Success Delegation',
    icon: {
      name: '546',
      color: 'green'
    }
  },
  fd: {
    event: 'Failed Delegation',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  gd_start_enroll: {
    event: 'Enroll started',
    description: 'Guardian - Start second factor enrollment',
    icon: {
      name: '299',
      color: 'green'
    }
  },
  gd_enrollment_complete: {
    event: 'Guardian enrollment complete',
    description: 'Guardian - Enrollment complete',
    icon: {
      name: '299',
      color: 'green'
    }
  },
  gd_auth_succeed: {
    event: 'OTP Auth suceed',
    description: 'Guardian - Second factor authentication succeed',
    icon: {
      name: 'mfa-login-succeed',
      color: 'green'
    }
  },
  gd_unenroll: {
    event: 'Unenroll device account',
    description: 'Guardian - Enrollment removed',
    icon: {
      name: '298',
      color: 'green'
    }
  },
  sui: {
    event: 'Users import',
    description: 'Users import finished',
    icon: {
      name: '299',
      color: 'green'
    }
  },
  fcoa: {
    event: 'Failed cross-origin authentication',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  fcph: {
    event: 'Failed Post Change Password Hook',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  feoobft: {
    event: 'Failed Exchange',
    description: 'Failed exchange of Password and OOB Challenge for Access Token',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  feotpft: {
    event: 'Failed Exchange',
    description: 'Failed exchange of Password and OTP Challenge for Access Token',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  fepft: {
    event: 'Failed Exchange',
    description: 'Failed exchange of Password for Access Token',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  fercft: {
    event: 'Failed Exchange',
    description: 'Failed Exchange of Password and MFA Recovery code for Access Token',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  fertft: {
    event: 'Failed Exchange',
    description: 'Failed Exchange of Refresh Token for Access Token',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  ferrt: {
    event: 'Failed Exchange',
    description: 'Reused Refresh Token',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  fui: {
    event: 'Failed users import',
    description: 'Failed to import users',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  gd_auth_failed: {
    event: 'OTP Auth failed',
    description: 'One-time password authentication failed.',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  gd_auth_rejected: {
    event: 'OTP Auth rejected',
    description: 'One-time password authentication rejected.',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  gd_module_switch: {
    event: 'Module switch',
    icon: {
      name: '354',
      color: '#FFA500'
    }
  },
  gd_otp_rate_limit_exceed: {
    event: 'Too many failures',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  gd_recovery_failed: {
    event: 'Recovery failed',
    description: 'Multi-factor recovery code failed.',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  gd_recovery_rate_limit_exceed: {
    event: 'Too many failures',
    description: 'Multi-factor recovery code has failed too many times.',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  gd_recovery_succeed: {
    event: 'Recovery success',
    description: 'Multi-factor recovery code succeeded authorization.',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  gd_send_pn: {
    event: 'Push notification sent',
    description: 'Push notification for MFA sent successfully sent.',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  gd_send_sms: {
    event: 'SMS Sent',
    description: 'SMS for MFA sent successfully sent.',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  gd_start_auth: {
    event: 'Second factor started',
    description: 'Second factor authentication event started for MFA.',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  gd_tenant_update: {
    event: 'Guardian tenant update',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  gd_update_device_account: {
    event: 'Update device account',
    description: 'Device used for second factor authentication has been updated.',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  gd_user_delete: {
    event: 'User delete',
    description: 'Deleted multi-factor user account.',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  limit_delegation: {
    event: 'Too Many Calls to /delegation',
    description: 'Rate limit exceeded to /delegation endpoint',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  pwd_leak: {
    event: 'Breached password',
    description: 'Someone attempted to login with a leaked password.',
    icon: {
      name: '311',
      color: '#A93F3F'
    }
  },
  scoa: {
    event: 'Success cross-origin authentication',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  scph: {
    event: 'Success Post Change Password Hook',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  seoobft: {
    event: 'Success Exchange',
    description: 'Successful exchange of Password and OOB Challenge for Access Token',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  seotpft: {
    event: 'Success Exchange',
    description: 'Successful exchange of Password and OTP Challenge for Access Token',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  sepft: {
    event: 'Success Exchange',
    description: 'Successful exchange of Password for Access Token',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  sercft: {
    event: 'Success Exchange',
    description: 'Successful exchange of Password and MFA Recovery code for Access Token',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  sertft: {
    event: 'Success Exchange',
    description: 'Successful exchange of Refresh Token for Access Token',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  sys_os_update_end: {
    event: 'Auth0 OS Update Ended',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  sys_os_update_start: {
    event: 'Auth0 OS Update Started',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  sys_update_end: {
    event: 'Auth0 Update Ended',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  sys_update_start: {
    event: 'Auth0 Update Started',
    icon: {
      name: '312',
      color: 'green'
    }
  },
  ublkdu: {
    event: 'User login block released',
    description: 'User block setup by anomaly detection has been released',
    icon: {
      name: '312',
      color: 'green'
    }
  }
});
// CONCATENATED MODULE: ./client/reducers/log.js

function log_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function log_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? log_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : log_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }




var log_initialState = {
  loading: false,
  error: null,
  logId: null,
  record: Object(immutable_es["b" /* Map */])()
};
var log_log = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(log_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["q" /* CLEAR_LOG */], function (state) {
  return state.merge(log_objectSpread({}, log_initialState));
}), constants["ab" /* FETCH_LOG_PENDING */], function (state, action) {
  return state.merge(log_objectSpread(log_objectSpread({}, log_initialState), {}, {
    loading: true,
    logId: action.meta.logId
  }));
}), constants["bb" /* FETCH_LOG_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["Z" /* FETCH_LOG_FULFILLED */], function (state, action) {
  var data = action.payload.data;
  if (data.log._id !== state.get('logId')) {
    // eslint-disable-line no-underscore-dangle
    return state;
  }
  var logType = logTypes[data.log.type];
  if (!logType) {
    logType = {
      // Don't do this, need to handle it elsewhere so language dictionary can do it: event: `Unknown Log Type: ${data.log.type}`,
      icon: {
        name: '354',
        color: '#FFA500'
      }
    };
  }
  data.log.shortType = data.log.type;
  data.log.type = logType.event;
  return state.merge({
    loading: false,
    record: Object(immutable_es["d" /* fromJS */])(data.log)
  });
}));
// CONCATENATED MODULE: ./client/reducers/logs.js

function logs_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function logs_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? logs_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : logs_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }




var logs_initialState = {
  loading: false,
  error: null,
  records: Object(immutable_es["d" /* fromJS */])([]),
  currentRecord: null
};
var logs_logs = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(logs_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["X" /* FETCH_LOGS_PENDING */], function (state, action) {
  return state.merge(logs_objectSpread(logs_objectSpread({}, logs_initialState), {}, {
    loading: true,
    records: Object(immutable_es["d" /* fromJS */])(action.meta.page === 0 ? [] : state.get('records'))
  }));
}), constants["Y" /* FETCH_LOGS_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["W" /* FETCH_LOGS_FULFILLED */], function (state, action) {
  var data = action.payload.data;
  return state.merge({
    loading: false,
    nextPage: action.meta.page + 1,
    records: Object(immutable_es["d" /* fromJS */])(state.get('records').concat(Object(immutable_es["d" /* fromJS */])(data.map(function (log) {
      log.shortType = log.type;
      log.type = logTypes[log.type];
      if (!log.type) {
        log.type = {
          // Don't do this, need to handle it elsewhere so language dictionary can do it: event: 'Unknown Event',
          icon: {
            name: '354',
            color: '#FFA500'
          }
        };
      }
      return log;
    }))))
  });
}));
// CONCATENATED MODULE: ./client/reducers/mfa.js

function mfa_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function mfa_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? mfa_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : mfa_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var mfa_initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null,
  provider: null
};
var mfa = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(mfa_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["jc" /* REQUEST_REMOVE_MULTIFACTOR */], function (state, action) {
  return state.merge(mfa_objectSpread(mfa_objectSpread({}, mfa_initialState), {}, {
    user: action.user,
    provider: action.provider,
    requesting: true
  }));
}), constants["m" /* CANCEL_REMOVE_MULTIFACTOR */], function (state) {
  return state.merge(mfa_objectSpread({}, mfa_initialState));
}), constants["Zb" /* REMOVE_MULTIFACTOR_PENDING */], function (state) {
  return state.merge({
    loading: true
  });
}), constants["ac" /* REMOVE_MULTIFACTOR_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["Yb" /* REMOVE_MULTIFACTOR_FULFILLED */], function (state) {
  return state.merge(mfa_objectSpread({}, mfa_initialState));
}));
// CONCATENATED MODULE: ./client/reducers/passwordChange.js

function passwordChange_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function passwordChange_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? passwordChange_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : passwordChange_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var passwordChange_initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null,
  connection: null
};
var passwordChange = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(passwordChange_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["gc" /* REQUEST_PASSWORD_CHANGE */], function (state, action) {
  return state.merge(passwordChange_objectSpread(passwordChange_objectSpread({}, passwordChange_initialState), {}, {
    user: action.user,
    connection: action.connection,
    requesting: true
  }));
}), constants["j" /* CANCEL_PASSWORD_CHANGE */], function (state) {
  return state.merge(passwordChange_objectSpread({}, passwordChange_initialState));
}), constants["Nb" /* PASSWORD_CHANGE_PENDING */], function (state) {
  return state.merge({
    loading: true
  });
}), constants["Ob" /* PASSWORD_CHANGE_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["Mb" /* PASSWORD_CHANGE_FULFILLED */], function (state) {
  return state.merge(passwordChange_objectSpread({}, passwordChange_initialState));
}));
// CONCATENATED MODULE: ./client/reducers/passwordReset.js

function passwordReset_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function passwordReset_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? passwordReset_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : passwordReset_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var passwordReset_initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null,
  connection: null
};
var passwordReset = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(passwordReset_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["hc" /* REQUEST_PASSWORD_RESET */], function (state, action) {
  return state.merge(passwordReset_objectSpread(passwordReset_objectSpread({}, passwordReset_initialState), {}, {
    user: action.user,
    connection: action.connection,
    requesting: true
  }));
}), constants["k" /* CANCEL_PASSWORD_RESET */], function (state) {
  return state.merge(passwordReset_objectSpread({}, passwordReset_initialState));
}), constants["Rb" /* PASSWORD_RESET_PENDING */], function (state) {
  return state.merge({
    loading: true
  });
}), constants["Sb" /* PASSWORD_RESET_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["Qb" /* PASSWORD_RESET_FULFILLED */], function (state) {
  return state.merge(passwordReset_objectSpread({}, passwordReset_initialState));
}));
// CONCATENATED MODULE: ./client/reducers/scripts.js




var scripts_scripts = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])({}), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["eb" /* FETCH_SCRIPT_PENDING */], function (state, action) {
  return state.setIn([action.meta.name], Object(immutable_es["d" /* fromJS */])({
    loading: true,
    error: null,
    script: null,
    token: null
  }));
}), constants["fb" /* FETCH_SCRIPT_REJECTED */], function (state, action) {
  return state.setIn([action.meta.name], Object(immutable_es["d" /* fromJS */])({
    loading: false,
    error: action.errorData
  }));
}), constants["db" /* FETCH_SCRIPT_FULFILLED */], function (state, action) {
  return state.setIn([action.meta.name], Object(immutable_es["d" /* fromJS */])({
    loading: false,
    script: action.payload.data.script
  }));
}), constants["Ac" /* UPDATE_SCRIPT_PENDING */], function (state, action) {
  return state.setIn([action.meta.name, 'loading'], true).setIn([action.meta.name, 'script'], action.meta.script);
}), constants["Bc" /* UPDATE_SCRIPT_REJECTED */], function (state, action) {
  return state.setIn([action.meta.name], Object(immutable_es["d" /* fromJS */])({
    loading: false,
    error: action.errorData
  }));
}), constants["zc" /* UPDATE_SCRIPT_FULFILLED */], function (state, action) {
  return state.setIn([action.meta.name, 'loading'], false);
}));
// EXTERNAL MODULE: ./client/reducers/settings.js
var reducers_settings = __webpack_require__(560);

// CONCATENATED MODULE: ./client/reducers/styleSettings.js




var styleSettings_initialState = {
  useAlt: false,
  path: ''
};
var styleSettings = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(styleSettings_initialState), defineProperty_default()(defineProperty_default()({}, constants["tc" /* TOGGLE_STYLE_SETTINGS */], function (state, action) {
  return state.merge({
    useAlt: action.payload.useAlt,
    path: action.payload.path
  });
}), constants["Eb" /* GET_STYLE_SETTINGS */], function (state, action) {
  return state.merge({
    useAlt: action.payload.useAlt,
    path: action.payload.path
  });
}));
// CONCATENATED MODULE: ./client/reducers/unblock.js

function unblock_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function unblock_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? unblock_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : unblock_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var unblock_initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null
};
var unblock = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(unblock_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["lc" /* REQUEST_UNBLOCK_USER */], function (state, action) {
  return state.merge({
    user: Object(immutable_es["d" /* fromJS */])(action.user),
    requesting: true
  });
}), constants["o" /* CANCEL_UNBLOCK_USER */], function (state) {
  return state.merge(unblock_objectSpread({}, unblock_initialState));
}), constants["wc" /* UNBLOCK_USER_PENDING */], function (state) {
  return state.merge({
    loading: true
  });
}), constants["xc" /* UNBLOCK_USER_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["vc" /* UNBLOCK_USER_FULFILLED */], function (state) {
  return state.merge(unblock_objectSpread({}, unblock_initialState));
}));
// CONCATENATED MODULE: ./client/reducers/user.js

function user_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function user_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? user_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : user_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }





var user_initialState = {
  loading: false,
  error: null,
  userId: null,
  record: Object(immutable_es["d" /* fromJS */])({}),
  memberships: Object(immutable_es["d" /* fromJS */])([]),
  connection: Object(immutable_es["d" /* fromJS */])({}),
  logs: {
    loading: false,
    error: null,
    records: Object(immutable_es["d" /* fromJS */])([])
  },
  devices: {
    loading: false,
    error: null,
    records: Object(immutable_es["d" /* fromJS */])({})
  }
};
var userLogs = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(user_initialState.logs), defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["wb" /* FETCH_USER_LOGS_PENDING */], function (state) {
  return state.merge(user_objectSpread(user_objectSpread({}, user_initialState.logs), {}, {
    loading: true
  }));
}), constants["xb" /* FETCH_USER_LOGS_REJECTED */], function (state, action) {
  return state.merge(user_objectSpread(user_objectSpread({}, user_initialState.logs), {}, {
    loading: false,
    error: Object(immutable_es["d" /* fromJS */])(action.errorData)
  }));
}), constants["vb" /* FETCH_USER_LOGS_FULFILLED */], function (state, action) {
  return state.merge({
    loading: false,
    records: Object(immutable_es["d" /* fromJS */])(typeof action.payload.data !== 'undefined' ? action.payload.data.map(function (log) {
      log.time_ago = moment_default()(log.date).fromNow();
      log.shortType = log.type;
      log.type = logTypes[log.type];
      if (!log.type) {
        log.type = {
          event: 'Unknown Error',
          icon: {
            name: '354',
            color: '#FFA500'
          }
        };
      }
      return log;
    }) : [])
  });
}));
var userDevices = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(user_initialState.devices), defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["rb" /* FETCH_USER_DEVICES_PENDING */], function (state) {
  return state.merge(user_objectSpread(user_objectSpread({}, user_initialState.devices), {}, {
    loading: true
  }));
}), constants["sb" /* FETCH_USER_DEVICES_REJECTED */], function (state, action) {
  return state.merge(user_objectSpread(user_objectSpread({}, user_initialState.devices), {}, {
    error: Object(immutable_es["d" /* fromJS */])(action.errorData)
  }));
}), constants["qb" /* FETCH_USER_DEVICES_FULFILLED */], function (state, action) {
  var devices = action.payload.data.devices.reduce(function (map, device) {
    map[device.device_name] = (map[device.device_name] || 0) + 1;
    return map;
  }, {});
  return state.merge({
    loading: false,
    records: Object(immutable_es["d" /* fromJS */])(devices)
  });
}));
var user_user = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(user_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["yb" /* FETCH_USER_PENDING */], function (state, action) {
  return state.merge({
    error: null,
    loading: true,
    userId: action.meta.userId
  });
}), constants["zb" /* FETCH_USER_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["tb" /* FETCH_USER_FULFILLED */], function (state, action) {
  var data = action.payload.data;
  if (data.user.user_id !== state.get('userId')) {
    return state;
  }
  return state.merge({
    loading: false,
    record: Object(immutable_es["d" /* fromJS */])(data.user),
    memberships: Object(immutable_es["d" /* fromJS */])(data.memberships),
    connection: Object(immutable_es["d" /* fromJS */])(data.connection)
  });
}), constants["wb" /* FETCH_USER_LOGS_PENDING */], function (state, action) {
  return state.merge({
    logs: userLogs(state.get('logs'), action)
  });
}), constants["xb" /* FETCH_USER_LOGS_REJECTED */], function (state, action) {
  return state.merge({
    logs: userLogs(state.get('logs'), action)
  });
}), constants["vb" /* FETCH_USER_LOGS_FULFILLED */], function (state, action) {
  return state.merge({
    logs: userLogs(state.get('logs'), action)
  });
}), constants["rb" /* FETCH_USER_DEVICES_PENDING */], function (state, action) {
  return state.merge({
    devices: userDevices(state.get('devices'), action)
  });
}), constants["sb" /* FETCH_USER_DEVICES_REJECTED */], function (state, action) {
  return state.merge({
    devices: userDevices(state.get('devices'), action)
  });
}), constants["qb" /* FETCH_USER_DEVICES_FULFILLED */], function (state, action) {
  return state.merge({
    devices: userDevices(state.get('devices'), action)
  });
}));
// CONCATENATED MODULE: ./client/reducers/userCreate.js

function userCreate_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function userCreate_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? userCreate_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : userCreate_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var userCreate_initialState = {
  error: null,
  record: null,
  loading: false,
  validationErrors: Object(immutable_es["d" /* fromJS */])({})
};
var userCreate = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(userCreate_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["cc" /* REQUEST_CREATE_USER */], function (state, action) {
  return state.merge(userCreate_objectSpread(userCreate_objectSpread({}, userCreate_initialState), {}, {
    record: {
      memberships: action.payload.memberships,
      connection: action.payload.connection
    }
  }));
}), constants["f" /* CANCEL_CREATE_USER */], function (state) {
  return state.merge(userCreate_objectSpread({}, userCreate_initialState));
}), constants["u" /* CREATE_USER_PENDING */], function (state) {
  return state.merge({
    loading: true
  });
}), constants["v" /* CREATE_USER_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    validationErrors: Object(immutable_es["d" /* fromJS */])({}),
    error: action.errorData
  });
}), constants["t" /* CREATE_USER_FULFILLED */], function (state) {
  return state.merge(userCreate_objectSpread({}, userCreate_initialState));
}));
// CONCATENATED MODULE: ./client/reducers/userDelete.js

function userDelete_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function userDelete_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? userDelete_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : userDelete_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var userDelete_initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null
};
var userDelete = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(userDelete_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["dc" /* REQUEST_DELETE_USER */], function (state, action) {
  return state.merge(userDelete_objectSpread(userDelete_objectSpread({}, userDelete_initialState), {}, {
    user: action.user,
    requesting: true
  }));
}), constants["g" /* CANCEL_DELETE_USER */], function (state) {
  return state.merge(userDelete_objectSpread({}, userDelete_initialState));
}), constants["y" /* DELETE_USER_PENDING */], function (state) {
  return state.merge({
    loading: true
  });
}), constants["z" /* DELETE_USER_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["x" /* DELETE_USER_FULFILLED */], function (state) {
  return state.merge(userDelete_objectSpread({}, userDelete_initialState));
}));
// CONCATENATED MODULE: ./client/reducers/fieldsChange.js

function fieldsChange_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function fieldsChange_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? fieldsChange_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : fieldsChange_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }




var fieldsChange_initialState = {
  error: null,
  userId: null,
  record: null,
  loading: false,
  validationErrors: Object(immutable_es["d" /* fromJS */])({})
};
var fieldsChange = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(fieldsChange_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["fc" /* REQUEST_FIELDS_CHANGE */], function (state, action) {
  return state.merge(fieldsChange_objectSpread(fieldsChange_objectSpread({}, fieldsChange_initialState), {}, {
    userId: action.payload.user.user_id,
    record: action.payload.user
  }));
}), constants["i" /* CANCEL_FIELDS_CHANGE */], function (state) {
  return state.merge(fieldsChange_objectSpread({}, fieldsChange_initialState));
}), constants["Cb" /* FIELDS_CHANGE_PENDING */], function (state) {
  return state.merge({
    loading: true
  });
}), constants["Db" /* FIELDS_CHANGE_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    validationErrors: Object(immutable_es["d" /* fromJS */])({}),
    error: action.errorData
  });
}), constants["Bb" /* FIELDS_CHANGE_FULFILLED */], function (state) {
  return state.merge(fieldsChange_objectSpread({}, fieldsChange_initialState));
}));
// CONCATENATED MODULE: ./client/reducers/usernameChange.js

function usernameChange_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function usernameChange_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? usernameChange_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : usernameChange_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var usernameChange_initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null,
  connection: null
};
var usernameChange = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(usernameChange_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["mc" /* REQUEST_USERNAME_CHANGE */], function (state, action) {
  return state.merge(usernameChange_objectSpread(usernameChange_objectSpread({}, usernameChange_initialState), {}, {
    user: action.user,
    connection: action.connection,
    requesting: true
  }));
}), constants["p" /* CANCEL_USERNAME_CHANGE */], function (state) {
  return state.merge(usernameChange_objectSpread({}, usernameChange_initialState));
}), constants["Fc" /* USERNAME_CHANGE_PENDING */], function (state, action) {
  return state.merge({
    loading: true,
    user: action.meta.user
  });
}), constants["Gc" /* USERNAME_CHANGE_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["Ec" /* USERNAME_CHANGE_FULFILLED */], function (state) {
  return state.merge(usernameChange_objectSpread({}, usernameChange_initialState));
}));
// CONCATENATED MODULE: ./client/reducers/users.js

function users_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function users_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? users_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : users_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }




var users_initialState = {
  loading: false,
  error: null,
  records: Object(immutable_es["d" /* fromJS */])([]),
  total: 0,
  currentPage: 1,
  pages: 1,
  selectedFilter: '',
  searchValue: '',
  sortProperty: 'last_login',
  sortOrder: -1
};
var users_users = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(users_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["r" /* CLEAR_USERS */], function (state) {
  return state.merge({
    loading: false,
    records: Object(immutable_es["d" /* fromJS */])([]),
    total: 0,
    currentPage: 1,
    pages: 1,
    nextPage: 1
  });
}), constants["nb" /* FETCH_USERS_PENDING */], function (state, action) {
  return state.merge(users_objectSpread(users_objectSpread({}, users_initialState), {}, {
    loading: true,
    records: action.meta.page === 0 ? Object(immutable_es["d" /* fromJS */])([]) : state.get('records'),
    pages: action.meta.page === 0 ? 1 : state.get('pages'),
    searchValue: action.meta.searchValue,
    sortProperty: action.meta.sortProperty,
    sortOrder: action.meta.sortOrder
  }));
}), constants["ob" /* FETCH_USERS_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["mb" /* FETCH_USERS_FULFILLED */], function (state, action) {
  var data = action.payload.data;
  return state.merge({
    loading: false,
    total: data.total,
    pages: Math.ceil(data.total / 10),
    nextPage: action.meta.page + 1,
    selectedFilter: action.meta.selectedFilter,
    records: Object(immutable_es["d" /* fromJS */])(data.users.map(function (user) {
      return users_objectSpread(users_objectSpread({}, user), {}, {
        last_login_relative: user.last_login ? moment_default()(user.last_login).fromNow() : 'Never'
      });
    }))
  });
}), constants["b" /* BLOCK_USER_FULFILLED */], function (state, action) {
  return state.updateIn(['records', state.get('records').findIndex(function (p) {
    return p.get('user_id') === action.meta.userId;
  }), 'blocked'], function () {
    return true;
  });
}), constants["vc" /* UNBLOCK_USER_FULFILLED */], function (state, action) {
  return state.updateIn(['records', state.get('records').findIndex(function (p) {
    return p.get('user_id') === action.meta.userId;
  }), 'blocked'], function () {
    return false;
  });
}), constants["Ub" /* REMOVE_BLOCKED_IPS_FULFILLED */], function (state, action) {
  return state.updateIn(['records', state.get('records').findIndex(function (p) {
    return p.get('user_id') === action.meta.userId;
  }), 'blocked_for'], function () {
    return [];
  });
}), constants["Yb" /* REMOVE_MULTIFACTOR_FULFILLED */], function (state, action) {
  return state.updateIn(['records', state.get('records').findIndex(function (p) {
    return p.get('user_id') === action.meta.userId;
  }), 'multifactor'], function (multifactor) {
    return multifactor && multifactor.splice(0, 1);
  });
}));
// CONCATENATED MODULE: ./client/reducers/verificationEmail.js

function verificationEmail_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function verificationEmail_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? verificationEmail_ownKeys(Object(t), !0).forEach(function (r) { defineProperty_default()(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : verificationEmail_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }



var verificationEmail_initialState = {
  error: null,
  loading: false,
  requesting: false,
  user: null
};
var verificationEmail = Object(createReducer["a" /* default */])(Object(immutable_es["d" /* fromJS */])(verificationEmail_initialState), defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()(defineProperty_default()({}, constants["kc" /* REQUEST_RESEND_VERIFICATION_EMAIL */], function (state, action) {
  return state.merge(verificationEmail_objectSpread(verificationEmail_objectSpread({}, verificationEmail_initialState), {}, {
    user: action.user,
    requesting: true
  }));
}), constants["n" /* CANCEL_RESEND_VERIFICATION_EMAIL */], function (state) {
  return state.merge(verificationEmail_objectSpread({}, verificationEmail_initialState));
}), constants["pc" /* RESEND_VERIFICATION_EMAIL_PENDING */], function (state) {
  return state.merge({
    loading: true
  });
}), constants["qc" /* RESEND_VERIFICATION_EMAIL_REJECTED */], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), constants["oc" /* RESEND_VERIFICATION_EMAIL_FULFILLED */], function (state) {
  return state.merge(verificationEmail_objectSpread({}, verificationEmail_initialState));
}));
// CONCATENATED MODULE: ./client/reducers/index.js



























function lastAction() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  return action;
}
/* harmony default export */ var reducers = (Object(redux_es["combineReducers"])({
  routing: react_router_redux_lib["routerReducer"],
  accessLevel: accessLevel_accessLevel,
  applications: applications,
  auth: auth_auth,
  block: block,
  connections: connections_connections,
  emailChange: emailChange,
  languageDictionary: languageDictionary_languageDictionary,
  log: log_log,
  logs: logs_logs,
  mfa: mfa,
  passwordChange: passwordChange,
  passwordReset: passwordReset,
  scripts: scripts_scripts,
  settings: reducers_settings["a" /* settings */],
  styleSettings: styleSettings,
  unblock: unblock,
  removeBlockedIPs: removeBlockedIPs,
  user: user_user,
  userCreate: userCreate,
  userDelete: userDelete,
  fieldsChange: fieldsChange,
  usernameChange: usernameChange,
  users: users_users,
  verificationEmail: verificationEmail,
  lastAction: lastAction,
  form: redux_form_es["c" /* reducer */]
}));
// CONCATENATED MODULE: ./client/middlewares/normalizeErrorMiddleware.js
function normalizeErrorMiddleware() {
  return function () {
    return function (next) {
      return function (action) {
        if (action && action.type.endsWith('_REJECTED') && action.payload) {
          // Try to get the default error message from the response.
          var message = action.payload.statusText || action.payload.status || 'Unknown Server Error';
          var status = action.payload.response && action.payload.response.status || 500;
          // Maybe some data is available.
          var error = action.payload.data && action.payload.data.message;
          if (!error) {
            error = action.payload.response && action.payload.response.data && action.payload.response.data.message;
          }
          if (error) {
            message = error.message || error;
          }
          action.errorData = {
            type: action.type.replace('_REJECTED', ''),
            message: message,
            status: status
          };
        }
        next(action);
      };
    };
  };
}
// CONCATENATED MODULE: ./client/middlewares/promiseSuccessMiddleware.js
function promiseSuccessMiddleware_normalizeErrorMiddleware() {
  return function () {
    return function (next) {
      return function (action) {
        next(action);
        if (action && action.meta && action.type.endsWith('_FULFILLED') && action.meta.onSuccess) {
          action.meta.onSuccess(action.payload);
        }
      };
    };
  };
}
// EXTERNAL MODULE: ./client/containers/DevTools.jsx
var DevTools = __webpack_require__(1044);

// CONCATENATED MODULE: ./client/store/configureStore.js









function configureStore(middlewares) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var pipeline = [redux_es["applyMiddleware"].apply(void 0, [Object(dist_es["a" /* default */])(), redux_thunk_lib_default.a, normalizeErrorMiddleware(), promiseSuccessMiddleware_normalizeErrorMiddleware(), redux_logger_lib_default()({
    predicate: function predicate() {
      return "production" !== 'production';
    }
  })].concat(toConsumableArray_default()(middlewares)))];
  if (false) {}
  var finalCreateStore = redux_es["compose"].apply(void 0, pipeline)(redux_es["createStore"]);
  var store = finalCreateStore(reducers, initialState);

  // Enable Webpack hot module replacement for reducers.
  if (false) {}
  return store;
}
// CONCATENATED MODULE: ./client/app.jsx















// Make axios aware of the base path.
axios["a" /* default */].defaults.baseURL = window.config.BASE_URL;

// Make history aware of the base path.
var app_history = Object(react_router_lib["useRouterHistory"])(history_lib["createHistory"])({
  basename: window.config.BASE_PATH || "",
  // history/react-router uses query-string behind the scenes. When query-string parses malformed URLs, 
  // it throws URIError, which crashes the app before any route renders (and the user sees a blank page)
  // This is a workaround to still use query-string for normal parsing so we keep its full behavior
  // while avoiding the crashes caused by malformed URLs.
  parseQueryString: function parseQueryString(str) {
    try {
      return query_string_default.a.parse(str);
    } catch (error) {
      if (error instanceof URIError) {
        return {};
      }
      throw error;
    }
  }
});
var app_store = configureStore([Object(react_router_redux_lib["routerMiddleware"])(app_history)], {});
var reduxHistory = Object(react_router_redux_lib["syncHistoryWithStore"])(app_history, app_store);
app_store.subscribe(function () {
  switch (app_store.getState().lastAction.type) {
    case constants["hb" /* FETCH_SETTINGS_FULFILLED */]:
      {
        var useAltCss = localStorage.getItem('delegated-admin:use-alt-css') === 'true';
        var data = app_store.getState().settings.get('record');
        var settings = data.get('settings');
        var dict = settings.get('dict');
        if (dict) {
          var title = dict.get('title');
          if (title && title !== '') {
            document.title = title;
          }
        }
        var css = useAltCss ? settings.get('altcss') : settings.get('css');
        if (css && css.length) {
          var head = document.getElementsByTagName('head')[0];
          var link = document.createElement('link');
          link.id = 'custom_css';
          link.rel = 'stylesheet';
          link.type = 'text/css';
          link.href = css;
          link.media = 'all';
          head.appendChild(link);
        }
        break;
      }
    case constants["tc" /* TOGGLE_STYLE_SETTINGS */]:
      {
        var _css = app_store.getState().styleSettings.get('path');
        if (_css !== '') {
          var customCss = document.getElementById('custom_css');
          if (customCss) {
            customCss.href = _css;
          } else {
            var _head = document.getElementsByTagName('head')[0];
            var _link = document.createElement('link');
            _link.id = 'custom_css';
            _link.rel = 'stylesheet';
            _link.type = 'text/css';
            _link.href = _css;
            _link.media = 'all';
            _head.appendChild(_link);
          }
        }
        break;
      }
    default:
      break;
  }
});
app_store.dispatch(loadCredentials());

// Render application.
react_dom_default.a.render(/*#__PURE__*/react_default.a.createElement(react_redux_lib["Provider"], {
  store: app_store
}, routes(reduxHistory)), document.getElementById('app'));

// Show the developer tools.
if (false) { var showDevTools; }

/***/ }),

/***/ 23:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createReducer; });
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);

function createReducer(initialState, actionHandlers) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    if (!immutable__WEBPACK_IMPORTED_MODULE_0__[/* Map */ "b"].isMap(state) && !immutable__WEBPACK_IMPORTED_MODULE_0__[/* List */ "a"].isList(state)) {
      state = immutable__WEBPACK_IMPORTED_MODULE_0__[/* default */ "c"].fromJS(state);
    }
    var handler = actionHandlers[action.type];
    if (!handler) {
      return state;
    }
    state = handler(state, action);
    if (!immutable__WEBPACK_IMPORTED_MODULE_0__[/* Map */ "b"].isMap(state) && !immutable__WEBPACK_IMPORTED_MODULE_0__[/* List */ "a"].isList(state)) {
      throw new TypeError('Reducers must return Immutable objects.');
    }
    return state;
  };
}

/***/ }),

/***/ 4:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "I", function() { return FETCH_APPLICATIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "K", function() { return FETCH_APPLICATIONS_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "L", function() { return FETCH_APPLICATIONS_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "J", function() { return FETCH_APPLICATIONS_FULFILLED; });
/* unused harmony export FETCH_APPLICATION */
/* unused harmony export FETCH_APPLICATION_PENDING */
/* unused harmony export FETCH_APPLICATION_REJECTED */
/* unused harmony export FETCH_APPLICATION_FULFILLED */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fb", function() { return LOADED_TOKEN; });
/* unused harmony export RECIEVED_TOKEN */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sc", function() { return SHOW_LOGIN; });
/* unused harmony export REDIRECT_LOGIN */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Hb", function() { return LOGIN_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Gb", function() { return LOGIN_FAILED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ib", function() { return LOGIN_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Jb", function() { return LOGOUT_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Kb", function() { return LOGOUT_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "M", function() { return FETCH_CONNECTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "O", function() { return FETCH_CONNECTIONS_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "P", function() { return FETCH_CONNECTIONS_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "N", function() { return FETCH_CONNECTIONS_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return CLEAR_LOG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "V", function() { return FETCH_LOGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "X", function() { return FETCH_LOGS_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Y", function() { return FETCH_LOGS_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "W", function() { return FETCH_LOGS_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "U", function() { return FETCH_LOG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ab", function() { return FETCH_LOG_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bb", function() { return FETCH_LOG_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Z", function() { return FETCH_LOG_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cc", function() { return REQUEST_CREATE_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return CANCEL_CREATE_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return CREATE_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "u", function() { return CREATE_USER_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "v", function() { return CREATE_USER_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return CREATE_USER_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Cc", function() { return UPDATE_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fc", function() { return REQUEST_FIELDS_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return CANCEL_FIELDS_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ab", function() { return FIELDS_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Cb", function() { return FIELDS_CHANGE_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Db", function() { return FIELDS_CHANGE_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Bb", function() { return FIELDS_CHANGE_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lb", function() { return FETCH_USERS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nb", function() { return FETCH_USERS_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ob", function() { return FETCH_USERS_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mb", function() { return FETCH_USERS_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return CLEAR_USERS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kb", function() { return FETCH_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "yb", function() { return FETCH_USER_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zb", function() { return FETCH_USER_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tb", function() { return FETCH_USER_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ub", function() { return FETCH_USER_LOGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wb", function() { return FETCH_USER_LOGS_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xb", function() { return FETCH_USER_LOGS_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vb", function() { return FETCH_USER_LOGS_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pb", function() { return FETCH_USER_DEVICES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rb", function() { return FETCH_USER_DEVICES_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sb", function() { return FETCH_USER_DEVICES_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "qb", function() { return FETCH_USER_DEVICES_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jc", function() { return REQUEST_REMOVE_MULTIFACTOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return CANCEL_REMOVE_MULTIFACTOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Xb", function() { return REMOVE_MULTIFACTOR; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Zb", function() { return REMOVE_MULTIFACTOR_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ac", function() { return REMOVE_MULTIFACTOR_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Yb", function() { return REMOVE_MULTIFACTOR_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bc", function() { return REQUEST_BLOCK_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return CANCEL_BLOCK_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BLOCK_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return BLOCK_USER_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return BLOCK_USER_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BLOCK_USER_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lc", function() { return REQUEST_UNBLOCK_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return CANCEL_UNBLOCK_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uc", function() { return UNBLOCK_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wc", function() { return UNBLOCK_USER_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "xc", function() { return UNBLOCK_USER_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vc", function() { return UNBLOCK_USER_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ic", function() { return REQUEST_REMOVE_BLOCKED_IPS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return CANCEL_REMOVE_BLOCKED_IPS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tb", function() { return REMOVE_BLOCKED_IPS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Vb", function() { return REMOVE_BLOCKED_IPS_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Wb", function() { return REMOVE_BLOCKED_IPS_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ub", function() { return REMOVE_BLOCKED_IPS_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dc", function() { return REQUEST_DELETE_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return CANCEL_DELETE_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "w", function() { return DELETE_USER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "y", function() { return DELETE_USER_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "z", function() { return DELETE_USER_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "x", function() { return DELETE_USER_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hc", function() { return REQUEST_PASSWORD_RESET; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return CANCEL_PASSWORD_RESET; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Pb", function() { return PASSWORD_RESET; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Rb", function() { return PASSWORD_RESET_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sb", function() { return PASSWORD_RESET_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Qb", function() { return PASSWORD_RESET_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gc", function() { return REQUEST_PASSWORD_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return CANCEL_PASSWORD_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Lb", function() { return PASSWORD_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Nb", function() { return PASSWORD_CHANGE_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ob", function() { return PASSWORD_CHANGE_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mb", function() { return PASSWORD_CHANGE_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mc", function() { return REQUEST_USERNAME_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return CANCEL_USERNAME_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dc", function() { return USERNAME_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Fc", function() { return USERNAME_CHANGE_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Gc", function() { return USERNAME_CHANGE_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ec", function() { return USERNAME_CHANGE_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ec", function() { return REQUEST_EMAIL_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return CANCEL_EMAIL_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "A", function() { return EMAIL_CHANGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "C", function() { return EMAIL_CHANGE_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "D", function() { return EMAIL_CHANGE_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "B", function() { return EMAIL_CHANGE_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "kc", function() { return REQUEST_RESEND_VERIFICATION_EMAIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return CANCEL_RESEND_VERIFICATION_EMAIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nc", function() { return RESEND_VERIFICATION_EMAIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pc", function() { return RESEND_VERIFICATION_EMAIL_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "qc", function() { return RESEND_VERIFICATION_EMAIL_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "oc", function() { return RESEND_VERIFICATION_EMAIL_FULFILLED; });
/* unused harmony export CONFIRM_USER_PICKER */
/* unused harmony export CANCEL_USER_PICKER */
/* unused harmony export OPEN_USER_PICKER */
/* unused harmony export SEARCH_USER_PICKER */
/* unused harmony export SEARCH_USER_PICKER_PENDING */
/* unused harmony export SEARCH_USER_PICKER_REJECTED */
/* unused harmony export SEARCH_USER_PICKER_FULFILLED */
/* unused harmony export SELECT_USER */
/* unused harmony export UNSELECT_USER */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cb", function() { return FETCH_SCRIPT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "eb", function() { return FETCH_SCRIPT_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fb", function() { return FETCH_SCRIPT_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "db", function() { return FETCH_SCRIPT_FULFILLED; });
/* unused harmony export UPDATE_SCRIPTS */
/* unused harmony export UPDATE_SCRIPTS_PENDING */
/* unused harmony export UPDATE_SCRIPTS_REJECTED */
/* unused harmony export UPDATE_SCRIPTS_FULFILLED */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "yc", function() { return UPDATE_SCRIPT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ac", function() { return UPDATE_SCRIPT_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Bc", function() { return UPDATE_SCRIPT_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zc", function() { return UPDATE_SCRIPT_FULFILLED; });
/* unused harmony export FETCH_MEMBERSHIPS */
/* unused harmony export FETCH_MEMBERSHIPS_PENDING */
/* unused harmony export FETCH_MEMBERSHIPS_REJECTED */
/* unused harmony export FETCH_MEMBERSHIPS_FULFILLED */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "E", function() { return FETCH_ACCESS_LEVEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "G", function() { return FETCH_ACCESS_LEVEL_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "H", function() { return FETCH_ACCESS_LEVEL_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "F", function() { return FETCH_ACCESS_LEVEL_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gb", function() { return FETCH_SETTINGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ib", function() { return FETCH_SETTINGS_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jb", function() { return FETCH_SETTINGS_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hb", function() { return FETCH_SETTINGS_FULFILLED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tc", function() { return TOGGLE_STYLE_SETTINGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Eb", function() { return GET_STYLE_SETTINGS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Q", function() { return FETCH_LANGUAGE_DICTIONARY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "S", function() { return FETCH_LANGUAGE_DICTIONARY_PENDING; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "T", function() { return FETCH_LANGUAGE_DICTIONARY_REJECTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "R", function() { return FETCH_LANGUAGE_DICTIONARY_FULFILLED; });
/* unused harmony export SUPER_ADMIN */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rc", function() { return RESERVED_USER_FIELDS; });
/*
 * Applications.
 */

// Fetch.
var FETCH_APPLICATIONS = 'FETCH_APPLICATIONS';
var FETCH_APPLICATIONS_PENDING = 'FETCH_APPLICATIONS_PENDING';
var FETCH_APPLICATIONS_REJECTED = 'FETCH_APPLICATIONS_REJECTED';
var FETCH_APPLICATIONS_FULFILLED = 'FETCH_APPLICATIONS_FULFILLED';

// Fetch single.
var FETCH_APPLICATION = 'FETCH_APPLICATION';
var FETCH_APPLICATION_PENDING = 'FETCH_APPLICATION_PENDING';
var FETCH_APPLICATION_REJECTED = 'FETCH_APPLICATION_REJECTED';
var FETCH_APPLICATION_FULFILLED = 'FETCH_APPLICATION_FULFILLED';

/*
 * Auth.
 */

// Token.
var LOADED_TOKEN = 'LOADED_TOKEN';
var RECIEVED_TOKEN = 'RECIEVED_TOKEN';

// Login.
var SHOW_LOGIN = 'SHOW_LOGIN';
var REDIRECT_LOGIN = 'REDIRECT_LOGIN';
var LOGIN_PENDING = 'LOGIN_PENDING';
var LOGIN_FAILED = 'LOGIN_FAILED';
var LOGIN_SUCCESS = 'LOGIN_SUCCESS';

// Logout.
var LOGOUT_PENDING = 'LOGOUT_PENDING';
var LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

/*
 * Connections.
 */

// Fetch.
var FETCH_CONNECTIONS = 'FETCH_CONNECTIONS';
var FETCH_CONNECTIONS_PENDING = 'FETCH_CONNECTIONS_PENDING';
var FETCH_CONNECTIONS_REJECTED = 'FETCH_CONNECTIONS_REJECTED';
var FETCH_CONNECTIONS_FULFILLED = 'FETCH_CONNECTIONS_FULFILLED';

/*
 * Logs.
 */

var CLEAR_LOG = 'CLEAR_LOG';

// Fetch all.
var FETCH_LOGS = 'FETCH_LOGS';
var FETCH_LOGS_PENDING = 'FETCH_LOGS_PENDING';
var FETCH_LOGS_REJECTED = 'FETCH_LOGS_REJECTED';
var FETCH_LOGS_FULFILLED = 'FETCH_LOGS_FULFILLED';

// Fetch single.
var FETCH_LOG = 'FETCH_LOG';
var FETCH_LOG_PENDING = 'FETCH_LOG_PENDING';
var FETCH_LOG_REJECTED = 'FETCH_LOG_REJECTED';
var FETCH_LOG_FULFILLED = 'FETCH_LOG_FULFILLED';

/*
 * Users.
 */

// Create user.
var REQUEST_CREATE_USER = 'REQUEST_CREATE_USER';
var CANCEL_CREATE_USER = 'CANCEL_CREATE_USER';
var CREATE_USER = 'CREATE_USER';
var CREATE_USER_PENDING = 'CREATE_USER_PENDING';
var CREATE_USER_REJECTED = 'CREATE_USER_REJECTED';
var CREATE_USER_FULFILLED = 'CREATE_USER_FULFILLED';

// Edit user.
var UPDATE_USER = 'UPDATE_USER';
var REQUEST_FIELDS_CHANGE = 'REQUEST_FIELDS_CHANGE';
var CANCEL_FIELDS_CHANGE = 'CANCEL_FIELDS_CHANGE';
var FIELDS_CHANGE = 'FIELDS_CHANGE';
var FIELDS_CHANGE_PENDING = 'FIELDS_CHANGE_PENDING';
var FIELDS_CHANGE_REJECTED = 'FIELDS_CHANGE_REJECTED';
var FIELDS_CHANGE_FULFILLED = 'FIELDS_CHANGE_FULFILLED';

// Fetch all.
var FETCH_USERS = 'FETCH_USERS';
var FETCH_USERS_PENDING = 'FETCH_USERS_PENDING';
var FETCH_USERS_REJECTED = 'FETCH_USERS_REJECTED';
var FETCH_USERS_FULFILLED = 'FETCH_USERS_FULFILLED';
var CLEAR_USERS = 'CLEAR_USERS';

// Fetch single.
var FETCH_USER = 'FETCH_USER';
var FETCH_USER_PENDING = 'FETCH_USER_PENDING';
var FETCH_USER_REJECTED = 'FETCH_USER_REJECTED';
var FETCH_USER_FULFILLED = 'FETCH_USER_FULFILLED';

// Fetch logs.
var FETCH_USER_LOGS = 'FETCH_USER_LOGS';
var FETCH_USER_LOGS_PENDING = 'FETCH_USER_LOGS_PENDING';
var FETCH_USER_LOGS_REJECTED = 'FETCH_USER_LOGS_REJECTED';
var FETCH_USER_LOGS_FULFILLED = 'FETCH_USER_LOGS_FULFILLED';

// Fetch devices.
var FETCH_USER_DEVICES = 'FETCH_USER_DEVICES';
var FETCH_USER_DEVICES_PENDING = 'FETCH_USER_DEVICES_PENDING';
var FETCH_USER_DEVICES_REJECTED = 'FETCH_USER_DEVICES_REJECTED';
var FETCH_USER_DEVICES_FULFILLED = 'FETCH_USER_DEVICES_FULFILLED';

// Remove MFA.
var REQUEST_REMOVE_MULTIFACTOR = 'REQUEST_REMOVE_MULTIFACTOR';
var CANCEL_REMOVE_MULTIFACTOR = 'CANCEL_REMOVE_MULTIFACTOR';
var REMOVE_MULTIFACTOR = 'REMOVE_MULTIFACTOR';
var REMOVE_MULTIFACTOR_PENDING = 'REMOVE_MULTIFACTOR_PENDING';
var REMOVE_MULTIFACTOR_REJECTED = 'REMOVE_MULTIFACTOR_REJECTED';
var REMOVE_MULTIFACTOR_FULFILLED = 'REMOVE_MULTIFACTOR_FULFILLED';

// Block user.
var REQUEST_BLOCK_USER = 'REQUEST_BLOCK_USER';
var CANCEL_BLOCK_USER = 'CANCEL_BLOCK_USER';
var BLOCK_USER = 'BLOCK_USER';
var BLOCK_USER_PENDING = 'BLOCK_USER_PENDING';
var BLOCK_USER_REJECTED = 'BLOCK_USER_REJECTED';
var BLOCK_USER_FULFILLED = 'BLOCK_USER_FULFILLED';

// Unblock user.
var REQUEST_UNBLOCK_USER = 'REQUEST_UNBLOCK_USER';
var CANCEL_UNBLOCK_USER = 'CANCEL_UNBLOCK_USER';
var UNBLOCK_USER = 'UNBLOCK_USER';
var UNBLOCK_USER_PENDING = 'UNBLOCK_USER_PENDING';
var UNBLOCK_USER_REJECTED = 'UNBLOCK_USER_REJECTED';
var UNBLOCK_USER_FULFILLED = 'UNBLOCK_USER_FULFILLED';

// Remove user blocks.
var REQUEST_REMOVE_BLOCKED_IPS = 'REQUEST_REMOVE_BLOCKED_IPS';
var CANCEL_REMOVE_BLOCKED_IPS = 'CANCEL_REMOVE_BLOCKED_IPS';
var REMOVE_BLOCKED_IPS = 'REMOVE_BLOCKED_IPS';
var REMOVE_BLOCKED_IPS_PENDING = 'REMOVE_BLOCKED_IPS_PENDING';
var REMOVE_BLOCKED_IPS_REJECTED = 'REMOVE_BLOCKED_IPS_REJECTED';
var REMOVE_BLOCKED_IPS_FULFILLED = 'REMOVE_BLOCKED_IPS_FULFILLED';

// Delete user.
var REQUEST_DELETE_USER = 'REQUEST_DELETE_USER';
var CANCEL_DELETE_USER = 'CANCEL_DELETE_USER';
var DELETE_USER = 'DELETE_USER';
var DELETE_USER_PENDING = 'DELETE_USER_PENDING';
var DELETE_USER_REJECTED = 'DELETE_USER_REJECTED';
var DELETE_USER_FULFILLED = 'DELETE_USER_FULFILLED';

// Reset password.
var REQUEST_PASSWORD_RESET = 'REQUEST_PASSWORD_RESET';
var CANCEL_PASSWORD_RESET = 'CANCEL_PASSWORD_RESET';
var PASSWORD_RESET = 'PASSWORD_RESET';
var PASSWORD_RESET_PENDING = 'PASSWORD_RESET_PENDING';
var PASSWORD_RESET_REJECTED = 'PASSWORD_RESET_REJECTED';
var PASSWORD_RESET_FULFILLED = 'PASSWORD_RESET_FULFILLED';

// Change password.
var REQUEST_PASSWORD_CHANGE = 'REQUEST_PASSWORD_CHANGE';
var CANCEL_PASSWORD_CHANGE = 'CANCEL_PASSWORD_CHANGE';
var PASSWORD_CHANGE = 'PASSWORD_CHANGE';
var PASSWORD_CHANGE_PENDING = 'PASSWORD_CHANGE_PENDING';
var PASSWORD_CHANGE_REJECTED = 'PASSWORD_CHANGE_REJECTED';
var PASSWORD_CHANGE_FULFILLED = 'PASSWORD_CHANGE_FULFILLED';

// Change username.
var REQUEST_USERNAME_CHANGE = 'REQUEST_USERNAME_CHANGE';
var CANCEL_USERNAME_CHANGE = 'CANCEL_USERNAME_CHANGE';
var USERNAME_CHANGE = 'USERNAME_CHANGE';
var USERNAME_CHANGE_PENDING = 'USERNAME_CHANGE_PENDING';
var USERNAME_CHANGE_REJECTED = 'USERNAME_CHANGE_REJECTED';
var USERNAME_CHANGE_FULFILLED = 'USERNAME_CHANGE_FULFILLED';

// Change email.
var REQUEST_EMAIL_CHANGE = 'REQUEST_EMAIL_CHANGE';
var CANCEL_EMAIL_CHANGE = 'CANCEL_EMAIL_CHANGE';
var EMAIL_CHANGE = 'EMAIL_CHANGE';
var EMAIL_CHANGE_PENDING = 'EMAIL_CHANGE_PENDING';
var EMAIL_CHANGE_REJECTED = 'EMAIL_CHANGE_REJECTED';
var EMAIL_CHANGE_FULFILLED = 'EMAIL_CHANGE_FULFILLED';

// Resend verification email.
var REQUEST_RESEND_VERIFICATION_EMAIL = 'REQUEST_RESEND_VERIFICATION_EMAIL';
var CANCEL_RESEND_VERIFICATION_EMAIL = 'CANCEL_RESEND_VERIFICATION_EMAIL';
var RESEND_VERIFICATION_EMAIL = 'RESEND_VERIFICATION_EMAIL';
var RESEND_VERIFICATION_EMAIL_PENDING = 'RESEND_VERIFICATION_EMAIL_PENDING';
var RESEND_VERIFICATION_EMAIL_REJECTED = 'RESEND_VERIFICATION_EMAIL_REJECTED';
var RESEND_VERIFICATION_EMAIL_FULFILLED = 'RESEND_VERIFICATION_EMAIL_FULFILLED';

/*
 * User Picker.
 */

var CONFIRM_USER_PICKER = 'CONFIRM_USER_PICKER';
var CANCEL_USER_PICKER = 'CANCEL_USER_PICKER';

// Open.
var OPEN_USER_PICKER = 'OPEN_USER_PICKER';

// Search.
var SEARCH_USER_PICKER = 'SEARCH_USER_PICKER';
var SEARCH_USER_PICKER_PENDING = 'SEARCH_USER_PICKER_PENDING';
var SEARCH_USER_PICKER_REJECTED = 'SEARCH_USER_PICKER_REJECTED';
var SEARCH_USER_PICKER_FULFILLED = 'SEARCH_USER_PICKER_FULFILLED';

// Select.
var SELECT_USER = 'SELECT_USER';
var UNSELECT_USER = 'UNSELECT_USER';

// Scripts.
var FETCH_SCRIPT = 'FETCH_SCRIPT';
var FETCH_SCRIPT_PENDING = 'FETCH_SCRIPT_PENDING';
var FETCH_SCRIPT_REJECTED = 'FETCH_SCRIPT_REJECTED';
var FETCH_SCRIPT_FULFILLED = 'FETCH_SCRIPT_FULFILLED';
var UPDATE_SCRIPTS = 'UPDATE_SCRIPTS';
var UPDATE_SCRIPTS_PENDING = 'UPDATE_SCRIPTS_PENDING';
var UPDATE_SCRIPTS_REJECTED = 'UPDATE_SCRIPTS_REJECTED';
var UPDATE_SCRIPTS_FULFILLED = 'UPDATE_SCRIPTS_FULFILLED';
var UPDATE_SCRIPT = 'UPDATE_SCRIPT';
var UPDATE_SCRIPT_PENDING = 'UPDATE_SCRIPT_PENDING';
var UPDATE_SCRIPT_REJECTED = 'UPDATE_SCRIPT_REJECTED';
var UPDATE_SCRIPT_FULFILLED = 'UPDATE_SCRIPT_FULFILLED';

// Memberships.
var FETCH_MEMBERSHIPS = 'FETCH_MEMBERSHIPS';
var FETCH_MEMBERSHIPS_PENDING = 'FETCH_MEMBERSHIPS_PENDING';
var FETCH_MEMBERSHIPS_REJECTED = 'FETCH_MEMBERSHIPS_REJECTED';
var FETCH_MEMBERSHIPS_FULFILLED = 'FETCH_MEMBERSHIPS_FULFILLED';

// Access Level.
var FETCH_ACCESS_LEVEL = 'FETCH_ACCESS_LEVEL';
var FETCH_ACCESS_LEVEL_PENDING = 'FETCH_ACCESS_LEVEL_PENDING';
var FETCH_ACCESS_LEVEL_REJECTED = 'FETCH_ACCESS_LEVEL_REJECTED';
var FETCH_ACCESS_LEVEL_FULFILLED = 'FETCH_ACCESS_LEVEL_FULFILLED';

// SETTINGS.
var FETCH_SETTINGS = 'FETCH_SETTINGS';
var FETCH_SETTINGS_PENDING = 'FETCH_SETTINGS_PENDING';
var FETCH_SETTINGS_REJECTED = 'FETCH_SETTINGS_REJECTED';
var FETCH_SETTINGS_FULFILLED = 'FETCH_SETTINGS_FULFILLED';
var TOGGLE_STYLE_SETTINGS = 'TOGGLE_STYLE_SETTINGS';
var GET_STYLE_SETTINGS = 'GET_STYLE_SETTINGS';

// LANGUAGE DICTIONARY.
var FETCH_LANGUAGE_DICTIONARY = 'FETCH_LANGUAGE_DICTIONARY';
var FETCH_LANGUAGE_DICTIONARY_PENDING = 'FETCH_LANGUAGE_DICTIONARY_PENDING';
var FETCH_LANGUAGE_DICTIONARY_REJECTED = 'FETCH_LANGUAGE_DICTIONARY_REJECTED';
var FETCH_LANGUAGE_DICTIONARY_FULFILLED = 'FETCH_LANGUAGE_DICTIONARY_FULFILLED';

// Access level constants
var SUPER_ADMIN = 2;

// The list of reserved user fields that must not be rendered in the custom fields edit form
var RESERVED_USER_FIELDS = ['username', 'memberships', 'connection', 'password', 'email', 'repeatPassword', 'resetPassword'];

/***/ }),

/***/ 560:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return settings; });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(16);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var _utils_createReducer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(23);





var initialState = {
  loading: false,
  error: null,
  record: Object(immutable__WEBPACK_IMPORTED_MODULE_1__[/* fromJS */ "d"])({
    settings: {
      dict: {
        title: '',
        memberships: ''
      },
      userFields: [],
      css: ''
    }
  })
};
var parseFunction = function parseFunction(property, attribute, functionString) {
  if (functionString !== undefined && lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isString(functionString) && functionString.startsWith('function')) {
    try {
      // TODO: this is scary => what else can we do?
      functionString = eval("(".concat(functionString, ")"));
    } catch (error) {
      console.error("The ".concat(attribute, " function for field ").concat(property, " throws an error"), error);
      // doing this because I couldn't get the tests to work when
      // passing back a function pointer for expect
      return eval('(function() { return "error"; })');
    }
  }
  return functionString;
};
var parseOptions = function parseOptions(options) {
  // Parse options
  if (lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isArray(options)) {
    options = options.map(function (option) {
      if (lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isString(option)) {
        return {
          label: option,
          value: option
        };
      } else if (lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isObject(option) && lodash__WEBPACK_IMPORTED_MODULE_2___default.a.has(option, 'label') && lodash__WEBPACK_IMPORTED_MODULE_2___default.a.has(option, 'value')) {
        return option;
      }
      return {
        label: 'Error',
        value: ''
      };
    });
  }
  return options;
};
var parseFieldSection = function parseFieldSection(property, sectionInfo, sectionName, inheritedDisplay) {
  if (sectionInfo && lodash__WEBPACK_IMPORTED_MODULE_2___default.a.isObject(sectionInfo)) {
    var sectionDisplay = parseFunction(property, "".concat(sectionName, ".display"), sectionInfo.display);
    var display = sectionDisplay !== undefined ? sectionDisplay : inheritedDisplay;
    if (display !== undefined) sectionInfo.display = display;
    if (sectionInfo.options) sectionInfo.options = parseOptions(sectionInfo.options);
    if (sectionInfo.validationFunction) sectionInfo.validationFunction = parseFunction(property, "".concat(sectionName, ".validationFunction"), sectionInfo.validationFunction);
  }
};
var settings = Object(_utils_createReducer__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"])(Object(immutable__WEBPACK_IMPORTED_MODULE_1__[/* fromJS */ "d"])(initialState), _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0___default()({}, _constants__WEBPACK_IMPORTED_MODULE_3__[/* FETCH_SETTINGS_PENDING */ "ib"], function (state) {
  return state.merge({
    loading: true,
    error: null
  });
}), _constants__WEBPACK_IMPORTED_MODULE_3__[/* FETCH_SETTINGS_REJECTED */ "jb"], function (state, action) {
  return state.merge({
    loading: false,
    error: action.errorData
  });
}), _constants__WEBPACK_IMPORTED_MODULE_3__[/* FETCH_SETTINGS_FULFILLED */ "hb"], function (state, action) {
  var data = action.payload.data;
  if (data.settings.userFields) {
    data.settings.userFields.forEach(function (field) {
      parseFieldSection(field.property, field, 'userField');
      parseFieldSection(field.property, field.edit, 'userField.edit', field.display);
      parseFieldSection(field.property, field.create, 'userField.create', field.display);
      parseFieldSection(field.property, field.search, 'userField.search', field.display);
    });
  }
  if (data.settings.errorTranslator) {
    data.settings.errorTranslator = parseFunction('errorTranslator', 'errorTranslator', data.settings.errorTranslator);
  }
  return state.merge({
    loading: false,
    error: null,
    record: Object(immutable__WEBPACK_IMPORTED_MODULE_1__[/* fromJS */ "d"])(data)
  });
}));

/***/ }),

/***/ 946:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

/******/ });