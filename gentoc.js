  var genToc=function(texts,depths,voffs){
    var out=[{depth:0,text:"Jiang Kangyur"}];
    for(var i=0; i<texts.length; i++){
      out.push({text:texts[i],depth:depths[i],voff:voffs[i]});
    }
    return out; 
  }
var fileindex=[308, 919, 1033, 1181, 1185, 1201, 1223, 1224, 1252, 1282, 1306, 1381]
var headvoff=[2836482,9328038,10454803,11807407,11834453,12029913,12200179,12236090,12491237,12749608,12965342,13710266];
var vpos2filepage=function(engine,vpos) {
    var pageOffsets=engine.get("pageOffsets");
    var fileOffsets=engine.get(["fileOffsets"]);
    var pageNames=engine.get("pageNames");
    var fileid=bsearch(fileOffsets,vpos+1,true);
    fileid--;
    var pageid=bsearch(pageOffsets,vpos+1,true);
    pageid--;
    while (pageid&&pageid<pageOffsets.length-1&&
      pageOffsets[pageid-1]==pageOffsets[pageid]) {
      pageid++;
    }

    var fileOffset=fileOffsets[fileid];
    var pageOffset=bsearch(pageOffsets,fileOffset+1,true);
    pageOffset--;
    pageid-=pageOffset;
    return {file:fileid,page:pageid};
    //console.log("file:",fileid,"page:",pageid);
}

var bsearch=require("ksana-document").bsearch;
require("ksana-document").kde.open("jiangkangyur",function(db){

        db.get([["fields","head"],["fields","head_depth"],["fields","head_voff"]],function(){

          var heads=db.get(["fields","head"]);
          var depths=db.get(["fields","head_depth"]);
          var voffs=db.get(["fields","head_voff"]);
          var filenames=db.get(["fileNames"]);
          
          headvoff.map(function(i){
            var res=vpos2filepage(db,i);
            console.log("file:",filenames[res.file],"page:",res.page);
          });

          var toc=genToc(heads,depths,voffs);
          //console.log(filenames);
        }); //載入目錄
    });    
      