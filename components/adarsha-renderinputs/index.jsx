/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var renderinputs = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  clear:function() {
    var tofind=this.refs.tofind.getDOMNode();
    tofind.value="";
    tofind.focus();
  },  
  updateValue:function(e){
    var newpagename=this.refs.pagename.getDOMNode().value;
    var n=newpagename.substr(newpagename.length-1);
    if(!n.match(/[ab]/)){
      newpagename = newpagename+"a";
    }
    this.props.setpage(newpagename);
  },    
  render: function() {
    if (this.props.db) {
      if(this.props.searcharea == "text"){
        return (    
          <div><input className="form-control" onInput={this.props.dosearch} ref="tofind" defaultValue="byang chub m"></input>
          <button onClick={this.clear} title="clear input box" className="btn btn-danger">xl</button><span className="wylie">{this.state.wylie}</span>
          </div>
          )    
      }
      if(this.props.searcharea == "title"){
        return (    
          <div><input className="form-control" onInput={this.props.dosearch_toc} ref="tofind_toc" defaultValue="byang chub"></input>
          <span className="wylie">{this.state.wylie_toc}</span>
          </div>
          ) 
      }
    } else {
      return <span>loading database....</span>
    }
  }
});
module.exports=renderinputs;