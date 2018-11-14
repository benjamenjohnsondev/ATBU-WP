/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 	__webpack_require__.p = "/home/benhogben/.valet/Sites/atbu-plugin/wp-content/plugins/atbu/build";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var DATE = new Date();\nvar EXPORT_FILENAME = 'ATBU-export_' + DATE.getDate() + DATE.getMonth() + DATE.getFullYear() + '.csv';\n\nvar toUrlEncoded = function toUrlEncoded(obj) {\n  return Object.keys(obj).map(function (k) {\n    return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);\n  }).join('&');\n};\n\nvar wpExportData = {\n  'action': 'atbuExport',\n  'security': wpAjax.export_nonce,\n  'ajaxurl': wpAjax.ajaxurl\n};\nvar wpImportData = {\n  'action': 'atbuImport',\n  'security': wpAjax.import_nonce,\n  'ajaxurl': wpAjax.ajaxurl\n};\njQuery(document).ready(function ($) {\n  $('#download-link').on('click', function () {\n    return ajaxExport(wpExportData.ajaxurl, wpExportData, EXPORT_FILENAME);\n  });\n  $('#import-link').on('click', function () {\n    var fileEl = $('#user-import-file');\n    $('#import-results-table').remove();\n    return handleImport(wpImportData.ajaxurl, wpImportData, fileEl);\n  });\n});\n\nfunction ajaxImport(url, wpData) {\n  var spinnerEl = document.getElementById('import-spinner');\n  spinnerEl.classList.add('is-active');\n  var resultsTable = document.getElementById('import-results');\n  return fetch(url, {\n    method: 'POST',\n    headers: {\n      'Accept': 'application/x-www-form-urlencoded;',\n      'Content-Type': 'application/x-www-form-urlencoded;'\n    },\n    body: toUrlEncoded(wpData),\n    credentials: 'same-origin'\n  }).then(function (response) {\n    return response.json();\n  }).then(function (res) {\n    spinnerEl.classList.remove('is-active');\n    resultsMarkup(res.data, resultsTable);\n  }).catch(function (err) {\n    throw err;\n  });\n}\n\nfunction resultsMarkup(data, tabelWrapper) {\n  var frag = document.createDocumentFragment();\n  var table = document.createElement('table');\n  table.setAttribute('id', 'import-results-table');\n  var tableEl = frag.appendChild(table);\n  data.map(function (row) {\n    var tabelRowEl = tableEl.insertRow();\n    row.map(function (content) {\n      var tableCell = tabelRowEl.insertCell();\n      tableCell.innerHTML = content;\n    });\n  });\n  tabelWrapper.appendChild(frag);\n}\n\nfunction handleImport(ajaxUrl, wpData, fileEl) {\n  var glob = createBlob(fileEl);\n  var data = readFile(glob);\n  data.then(function (res) {\n    wpImportData.importData = JSON.stringify(res);\n    ajaxImport(ajaxUrl, wpData);\n  }).then(function () {});\n}\n\nfunction createBlob(fileEl) {\n  var data = fileEl[0].files[0],\n      contentType = 'text/csv',\n      dataType = data.type,\n      blob = null;\n  /*\n   TODO: CHAIN PROMISES HERE - VALIDATE FILE TYPE ON SERVER\n   ! Remove below file falidation\n  */\n\n  try {\n    blob = new Blob([data], {\n      type: contentType\n    });\n  } catch (error) {\n    return console.error('Please upload a file');\n  }\n\n  if (dataType != contentType) {\n    throw new Error('Incorrect file type, please upload a csv file');\n  }\n\n  return blob;\n}\n\nfunction readFile(fileBlob) {\n  return new Promise(function (resolve, reject) {\n    var reader = new FileReader();\n    var glob = [];\n    reader.readAsText(fileBlob);\n\n    reader.onload = function () {\n      glob = processData(reader.result);\n    };\n\n    reader.onloadend = function () {\n      resolve(glob);\n    };\n\n    reader.onerror = function (error) {\n      reject(error);\n    };\n  });\n}\n\nfunction processData(csv) {\n  var allTextLines = csv.split(/\\r\\n|\\n/);\n  var rows = [];\n  allTextLines.map(function (row) {\n    var cellsArr = [];\n    var cells = row.split(',');\n    cells.map(function (cell) {\n      cellsArr.push(cell);\n    });\n    rows.push(cellsArr);\n  });\n  return rows;\n}\n\nfunction ajaxExport(url, data, filename) {\n  var spinnerEl = document.getElementById('export-spinner');\n  spinnerEl.classList.add('is-active');\n  var FILENAME = filename;\n  return fetch(url, {\n    method: 'POST',\n    headers: {\n      'Accept': 'application/x-www-form-urlencoded;',\n      'Content-Type': 'application/x-www-form-urlencoded;'\n    },\n    body: toUrlEncoded(data),\n    credentials: 'same-origin'\n  }).then(function (response) {\n    return response.json();\n  }).then(function (res) {\n    var obj = res.data;\n    var title = 'id,guid,alt\\r\\n';\n    obj.map(function (rowArray) {\n      var row = rowArray.join(',');\n      title += row + '\\r\\n';\n    });\n    return saveData(title, FILENAME);\n  }).then(function () {\n    spinnerEl.classList.remove('is-active');\n  }).catch(function (err) {\n    throw err;\n  });\n}\n\nfunction saveData(data, fileName) {\n  var a = document.createElement('a');\n  document.body.appendChild(a);\n  a.style = 'display: none';\n  var contentType = 'text/csv',\n      blob = new Blob([data], {\n    type: contentType\n  }),\n      url = window.URL.createObjectURL(blob);\n  a.href = url;\n  a.download = fileName;\n  a.click();\n  window.URL.revokeObjectURL(url);\n}\n\n//# sourceURL=webpack:///./src/js/app.js?");

/***/ }),

/***/ "./src/scss/main.scss":
/*!****************************!*\
  !*** ./src/scss/main.scss ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/scss/main.scss?");

/***/ }),

/***/ 0:
/*!**************************************************!*\
  !*** multi ./src/scss/main.scss ./src/js/app.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/scss/main.scss */\"./src/scss/main.scss\");\nmodule.exports = __webpack_require__(/*! ./src/js/app.js */\"./src/js/app.js\");\n\n\n//# sourceURL=webpack:///multi_./src/scss/main.scss_./src/js/app.js?");

/***/ })

/******/ });
//# sourceMappingURL=main.js.map