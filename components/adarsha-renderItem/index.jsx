/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var renderItem = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  renderItem: function(item) {
    var title=item["text"];
    return (
      <div>
        <span>{title}</span>
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