$(document).ready(function () {

    $(function () {
        $('#toggle').bootstrapToggle({
            on: 'Open',
            off: 'Closed'
        });
    });

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