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
var renderItem=Require("renderItem");
var tibetan=Require("ksana-document").languages.tibetan; 
var page2catalog=Require("page2catalog");
var namelist=Require("namelist");
var version="v0.1.03"
var main = React.createClass({
  componentDidMount:function() {
    var that=this;
    //window.onhashchange = function () {that.goHashTag();}   
  }, 
  getInitialState: function() {
    document.title=version+"-adarsha";
    return {dialog:null,res:{},res_toc:[],bodytext:{file:0,page:0},db:null,toc_result:[],page:0,field:"sutra"};
  },
  componentDidUpdate:function()  {
    var ch=document.documentElement.clientHeight;
    var banner=82;
    this.refs["text-content"].getDOMNode().style.height=ch-banner+"px";
    this.refs["tab-content"].getDOMNode().style.height=(ch-banner-40)+"px";
  },  
  encodeHashTag:function(file,p) { //file/page to hash tag
    var f=parseInt(file)+1;
    var pagename=this.state.db.getFilePageNames(f)[p];
    return "#"+f+"."+p;
  },
  decodeHashTag:function(s) {
    var fp=s.match(/#(\d+)\.(.*)/);
    var p=parseInt(fp[2]);
    var file=parseInt(fp[1])-1;
    var pagename=this.state.db.getFilePageNames(file)[p];   
    this.setPage(pagename,file);
  },
  goHashTag:function() {
    this.decodeHashTag(window.location.hash || "#1.1");
  },
  searchtypechange:function(e) {
    var field=e.target.dataset.type;
    var w=this.refs.tofind.getDOMNode().value;
    var tofind=tibetan.romanize.fromWylie(w);
    this.dosearch(null,null,0,field,tofind);
    this.setState({field:field});
  },
  dosearch: function(e,reactid,start,field,tofind){
    field=field || this.state.field;
    if(field == "fulltext"){
      kse.search(this.state.db,tofind,{range:{start:start,maxhit:100}},function(data){ //call search engine          
        this.setState({res:data, tofind:tofind, res_toc:[]});  
      });
    }
    if(field == "kacha"){
      var res_kacha=api.search_api.searchKacha(tofind,this.state.toc);
      this.setState({res_toc:res_kacha, tofind:tofind, res:[]});
    }
    if(field == "sutra"){
      var res_sutra=api.search_api.searchSutra(tofind,this.state.toc);
      this.setState({res_toc:res_sutra, tofind:tofind, res:[]});
    }
    
  },
  renderinputs:function(searcharea) {  // input interface for search // onInput={this.searchtypechange}
    if (this.state.db) {
      return (    
        <div>
        <input className="form-control" ref="tofind" defaultValue="byang chub"></input>
        <span className="wylie">{this.state.wylie}</span>
        </div>
        )          
    } else {
      return <span>loading database....</span>
    }
  },   
  genToc:function(texts,depths,voffs){
    var out=[{depth:0,text:"འཇང་བཀའ་འགྱུར།"}];
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
          this.goHashTag();
        }); //載入目錄
    },this);    
      
    this.setState({dialog:false,quota:quota,usage:usage});
    
  },
  openFileinstaller:function(autoclose) {
    if (window.location.origin.indexOf("http://127.0.0.1")==0) {
      require_kdb[0].url=window.location.origin+window.location.pathname+"jiangkangyur.kdb";
    }
    return <fileinstaller quota="512M" autoclose={autoclose} needed={require_kdb} 
                     onReady={this.onReady}/>
  },
  showExcerpt:function(n) {
    var voff=this.state.toc[n].voff;
    this.dosearch(null,null,voff);
  },
  gotofile:function(vpos){
    var res=kse.vpos2filepage(this.state.db,vpos);
    this.showPage(res.file,res.page-1,false);
  },
  showPage:function(f,p,hideResultlist) {    
    window.location.hash = this.encodeHashTag(f,p);
    var that=this;
    kse.highlightFile(this.state.db,f,{q:this.state.tofind},function(data){
      that.setState({bodytext:data,page:p});
      if (hideResultlist) that.setState({res:[]});     
    });

  }, 
  showText:function(n) {
    var res=kse.vpos2filepage(this.state.db,this.state.toc[n].voff);
    this.showPage(res.file,res.page,true);
  },
  nextfile:function() {
    var file=this.state.bodytext.file+1;
    var page=this.state.bodytext.page || 1;
    this.showPage(file,page,false);
  },
  prevfile:function() {
    var file=this.state.bodytext.file-1;
    var page=this.state.bodytext.page || 1;
    if (file<0) file=0;
    this.showPage(file,page,false);
  },
  setPage:function(newpagename,file) {
    var fp=this.state.db.findPage(newpagename);
    if (fp.length){
      this.showPage(fp[0].file,fp[0].page);
    }
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
  <div className="row">
    <div className="col-md-12">
      <div className="header">
        &nbsp;&nbsp;<img height="80px" src="./banner/banner-01.png"/>

      </div>

      <div className="row">
        <div className="col-md-3">
          <div className="borderright">
            <ul className="nav nav-tabs" role="tablist">
              <li className="active"><a href="#Catalog" role="tab" data-toggle="tab">དཀར་ཆགས།</a></li>
              <li><a href="#Search" role="tab" data-toggle="tab">འཚོལ་བ།</a></li>
            </ul>

            <div className="tab-content" ref="tab-content">
              <div className="tab-pane fade in active" id="Catalog">               
                <stacktoc showText={this.showText} showExcerpt={this.showExcerpt} hits={this.state.res.rawresult} data={this.state.toc} goVoff={this.state.goVoff} />
              </div>

              <div className="tab-pane fade" id="Search">
                {this.renderinputs("title")}
                <div className="btn-group" data-toggle="buttons" ref="searchtype" onClick={this.searchtypechange}>
                  <label data-type="sutra" className="btn btn-success">
                  <input type="radio" name="field" autocomplete="off">མདོ་ཡི་མཚན་འཚོལ་བ།</input>
                  </label>
                  <label data-type="kacha" className="btn btn-success">
                  <input type="radio" name="field" autocomplete="off">དཀར་ཆགས་འཚོལ་བ།</input>
                  </label>
                  <label data-type="fulltext" className="btn btn-success" >
                  <input type="radio" name="field" autocomplete="off">ནང་དོན་འཚོལ་བ།</input>
                  </label>
                </div>         
                <namelist res_toc={this.state.res_toc} tofind={this.state.tofind} gotofile={this.gotofile} />
                <resultlist res={this.state.res} tofind={this.state.tofind} gotofile={this.gotofile} />
              </div>        
            </div>      
          </div>     
        </div>

        <div className="col-md-9">
          <div className="text text-content" ref="text-content">
          <showtext page={this.state.page}  bodytext={this.state.bodytext} text={text} nextfile={this.nextfile} prevfile={this.prevfile} setpage={this.setPage} db={this.state.db} toc={this.state.toc} />
          </div>
        </div>
      </div>
    </div>
  </div>
      );
    }
  }
});

module.exports=main;