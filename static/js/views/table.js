define([''],
    function() {
    return Backbone.View.extend({

        id : "data-table",

        initialize: function(config){
            //$('body').append("<div")
            //console.log(config.data);
            this.dataset_id = config.datset_id;
            this.headers = config.headers;
            console.log(this.headers);
            headerHTML = "<th>";
            for (var i = 0; i < this.headers.length; i++){
                headerHTML = headerHTML + this.headers[i] + "</th><th>"
            }
            $("#data-table").html("<thead><tr>" + headerHTML.slice(0,headerHTML.length - 4) + "</thead>");
        },

        render : function() {
            var view = this;
            $(document).ready(function() {
                view.table = $("#" + view.id).DataTable( {
                //$("#" + this.id).DataTable( {
                    "ajax": {
                            "url": '/api/datasets/c6846140ddc4dc1d',// + view.dataset_id,
                            contentType: 'application/json; charset=utf-8',
                            dataType : 'json',
                            "data": {data_type : 'raw_data',
                                provider : 'column'}
                                //limit : 100000,
                                //offset: 1}
                    },
                    select : true
                });
                $("#" + view.id + " tbody").on("click", "td", function () {
                    view.table.cells(".selected").deselect();
                    view.table.cell( this ).select();
                })
            });
        }
    });
});
