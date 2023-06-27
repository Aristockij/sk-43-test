$(function () {
    document_ready();
    window_onload();
});

function document_ready() {
    ts = (new Date()).getTime();
    $("body").addClass("ready");

    var os = navigator.platform.toLowerCase();
    if (os.indexOf("mac") != -1) {
        $("body").addClass("mac");
    }

    //responsive_init();
    init_event_handlers();

    bind_widgets();
    $(document).ajaxStop(function () {
        bind_widgets();
    });

    //scroll_animations_init();

    te = (new Date()).getTime();
    console.log("On-Ready Load Time: ", te - ts);
}

function window_onload() {
    ts = (new Date()).getTime();
    $("body").addClass("win-loaded").removeClass("win-not-loaded");
    /*$(document).imagesLoaded(function () {
        te = (new Date()).getTime();
        console.log("Images Load Time: ", te - ts);
        setTimeout(function () {
            $("body").addClass("loaded").removeClass("not-loaded");
        }, 10);
    });*/

    //responsive_update();
    //lazy_load();

    te = (new Date()).getTime();
    console.log("Window Load Time: ", te - ts);

}

$(window).scroll(function () {
    if (typeof $("body").data("scrollval") === "undefined") $("body").data("scrollval", 0);

    //scroll_animations();
    //lazy_load();
    $("body").data("scrollval", $(window).scrollTop());
});

function init_event_handlers() {
    //fix_touch_hovers();
    //click_touch_init();

    ajaxHandlersInit();

    /*$(".animated").appear();
    $(document).on('appear',".animated", function(event, $all_appeared_elements) {
        var elem = $(this);

        var animation = elem.data('animation');

        if (!elem.hasClass('visible')) {
            var animationDelay = elem.data('animation-delay');
            if (animationDelay) {
                setTimeout(function () {
                    elem.addClass(animation + " visible");
                }, animationDelay);
            } else {
                elem.addClass(animation + " visible");
            }
        }
    });*/


    $(document).on("touchstart",".touchevents a",function () {
        $(this).addClass("touched");
    });

    $(document).on("touchend",".touchevents a",function () {
        $(this).removeClass("touched");
    });


    $(window).scroll(function () {
        var scroll_top = parseInt($(this).scrollTop());
        if (scroll_top > 0) {
            $(".header").addClass("fixed").addClass("active");
        }
        else {
            $(".header").removeClass("fixed").removeClass("active");
        }
    });

    $(document).on("click",".page-link",function (e) {
        var link = "#"+$(this).data("link");
        var top = $(link).offset().top - 150;

        $("body,html").animate({"scrollTop":top},"slow");

    });
    //
    // $(document).on("click","#hamburger",function (e) {
    //     if ($(this).hasClass("is-open")) {
    //         $(this)
    //             .removeClass('is-open')
    //             .addClass('is-closed');
    //
    //         $(".header .header-menu--wrap").removeClass("active");
    //     } else {
    //         $(this)
    //             .removeClass('is-closed')
    //             .addClass('is-open');
    //         $(".header .header-menu--wrap").addClass("active");
    //     }
    // });

    //////////////Burger2//////////
    $(document).on("click",".header-burger", ".menu",function (e) {
            $('.header-burger, .menu').toggleClass('active');
    });

    /////////////_hidden_///////////
    $(document).on("click",".better-house-content",function (e){
            $(this).siblings('.better-house-content').removeClass('active');
            $(this).toggleClass('active');
    });

    //////////copy_paste/////////////
    $(document).on("click",".work-block-handler",function (e){
        $(this).parents(".work-block").find(".work-bottom").toggleClass('active');
        $(this).toggleClass("active");
        if ($(this).hasClass('active')) {
            $(this).html("<span>Свернуть</span> текст");
        } else {
            $(this).html("<span>Читать</span> далее");
        }
    });

    /////////////////blog top//////////////////////
    $(document).on("click",".info-blog-left--top",function (e){

            $('.info-blog-left--top').removeClass('active');
            $(this).addClass('active');

            var tab = $(this).data("tab");

            $(".info-blog-right-first").removeClass("active");
            $(".info-blog-right-first[data-tab="+tab+"]").addClass("active");

    });


    //////////filter_hidden/////////////

    $(document).on("click",".choice-filter",function (e){
        $('.choice-filter, .filter').toggleClass('active');
    });

    ///////////////range_slider///////////////

    var $range = $(".js-range-slider"),
        $inputFrom = $(".js-input-from"),
        $inputTo = $(".js-input-to"),
        instance,
        min = 0,
        max = 1000,
        from = 0,
        to = 0;

    $range.ionRangeSlider({
        skin: "round",
        type: "double",
        min: min,
        max: max,
        from: 200,
        to: 800,
        onStart: updateInputs,
        onChange: updateInputs
    });
    instance = $range.data("ionRangeSlider");

    function updateInputs (data) {
        from = data.from;
        to = data.to;

        $inputFrom.prop("value", from);
        $inputTo.prop("value", to);
    }

    $inputFrom.on("input", function () {
        var val = $(this).prop("value");

        // validate
        if (val < min) {
            val = min;
        } else if (val > to) {
            val = to;
        }

        instance.update({
            from: val
        });
    });

    $inputTo.on("input", function () {
        var val = $(this).prop("value");

        // validate
        if (val < from) {
            val = from;
        } else if (val > max) {
            val = max;
        }

        instance.update({
            to: val
        });
    });

    /////////////equipment_items////////////////

    $(document).on("click",".item-btn",function (e){

        $('.item-btn').removeClass('active');
        $(this).addClass('active');

        var tab = $(this).data("tab");

        $(".equipment-text").removeClass("active");
        $(".equipment-text[data-tab="+tab+"]").addClass("active");

    });

    ///////////////////card////////////////////

    $('.all-rus--card path').hover(function(e){

        var id = $(this).attr('id').toUpperCase();

        if($(this).attr('name')) {
            var name = $(this).attr('name');
            $('<div>' + name +'</div>').appendTo('.indicator');
        }

        $('.change').remove();

        $(this).css('fill','#67544b');
        $('.indicator').css({'top':e.pageY,'left':e.pageX+30}).show();



    },function(){
       // $('.indicator').html('');
        $('.indicator').hide();
        $('path').css('fill','#f2efeb');
    });


    $('.reg').hover(function(e) {


        var id = $(this).find('span').text();

        idHover = '#' + id;

        $(idHover).css('fill','#f6e72d');

    },function(){
        //$('.indicator').html('');
        $('.indicator').hide();
        // $('path').css('fill','rgba(0,0,0,0.2)');
    });

//} // revertFill

    //$('.scroll-pane').jScrollPane();

    setTimeout(function(){
        $(window).resize();
    },300);


}

$(window).on("resize orientationchange", function (e) {
    //$('.scroll-pane').jScrollPane();
    //responsive_update();
    //scroll_animations();
});

function bind_widgets() {
    img_to_bg();
    slider_init();
    fancybox_init();
    //gmap_load();
    validate_init();
    mask_init();
    checkbox_plain_init();
    //sliceSlider_init();
    //ui_slider_init();
}
