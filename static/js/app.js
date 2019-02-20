/**
 * Main application class.
 */
define(["views/volcanoPlot", "views/table", "models/data"],
    function(volcanoPlot, dataTable, Dataset) {
    return Backbone.View.extend({
        
        //el : $('#container'),

        id : 'container',

        initialize: function(config){
            this.model = new Dataset(config);
            var view = this;
            this.model.on("change:data", function(){ view.render() });
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

        heatMap : function(data){
            var cols1 = this.sampCols[Object.keys(this.sampCols)[0]];
            var cols2 = this.sampCols[Object.keys(this.sampCols)[1]];
            hmdata = {};
            for (var i = 0; i < cols1.length; i++){
                hmdata[cols1[i]] = data[cols1[i]]
                hmdata[cols2[i]] = data[cols2[i]]
            }


            var colorScaleValue = [[0,"#FFF7FB"],
                [1,"#ECE7F2"],
                [2,"#D0D1E6"],
                [3,"#A6BDDB"],
                [4,"#74A9CF"],
                [5,"#3690C0"],
                [6,"#0570B0"],
                [7,"#045A8D"],
                [9,"#023858"]];

            var data = [
                {
                    x: Object.keys(hmdata),
                    z: this.scale(hmdata),
                    type: 'heatmap',
                    colorscale: colorScaleValue,
                    showscale: true
                }
            ];


            Plotly.newPlot('heatMap', data);
        },

        scale : function(data){
            var avg;
            var sd;
            var scaled_row;
            var scaled_data = [];
            for (var i = 0; i < data[Object.keys(data)[0]].length; i++){
                row = [];
                for (el in data){
                    row.push(parseFloat(data[el][i]));
                }
                avg = this.average(row);
                sd = this.standardDeviation(row);
                scaled_row = row.map((row) => (row - avg) / sd);
                scaled_data.push(scaled_row);
            }
            return scaled_data;
        },

        average : function(data){
          var sum = data.reduce(function(sum, value){
            return sum + value;
          }, 0);

          var avg = sum / data.length;
          return avg;
        },
        
        standardDeviation : function (data) {
            let m = this.average(data);
            return Math.sqrt(data.reduce(function (sq, n) {
                    return sq + Math.pow(n - m, 2);
                }, 0) / (data.length - 1));
        },

        render : function(){
            //this.barPlot(this.data);
            //this.heatMap(this.data);
            if ("log2fc_NS_over_WS" in this.model.get("data")){
                new volcanoPlot({
                    "IDs" : this.data.id,
                    "name" : this.data.name,
                    "category" : this.data.namespace,
                    "x_vals" : this.data.log2fc_NS_over_WS,
                    "y_vals" : this.data.corrected_p});
            }
            var table = new dataTable({dataset_id : this.dataset_id,
                                        headers : this.model.get("headers"),
                                        data : this.model.get("data")});
            //this.$el.append(table.el);
            table.render();
        }
    });
});
