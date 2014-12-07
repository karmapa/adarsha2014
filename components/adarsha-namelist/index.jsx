/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var tibetan=Require("ksana-document").languages.tibetan; 
var namelist = React.createClass({
  getInitialState: function() {
    return {};
  },
  onItemClick:function(e) {
    if (e.target.nodeName == "HL") var voff=parseInt(e.target.parentElement.dataset.voff);
    else voff=parseInt(e.target.dataset.voff);
    <span>{e.target.innerHTML}</span>
    this.props.gotofile(voff);
  },
  renderNameItem: function(item) {
    var context="";
    if(this.props.wylie == false){
      var tofind=this.props.tofind;
      context=item.text.replace(tofind,function(t){return '<hl>'+t+"</hl>";});
    }
    if(this.props.wylie == true){
      var tofind=tibetan.romanize.toWylie(this.props.tofind,null,false);
      context=tibetan.romanize.toWylie(item.text,null,false).replace(tofind,function(t){return '<hl>'+t+"</hl>";});
    }
      
    return (
      <div>
        <li><a herf='#' className="item" data-voff={item.voff} onClick={this.onItemClick} dangerouslySetInnerHTML={{__html:context}}></a></li>
      </div> 
      )
  },
  render: function() {
    
    return (
      <div className="namelist">
        {this.props.res_toc.map(this.renderNameItem)}
      </div>
    );
  }
});
module.exports=namelist;