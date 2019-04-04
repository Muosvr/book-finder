/*global fetch goodReadsApiKey DOMParser*/

function search(){
    // Get search keyword from the input
    const keyword = document.getElementById("keyword").value;
    console.log("searched for",keyword);
    
    // Declare an API key
    
    // Make a GET request to Goodreads API
    // to get book info
    const endpoint = "https://www.goodreads.com/search/index.xml";
    const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
    const url = corsAnywhere + endpoint + "?" + "key=" + goodReadsApiKey + "&q=" + keyword;
    
    fetch(url)
    .then(function(response){
        return response.text()
    }).then(function(response){
        const parser = new DOMParser();
        const parsedRes = parser.parseFromString(response, "text/xml");
        const parsedJsonRes = xmlToJson(parsedRes);
        
        console.log(parsedJsonRes);
        displayResults(parsedJsonRes);
    });
}

// Generate a list to display results from API
function displayResults(parsedObj) {
    console.log("displayReults",parsedObj);
    const works = parsedObj.GoodreadsResponse.search.results.work;
    var liGroup = "";
    
    works.forEach(function(work){
        const author = work.best_book.author.name["#text"];
        const title = work.best_book.title["#text"];
        const imgUrl = work.best_book.image_url["#text"];
        
        console.log(author, title, imgUrl);
        const img = "<img src=" + imgUrl + ">";
        const li = "<li>" + title + " by " + author + img + "</li>";
        
        liGroup += li;
    })
    
    document.getElementById("list").innerHTML = liGroup;
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