define([''],
    function() {
    return Backbone.View.extend({

        id : "data-table",

        initialize: function(config){
            this.dataset_id = config.dataset_id;
            this.loadDataset();
            this.sampCols = {"NS": ["X737NS", "X852NS", "X867NS"],
                             "WS": ["X737WS", "X852WS", "X867WS"]}
            
            this.headers = [];
        },

        render : function() {
        }
    });
});
