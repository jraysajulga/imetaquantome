/**
 * Main application class.
 */
define(["views/volcanoPlot", "views/table", "models/data", "views/heatmap", "views/plots"],
    function(volcanoPlot, dataTable, Dataset, HeatMap, Visualizations) {
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
            /*bar_plot_model = new Plot({data : this.model,
                                        headers : {label : "taxon_name",
                                                 group_1 : "NS_mean",
                                                 group_2 : "WS_mean"}})
            var barPlot = new BarPlot({id : "taxonomy-barplot",
                                      model : this.model,
                                      colnames: {label : "taxon_name",
                                            group_1 : "NS_mean",
                                            group_2 : "WS_mean"}});*/

            // View
            visualizations = new Visualizations({model : this.model});
            this.$el.append(visualizations.el);
            visualizations.render();

            //this.$el.append(barPlot.el);
            //barPlot.render();

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
