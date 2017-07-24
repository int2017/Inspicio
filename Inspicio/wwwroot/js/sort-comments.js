$(document).ready(function () {
   

    addComDates();
    $(document).on("click",".date-header",function () {
        var date = $(this).children().data("value");
        $(".date-header").removeClass("active");
        $("#comment-date").val(date).change();
    })

    $("#comment-date").change(function () {
        if ($(this).val() == "all") {
            $(".date-header").removeClass("active");
            $(".comment").slideDown(300);
        }
        else {
            $(".comment").slideUp(300);
            var value = $(this).val().toLowerCase();

            $(".date-header").each(function () {
                var dateVal = $(this).children().data("value");
                if (dateVal.toLowerCase() == value) {
                    $(this).addClass("active");

                }
            })
            $("." + value).delay(300).slideDown(400);
            
        }

    })
});

function addComDates() {
    alert("addc")
    $("#comment-date").html("<option value='all'>All</option>");
    var dates = [];
    $(".date-header").each(function () {
        var dateVal = $(this).children().data("value");
        if ($.inArray(dateVal, dates)) {
            var option = document.createElement('option');
            $(option).html(dateVal).val(dateVal);
            $(option).appendTo("#comment-date");
            dates.push(dateVal.toLowerCase());
        }
        })
    }
        
    