/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var resultlist=React.createClass({  //should search result
  show:function() {
    console.log(this.props.children);
    var tofind=this.props.tofind;
    return this.props.res.excerpt.map(function(r,i){ // excerpt is an array 
      var t = new RegExp(tofind,"g"); 
      r.text=r.text.replace(t,function(tofind){return "<span class='tofind'>"+tofind+"</span>"});
      return <div data-vpos={r.hits[0][0]}>
      <a onClick={this.gotopage} className="pagename">{r.pagename}</a>
        <div className="resultitem" dangerouslySetInnerHTML={{__html:r.text}}></div>
      </div>
    },this); 
  }, 
  gotopage:function(e) {
    var vpos=parseInt(e.target.parentNode.dataset['vpos']);
    this.props.gotopage(vpos);
  },
  render:function() {
    if (this.props.res) {
      if (this.props.res.excerpt&&this.props.res.excerpt.length) {
          return <div>{this.show()}</div>
          debugger;
      } else {
        return <div>Not found</div>
      }
    }
    else {
      return <div>type keyword to search</div>
    } 
  }
});
module.exports=resultlist; 