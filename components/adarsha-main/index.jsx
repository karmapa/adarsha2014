/** @jsx React.DOM */

/* to rename the component,
 change name of ./component.js and  "dependencies" section of ../../component.js */
var require_kdb=[{ 
  filename:"jiangkangyur.kdb"  , 
  url:"http://ya.ksana.tw/kdb/jiangkangyur.kdb" , desc:"jiangkangyur"
}];  
//var othercomponent=Require("other"); 
var bootstrap=Require("bootstrap");  
var resultlist=Require("resultlist");
var fileinstaller=Require("fileinstaller");
var kde=Require('ksana-document').kde;  // Ksana Database Engine
var kse=Require('ksana-document').kse; // Ksana Search Engine (run at client side)
var api=Require("api");
var stacktoc=Require("stacktoc");  //載入目錄顯示元件
var showtext=Require("showtext");
     

var main = React.createClass({
  getInitialState: function() {
    return {dialog:null,res:{},db:null};
  },
  genToc:function(texts,depths,voffs){
    var out=[{depth:0,text:"Jiang Kangyur"}];
    for(var i=0; i<texts.length; i++){
      out.push({text:texts[i],depth:depths[i],voff:voffs[i]});
    }
    return out; 
  },// 轉換為stacktoc 目錄格式
  onReady:function(usage,quota) {
    if (!this.state.db) kde.open("jiangkangyur",function(db){
        this.setState({db:db});
    db.get([["fields","head"],["fields","head_depth"],["fields","head_voff"]],function(){
      var heads=db.get(["fields","head"]);
      var depths=db.get(["fields","head_depth"]);
      var voffs=db.get(["fields","head_voff"]);
      var toc=this.genToc(heads,depths,voffs);
      this.setState({toc:toc});
    }); //載入目錄
    },this);      
    this.setState({dialog:false,quota:quota,usage:usage});
  },
  openFileinstaller:function(autoclose) {
    if (window.location.origin.indexOf("http://127.0.0.1")==0) {
      for (var i=0;i<require_kdb.length;i++) {
        require_kdb[i].url=window.location.origin+"/"+require_kdb[i].filename;  
      }
    }

    return <fileinstaller quota="512M" autoclose={autoclose} needed={require_kdb} 
                     onReady={this.onReady}/>
  },
  dosearch: function(){
    var start=arguments[2];  
    var tofind=tofind=this.refs.tofind.getDOMNode().value;
    kse.search(this.state.db,tofind,{range:{start:start,maxhit:100}},function(data){ //call search engine          
      this.setState({res:data, tofind:tofind});  
    });
  },
  dosearch_ex: function(e) {    
    var tofind=e.target.innerHTML;
    kse.search(this.state.db,tofind,{range:{maxhit:100}},function(data){ //call search engine          
      this.setState({res:data, tofind:tofind});  
    });
  },
  dosearch_toc: function(){
    var out=[];
    var tofind_toc=this.refs.tofind_toc.getDOMNode().value;
    this.state.toc.forEach(function(t){
      if(t.text.match(tofind_toc)){
        out.push(t);
      };
    });
    this.setState
      console.log(out); 
  },
  showExcerpt:function(n) {
    var voff=this.state.toc[n].voff;
    this.dosearch(null,null,voff);
  }, 
  showPage:function(f,p,hideResultlist) {

    kse.highlightPage(this.state.db,f,p,{ q:this.state.tofind},function(data){
      this.setState({bodytext:data});
      if (hideResultlist) this.setState({res:[]});
    });
  }, 
  showText:function(n) {
    var res=kse.vpos2filepage(this.state.db,this.state.toc[n].voff);
    this.showPage(res.file,res.page,true);
  },
  gotopage:function(vpos){
    var res=kse.vpos2filepage(this.state.db,vpos);
    this.showPage(res.file,res.page-1,false);
  },
  nextpage:function() {
    var page=this.state.bodytext.page+1;
    this.showPage(this.state.bodytext.file,page,false);
    console.log(this.showPage(this.state.bodytext.file,page),"next");
  },
  prevpage:function() {
    var page=this.state.bodytext.page-1;
    if (page<0) page=0;
    this.showPage(this.state.bodytext.file,page,false);
    console.log(this.showPage(this.state.bodytext.file,page),"prev");
  },
  render: function() {
    if (!this.state.quota) { // install required db
        return this.openFileinstaller(true);
    } else { 
      var text="",pagename="";
      if (this.state.bodytext) {
        text=this.state.bodytext.text;
        pagename=this.state.bodytext.pagename;
    }
      return (
        <div>
          <div className="col-md-4">
            <input onInput={this.dosearch_toc} ref="tofind_toc"></input>
            <stacktoc showText={this.showText} showExcerpt={this.showExcerpt} hits={this.state.res.rawresult} data={this.state.toc}/>// 顯示目錄
          </div>
          <div className="col-md-8">
            <div className="text">
            <showtext pagename={pagename} text={text} nextpage={this.nextpage} prevpage={this.prevpage}/>
            </div>
            <div className="search">
              <br/><input ref="tofind" defaultValue="དགེ"></input>
              <button onClick={this.dosearch} className="btn btn-success btn-xs">Search</button>
              Search Example:   1.<a href='#' onClick={this.dosearch_ex} >བྱས</a>
              2. <a href='#' onClick={this.dosearch_ex} >གནས</a>
              3. <a href='#' onClick={this.dosearch_ex} >འགྱུར</a>
              4. <a href='#' onClick={this.dosearch_ex} >བདག</a>
              5. <a href='#' onClick={this.dosearch_ex} >དགའ</a>
              <resultlist res={this.state.res} tofind={this.state.tofind} gotopage={this.gotopage}/>
              <span>{this.state.elapse}</span>


            </div>
          </div>
        </div>
      );
    }
  }
});

module.exports=main;