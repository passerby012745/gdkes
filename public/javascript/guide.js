var resource = null;

function getResource()
{
	return resource;
}

function initPage()
{
	var spanArray = document.getElementsByTagName("span");
	for(var i = 0; i < spanArray.length; i++)
	{
		var key = spanArray[i].getAttribute("local_key");
		spanArray[i].innerHTML = getResource()[key];
	}

}

function load()
{
	window.AppJsBridge.service.localeService.getResource({
		"success":function(data){
						resource = data;
						window.AppJsBridge.ready(function(){});
						initPage();
					},
		"error":function(data){}
	});
}
