
$(function () {
    $('#toggle').bootstrapToggle({
        on: 'Open',
        off: 'Closed'
    });
})


$(function () {
    $('#toggle').change(function () {
        var DataFromToggle = {

        "ImageId": $("#ImageId").val(),
        "Open": $("#toggle").prop('checked')
        }

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
    })
})