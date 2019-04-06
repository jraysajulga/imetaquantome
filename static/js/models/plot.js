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
            if (type == "Bar Chart"){
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
                    if (header.includes("taxon")){
                        values["Label"] = header;
                    }
                }
            } else if (type == "Heat Map"){
                var samples = this.dataModel.get("samplesFiles");
                var values = {};
                // Heat Map defaults
                for (sample in samples){
                    groups = samples[sample];
                    for (var i = 0; i < groups.length; i++){
                        group = groups[i];
                        group_name = group[0];
                        col_names = group[1] ? group[1].split(",") : "";
                        console.log(col_names);
                        for (var j = 0; j < col_names.length; j++){
                            values[group_name + " " + (j + 1)] = col_names[j];
                        }
                    }
                }
            }
            console.log(values);
            this.set("values", values);
        },

        generateValuesFromSamplesFiles : function(){
          console.log(this.dataModel.get("loadingSamplesFiles"));
          var samples = this.dataModel.get("samplesFiles");
          var groups;
          var group;
          var col_names;
          var values = {};
          var sample_selection = [];
          var group_preview;
          var limit = 20;
          // Generates sample file selection items
          for (sample in samples){
            groups = samples[sample];
            group_preview = [];
            for (var i = 0; i < groups.length; i++){
                group = groups[i];
                if (group.length > 1){
                    if (group[1].length > limit){
                        group[1] = group[1].slice(0,limit) + "..."
                    }
                }   
                group_preview.push(group.join(": "));
            }
            sample_selection.push(sample + "\n" + group_preview.join("\n"));
          }
          this = sample_selection;

          // Obtains Heat Map columns
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
          }
          this.set("values", values);
        }
    });
});
