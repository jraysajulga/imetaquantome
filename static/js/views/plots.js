define(["collections/plots", "models/plot", "views/plot"],
    function(PlotData, PlotDatum, PlotView) {
    return Backbone.View.extend({

        className : "visualizations",

        initialize: function(config){
            this.model = config.model;
            this.plots = new PlotData();
            var view = this;
            this.plots.bind("add", function(){
              view.addPlot();
            });
            this.plots.add(new PlotDatum({values : this.surmiseDefaultValues(),
                                             type : "barchart"}));
            //this.plots.add({plot : new PlotDatum({values : this.surmiseDefaultValues(),
              //                               type : "heatmap"})});
            //this.plots.add({testModel : "Test"});
            //console.log(this.plots);
        },

        surmiseDefaultValues : function(){
          var headers = this.model.get("headers");
          if (headers.includes("taxon_name") && headers.includes("NS_mean")){
            return {"Label" : "taxon_name", "Group 1" : "NS_mean", "Group 2" : "WS_mean"}
          } else {
            return false
          }
        },

        addPlot : function(){
          console.log("Adding plot!");
          //console.log(this.plots.at(-1));
          //console.log($(this.length));
          //console.log(this.plots.length);
          var plot = new PlotView({model : this.plots.at(-1),
                                        dataModel : this.model});
          this.$el.append(plot.el);
          this.plot = plot;

          //plot.renderBarChart();
          if ($(this).length < this.plots.length){
            //this.$el.append(new PlotView({model : this.plots.at(-1)}).el);
            //this.$el.append(new PlotView({model : this.plots.at(-1)}).el);
            //console.log(this.$el.length)
            //console.log($(this).length)
          } else {
            //console.log("Check addPlot in plot.js");
          }
        },

        renderReady : function(){
          // Marks plot models as "ready" for rendering
          var models = this.plots.models;
          for (var i = 0; i < models.length; i++){
            this.plots.models[i].set("ready", true);
          }
        }
    });
});
