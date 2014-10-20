var kse=require('ksana-document').kse;
var kde=require('ksana-document').kde;
var headvoff=[2836482,9328038,10454803,11807407,11834453,12029913,12200179,12236090,12491237,12749608,12965342,13710266];


var vpos2filepage=function(vpos,index) {
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
}

kde.open("jiangkangyur",function(db){
    var engine=db;
})

headvoff.map(kse.vpos2filepage);
