/**
 * Main application class.
 */
define([],
    function() {
    return Backbone.View.extend({
        
        el : $('#container'),

        initialize: function(config){
            var ID = config.dataset_id;
            this.loadDataset(ID);
        },


        array2dict: function(array){
            var headers = array.shift();
            var row;
            var dict = {};
            for (var i = 0; i < array.length; i++){
                row = array[i];
                for (var j = 0; j < row.length; j++){
                    if (headers[j] in dict){
                        dict[headers[j]].push(row[j]);
                    } else{
                        dict[headers[j]] = [];
                    }
                }
            }
            return dict;
        },

        loadDataset : function(ID){
            app = this;
            var xhr = jQuery.getJSON('/api/datasets/' + ID, {
                        data_type : 'raw_data',
                        provider : 'column'
                    });
            xhr.done(function(response){
                app.data = app.array2dict(response.data);
                app.render();
            });
        },

        barPlot : function(data){
            var taxa = data.taxon_name;
            var NS_means = data.NS_mean;
            var WS_means = data.WS_mean;
            NS_means = NS_means.map(function(e) {e = 2**e; return e; })
            WS_means = WS_means.map(function(e) {e = 2**e; return e; })

            var NS_data = {
              x: taxa,
              y: NS_means,
              name: 'NS',
              type: 'bar'
            };

            var WS_data = {
              x: taxa,
              y: WS_means,
              name: 'WS',
              type: 'bar'
            };

            var data = [NS_data, WS_data];
            var layout = {barmode: 'group'};

            Plotly.newPlot('myDiv', data, layout);

        },

        render : function(){
            this.barPlot(this.data);
        }
    });
});