define([''],
    function() {
    return Backbone.View.extend({

        id : "bar-plot",

        initialize: function(config){
            this.model = config.model;
            this.colnames = {label : "taxon_name",
                        group_1 : "NS_mean",
                        group_2 : "WS_mean"};
        },

        render : function(){
            var data = this.model.get("data");
            var label = data[this.colnames.label];
            var group_1 = data[this.colnames.group_1];
            var group_2 = data[this.colnames.group_2];

            group_1 = group_1.map(function(e) {e = 2**e; return e; })
            group_2 = group_2.map(function(e) {e = 2**e; return e; })

            var NS_data = {
              x: label,
              y: group_1,
              name: 'NS',
              type: 'bar'
            };

            var WS_data = {
              x: label,
              y: group_2,
              name: 'WS',
              type: 'bar'
            };

            var data = [NS_data, WS_data];
            var layout = {barmode: 'group'};

            Plotly.newPlot(this.id, data, layout);
        },

    });
});
