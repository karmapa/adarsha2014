/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

//var othercomponent=Require("other"); 
var searchbar = React.createClass({
  getInitialState: function() {
    return {find:[],field:[]};
  },
  gettofind: function() {
    var find=this.refs.tofind.getDOMNode().value;
    this.setState({find:find});
  },
  getfield: function(e) {
    var field=e.target.dataset.type;
    this.setState({field:field});   
  },
  render: function() {
    return (
      <div>
        <input className="form-control" onInput={this.gettofind} ref="tofind" defaultValue="byang chub"></input>
        <div className="btn-group" data-toggle="buttons" ref="searchtype" onClick={this.getfield}>
          <label data-type="sutra" className="btn btn-success">
          <input type="radio" name="field" autocomplete="off">Sutra</input>
          </label>
          <label data-type="kacha" className="btn btn-success">
          <input type="radio" name="field" autocomplete="off">Kacha</input>
          </label>
          <label data-type="fulltext" className="btn btn-success" >
          <input type="radio" name="field" autocomplete="off">Text</input>
          </label>
        </div>
        {this.props.dosearch(null,null,0,this.state.field,this.state.tofind)}
      </div>
    );
  }
});
module.exports=searchbar;