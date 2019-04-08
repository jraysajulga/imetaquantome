define([''],
    function() {
    return Backbone.View.extend({

        tagName : "table",

        id : "data-table",

        initialize: function(config){
            this.table = null;
            this.model = config.model;
            this.plots = config.plots;
            this.dataset_id = config.model.dataset_id;
            this.headers = this.model.get("headers");
            this.plots.on("change", this.addListener, this);
            this.model.on("change:highlighted", this.highlightColumn, this);
        },

        highlightColumn : function(){
            var index = this.headers.indexOf((this.model.get("highlighted")));
            $(this.table.cells().nodes()).css("border-left", "5px solid white");
            $(this.table.cells().nodes()).css("border-right", "5px solid white");

            $(this.table.column(index).nodes()).css("border-left", "5px solid #39c3ff");
            $(this.table.column(index).nodes()).css("border-right", "5px solid #39c3ff");
            //var width = parseFloat($(this.table.column(index).nodes()).css("width").replace("px",""));
            //$(this.table.column(index).nodes()).css("width", width - 10 + "px");
        },

        addListener : function(){
            var view = this;
            this.plots.on("change:values", function(){
                view.highlightColumns();
            });
            view.highlightColumns();
        },

        highlightColumns : function(){
            var highlights = this.plots.pluck("values");
            var highlight_plot;
            var index;
            var colors = this.model.get("colors");
            var color; 
            $(this.table.cells().nodes()).css("background-color", "white");
            for (var i = 0; i < highlights.length; i++){
                highlight_plot = highlights[i];
                for (key in highlight_plot) {
                    index = this.headers.indexOf(highlight_plot[key]);
                    color = key in colors ? colors[key][0].split(";")[0] : "#cccccc";
                    $(this.table.column(index).nodes()).css("background-color", this.adjustColor(color, 15));
                }
            }
        },

        adjustColor : function(color, percent) {
            var num = parseInt(color.replace("#", ""),16),
                amt = Math.round(2.55 * percent),
                R = (num >> 16) + amt,
                B = (num >> 8 & 0x00FF) + amt,
                G = (num & 0x0000FF) + amt;
                return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
        },

        render : function() {
            // Renders header HTML within table for datatable to load
            headerHTML = "<th>";
            for (var i = 0; i < this.headers.length; i++){
                headerHTML = headerHTML + this.headers[i] + "</th><th>"
            }
            this.$el.html("<thead><tr>" + headerHTML.slice(0,headerHTML.length - 4) + "</thead>");

            // AJAX loaded Datatable initialization
            var view = this;
            $(document).ready(function() {
                view.table = $("#" + view.id).DataTable( {
                    "ajax": {
                            "url": "/api/datasets/" + view.dataset_id,
                            contentType: 'application/json; charset=utf-8',
                            dataType : 'json',
                            "data": {data_type : 'raw_data',
                                provider : 'column',
                                offset : 1}
                                //limit : 100000,
                    },
                    // Misalignment fix derived from:
                    // https://stackoverflow.com/questions/13178039/datatables-fixed-headers-misaligned-with-columns-in-wide-tables
                    select : true,
                    "iDisplayLength": 10,
                    "bPaginate": true,
                    "iCookieDuration": 60,
                    "bStateSave": false,
                    "bAutoWidth": false,
                    //true
                    "bScrollAutoCss": true,
                    "bProcessing": true,
                    "bRetrieve": true,
                    "bJQueryUI": true,
                    //"sDom": 't',
                    "sDom": '<"H"CTrf>t<"F"lip>',
                    "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
                    //"sScrollY": "500px",
                    //"sScrollX": "100%",
                    "sScrollXInner": "110%",
                    "paging" : true,
                    "fnInitComplete": function() {
                        this.css("visibility", "visible");
                        view.highlightColumns();
                    }
                });
                var tableId = view.id;
                $('<div style="width: 100%; overflow: auto"></div>').append($('#' + tableId)).insertAfter($('#' + tableId + '_wrapper div').first());
                $("#" + view.id + " tbody").on("click", "td", function () {
                    view.table.cells(".selected").deselect();
                    view.table.cell( this ).select();
                })
            });
        }
    });
});
