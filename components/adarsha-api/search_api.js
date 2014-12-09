var searchSutra=function(tofind,toc){
	var reg=new RegExp(tofind,"g");
	var out=[];
	toc.map(function(item){
		if(item.depth==3 && item.text.match(reg)){
			out.push(item);
		}
	});
	return out;
}

var searchKacha=function(tofind,toc){
	var out=[];
	var reg=new RegExp(tofind,"g");
	toc.map(function(item){

		if(item.depth!=3 && item.depth!=0 && item.text.match(reg)){
			out.push(item);
		}
	});
	return out;
}

var search_api={searchSutra:searchSutra,searchKacha:searchKacha}
module.exports=search_api;