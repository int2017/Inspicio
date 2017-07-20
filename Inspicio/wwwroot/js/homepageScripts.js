var section = 2;

function switchSection() {
    setTimeout(function () {
        $("[id^='section'").hide();
        $("#section" + section).show();
        section++;
    }, 2000)
    
}

$(".switch-section").click(function () {
    if ($("#chatbot-check").is(":checked")) {
        switchSection();
    }
    else alert("Select people for your review first!")
})