/** @jsx React.DOM */

//var othercomponent=Require("other"); 
var api=Require("api");
var dataset=Require("dataset");
var tibetan=Require("ksana-document").languages.tibetan; 
var mappings={"J":dataset.jPedurma,"D":dataset.dPedurma};
var Controlsfile = React.createClass({
  getInitialState: function() {
    return {address:0,fontsize:125};
  },
  filepage2vpos:function(file,page) {
    var out=[];
    if(!this.props.db || !this.props.toc) return 0;
    var offsets=this.props.db.getFilePageOffsets(file);
    var voff=offsets[page];

    var n=this.findByVoff(voff);//toc裡的第幾項
    var parents=this.enumAncestors(n) || [];

    for(var i=0; i<parents.length; i++){
      out.push(this.props.toc[parents[i]].text);
    }
    return out.join('<img src="banner/slash.png"></img>');
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
    var n=cur;
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
    parents.push(cur);

    return parents;
  },
  getAddress: function() {
    if (!this.props.bodytext)return;
    var file=this.props.bodytext.file;
    var page=this.props.page;
    var res=this.filepage2vpos(file,page);
   if(this.props.wylie == false) return res;
   if(this.props.wylie == true) return tibetan.romanize.toWylie(res,null,false);    
  },
  increasefontsize:function() {
    var fontsize=parseFloat($(".pagetext").css("font-size"));
    fontsize=fontsize*1.1;
    if (fontsize>40) return;
    $(".pagetext").css("font-size",fontsize+"px")
                  .css("line-height",(fontsize*1.7)+"px");
  },
  decreasefontsize:function() {
    var fontsize=parseFloat($(".pagetext").css("font-size"));
    fontsize=fontsize/1.1;
    if (fontsize<12) return;
    $(".pagetext").css("font-size",fontsize+"px")
    .css("line-height",(fontsize*1.7)+"px");
  },
  renderSideMenuButton:function() {
    if (this.props.sidemenu) {
      return <button className="btn btn-default" title="Hide Side Menu" onClick={this.props.toggleMenu}><img width="20" src="./banner/hidemenu.png"/></button>
    } else {
      return <button className="btn btn-default" title="Show Side Menu" onClick={this.props.toggleMenu}><img width="20" src="./banner/showmenu.png"/></button>
    }
  },
  render: function() {   
   return <div className="cursor controlbar">
            {this.renderSideMenuButton()}            
            <button className="btn btn-default" title="Previous File" onClick={this.props.prev}><img width="20" src="./banner/prev.png"/></button>
            <button className="btn btn-default" title="Next File" onClick={this.props.next}><img width="20" src="./banner/next.png"/></button>

            <button className="btn btn-default right" title="Contact Us"><a href="http://www.dharma-treasure.org/en/contact-us/" target="_new"><img width="20" src="./banner/icon-info.png"/></a></button>
            <button className="btn btn-default right" title="Toggle Wylie Transliteration" onClick={this.props.setwylie}><img width="20" src="./banner/icon-towylie.png"/></button>

            <button className="btn btn-default right" title="Increase Font Size" onClick={this.increasefontsize}><img width="20" src="./banner/increasefontsize.png"/></button>
            <button className="btn btn-default right" title="Decrease Font Size" onClick={this.decreasefontsize}><img width="20" src="./banner/decreasefontsize.png"/></button>
            <br/>
            <br/><span id="address" dangerouslySetInnerHTML={{__html:this.getAddress()}}></span>
          </div>
  }  
});

var showtext = React.createClass({
  getInitialState: function() {
    return {bar: "world", pageImg:"",clickedpb:[]};
  },
  shouldComponentUpdate:function(nextProps,nextState) {
    if (nextProps.page!=this.props.page) {
      nextState.clickedpb=[]; //reset image
    }
    return true;
  },
  componentWillReceiveProps: function() {
    this.shouldscroll=true;
  },
  componentDidMount:function() {
    this.textcontent=$(".text-content");
  },
  onImageError:function() {
    console.log("image error");
  },
  checkImageLoaded:function() {
    var pagetext=this.refs.pagetext.getDOMNode();
    var images=pagetext.querySelectorAll("IMG.sourceimage");
    for (var i=0;i<images.length;i++) {
      var img=images[i];
      if (img.naturalWidth==0) {
        img.src="banner/image_notfound.png";
      }
    }
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
      }
    } else if(this.shouldscroll){
      $(".text-content").scrollTop( 0 );
    }
    var that=this;
    clearTimeout(this.checkimagetimer);
    this.checkimagetimer=setTimeout(function(){
      that.checkImageLoaded();
    },2000);
    this.shouldscroll=false;
  },
  hitClick: function(n){
    if(this.props.showExcerpt) this.props.showExcerpt(n);
  },
  removeImage:function(pb) {
    var clickedpb=this.state.clickedpb;
    var idx=clickedpb.indexOf(pb);
    if (idx>-1) clickedpb.splice(idx,1);
    this.setState({clickedpb:clickedpb});
  },
  addImage:function(pb) {
    var clickedpb=this.state.clickedpb;
    var idx=clickedpb.indexOf(clickedpb);
    if (idx==-1) clickedpb.push(pb);
    this.setState({clickedpb:clickedpb});
  },
  togglePageImg: function(e) {
    if (e&& e.target && e.target.nextSibling && e.target.nextSibling.nextSibling &&
      e.target.nextSibling.nextSibling.nodeName=="IMG") {
      if (e.target && e.target.dataset) {
        var pb=e.target.dataset.pb;
        if (pb) this.removeImage(pb);
      }
    } else {
      var pb=null;
      if (e.target && e.target.dataset) pb=e.target.dataset.pb;
      if (pb) {
        this.addImage(pb);
      } else {
        if (e && e.target && e.target.previousSibling && e.target.previousSibling
          && e.target.previousSibling.previousSibling && e.target.previousSibling.previousSibling.dataset){
          var pb=e.target.previousSibling.previousSibling.dataset.pb;
          if (pb) this.removeImage(pb);
        }
      }  
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
    var out="",lastidx=0,nextpagekeepcrlf=false;

    s.replace(/<pb n="(.*?)"><\/pb>/g,function(m,m1,idx){
      var p=m1.match(/\d+.(\d+[ab])/) || ["",""];
      var link="";
      var pagetext=s.substring(lastidx+m.length,idx);
      if (idx==0) pagetext="";
      if(that.state.clickedpb.indexOf(m1)>-1){
        var imgName=that.getImgName(m1);
        var corresPage=that.getCorresPage(m1);
        link='</span><br></br><a href="#" data-pb="'+m1+'">'+m1+
        '</a>&nbsp;(Derge:'+corresPage+')<img class="sourceimage" data-img="'+m1+'" width="100%" src="../adarsha_img/lijiang/'+imgName+'.jpg"/><br></br>'
        +'<span class="textwithimage">';
        nextpagekeepcrlf=true;
      } else {
        link='</span><br></br><a href="#" data-pb="'+m1+'">'+m1+'<img width="25" data-pb="'+m1+'" src="banner/imageicon.png"/></a><span>';
      }
      if (!nextpagekeepcrlf) {
        pagetext=pagetext.replace(/། །\r?\n/g,"། །");
        pagetext=pagetext.replace(/།།\r?\n/g,"།།");
        pagetext=pagetext.replace(/།\r?\n/g,"། ");
        pagetext=pagetext.replace(/\r?\n/g,"");
        nextpagekeepcrlf=false;
      }
      out+=pagetext+link;
      lastidx=idx;
    });
    out+=s.substring(lastidx);

    out="<span>"+out+"</span>";
    
    return out;
  },
  render: function() {

    var content=this.props.text||"";
    if (this.props.wylie) content=tibetan.romanize.toWylie(content,null,false);
    content=this.renderpb(content);
 
    return (
      <div className="cursor">
        <Controlsfile sidemenu={this.props.sidemenu} toggleMenu={this.props.toggleMenu} dataN={this.props.dataN} setwylie={this.props.setwylie} wylie={this.props.wylie} page={this.props.page} bodytext={this.props.bodytext}  next={this.props.nextfile} prev={this.props.prevfile} setpage={this.props.setpage} db={this.props.db} toc={this.props.toc} />
        <div onClick={this.togglePageImg} ref="pagetext" className="pagetext" dangerouslySetInnerHTML={{__html: content}} />
      </div>
    );
  }
});
module.exports=showtext;