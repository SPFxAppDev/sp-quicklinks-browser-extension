async function getTab() {
    let queryOptions = { active: true, currentWindow: true, lastFocusedWindow: true };
    let tabs = await chrome.tabs.query(queryOptions);
    return tabs[0];
}

var noSPContainer = document.querySelector(".no-sharepoit-container");
var container = document.querySelector(".qucklinks-container");

noSPContainer.classList.remove("show");
noSPContainer.classList.add("hide");
container.classList.remove("hide");




chrome.storage.sync.get({
    defaultSPLinks: JSON.stringify(window.defaultSPLinks),
    defaultPageLinks: JSON.stringify(window.defaultPageLinks),
    customLinks: JSON.stringify([]),
    webUrlsHeading: window.defaultHeading.webUrlsHeading,
    pageUrlsHeading: window.defaultHeading.pageUrlsHeading,
    customUrlsHeading: window.defaultHeading.customUrlsHeading
}, function(options) {

    getTab().then((tab) => {

	
        if(isNullOrEmpty(tab) || isNullOrEmpty(tab.url)) {
            alert("Error, cannot get url");
        }
    
        var url = tab.url.toLowerCase().split('?')[0].split('&')[0].split('#')[0];
    
        if(url.indexOf(".sharepoint.com") <= 0) {
            noSPContainer.classList.remove("hide");
            noSPContainer.classList.add("show");
            container.classList.add("hide");
            return;
        }
    
        let spWebAppUrl = url.split('/').slice(0, 3).join('/');
        let spWebUrl = "";
        let pageUrl = "";
    
    
        let isListOrLibrary = false;
        let isPage = false;
        
        
        if(url.indexOf("/sitepages/") > 0) {
            isListOrLibrary = true;
            spWebUrl = url.substring(0, url.indexOf("/sitepages/"));
            isPage = url.indexOf("/forms/") < 0 && url.indexOf(".aspx") == url.length - ".aspx".length;
    
            if(isPage) {
                pageUrl = url;
            }
        }
        else if(url.indexOf("/forms/") > 0) {
            isListOrLibrary = true;
    
            let splittedUrl = url.substring(0, url.indexOf("/forms/")).split("/");
            splittedUrl.splice(-1);
            spWebUrl = splittedUrl.join('/');
        }
        else if(url.indexOf("/lists/") > 0) {
            isListOrLibrary = true;
    
            let splittedUrl = url.substring(0, url.indexOf("/lists/")).split("/");
            spWebUrl = splittedUrl.join('/');
        }
        else if(url.indexOf("/_layouts/") > 0) {
            spWebUrl = url.substring(0, url.indexOf("/_layouts/"));
        }
        else {
            spWebUrl = url;
            isPage = true;
            pageUrl = url;
        }
    
    
        let defaultSPLinksList = document.createElement("ul");
        let defaultSPPageLinksList = document.createElement("ul");
        let customLinksList = document.createElement("ul");
        let allSPLinks = JSON.parse(options.defaultSPLinks); 
        let allPageLinks = JSON.parse(options.defaultPageLinks);
        let allCustomLinks = JSON.parse(options.customLinks);
        let showDefaultLinks = false;
        let showDefaultPageLinks = false;
        let showCustomLinks = false;


        for(let i = 0; i < allSPLinks.length; i++) {
            let linkItem = allSPLinks[i];

            if(!linkItem.enabled) {
                continue;
            }

            showDefaultLinks = true;
            let label = linkItem.label;
            let linkUrl = linkItem.url;

            let li = createListItem(tab, label, linkUrl, spWebAppUrl, spWebUrl, pageUrl, linkItem.type);
            defaultSPLinksList.appendChild(li);
        }

        if(isPage) {
            for(let i = 0; i < allPageLinks.length; i++) {
                let linkItem = allPageLinks[i];
    
                if(!linkItem.enabled) {
                    continue;
                }

                showDefaultPageLinks = true;
                let label = linkItem.label;
                let linkUrl = linkItem.url;
    
                let li = createListItem(tab, label, linkUrl, spWebAppUrl, spWebUrl, pageUrl, linkItem.type);
                defaultSPPageLinksList.appendChild(li);
            }
        }

        

        if(!isNullOrEmpty(allCustomLinks)) {
            for(let i = 0; i < allCustomLinks.length; i++) {
                let linkItem = allCustomLinks[i];
    
                if(!linkItem.enabled) {
                    continue;
                }

                if(!isPage && linkItem.url.indexOf("{pageurl}") >= 0) {
                    continue;
                }
    
                showCustomLinks = true;
                let label = linkItem.label;
                let linkUrl = linkItem.url;
    
                let li = createListItem(tab, label, linkUrl, spWebAppUrl, spWebUrl, pageUrl, linkItem.type);
                customLinksList.appendChild(li);
            }
        }
    
    
        container.innerHTML = ""; //`webapp: ${spWebAppUrl} <br/>url: ${url} <br/> webUrl: ${spWebUrl}<br/> PageUrl: ${pageUrl}`;
    
        if(showDefaultLinks) {
            let heading = document.createElement("h3");
            heading.innerText = options.webUrlsHeading;
            container.appendChild(heading);
            container.appendChild(defaultSPLinksList);
        }

        if(showDefaultPageLinks) {
            let heading = document.createElement("h3");
            heading.innerText = options.pageUrlsHeading;
            container.appendChild(heading);
            container.appendChild(defaultSPPageLinksList);
        }

        if(showCustomLinks) {
            let heading = document.createElement("h3");
            heading.innerText = options.customUrlsHeading;
            container.appendChild(heading);
            container.appendChild(customLinksList);
        }
    
    
        
    }).catch((e) => {
        alert(e);
    });

});

function createListItem(tab, label, url, spWebAppUrl, spWebUrl, spPageUrl, linkType) {
    var listItem = document.createElement("li");
    var anchor = document.createElement("a");
    var anchorUrl = tpl(url, { "weburl": spWebUrl, "webapp": spWebAppUrl, "pageurl": spPageUrl });

    anchor.href = anchorUrl;
    anchor.innerText = label;
    anchor.dataset.linkType = linkType;

    anchor.addEventListener("click", (ev) => {
        ev.preventDefault();
        let href = ev.target.href;
        let linktype = parseInt(ev.target.dataset.linkType);

        if(linktype == 2) {
            let appId = prompt("Please enter your app extenion ID from manifest.json");
            href = href.replace("{appId}", appId);
        }

        chrome.tabs.update(tab.id, {url: href});
        window.close();
        return false;
    });

    listItem.append(anchor);

    return listItem;
}

document.querySelector('#go-to-options').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

document.querySelector('#copyright').addEventListener('click', function() {
    chrome.tabs.create({url: "https://spfx-app.dev/"});
    return false;
});