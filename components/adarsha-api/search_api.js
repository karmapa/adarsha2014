var searchSutra=function(tofind,toc){
	var out=[];
	toc.map(function(item){
		if(item.depth==3 && item.text.indexOf(tofind)>-1){
			out.push(item);
		}
	});
	return out;
}

var searchKacha=function(tofind,toc){
	var out=[];
	toc.map(function(item){
		if(item.depth!=3 && item.depth!=0 && item.text.indexOf(tofind)>-1){
			out.push(item);
		}
	});
	return out;
}

var search_api={searchSutra:searchSutra,searchKacha:searchKacha}
module.exports=search_api;