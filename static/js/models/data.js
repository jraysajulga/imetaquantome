define([''],
    function() {
    return Backbone.Model.extend({

        id : "data-table",

        defaults : {
            data : null
        },

        initialize: function(config){
            console.log("initializing data model...");
            this.dataset_id = config.dataset_id;
            this.loadDataset();
            this.sampCols = {"NS": ["X737NS", "X852NS", "X867NS"],
                             "WS": ["X737WS", "X852WS", "X867WS"]};
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
            model = this;
            xhr.done(function(response){
                model.set("headers", response.data.shift());
                model.set("data", model.array2dict(response.data));
            });
        }

    });
});
