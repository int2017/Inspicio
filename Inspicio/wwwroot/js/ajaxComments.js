$(document).ready(function () {
    
    //function will be called on button click having id btnsave
    $("#submit-comment").click(function () {
        var comment = {
            "Message" : $("#comment-textarea").val()
        }
        $.ajax(
            {
                type: "POST", //HTTP POST Method  
                url: "../Comment", // Controller/View  
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(comment),
                
                success: function () {
                    alert(result.success);
                }
            });

    });
});  