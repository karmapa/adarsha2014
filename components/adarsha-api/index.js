//var othercomponent=Require("other"); 
//new module filename must be added to scripts section of ./component.js and export here
var api = {
 search_api: require("./search_api"),
 corres_api: require("./corres_api")
}

module.exports=api;