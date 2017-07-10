$("#filters :checkbox").click(function () {
    
    var n = 0;
    if ($(this).attr("id") === "all") {
        $("#filters :checkbox").prop("checked", false);
        $(".dash-project").show();
        $("#all:checkbox").prop("checked", true);
    }
    else {
        $("#all:checkbox").prop("checked", false);
        n = 0;
        $(".dash-project").hide();
        $("#filters :checkbox:checked").each(function () {
            $("." + $(this).val()).show();
            n++;
        });
        if (n == 0) {
            $("#filters :checkbox").prop("checked", false);
            $(".dash-project").show();
            $("#all:checkbox").prop("checked", true);
        }
    }
});

