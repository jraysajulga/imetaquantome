/**
 * Main application class.
 */
define(["views/volcanoPlot", "views/table", "models/data", "views/barPlot", "views/heatmap", "collections/plots"],
    function(volcanoPlot, dataTable, Dataset, BarPlot, HeatMap, Plots) {
    return Backbone.View.extend({

        id : "container",

        initialize: function(config){
            this.model = new Dataset(config);
            var view = this;
            this.model.on("change:data", function(){ view.render() });
        },

        render : function(){

            // Datatable
            var table = new dataTable({dataset_id : this.dataset_id,
                                        model : this.model});
            this.$el.append(table.el);
            table.render();

            // Taxonomy barplot
            var barPlot = new BarPlot({id : "taxonomy-barplot",
                                      model : this.model,
                                      colnames: {label : "taxon_name",
                                            group_1 : "NS_mean",
                                            group_2 : "WS_mean"}});
            this.$el.append(barPlot.el);
            barPlot.render();

            // Taxonomy heatmap
            var heatMap = new HeatMap({model : this.model});
            this.$el.append(heatMap.el);
            heatMap.render();

            // Volcano Plot
            if ("log2fc_NS_over_WS" in this.model.get("data")){
                new volcanoPlot({
                    "IDs" : this.data.id,
                    "name" : this.data.name,
                    "category" : this.data.namespace,
                    "x_vals" : this.data.log2fc_NS_over_WS,
                    "y_vals" : this.data.corrected_p});
            }

            
        }
    });
});
