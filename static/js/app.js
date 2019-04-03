/**
 * Main application class.
 */
define(["views/volcanoPlot", "views/table", "models/data", "views/heatmap", "views/plots", "collections/plots"],
    function(volcanoPlot, dataTable, Dataset, HeatMap, Visualizations, PlotData) {
    return Backbone.View.extend({

        id : "container",

        initialize: function(config){
            this.model = new Dataset(config);
            this.column_types = config.column_types;
            var view = this;
            this.model.on("change:data", function(){ view.render() });
        },

        render : function(){

            var plots = new PlotData();

            // Datatable
            var table = new dataTable({dataset_id : this.dataset_id,
                                        model : this.model,
                                        plots : plots});
            this.$el.append(table.el);
            table.render();

            // View
            visualizations = new Visualizations({model : this.model,
                                                 plots : plots});
            this.$el.append(visualizations.el);
            visualizations.renderReady();


            // Taxonomy heatmap
            /*var heatMap = new HeatMap({model : this.model});
            this.$el.append(heatMap.el);
            heatMap.render();*/

            // Volcano Plot
            /*if ("log2fc_NS_over_WS" in this.model.get("data")){
                new volcanoPlot({
                    "IDs" : this.data.id,
                    "name" : this.data.name,
                    "category" : this.data.namespace,
                    "x_vals" : this.data.log2fc_NS_over_WS,
                    "y_vals" : this.data.corrected_p});
            }*/

            
        }
    });
});
