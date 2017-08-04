$(document).ready(function(){
    $(function () {
        $('#toggle').bootstrapToggle({
            on: 'Open',
            off: 'Closed'
        });
    });
    $(function () {

        $(document).on("change", "#toggle", function () {
            var DataFromToggle = {

                "ReviewId": $("#ReviewId").val(),
                "Open": $("#toggle").prop('checked')
            };

            $.ajax(
                {
                    type: "POST", //HTTP POST Method  
                    url: "../CloseReview", // Controller/View  
                    contentType: "application/json;",
                    dataType: "text",
                    data: JSON.stringify(DataFromToggle),
                    success: function () {
                    }
                });
        });
    });
})