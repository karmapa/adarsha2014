/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var renderItem = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  onItemClick:function(e) {
    var voff=parseInt(e.target.dataset.voff);
    console.log(voff);
    this.props.gotopage(voff);
  },
  renderItem: function(item) {
    return (
      <div>
        <a herf='#' className="item" data-voff={item.voff} onClick={this.onItemClick}>{item.text}</a>
      </div>
      )
  },
  render: function() {
    return (
      <div>
        {this.props.data.map(this.renderItem)}
      </div>
    );
  }
});

module.exports=renderItem;