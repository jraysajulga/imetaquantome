define([''],
    function() {
    return Backbone.Model.extend({

        id : "data-table",

        defaults : {
            headers : [],
            ready : false,
            data : [],
            charts : {},
            sampCols : {}
        },

        initialize: function(config){
            this.dataModel = config.dataModel;
            this.headers = this.dataModel.get("headers");
            this.set("type", config.type);
        },

        surmiseDefaultValues : function(){
          var type = this.get("type");
          var header;
          var values = {};
          var headers = this.headers;
          for (var i = 0; i < headers.length; i++){
            header = headers[i];
            if (header.includes("_mean") && (!values["Group 1"] || !values["Group 2"])){
              if (values["Group 1"]){
                values["Group 2"] = header;
              } else{
                values["Group 1"] = header;
              }
            }
            if (type == "Bar Chart"){
              if (header.includes("taxon")){
                values["Label"] = header;
              }
            } 
          }
          this.set("values", values);
        },

        generateValuesFromSamplesFiles : function(){
          console.log(this.dataModel.get("loadingSamplesFiles"));
          var samples = this.dataModel.get("samplesFiles");
          var groups;
          var group;
          var col_names;
          var values = {};
          for (sample in samples){
            groups = samples[sample];
            for (var i = 0; i < groups.length; i++){
              group = groups[i];
              group_name = group[0];
              col_names = group[1] ? group[1].split(",") : "";
              for (var j = 0; j < col_names.length; j++){
                values[group_name + " " + (j + 1)] = col_names[j];
              }
            }
            console.log(values);
          }
        }
    });
});
