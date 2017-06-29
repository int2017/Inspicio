
$(document).ready(function () {

    $(".filter-button").click(function(){
        var value = $(this).attr('data-filter');
        
        if(value === "all")
        {
           
            $('.filter').show('1000');
            $('input[type=checkbox]').not("#all").each(function (i, item) {
                $(item).attr('checked', false);
            })
            
        }
        else 
        {
            $("#all").attr('checked', false);
            $('.filter[filter-item="'+value+'"]').removeClass('hidden');
           // $(".filter").not('.filter[filter-item="'+value+'"]').addClass('hidden');
            $(".filter").not('.'+value).hide('3000');
            $('.filter').filter('.'+value).show('3000');
            
        }
    });
    
    if ($(".filter-button").removeClass("active")) {
$(this).removeClass("active");
}
$(this).addClass("active");

});