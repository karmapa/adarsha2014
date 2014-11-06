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
   return <div className="cursor">
            Bampo
            <a href="#" onClick={this.props.prev}><img width="25" src="./banner/prev.png"/></a>                                                   
            <a href="#" onClick={this.props.next}><img width="25" src="./banner/next.png"/></a>
            <br/><span id="address">{this.getAddress()}</span>
          </div>
  }  
});

var showtext = React.createClass({
  getInitialState: function() {
    return {bar: "world", pageImg:""};
  },
  hitClick: function(n){
    if(this.props.showExcerpt) this.props.showExcerpt(n);
  },
  renderPageImg: function(e) {
    var pb=e.target.dataset.pb;
    if (pb) this.setState({clickedpb:pb});
    var img=e.target.dataset.img;
    if (img) this.setState({clickedpb:null});
  },
  getImgName: function(volpage) {
    var p=volpage.split(".");
    var v="000"+p[0];
    var vol=v.substr(v.length-3,v.length);
    var pa="000"+p[1].substr(0,p[1].length-1);
    var page=pa.substr(pa.length-3,pa.length);
    var side=p[1].substr(p[1].length-1);

    return vol+"/"+vol+"-"+page+side;
  },
  renderpb: function(s){
    var that=this;
    if(typeof s == "undefined") return "";
    s= s.replace(/<pb n="(.*?)"><\/pb>/g,function(m,m1){
      var link='<br></br><a href="#" data-pb="'+m1+'">'+m1+'<img width="25" src="banner/imageicon.png"/></a>';
      if(m1 == that.state.clickedpb){
        var imgName=that.getImgName(m1);
        link='<br></br>'+m1+'<img data-img="'+m1+'" width="100%" src="../adarsha_img/lijiang/'+imgName+'.jpg"/>';
      }
      return link;
    });
    
    return s;
  },
  render: function() {

    var text=this.renderpb(this.props.text);
    return (
      <div className="cursor">
        <controls  next={this.props.nextpage} prev={this.props.prevpage} setpage={this.props.setpage} db={this.props.db} toc={this.props.toc} genToc={this.props.genToc} syncToc={this.props.syncToc}/>
        <controlsFile page={this.props.page} bodytext={this.props.bodytext}  next={this.props.nextfile} prev={this.props.prevfile} setpage={this.props.setpage} db={this.props.db} toc={this.props.toc} />
        <br/>
        <div onClick={this.renderPageImg} className="pagetext" dangerouslySetInnerHTML={{__html: text}} />
      </div>
    );
  }
});
module.exports=showtext;