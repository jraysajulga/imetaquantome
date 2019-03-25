define([''],
    function() {
    return Backbone.Collection.extend({

        id : "data-table",

        defaults : {
            headers : [],
            data : [],
            charts : {},
            sampCols : {"NS": ["X737NS", "X852NS", "X867NS"],
                             "WS": ["X737WS", "X852WS", "X867WS"]}
        },

        initialize: function(config){
            this.dataset_id = config.dataset_id;
            this.loadDataset();
        }
    });
});
