﻿
    //function will be called on button click having id btnsave
    $("#submit-comment").click(function () {

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
                    $("#comment-section").load(window.location.href + " #comment-section");
                    $("#comment-textarea").val('');
                }

              });

    }); 