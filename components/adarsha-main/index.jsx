/** @jsx React.DOM */

/* to rename the component,
 change name of ./component.js and  "dependencies" section of ../../component.js */
var require_kdb=[{ 
  filename:"jiangkangyur.kdb"  , 
  url:"http://ya.ksana.tw/kdb/jiangkangyur.kdb" , desc:"jiangkangyur"
}];
//var othercomponent=Require("other");
var bootstrap=Require("bootstrap");  
var Resultlist=Require("resultlist");
var Fileinstaller=Require("fileinstaller");
var kde=Require('ksana-document').kde;  // Ksana Database Engine
var kse=Require('ksana-document').kse; // Ksana Search Engine (run at client side)
var api=Require("api");
var Stacktoc=Require("stacktoc");  //載入目錄顯示元件
var Showtext=Require("showtext");
var tibetan=Require("ksana-document").languages.tibetan; 
var page2catalog=Require("page2catalog");
var Namelist=Require("namelist");
var version="v0.1.27";
var main = React.createClass({
  hideBanner:function() {
    var header=$("div.header");
    var that=this;
    header.animate({height: "0px"}, 2000, function() {
      header.hide();
      that.bannerHeight=0;
      that.setBannerHeight(0);
    });
  },
  toggleMenu:function(){
    this.setState({sidemenu:!this.state.sidemenu});
  },
  bannerHeight:100,
  componentDidMount:function() {
    var that=this;
    setTimeout(function(){
      that.hideBanner();
    },5000);
    //window.onhashchange = function () {that.goHashTag();} 

  }, 
  getInitialState: function() {
    document.title=version+"-adarsha";
    return {sidemenu:true,dialog:null,res:{},res_toc:[],bodytext:{file:0,page:0},db:null,toc_result:[],page:0,field:"sutra",scrollto:0,hide:false, wylie:false, dataN:null};
  },
  setBannerHeight:function(bannerHeight) {
    var ch=document.documentElement.clientHeight;
    this.refs["text-content"].getDOMNode().style.height=ch-bannerHeight+"px";
    this.refs["tab-content"].getDOMNode().style.height=(ch-bannerHeight-40)+"px";
  },
  componentDidUpdate:function()  {
    this.setBannerHeight(this.bannerHeight);
  },  
  encodeHashTag:function(file,p) { //file/page to hash tag
    var f=parseInt(file)+1;
    return "#"+f+"."+p;
  },
  decodeHashTag:function(s) {
    var fp=s.match(/#(\d+)\.(.*)/);
    var p=parseInt(fp[2]);

    var file=parseInt(fp[1])-1;
    if (file<0) file=0;
    if (p<0) p=0;
    var pagename=this.state.db.getFilePageNames(file)[p]; 
    this.setPage(pagename,file);
  },
  goHashTag:function() {
    this.decodeHashTag(window.location.hash || "#1.1");
  
  },  
  searchtypechange:function(e) {
    this.refs.tofind.getDOMNode().focus();
    this.dosearch(null,null,0);
  },
  tofindchange:function(e) {
    clearTimeout(this.tofindtimer);
    var that=this;
    this.tofindtimer=setTimeout(function(){
      that.dosearch(null,null,0);
    },300);
    //var field=e.target.parentElement.dataset.type;
  },
  dosearch: function(e,reactid,start){
    var field=$(this.refs.searchtype.getDOMNode()).find(".active")[0].dataset.type;
    var tofind=this.refs.tofind.getDOMNode().value.trim();
    tofind=tibetan.romanize.fromWylie(tofind);

    field=field || this.state.field;
    if(field == "fulltext"){
      kse.search(this.state.db,tofind,{range:{start:start,maxhit:100}},function(data){ //call search engine          
        this.setState({res:data, tofind:tofind, res_toc:[]});  
      });
    }
    if(field == "kacha"){
      var res_kacha=api.search_api.searchKacha(tofind,this.state.toc);
      if(tofind != "") this.setState({res_toc:res_kacha, tofind:tofind, res:[]});
      else this.setState({res_toc:[], tofind:tofind, res:[]});
    }
    if(field == "sutra"){
      var res_sutra=api.search_api.searchSutra(tofind,this.state.toc);
      if(tofind != "") this.setState({res_toc:res_sutra, tofind:tofind, res:[]});
      else this.setState({res_toc:[], tofind:tofind, res:[]});
    }
    
  },
  renderinputs:function(searcharea) {  // input interface for search // onInput={this.searchtypechange}
    if (this.state.db) {
      return (    
        <div>
        <input className="tofind form-control" ref="tofind" onInput={this.tofindchange} placeholder="type Tibetan or Wylie transliteration to search"></input>
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
    return <Fileinstaller quota="512M" autoclose={autoclose} needed={require_kdb} 
                     onReady={this.onReady}/>
  },
  showExcerpt:function(n) {
    var voff=this.state.toc[n].voff;
    this.dosearch(null,null,voff,"fulltext",this.state.tofind);
   // var searchtabid=$(".tab-pane#Search").attr("id");
    $('.nav a[href=#Search]').tab('show');
  },
  gotofile:function(vpos){
    var res=kse.vpos2filepage(this.state.db,vpos);
    this.showPage(res.file,res.page);
  },
  showPage:function(f,p) {  
    window.location.hash = this.encodeHashTag(f,p);
    var that=this;
    var pagename=this.state.db.getFilePageNames(f)[p];
    this.setState({scrollto:pagename});

    kse.highlightFile(this.state.db,f,{q:this.state.tofind,nospan:true,nocrlf:true},function(data){
      that.setState({bodytext:data,page:p});
    });
  }, 
  showText:function(n) {
    var res=kse.vpos2filepage(this.state.db,this.state.toc[n].voff);
    if(res.file != -1) this.showPage(res.file,res.page);
    this.setState({dataN:n});    
  },
  nextfile:function() {
    var file=this.state.bodytext.file+1;
    var page=this.state.bodytext.page || 1;
    this.showPage(file,page);
    this.setState({scrollto:null});
  },
  prevfile:function() {
    var file=this.state.bodytext.file-1;
    var page=this.state.bodytext.page || 1;
    if (file<0) file=0;
    this.showPage(file,page);
    this.setState({scrollto:null});
  },
  setPage:function(newpagename,file) {
    var fp=this.state.db.findPage(newpagename);
    if (fp.length){
      this.showPage(fp[0].file,fp[0].page);
    }
    console.log(newpagename);
  },
  setwylie: function() {
    this.setState({wylie:!this.state.wylie});
    this.setState({scrollto:null});
  },
  textConverter:function(t) {
    if(this.state.wylie == true) return tibetan.romanize.toWylie(t,null,false); 
    return t; 
  },
  startsearch:function() {
    var that=this;
    setTimeout(function(){
      that.refs.tofind.getDOMNode().focus();  
    },500);
    
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
    var bodytextcols="col-md-9";
    var menuclass="col-md-3";
    if (!this.state.sidemenu) {
      bodytextcols="";
      menuclass="hidemenu";
    }

    return (
      <div className="container-fluid">
  <div className="row">
      <div className="header">
        <img width="100%" src="./banner/banner.png"/>
      </div>

      <div className="row">
        <div className={menuclass}>
          <div className="borderright">
            <ul className="nav nav-tabs" role="tablist">
              <li className="active"><a href="#Catalog" role="tab" data-toggle="tab" title="Catalog"><img width="25" src="./banner/icon-read.png"/></a></li>
              <li><a href="#Search" role="tab" onClick={this.startsearch} data-toggle="tab" title="Search"><img width="25" src="./banner/search.png"/></a></li>              
            </ul>

            <div className="tab-content" ref="tab-content">
              <div className="tab-pane fade in active" id="Catalog">               
                <Stacktoc textConverter={this.textConverter} showText={this.showText} 
                showExcerpt={this.showExcerpt} 
                hits={this.state.res.rawresult} data={this.state.toc} goVoff={this.state.goVoff} />
              </div>

              <div className="tab-pane fade" id="Search">
                <div className="slight"><br/></div>
                {this.renderinputs("title")}
                <div className="center">
                  <div className="btn-group" data-toggle="buttons" ref="searchtype" onClick={this.searchtypechange}>
                    <label data-type="sutra" className="btn btn-default btn-xs searchmode">
                    <input type="radio" name="field" autocomplete="off"><img title="མདོ་མིང་འཚོལ་བ། Sutra Search" width="25" src="./banner/icon-sutra.png"/></input>
                    </label>
                    <label data-type="kacha" className="btn btn-default btn-xs searchmode">
                    <input type="radio" name="field" autocomplete="off"><img title="དཀར་ཆག་འཚོལ་བ། Karchak Search" width="25" src="./banner/icon-kacha.png"/></input>
                    </label>
                    <label data-type="fulltext" className="btn btn-default btn-xs searchmode active">
                    <input type="radio" name="field" autocomplete="off"><img title="ནང་དོན་འཚོལ་བ།  Full Text Search" width="25" src="./banner/icon-fulltext.png"/></input>
                    </label>
                  </div> 
                  
              
                                    
                </div>       
                <Namelist wylie={this.state.wylie} res_toc={this.state.res_toc} tofind={this.state.tofind} gotofile={this.gotofile} />
                <Resultlist wylie={this.state.wylie} res={this.state.res} tofind={this.state.tofind} gotofile={this.gotofile} />
              </div>        
            </div>      
          </div>     
        </div>

        <div className={bodytextcols}>
          
          <div className="text text-content" ref="text-content">
          <Showtext sidemenu={this.state.sidemenu} toggleMenu={this.toggleMenu} dataN={this.state.dataN} setwylie={this.setwylie} wylie={this.state.wylie} page={this.state.page}  bodytext={this.state.bodytext} text={text} nextfile={this.nextfile} prevfile={this.prevfile} setpage={this.setPage} db={this.state.db} toc={this.state.toc} scrollto={this.state.scrollto} />
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