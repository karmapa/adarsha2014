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

var main = React.createClass({
  getInitialState: function() {
    return {dialog:null,res:{},db:null};
  },
  onReady:function(usage,quota) {
    if (!this.state.db) kde.open("jiangkangyur",function(db){
        this.setState({db:db});
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

          <br/><input ref="tofind" defaultValue="དགེ"></input>
          <button onClick={this.dosearch}>Search</button>
          Search Example:   1.<a href='#' onClick={this.dosearch_ex} >བྱས</a>
          2. <a href='#' onClick={this.dosearch_ex} >གནས</a>
          3. <a href='#' onClick={this.dosearch_ex} >འགྱུར</a>
          4. <a href='#' onClick={this.dosearch_ex} >བདག</a>
          5. <a href='#' onClick={this.dosearch_ex} >དགའ</a>
          <results res={this.state.res} tofind={this.state.tofind}/>
        </div>
      );
    }
  }
});

module.exports=main;