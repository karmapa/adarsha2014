/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var controls = React.createClass({  
    getInitialState: function() {
      return {value: this.props.pagename};
    },
    shouldComponentUpdate:function(nextProps,nextState) {
      this.state.pagename=nextProps.pagename;
      return (nextProps.pagename!=this.props.pagename);
    },
    updateValue:function(e){
    var newpagename=this.refs.pagename.getDOMNode().value;
    var n=newpagename.substr(newpagename.length-1);
    if(!n.match(/[ab]/)){
      newpagename = newpagename+"a";
    }
    this.props.setpage(newpagename);
    },
    gotoToc: function(e){
      var s=window.location.hash;
      var fp=s.match(/#(\d+)\.(.*)/);
      var page=parseInt(fp[2]);
      var file=parseInt(fp[1]);
      // var out=[];
      // var pagename=this.props.db.getFilePageNames(file)[page];
      var voff=this.props.db.getFilePageOffsets(file)[page];
      // this.props.toc.map(function(item){
      //   if(voff<item.voff){
      //     out.push(item);
      //   }
      // },this);
      // console.log("pagename:",pagename,"voff:",voff);
      this.props.syncToc(voff);
       
    },
    render: function() { 
     return <div>
              <button className="btn btn-success" onClick={this.props.prev}>←</button>              
                <input type="text" ref="pagename" onChange={this.updateValue} value={this.state.pagename}></input>             
              <button className="btn btn-success" onClick={this.props.next}>→</button>
              <button className="btn btn-success" onClick={this.gotoToc}>Catalog</button>
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