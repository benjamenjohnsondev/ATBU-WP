const DATE = new Date();
const EXPORT_FILENAME = 'ATBU-export_' + DATE.getDate() + DATE.getMonth() + DATE.getFullYear() + '.csv';
const toUrlEncoded = obj => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');
const wpExportData = {
  'action': 'atbuExport',
  'security': wpAjax.export_nonce,
  'ajaxurl': wpAjax.ajaxurl
};

let wpImportData = {
  'action': 'atbuImport',
  'security': wpAjax.import_nonce,
  'ajaxurl': wpAjax.ajaxurl
};

jQuery(document).ready(function($) {
  $('#download-link').on('click', function() {
    return ajaxExport(wpExportData.ajaxurl, wpExportData, EXPORT_FILENAME);
  });
  $('#import-link').on('click', () => {
    let fileEl = $('#user-import-file');
    $('#import-results-table').remove();
    return handleImport(wpImportData.ajaxurl, wpImportData, fileEl);
  });
});

function ajaxImport(url, wpData) {
  let spinnerEl = document.getElementById('import-spinner');
  spinnerEl.classList.add('is-active');
  let resultsTable = document.getElementById('import-results');
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/x-www-form-urlencoded;',
      'Content-Type': 'application/x-www-form-urlencoded;'
    },
    body: toUrlEncoded(wpData),
    credentials: 'same-origin'
  }).then(response => {
    return response.json();
  }).then(res => {
    spinnerEl.classList.remove('is-active');
    resultsMarkup(res.data, resultsTable);
  }).catch(err => {
    throw err;
  });
}

function resultsMarkup(data, tabelWrapper) {
  let frag = document.createDocumentFragment();
  let table = document.createElement('table');
  table.setAttribute('id', 'import-results-table');
  let tableEl = frag.appendChild(table);
  data.map((row) => {
    let tabelRowEl = tableEl.insertRow();
    row.map((content) => {
      let tableCell = tabelRowEl.insertCell();
      tableCell.innerHTML = content;
    });
  });
  tabelWrapper.appendChild(frag);
}

function handleImport(ajaxUrl, wpData, fileEl) {
  let glob = createBlob(fileEl);
  let data = readFile(glob);
  data.then((res) => {
    wpImportData.importData = JSON.stringify(res);
    ajaxImport(ajaxUrl, wpData);
  }).then(() => {

  });
}

function createBlob(fileEl) {
  let data = fileEl[0].files[0],
    contentType = 'text/csv',
    dataType = data.type,
    blob = null;
  /*
   TODO: CHAIN PROMISES HERE - VALIDATE FILE TYPE ON SERVER
   ! Remove below file falidation
  */
  try {
    blob = new Blob([data], {
      type: contentType
    });
  } catch (error) {
    return console.error('Please upload a file');
  }
  if (dataType != contentType) {
    throw new Error('Incorrect file type, please upload a csv file');
  }
  return blob;
}

function readFile(fileBlob) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    let glob = [];
    reader.readAsText(fileBlob);
    reader.onload = () => {
      glob = processData(reader.result);
    };
    reader.onloadend = () => {
      resolve(glob);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

function processData(csv) {
  let allTextLines = csv.split(/\r\n|\n/);
  let rows = [];
  allTextLines.map((row) => {
    let cellsArr = [];
    let cells = row.split(',');
    cells.map((cell) => {
      cellsArr.push(cell);
    });
    rows.push(cellsArr);
  });
  return (rows);
}

function ajaxExport(url, data, filename) {
  let spinnerEl = document.getElementById('export-spinner');
  spinnerEl.classList.add('is-active');
  const FILENAME = filename;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/x-www-form-urlencoded;',
      'Content-Type': 'application/x-www-form-urlencoded;'
    },
    body: toUrlEncoded(data),
    credentials: 'same-origin'
  }).then(response => {
    return response.json();
  }).then(res => {
    let obj = res.data;
    let title = 'id,guid,alt\r\n';
    obj.map(rowArray => {
      let row = rowArray.join(',');
      title += row + '\r\n';
    });
    return saveData(title, FILENAME);
  }).then(
    () => {
      spinnerEl.classList.remove('is-active');
    }
  ).catch(err => {
    throw err;
  });
}

function saveData(data, fileName) {
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  var contentType = 'text/csv',
    blob = new Blob([data], {
      type: contentType
    }),
    url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}