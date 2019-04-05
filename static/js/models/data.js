define([''],
    function() {
    return Backbone.Model.extend({

        id : "data-table",

        defaults : {
            headers : [],
            data : [],
            charts : {},
            highlighted : "",
            sampCols : {"NS": ["X737NS", "X852NS", "X867NS"],
                             "WS": ["X737WS", "X852WS", "X867WS"]},
            label_types : {"Group 1" : ["float", "int"],
                           "Group 2" : ["float", "int"],
                            "Label"  : ["str"]},
            colors : {"Label" : ["#cccccc"],
                      "Group 1" : ["#0066ff; color : white"],
                      "Group 2" : ["#ff9933"]},
            samplesFiles : {},
            loadingSamplesFiles : true
        },

        initialize: function(config){
            this.dataset_id = config.dataset_id;
            this.history_id = config.history_id;
            this.column_types = config.column_types;
            this.num_samplesFiles = 0;
            this.num_checkedDatasets = 0;
            this.loadDataset();
            this.loadHistory();
        },

        // Reformats a table array to a dictionary, using the first row
        // as the keys and the subsequent rows as values. 
        array2dict: function(array){
            var row;
            var dict = {};
            for (var i = 0; i < array.length; i++){
                row = array[i];
                for (var j = 0; j < row.length; j++){
                    if (this.get("headers")[j] in dict){
                        dict[this.get("headers")[j]].push(row[j]);
                    } else{
                        dict[this.get("headers")[j]] = [row[j]];
                    }
                }
            }
            return dict;
        },

        // Retrieves the dataset from the galaxy API
        loadDataset : function(){
            var xhr = jQuery.getJSON('/api/datasets/' + this.dataset_id, {
                        data_type : 'raw_data',
                        provider : 'column'
                    });
            // Once retrieved, sets data and headers to model...
            // Will trigger any .on listeners
            var model = this;
            xhr.done(function(response){
                var data = response.data;
                model.set("headers", data.shift());
                model.set("data", model.array2dict(data));
            });
        },

        loadHistory : function(){
            var xhr = jQuery.getJSON('/api/histories/' + this.history_id);
            // Once retrieved, sets data and headers to model...
            // Will trigger any .on listeners
            var model = this;
            xhr.done(function(response){
                var datasets = response.state_ids.ok;
                model.num_samplesFiles = datasets.length;
                for (var i = 0; i < datasets.length; i++){
                    model.getSampleFileIDs(datasets[i]);
                    console.log("YOGA");
                }
            });
        },

        getSampleFileIDs : function(id){
            var xhr = jQuery.getJSON("/api/datasets/" + id);
            var model = this;
            xhr.done(function(response){
                if (response.peek && response.name){
                    if (response.peek.includes("colnames") && response.name.includes("create samples")){
                        model.setSampleFiles(response.dataset_id, response.name);
                    } else {
                        model.num_checkedDatasets++;
                    }
                } else {
                    model.num_checkedDatasets++;
                }
            });
        },

        setSampleFiles : function(id, name){
            var xhr = jQuery.getJSON("/api/datasets/" + id, {
                            data_type : "raw_data",
                            provider : "column"});
            var model = this;
            xhr.done(function(response){
                var samplesFiles = _.clone(model.get("samplesFiles"));
                response.data.shift();
                samplesFiles[name] = response.data;
                model.set("samplesFiles", samplesFiles);
                model.num_checkedDatasets++;
                if (model.num_checkedDatasets == model.num_samplesFiles){
                    model.set("loadingSamplesFiles", false);
                }
            });
        }
    });
});
