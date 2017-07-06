
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
                    checkAffix();
                    createCommentRow("user", $(".popup-textarea").val(), uniqID);
                    $("#comment-section").load(window.location.href + " #comment-section");
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
                checkAffix();
                $("#comment-section").load(window.location.href + " #comment-section");
                $("#comment-textarea").val("");
            }
        });

}; 

