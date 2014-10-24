/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var controls = React.createClass({
  getInitialState: function() {
    return {value: this.props.pagename};
  },

  gotoToc: function(){
    this.props.syncToc();       
  },
  render: function() { 
   
   return <div>

          </div>
  }  
});

var controlsFile = React.createClass({
 
  getInitialState: function() {
    return {value: this.props.pagename};
  },
  render: function() { 
   console.log(this.props.filename);
   
   return <div>
            Bampo
            <button className="btn btn-success" onClick={this.props.prev}>←</button>                                        
           
            <button className="btn btn-success" onClick={this.props.next}>→</button>
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
  renderpb: function(s){
    if(typeof s == "undefined") return "";
    s= s.replace(/<pb n="(.*?)">/g,function(m,m1){
      var link='<a target="_new" href="../adarsha_img/#'+m1+'">'+'<img width=25 src="imageicon.png"/>'+'</a>';

      return m+link;
    });
    
  return s;
  },
  render: function() {

    var pn=this.props.pagename;
    var text=this.renderpb(this.props.text);
    return (
      <div>
        <controls pagename={this.props.pagename} next={this.props.nextpage} prev={this.props.prevpage} setpage={this.props.setpage} db={this.props.db} toc={this.props.toc} genToc={this.props.genToc} syncToc={this.props.syncToc}/>
        <controlsFile filename={this.props.filename} pagename={this.props.pagename} next={this.props.nextfile} prev={this.props.prevfile} setpage={this.props.setpage} db={this.props.db} toc={this.props.toc} genToc={this.props.genToc} syncToc={this.props.syncToc}/>

        <div className="text" dangerouslySetInnerHTML={{__html: text}} />
      </div>
    );
  }
});
module.exports=showtext;