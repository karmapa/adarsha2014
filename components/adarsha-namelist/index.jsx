/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var namelist = React.createClass({
  getInitialState: function() {
    return {};
  },
  onItemClick:function(e) {
    var voff=parseInt(e.target.dataset.voff);
    <span>{e.target.innerHTML}</span>
    this.props.gotofile(voff);
  },
  renderItem: function(item) {
    var tofind=this.props.tofind;
    item.text=item.text.replace(tofind,function(t){
      return '<hl>'+t+"</hl>";
    });
    return (
      <div>
        <li><a herf='#' className="item" data-voff={item.voff} onClick={this.onItemClick} dangerouslySetInnerHTML={{__html:item.text}}></a></li>
      </div> 
      )
  },
  render: function() {

    return (
      <div>
        {this.props.res_toc.map(this.renderItem)}
      </div>
    );
  }
});
module.exports=namelist;