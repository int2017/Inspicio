$(document).ready(function () {

    $(function () {

        $(document).on("click", '#screen-state-toggle', function () {

            var id = $("#ScreenId").val();
            $.ajax(
                {
                    type: "POST",
                    url: "../Toggle_ScreenState?id=" + id, 
                    dataType: "json",
                    success: function (response) {

                        if (response == 0) {
                            $('#' + id).css("opacity", "1.0");
                            $('#' + id + '.state').removeClass("screen-closed");
                            $('#' + id + '.state').removeClass("glyphicon glyphicon-ok-circle");
                            $('#' + id + '.state').addClass("screen-open");
                            $('#' + id + '.state').addClass("glyphicon glyphicon-exclamation-sign");

                            $("#screen-state-toggle").attr("title", "Close Screen");
                            $("#screen-state-icon").addClass("class=fa fa-toggle-off");
                            $("#screen-state-icon").removeClass("class=fa fa-toggle-on");
                        }
                        else {
                            $('#' + id).css("opacity", "0.5");
                            $('#' + id + '.state').removeClass("glyphicon glyphicon-exclamation-sign");
                            $('#' + id + '.state').removeClass("screen-open");
                            $('#' + id + '.state').addClass("screen-closed");
                            $('#' + id + '.state').addClass("glyphicon glyphicon-ok-circle");

                            $("#screen-state-toggle").attr("title", "Re-open Screen");
                            $("#screen-state-icon").addClass("class=fa fa-toggle-on");
                            $("#screen-state-icon").removeClass("class=fa fa-toggle-off");
                        }
                    }
                });
        });
    });


    $("#review-state-toggle").on('click', function () {

        var reviewData = {

            "ReviewId": $("#ReviewId").val(),
            "Open": $("#review-state").hasClass('review_closed') ? true : false
        };

        $.ajax(
            {
                type: "POST", //HTTP POST Method  
                url: "../CloseReview", // Controller/View  
                contentType: "application/json;",
                dataType: "text",
                data: JSON.stringify(reviewData),
                success: function (response) {

                    if (response == 1) {
                        $("#review-state-toggle").attr("title", "Re-open Review");
                        $("#review-state-icon").addClass("fa fa-toggle-on");
                        $("#review-state-icon").removeClass("fa fa-toggle-off");
                        $("#review-state").html("Review :Closed");
                    }
                    else {
                        $("#review-state-toggle").attr("title", "Close Review");
                        $("#review-state-icon").addClass("fa fa-toggle-off");
                        $("#review-state-icon").removeClass("fa fa-toggle-on");
                        $("#review-state").html("Review :Open");
                    }
                }
            });
    })
})