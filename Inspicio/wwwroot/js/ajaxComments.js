
function commentClick (uniqID) {
        var data = {
                "ImageId": $("#ImageId").val(),
                "Message": $(".popup-textarea").val()
        }
        $.ajax(
            {
                type: "POST", //HTTP POST Method  
                url: "../Comment", // Controller/View  
                contentType: "application/json;",
                dataType: "text",
                data: JSON.stringify(data),
                
                success: function () {
                    createCommentRow("user", $(".popup-textarea").val(), uniqID);
                    $("#comment-section").load(window.location.href + " #comment-section > * ");
                    $("#comment-textarea").val("");
                }
            });

}; 

function commentClickMain() {
    var data = {
        "ImageId": $("#ImageId").val(),
        "Message": $("#comment-textarea").val()
    }
    $.ajax(
        {
            type: "POST", //HTTP POST Method  
            url: "../Comment", // Controller/View  
            contentType: "application/json;",
            dataType: "text",
            data: JSON.stringify(data),

            success: function () {
                $("#comment-section").load(window.location.href + " #comment-section > * ");
                $("#comment-textarea").val("");
            }
        });

}; 

$('#comment-textarea').keypress(function (e) {
    if (e.which == 13) {
        $('#submit-comment').click();
        // prevent duplicate submission
        return false; 
    }
});