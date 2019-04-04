function searchBook(){
    const keyword = document.getElementById("keyword").value;
    const preUrl = "https://cors-anywhere.herokuapp.com/"
    const url = "https://www.goodreads.com/search/index.xml"
    
    console.log(keyword);
    
    
    fetch(preUrl + url + "?" + "key=" + goodreadsAPIKey+ "&origin=*" + "&q=" + keyword)
    .then(function(response){
        // console.log("first response", response);
        return response.text()
    }).then(function(response){
        
        const parser = new window.DOMParser();
        const parsedRes = parser.parseFromString(response, "application/xml");
        const jsonRes = xmlToJson(parsedRes);
        console.log(jsonRes);
        const works = jsonRes.GoodreadsResponse.search.results.work;
        // const works = [...parsedRes.getElementsByTagName("work")];
        
        // console.log(works);
        
        works.forEach(work=>{
            const book = work.best_book;
            
            console.log(book);
            const author = book.author.name["#text"];
            const title = book.title["#text"];
            const imgUrl = book.image_url["#text"];
            
            const li = document.createElement("li");
            li.innerHTML = title + " by " + author;
            const img = document.createElement("img");
            img.setAttribute("src", imgUrl);
            
            li.appendChild(img);
            document.getElementById("results").appendChild(li);
        })
        // console.log("jsonified")
    })
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