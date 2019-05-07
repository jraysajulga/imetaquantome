define([''],
    function() {
    return Backbone.View.extend({

        id : "heat-map",

        initialize: function(config){
            this.model = config.model;

        },

        render : function(){
            var data = this.model.get("data");
            this.sampCols = this.model.get("sampCols");
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

            Plotly.newPlot(this.id, data);
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
        }
    });
});
