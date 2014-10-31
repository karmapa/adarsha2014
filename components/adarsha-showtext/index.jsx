/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var controls = React.createClass({
  getInitialState: function() {
    return {};
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
    return {address:0};
  },
  filepage2vpos:function(file,page) {
    var out=[];
    if(!this.props.db) return 0;
    var offsets=this.props.db.getFilePageOffsets(file);
    var voff=offsets[page];
    var n=this.findByVoff(voff);//toc裡的第幾項
    var parents=this.enumAncestors(n) || 1;
    for(var i=0; i<parents.length; i++){
      out.push(this.props.toc[parents[i]].text);
    }
    return out.join("  >  ");
  },
  findByVoff: function(voff) {
    if(!this.props.toc) return 0;
    for (var i=0;i<this.props.toc.length;i++) {
      var t=this.props.toc[i];
      if (t.voff>voff) return i-1;
    }
    return 0; //return root node
  },

  enumAncestors: function(cur) {
    var toc=this.props.toc;
    if (!toc || !toc.length) return;
    //var cur=this.state.cur;
    if (cur==0) return [];
    var n=cur-1;
    var depth=toc[cur].depth - 1;
    var parents=[];
    while (n>=0 && depth>0) {
      if (toc[n].depth==depth) {
        parents.unshift(n);
        depth--;
      }
      n--;
    }
    parents.unshift(0); //first ancestor is root node
    return parents;
  },
  getAddress: function() {
    var file=this.props.bodytext.file;
    var page=this.props.page;
    var res=this.filepage2vpos(file,page);
   // this.setState({address:res});
    return res;
  },
  render: function() {    
   return <div>
            Bampo
            <a href="#" onClick={this.props.prev}><img width="25" src="http://karmapa.github.io/adarsha/prev.png"/></a>                                                   
            <a href="#" onClick={this.props.next}><img width="25" src="http://karmapa.github.io/adarsha/next.png"/></a>
            <br/><span>{this.getAddress()}</span>
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
      var link='<a target="_new" href="../adarsha_img/#'+m1+'">'+'<img width=25 src="http://karmapa.github.io/imageicon.png"/>'+'</a>';

      return "<br></br>"+m+link;
    });
    
  return s;
  },
  render: function() {

    var text=this.renderpb(this.props.text);
    return (
      <div>
        <controls  next={this.props.nextpage} prev={this.props.prevpage} setpage={this.props.setpage} db={this.props.db} toc={this.props.toc} genToc={this.props.genToc} syncToc={this.props.syncToc}/>
        <controlsFile page={this.props.page} bodytext={this.props.bodytext}  next={this.props.nextfile} prev={this.props.prevfile} setpage={this.props.setpage} db={this.props.db} toc={this.props.toc} />
        <br/>
        <div className="text" dangerouslySetInnerHTML={{__html: text}} />
      </div>
    );
  }
});
module.exports=showtext;