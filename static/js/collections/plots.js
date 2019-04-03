define(["models/plot"],
    function(Plot) {
    return Backbone.Collection.extend({

        id : "data-table",

        model : Plot,

        defaults : {
            headers : [],
            data : [],
            charts : {},
            sampCols : {"NS": ["X737NS", "X852NS", "X867NS"],
                             "WS": ["X737WS", "X852WS", "X867WS"]}
        },

        initialize: function(config){
        }
    });
});
