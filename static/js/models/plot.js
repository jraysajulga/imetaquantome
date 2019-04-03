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
            this.set("values", config.values);
            this.set("type", config.type);
        }
    });
});
