var fs=require("fs");
var head=JSON.parse(fs.readFileSync("head.json","utf8"));
var allword=0;
var headindex=[];
for(var i=0; i<head.length; i++){
	var word=head[i][0].length;
	allword=allword+word;
}
var ave=allword/head.length;

head.map(function(i,index){
	if(i[0].length>ave*3){
		//console.log("head:",index,"word:",i[0].length);
		headindex.push(index);
	}	
})

var genToc=function(texts,depths,voffs){
var out=[{depth:0,text:"Jiang Kangyur"}];
for(var i=0; i<texts.length; i++){
  out.push({text:texts[i],depth:depths[i],voff:voffs[i]});
}
return out; 
}

require("ksana-document").kde.open("jiangkangyur",function(db){

        db.get([["fields","head"],["fields","head_depth"],["fields","head_voff"]],function(){
          var heads=db.get(["fields","head"]);
          var depths=db.get(["fields","head_depth"]);
          var voffs=db.get(["fields","head_voff"]);
          var filenames=db.get
          headindex.map(function(i){
          	console.log(voffs[i]);
          })

        }); //載入目錄
    });   
