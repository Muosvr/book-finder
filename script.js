function search(){
    const keyword = document.getElementById("keyword").value;
    console.log(keyword);
    
    console.log(goodreadsApiKey);
    
    // Get results from API using fetch
    const endpoint = 'https://www.goodreads.com/search/index.xml';
    const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
    const url = corsAnywhere + endpoint + "?"+"key=" + goodreadsApiKey +"&" +"q=" + keyword;
    
    fetch(url)
    .then(function(response){
        console.log(response);
        return response.text();
    })
    .then(function(response){
        const parser = new DOMParser();
        const parsedRes = parser.parseFromString(response, "text/xml");
        const parsedJson = xmlToJson(parsedRes);
        console.log(parsedJson);
    })
    
    // Display results on page as a list
}



// Changes XML to JSON
// Source: https://davidwalsh.name/convert-xml-json
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};