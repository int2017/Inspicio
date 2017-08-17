$(document).on("change", "#view-dropdown", function () {

        // If the user chooses all reviews
        if ($(this).val() == "0") {
            $(".Open").removeClass("hidden");
            $(".Closed").removeClass("hidden");
            $("#table").slideDown(300);
        }
        // If the user only wants open reviews
        else if ($(this).val() == "1") {
            $(".Open").removeClass("hidden");
            $(".Closed").addClass("hidden");
            $("#table").slideDown(300);
        }

        // if the user only wants closed reviews
        else if ($(this).val() == "2") {
            $(".Open").addClass("hidden");
            $(".Closed").removeClass("hidden");
            $("#table").slideDown(300);
        }
    });
