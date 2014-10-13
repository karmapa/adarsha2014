/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var controls = React.createClass({  
  getInitialState: function() {
    return {value: this.props.pagename};
  },
  shouldComponentUpdate:function(nextProps,nextState) {
    this.state.pagename=nextProps.pagename;
    this.refs.pagename.getDOMNode().value=nextProps.pagename;
    return (nextProps.pagename!=this.props.pagename);
  },
  updateValue:function(e){
    if(e.key!="Enter") return;
    var newpagename=this.refs.pagename.getDOMNode().value;
    var n=newpagename.substr(newpagename.length-1);
    if(!n.match(/[ab]/)){
      newpagename = newpagename+"a";
    }
    this.props.setpage(newpagename);
  },
  gotoToc: function(){
    this.props.syncToc();       
  },
  render: function() { 
   
   return <div>
            <button className="btn btn-success" onClick={this.props.prev}>←</button>              
            <input type="text" ref="pagename" onKeyUp={this.updateValue}></input>             
            <button className="btn btn-success" onClick={this.props.next}>→</button>
            <button className="btn btn-success" onClick={this.gotoToc}>Catalog</button>
            <a target="_new" href={"http://127.0.0.1:2556/pedurmacat/#"+this.props.pagename}>Compare</a>
          </div>
  }  
});

var showtext = React.createClass({
  getInitialState: function() {
    return {bar: "world"};
  },
  hitClick: function(n){
    if(this.props.showExcerpt) this.props.showExcerpt(n);
  },
  render: function() {
    var pn=this.props.pagename;
    return (
      <div>
        <controls pagename={this.props.pagename} next={this.props.nextpage} prev={this.props.prevpage} setpage={this.props.setpage} db={this.props.db} toc={this.props.toc} genToc={this.props.genToc} syncToc={this.props.syncToc}/>

        <div dangerouslySetInnerHTML={{__html: this.props.text}} />
      </div>
    );
  }
});
module.exports=showtext;