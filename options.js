// Saves options to chrome.storage
var defaultLinkRowTpl = `
<div class="row jsInputRow">
    <div class="cell header">
        <input type="text" value="{urlInputValue}" disabled />
    </div>
    <div class="cell header">
        <input type="text" value="{labelInputValue}" />
    </div>
    <div class="cell header">
        <input type="checkbox" {checked} />
    </div>
</div>
`;

var customLinkRowTpl = `
<div class="cell header">
    <input type="text" value="{urlInputValue}" />
</div>
<div class="cell header">
    <input type="text" value="{labelInputValue}" />
</div>
<div class="cell header">
    <input type="checkbox" {checked} />
    <button type="button" class="jsDeleteBtn" title="Delete">X</button>
</div>
`;

function save_options() {
   
    let webUrlsHeadingInput = document.querySelector("input[name='webUrlsHeading']");
    let pageUrlsHeadingInput = document.querySelector("input[name='pageUrlsHeading']");
    let customUrlsHeadingInput = document.querySelector("input[name='customUrlsHeading']");


    let webUrlsTableRows = document.querySelectorAll(".jsWebUrls .jsInputRow");
    let pageUrlsTableRows = document.querySelectorAll(".jsPageUrls .jsInputRow");
    let customUrlsTableRows = document.querySelectorAll(".jsCustomUrls .jsInputRow");

    var webUrlsToSafe = [];
    var pageUrlsToSafe = [];
    var customUrlsToSafe = [];

    for(var i = 0; i < webUrlsTableRows.length; i++) {

        let currentRow = webUrlsTableRows[i];
        let allInputs = currentRow.querySelectorAll("input");

        let url = allInputs[0].value;
        let name = allInputs[1].value;
        let enabled = allInputs[2].checked;

        webUrlsToSafe.push({
            url: url,
            label: name,
            type: "0",
            enabled: enabled
        });
    }

    for(var i = 0; i < pageUrlsTableRows.length; i++) {

        let currentRow = pageUrlsTableRows[i];
        let allInputs = currentRow.querySelectorAll("input");

        let url = allInputs[0].value;
        let name = allInputs[1].value;
        let enabled = allInputs[2].checked;

        pageUrlsToSafe.push({
            url: url,
            label: name,
            type: url.indexOf("{appId}") >= 0 ? "2" : "1",
            enabled: enabled
        });
    }

    for(var i = 0; i < customUrlsTableRows.length; i++) {

        let currentRow = customUrlsTableRows[i];
        let allInputs = currentRow.querySelectorAll("input");

        let url = allInputs[0].value;
        let name = allInputs[1].value;
        let enabled = allInputs[2].checked;

        customUrlsToSafe.push({
            url: url,
            label: name,
            type: "3",
            enabled: enabled
        });
    }
    
    chrome.storage.sync.set({
        defaultSPLinks: JSON.stringify(webUrlsToSafe),
        defaultPageLinks: JSON.stringify(pageUrlsToSafe),
        customLinks: JSON.stringify(customUrlsToSafe),
        webUrlsHeading: webUrlsHeadingInput.value,
        pageUrlsHeading: pageUrlsHeadingInput.value,
        customUrlsHeading: customUrlsHeadingInput.value
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.classList.add("success");
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
        status.classList.remove("success");
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {




    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        defaultSPLinks: JSON.stringify(window.defaultSPLinks),
        defaultPageLinks: JSON.stringify(window.defaultPageLinks),
        customLinks: JSON.stringify([]),
        webUrlsHeading: window.defaultHeading.webUrlsHeading,
        pageUrlsHeading: window.defaultHeading.pageUrlsHeading,
        customUrlsHeading: window.defaultHeading.customUrlsHeading
    }, function(options) {

        let webUrlsTable = document.querySelector(".jsWebUrls");
        let pageUrlsTable = document.querySelector(".jsPageUrls");
        let customUrlsTable = document.querySelector(".jsCustomUrls");

        let allSPLinks = JSON.parse(options.defaultSPLinks); 
        let allPageLinks = JSON.parse(options.defaultPageLinks);
        let allCustomLinks = JSON.parse(options.customLinks);


        for(let i = 0; i < allSPLinks.length; i++) {
            let url = allSPLinks[i].url;
            let label = allSPLinks[i].label;
            let enabled = allSPLinks[i].enabled;

            webUrlsTable.innerHTML += tpl(defaultLinkRowTpl, {
                urlInputValue: url,
                labelInputValue: label,
                checked: enabled ? "checked" : ""
            });
        }

        for(let i = 0; i < allPageLinks.length; i++) {
            let url = allPageLinks[i].url;
            let label = allPageLinks[i].label;
            let enabled = allPageLinks[i].enabled;

            pageUrlsTable.innerHTML += tpl(defaultLinkRowTpl, {
                urlInputValue: url,
                labelInputValue: label,
                checked: enabled ? "checked" : ""
            });
        }

        for(let i = 0; i < allCustomLinks.length; i++) {
            let url = allCustomLinks[i].url;
            let label = allCustomLinks[i].label;
            let enabled = allCustomLinks[i].enabled;

            let row = document.createElement("div");
            row.classList.add("row");
            row.classList.add("jsInputRow");
            row.innerHTML = tpl(customLinkRowTpl, {
                urlInputValue: url,
                labelInputValue: label,
                checked: enabled ? "checked" : ""
            });

            row.querySelector(".jsDeleteBtn").addEventListener("click", (ev) => {
                ev.target.parentNode.parentNode.remove();
            });

            customUrlsTable.appendChild(row);
        }

        let webUrlsHeadingInput = document.querySelector("input[name='webUrlsHeading']");
        let pageUrlsHeadingInput = document.querySelector("input[name='pageUrlsHeading']");
        let customUrlsHeadingInput = document.querySelector("input[name='customUrlsHeading']");
        webUrlsHeadingInput.value = options.webUrlsHeading;
        pageUrlsHeadingInput.value = options.pageUrlsHeading;
        customUrlsHeadingInput.value = options.customUrlsHeading;

    });
  }

  function onAddNewClicked() {
    let customUrlsTable = document.querySelector(".jsCustomUrls");

    let row = document.createElement("div");
    row.classList.add("row");
    row.classList.add("jsInputRow");
    row.innerHTML = tpl(customLinkRowTpl, {
        urlInputValue: "",
        labelInputValue: "",
        checked: "checked"
    });

    row.querySelector(".jsDeleteBtn").addEventListener("click", (ev) => {
        ev.target.parentNode.parentNode.remove();
    });

    customUrlsTable.appendChild(row);
  }

  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click', save_options);
  document.getElementById('addNew').addEventListener('click', onAddNewClicked);
  