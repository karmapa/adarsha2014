/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var api=Require("api");
var dataset=Require("dataset");
var tibetan=Require("ksana-document").languages.tibetan; 
var mappings={"J":dataset.jPedurma,"D":dataset.dPedurma};
var Controlsfile = React.createClass({
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
      if (t.voff>=voff) return i;
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
    if(this.props.dataN && toc[this.props.dataN].depth==toc[this.props.dataN+1].depth){
      parents.push(this.props.dataN);
    }

    return parents;
  },
  getAddress: function() {
    if (!this.props.bodytext)return;
    var file=this.props.bodytext.file;
    var page=this.props.page;
    var res=this.filepage2vpos(file,page);
   // this.setState({address:res});
   if(this.props.wylie == false) return res;
   if(this.props.wylie == true) return tibetan.romanize.toWylie(res,null,false);
    
  },

  render: function() {   
   return <div className="cursor controlbar">
            
            <button className="btn btn-default" onClick={this.props.prev}><img width="20" src="./banner/prev.png"/></button>                                                   
            <button className="btn btn-default" onClick={this.props.next}><img width="20" src="./banner/next.png"/></button>
            <button className="btn btn-default right"><a href="http://www.dharma-treasure.org/en/contact-us/" target="_new"><img width="20" src="./banner/icon-info.png"/></a></button>
            <button className="btn btn-default right" onClick={this.props.setwylie}><img width="20" src="./banner/icon-towylie.png"/></button>
            <br/>
            <br/><span id="address">{this.getAddress()}</span>

          </div>
  }  
});

var showtext = React.createClass({
  getInitialState: function() {
    return {bar: "world", pageImg:""};
  },
  componentWillReceiveProps: function() {
    this.shouldscroll=true;
  },
  componentDidMount:function() {
    this.textcontent=$(".text-content");
  },
  componentDidUpdate: function()  {
    if(this.shouldscroll && this.props.scrollto && this.props.scrollto.match(/[abc]/) ){
      var p=this.props.scrollto.match(/\d+.(\d+)[abc]/);
      this.textcontent.scrollTop( 0 );
      if(p[1]!=1){
        $("a[data-pb]").removeClass("scrolled");      
        var pb=$("a[data-pb='"+this.props.scrollto+"']");
        if(pb.length) {
          this.textcontent.scrollTop( pb.position().top-120 );
          pb.addClass("scrolled");
        }
        this.shouldscroll=false;
      }         
    } 
    if(this.shouldscroll && this.props.scrollto && this.props.scrollto.match("_")) {
      $(".text-content").scrollTop( 0 );
      this.shouldscroll=false;
    }
  },
  hitClick: function(n){
    if(this.props.showExcerpt) this.props.showExcerpt(n);
  },
  renderPageImg: function(e) {
    var pb=e.target.dataset.pb;
    if (pb || e.target.nodeName == "IMG") {
      this.setState({clickedpb:pb});  
    }
    var img=e.target.dataset.img;
    if (img) {
      this.setState({clickedpb:null});  
       
    }
    
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

  getCorresPage: function(fromPage) {
    var corresPage=api.corres_api.dosearch(fromPage,mappings["J"],mappings["D"]);
    return corresPage;
  },

  renderpb: function(s){
    var that=this;
    if(typeof s == "undefined") return "";
    s= s.replace(/<pb n="(.*?)"><\/pb>/g,function(m,m1){
      var p=m1.match(/\d+.(\d+[ab])/) || ["",""];
      var link='<br></br><a href="#" data-pb="'+m1+'">'+m1+'<img width="25" data-pb="'+m1+'" src="banner/imageicon.png"/></a>';
      if(m1 == that.state.clickedpb){
        var imgName=that.getImgName(m1);
        var corresPage=that.getCorresPage(m1);
        link='<br></br><a href="#" data-pb="'+m1+'">'+m1+'</a>&nbsp;(Derge:'+corresPage+')<img data-img="'+m1+'" width="100%" src="../adarsha_img/lijiang/'+imgName+'.jpg"/><br></br>';
      }
      return link;
    });
    
    return s;
  },
  render: function() {

    var content=this.props.text||"";
    if (this.props.wylie) content=tibetan.romanize.toWylie(content,null,false);
    content=this.renderpb(content.replace(/[^།]\n/,""));
 
    return (
      <div className="cursor">
        <Controlsfile dataN={this.props.dataN} setwylie={this.props.setwylie} wylie={this.props.wylie} page={this.props.page} bodytext={this.props.bodytext}  next={this.props.nextfile} prev={this.props.prevfile} setpage={this.props.setpage} db={this.props.db} toc={this.props.toc} />
        <br/>
        <br/>
        <div onClick={this.renderPageImg} className="pagetext" dangerouslySetInnerHTML={{__html: content}} />
      </div>
    );
  }
});
module.exports=showtext;