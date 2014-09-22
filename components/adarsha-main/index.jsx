/** @jsx React.DOM */

/* to rename the component,
 change name of ./component.js and  "dependencies" section of ../../component.js */
var require_kdb=[{ 
  filename:"jiangkangyur.kdb"  , 
  url:"http://ya.ksana.tw/kdb/jiangkangyur.kdb" , desc:"jiangkangyur"
}];  
//var othercomponent=Require("other"); 
var bootstrap=Require("bootstrap");  
var results=Require("results");
var fileinstaller=Require("fileinstaller");
var kde=Require('ksana-document').kde;  // Ksana Database Engine
var kse=Require('ksana-document').kse; // Ksana Search Engine (run at client side)
var api=Require("api");
var stacktoc=Require("stacktoc");  //載入目錄顯示元件

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
  dosearch: function() {    
    var tofind=tofind=this.refs.tofind.getDOMNode().value;
    kse.search(this.state.db,tofind,{range:{maxhit:100}},function(data){ //call search engine          
      this.setState({res:data, tofind:tofind});  
    });
  },
  dosearch_ex: function(e) {    
    var tofind=e.target.innerHTML;
    kse.search(this.state.db,tofind,{range:{maxhit:100}},function(data){ //call search engine          
      this.setState({res:data, tofind:tofind});  
    });
  },
  render: function() {
    if (!this.state.quota) { // install required db
        return this.openFileinstaller(true);
    } else { 
      return (
        <div>
          <div className="col-md-4">
            <stacktoc data={this.state.toc} /> //顯示目錄
          </div>
          <div className="col-md-8">
            <br/><input ref="tofind" defaultValue="དགེ"></input>
            <button onClick={this.dosearch} className="btn btn-success btn-xs">Search</button>
            Search Example:   1.<a href='#' onClick={this.dosearch_ex} >བྱས</a>
            2. <a href='#' onClick={this.dosearch_ex} >གནས</a>
            3. <a href='#' onClick={this.dosearch_ex} >འགྱུར</a>
            4. <a href='#' onClick={this.dosearch_ex} >བདག</a>
            5. <a href='#' onClick={this.dosearch_ex} >དགའ</a>
            <results res={this.state.res} tofind={this.state.tofind}/>
          </div>
        </div>
      );
    }
  }
});

module.exports=main;