define([''],
    function() {
    return Backbone.Model.extend({

        id : "data-table",

        defaults : {
            headers : [],
            data : [],
            charts : {},
            sampCols : {"NS": ["X737NS", "X852NS", "X867NS"],
                             "WS": ["X737WS", "X852WS", "X867WS"]},
            label_types : {"Group 1" : ["float", "int"],
                           "Group 2" : ["float", "int"],
                            "Label"  : ["str"]},
            colors : {"Label" : ["#cccccc"],
                      "Group 1" : ["#0066ff; color : white"],
                      "Group 2" : ["#ff9933"]}
        },

        initialize: function(config){
            this.dataset_id = config.dataset_id;
            this.column_types = config.column_types;
            this.loadDataset();
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
        }

    });
});
