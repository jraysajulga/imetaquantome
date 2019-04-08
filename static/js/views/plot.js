define(["views/options"],
    function(OptionTable) {
    return Backbone.View.extend({

        className : "chart-container",

        initialize: function(config){
            this.id = this.model.cid;
            this.plot_model = config.model;
            this.dataModel = config.dataModel;
            this.data = this.dataModel.get("data");
            this.headers = this.dataModel.get("headers");

            this.plot_model.surmiseDefaultValues();

            // Adds options table and chart divs
            this.$el.html(new OptionTable({model : this.plot_model,
                                           dataModel : config.dataModel}).el);
            this.$el.append($("<div>", {id : this.id + "-plotly"}));
            
            this.plot_model.on("change:ready change:values", this.render, this);
            //this.dataModel.on("change:loadingSamplesFiles", this.render, this);
        },

        render : function(){
          var type = this.plot_model.get("type");
          if (type == "Bar Chart"){
            this.renderBarChart();
          } else if (type == "Heat Map"){
            console.log("HEAT MAP");
            //this.plot_model.generateValuesFromSamplesFiles()
            this.renderHeatMap();
          }
        },

        renderBarChart : function(){
          var values = this.plot_model.get("values");
          var label = this.data[values["Label"]];
          var group_1 = this.data[values["Group 1"]];
          var group_2 = this.data[values["Group 2"]];
          
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

          Plotly.newPlot(this.id + "-plotly", data, layout);
        },

        renderHeatMap : function(){
          console.log(this.plot_model.get("values"));
          var values = this.plot_model.get("values");
          var data = this.dataModel.get("data");
          heatmap_data = [];
          for (value in values){
            heatmap_data.push(data[values[value]]);
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

            var plotting_data = [
                {
                    x: Object.keys(heatmap_data),
                    z: this.scale(heatmap_data),
                    type: 'heatmap',
                    colorscale: colorScaleValue,
                    showscale: true
                }
            ];

            Plotly.newPlot(this.id + "-plotly", plotting_data);

          
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
