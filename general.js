window.defaultSPLinks = [
    { label: "Site settings", url: "{weburl}/_layouts/15/settings.aspx", enabled: true, type: 0 },
    { label: "Site contents", url: "{weburl}/_layouts/15/viewlsts.aspx", enabled: true, type: 0 },
    { label: "Website permissions", url: "{weburl}/_layouts/15/user.aspx", enabled: true, type: 0 },
    { label: "Users & groups", url: "{weburl}/_layouts/15/people.aspx", enabled: true, type: 0 },
    { label: "Site columns", url: "{weburl}/_layouts/15/mngfield.aspx", enabled: true, type: 0 },
    { label: "Site content types", url: "{weburl}/_layouts/15/mngctype.aspx", enabled: true, type: 0 },
    { label: "Recycle Bin", url: "{weburl}/_layouts/15/AdminRecycleBin.aspx?view=5", enabled: true, type: 0 },
    { label: "2nd Stage recycle Bin", url: "{weburl}/_layouts/15/AdminRecycleBin.aspx?view=13", enabled: true, type: 0 },
    { label: "SPFx Workbench", url: "{weburl}/_layouts/15/workbench.aspx", enabled: true, type: 0 },
    { label: "Login with another user", url: "{weburl}/_layouts/15/closeConnection.aspx?loginasanotheruser=true", enabled: true, type: 0 },
];

window.defaultPageLinks = [
    { label: "Maintenance mode", url: "{pageurl}?maintenancemode=true", enabled: false, type: 1 },
    { label: "SPFx Debug", url: "{pageurl}?loadSPFX=true&debugManifestsFile=https%3A%2F%2Flocalhost%3A4321%2Ftemp%2Fmanifests.js", enabled: false, type: 1 },
    { label: "SPFx App Extension Debug", url: "{pageurl}?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js&customActions=%7B%22{appId}%22%3A%7B%22location%22%3A%22ClientSideExtension.ApplicationCustomizer%22%7D%7D", enabled: false, type: 2 },
];

window.defaultHeading = {
    webUrlsHeading: "Website Urls",
    pageUrlsHeading: "Page & Development Urls",
    customUrlsHeading: "Custom Urls",
}

function tpl(template, data) {
    return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
      var keys = key.split("."), v = data[keys.shift()];
      for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
      return (typeof v !== "undefined" && v !== null) ? v : "{" + key + "}";
    });
}

function isset(property) {
    return typeof property !== 'undefined' && property != null;
}

function isNullOrEmpty(property) {
    if (!isset(property)) {
        return true;
    }
    if (typeof property === 'string') {
        return property.trim().length < 1;
    }
    if (!property.hasOwnProperty('length')) {
        return false;
    }
    return property.length < 1;
}