FII's Crawler

# Integrating with Google SpreadSheets

Go to  `Tools/Script Editor`
It will get the selected cell and put the value, reading the first column of the row to get the Fii Name
```
function getFillsEquityPerShare() {
  var apiCall = function apiCall(name) {
    var response = UrlFetchApp.fetch("https://fiis-crawler.azurewebsites.net/api/equity-per-share?name=" + name);
    var json = response.getContentText();
    return JSON.parse(json);
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var selection = sheet.getSelection();
  var ranges = selection.getActiveRangeList().getRanges();

  for (var i = 0; i < ranges.length; i++) {
    var range = ranges[i];

    var row = range.getRow();
    var name = sheet.getRange(row, 1).getValue();
    var data = apiCall(name);

    range.setValue(data.value);
  }
}
```

*Plus*

If you want, you can create a button to generete the script
```
  Insert/Draw
```

Enjoy ⚡️