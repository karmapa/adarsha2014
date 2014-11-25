/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var tibetan=Require("ksana-document").languages.tibetan; 
var resultlist=React.createClass({  //should search result
  show:function() {
    if(this.props.wylie == false) var tofind=this.props.tofind;
    if(this.props.wylie == true ) var tofind=tibetan.romanize.toWylie(this.props.tofind,null,false);
    
    return this.props.res.excerpt.map(function(r,i){ // excerpt is an array 
      var t = new RegExp(tofind,"g"); 
      var context="";
      if(this.props.wylie == false) context=r.text.replace(t,function(tofind){return "<hl>"+tofind+"</hl>"});
      if(this.props.wylie == true) context=tibetan.romanize.toWylie(r.text,null,false).replace(t,function(tofind){return "<hl>"+tofind+"</hl>"});
      return <div data-vpos={r.hits[0][0]}>
      <a onClick={this.gotopage} className="pagename">{r.pagename}</a>
        <div className="resultitem" dangerouslySetInnerHTML={{__html:context}}></div>
      </div>
    },this);
  }, 
  gotopage:function(e) {
    var vpos=parseInt(e.target.parentNode.dataset['vpos']);
    this.props.gotofile(vpos);
  },
  render:function() {
    if (this.props.res) {
      if (this.props.res.excerpt&&this.props.res.excerpt.length) {
          return <div className="results">{this.show()}</div>
          debugger;
      } else {
        return <div></div>
      }
    }
    else {
      return <div>type keyword to search</div>
    } 
  }
});
module.exports=resultlist; 