function img_to_bg($o) {
    if (typeof $o === "undefined") $o = $(".img-to-bg");
    $o.each(function () {
        if ($(this).find("> img").length && $(this).find("> img").attr("src")) {
            $(this).css("background-image", "url('" + $(this).find("> img").attr("src") + "')");
            $(this).addClass("img-to-bg--inited");
        }
    });
}

/*

Slider

 */



/*

Gallery and Modal Popups

 */

function fancybox_init() {

    if (!$("body").hasClass("fancybox-inited")) {

        if ($().fancybox) {
            $.fancybox.options_modal = {
                slideShow: false,
                hash: false,
                clickContent: false,
                clickSlide: false,
                clickOutside: false,
                keyboard: false,
                mobile: {
                    clickSlide: false
                },
                ajax: {
                    settings: {
                        cache: false
                    }
                },
                baseClass: "fancybox-container--popup",
                trapFocus: false,
                autoFocus: false,
                touch: false,
                popup_default: true,
                btnTpl : {
                    smallBtn: '<button data-fancybox-close class="fancybox-close-small"><i class="icon-cross-slim"></i></button>'
                },
                afterLoad: function (instance, current) {
                    console.log("afterLoad", current, current.$content);
                    current.$content.wrap("<div>");
                },
            };
            if ($().tooltipster) {
                $.fancybox.defaults.beforeLoad = function (instance, current) {
                    var tooltips = $.tooltipster.instances();
                    $.each(tooltips, function (i, tooltip) {
                        tooltip.close();
                    });
                };
            }
            $.fancybox.defaults.hash = false;
            $.fancybox.defaults.errorTpl = '<div><div class="panel panel--compact"><div class="panel__content"><p>Произошла ошибка при загрузке. <br /> Попробуйте ещё раз.</p></div></div></div>';
        }

        $('body').on('mousewheel', function (e) {
            if ($(".fancybox-is-zoomable").length) {
                e.preventDefault();
                var instance = $.fancybox.getInstance();
                if ($(".fancybox-is-zoomable").length && instance.canPan() && e.deltaY > 0) {
                    instance.scaleToFit();
                } else if ($(".fancybox-can-zoomIn").length && instance.isScaledDown() && e.deltaY < 0) {
                    instance.scaleToActual(e.clientX, e.clientY);
                }
            }
        });

        $("body").addClass("fancybox-inited");
    }

    if (jQuery().fancybox) {

        var options = {
            slideShow: false,
            hash: true,
            loop: true,
            idleTime: 10,
            margin: [44, 0],
            gutter: 50,
            keyboard: true,
            animationEffect: "zoom",
            arrows: true,
            infobar: false,
            toolbar: true,
            buttons: [
                //'slideShow',
                //'fullScreen',
                //'thumbs',
                'close'
            ],
            thumbs: {
                autoStart: false,
                hideOnClose: true
            },
        };

        $fancybox_links_all = $("[data-fancybox]").not(".fancybox-inited");

        $fancybox_links = $fancybox_links_all.not("[data-type='ajax']");
        fancybox_links_by_group = [];
        groups = [];
        $fancybox_links.each(function () {
            var group = $(this).attr("data-fancybox");
            if (!group) group = "";
            if ($.inArray(group, groups) < 0) groups.push(group);
        });
        for (group in groups) {
            options_current = $.extend(true, {}, options);
            var $items = $fancybox_links.filter("[data-fancybox='" + groups[group] + "']");
            var $first = $items.eq(0);
            if (typeof $first.attr("data-fancybox-loop") !== "undefined") {
                options_current["loop"] = $first.data("fancybox-loop");
            }
            $items.fancybox(options_current).addClass("fancybox-inited");
        }

        $fancybox_links_ajax = $fancybox_links_all.filter("[data-type='ajax']");
        $fancybox_links_ajax.each(function () {
            if ($(this).attr("data-type") == "ajax" || $(this).attr("data-src")) {
                options = $.fancybox.options_modal;
            }
            $(this).fancybox(options);
        }).addClass("fancybox-inited");
    }
}




/*

 Input Masks

 */

function mask_init() {

    if (!$("body").hasClass("inputmask-inited")) {
        Inputmask.extendDefaults({
            showMaskOnHover: false,
            showMaskOnFocus: true,
            onKeyDown: function(event, buffer, caretPos, opts) {
                if (event && event.target && !$(event.target).inputmask('isComplete')) {
                    $(event.target).removeClass("mask-complete");
                    $(event.target).removeClass("mask-incomplete");
                }
            },
            oncomplete: function(event) {
                if (event && event.target) {
                    $(event.target).addClass("mask-complete");
                    $(event.target).removeClass("mask-incomplete");
                }
            },
            onincomplete: function(event) {
                if (event && event.target) {
                    $(event.target).removeClass("mask-complete");
                    $(event.target).addClass("mask-incomplete");
                    $(event.target).val("");
                }
            },
        });

        $("body").addClass("inputmask-inited")
    }

    $(".mask-phone-ru").filter(":not(.mask-inited)").inputmask({
        definitions: {
            '#': {
                validator: "[0-9]",
                cardinality: 1
            }
        },
        mask: "+7 (###)-###-##-##",
        placeholder: "_"
    }).addClass("mask-inited");

}


/*

 Form Validation

 */

function validate_init()
{
    if (!$.validator) return;

    if (!$("body").hasClass("validate-inited")) {

        $(document).on("reset", ".form-validate form", function () {
            $(this).find(".textfield, :input").removeClass("error");
            setTimeout(function () {
                $(":input").trigger("change");
                $(".checkbox-plain-js input[type='checkbox'], .checkbox-plain-js input[type='radio']").trigger("change-pseudo");
            }, 50);
        });

        $.validator.setDefaults({
        });

        $.extend($.validator.messages, {
            required: "Обязательное поле.",
            email: "Некорректный E-mail.",
            phonecomplete: "Неполный номер телефона.",
            latlng: "Некорректные координаты.",
            complexity: "Некорректный формат.",
            digits: "Только цифры.",
            passport: "Неполный номер паспорта",
            card: "Неполный номер карты",
        });

        $.validator.addMethod("email", function( value, element ) {
            return this.optional( element ) || /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test( value ); // /^[a-zA-Z\-\._]+@[a-z0-9\-]+(\.[a-z0-9\-]+)*\.[a-z]+$/i
        });

        $.validator.addMethod("phonecomplete", function( value, element ) {
            return this.optional( element ) || (value.replace(/\D/, "").length >= 7 && $(element).inputmask('isComplete'));
        });

        $.validator.addMethod("passport", function( value, element ) {
            return this.optional( element ) || (value.replace(/\D/, "").length >= 10 && $(element).inputmask('isComplete'));
        });

        $.validator.addMethod("card", function( value, element ) {
            return this.optional( element ) || (value.replace(/\D/, "").length >= 12 && $(element).inputmask('isComplete'));
        });

        $.validator.addMethod("password", function( value, element ) {
            return this.optional( element ) || value.length >= 6;
        }, "Должно быть не меньше 6 символов.");

        $.validator.addMethod("passwordconfirm", function( value, element ) {
            var $password = $($(element).data("rule-passwordconfirm-password"));
            return this.optional( element ) || !$password.length || !$password.val() || value === $password.val();
        }, "Пароль не совпадает с подтверждением.");

        $.validator.addMethod("emailconfirm", function( value, element ) {
            var $email = $($(element).data("rule-emailconfirm-password"));
            return this.optional( element ) || !$email.length || !$email.val() || value === $email.val();
        }, "E-mail должны совпадать.");

        $.each($.validator.methods, function (key, value) {
            $.validator.methods[key] = function () {
                if(arguments.length > 0) {
                    arguments[0] = $.trim(arguments[0]);
                }
                return value.apply(this, arguments);
            };
        });

        $(document).on("keyup blur change check-form", ".form-disabled-until-valid :input", function () {
            var $form = $(this).closest(".form-disabled-until-valid");
            var $button = $form.find(".disabled-until-valid");
            $button.prop('disabled', !$form.validate().checkForm());
        });

        $(document).on("change change-checkbox-valid", "input[type='checkbox'], input[type='radio']", function () {
            var $form = $(this).closest("form");
            var validator = $form.data("validator");
            if (validator) $(this).valid();
        });

        $("body").addClass("validate-inited");
    }

    var $forms = $(".form-validate form").not(".form-validate-inited");
    $forms.each(function(){
        $(this).validate({
            onkeyup: false,
            normalizer: function( value ) {
                return $.trim( value );
            },
            errorClass: 'form--error',
            validClass: 'valid',
            errorElement: 'div',
            highlight: function(element, errorClass, validClass) {
                $(element).addClass('error').removeClass('valid');
            },
            unhighlight: function(element, errorClass, validClass) {
                $(element).addClass('valid').removeClass('error');
            },
            errorPlacement: function(error, element) {
               // $(element).closest(".form--item").append(error);
            },
            submitHandler: function(form, e) {
                $(form).trigger("submit.valid");
            }
        });

        $(this).addClass("form-validate-inited")
    });

    $(".form-disabled-until-valid").find(":input").first().trigger("check-form");

}


/*

Custom Checkboxes

 */

function checkbox_plain_init() {
    $(".checkbox-plain-js").find("[type='checkbox'], [type='radio']").not(".checkbox-plain-js-inited").on("change change-pseudo", function(e){
        var $o = $(this).closest(".checkbox-plain-js");
        if ($(this).is(":radio"))
        {
            var name = $(this).attr("name");
            var $radios = $(this).closest("form").find("[name='"+name+"']");
            if (!$radios.length) $radios = $("input[name='"+name+"']");
            $radios.closest(".checkbox-plain-js").removeClass("checked");
        }
        if ($(this).prop("checked")) $o.addClass("checked");
        else $o.removeClass("checked");
        if ($(this).prop("disabled")) $o.addClass("disabled");
        else $o.removeClass("disabled");
    }).on("focus", function(e){
        var $o = $(this).closest(".checkbox-plain-js");
        if (!$(this).prop("disabled")) $o.addClass("focused");
    }).on("blur", function(e){
        var $o = $(this).closest(".checkbox-plain-js");
        $o.removeClass("focused");
    }).each(function(){
        var $o = $(this).closest(".checkbox-plain-js");
        if ($(this).prop("checked")) $o.addClass("checked");
        if ($(this).prop("disabled")) $o.addClass("disabled");
    }).addClass("checkbox-plain-js-inited").closest(".checkbox-plain-js").addClass("checkbox-plain-js-inited").find("input:text").on("focus", function(){
        $(this).closest(".checkbox-plain-js").find(":checkbox,:radio").prop("checked", true).trigger("change");
    });
}

/*

Slider

 */


function slider_init($s)
{
    slider_swiper_init($s);
}

function slider_swiper_init($s)
{
    if (typeof Swiper !== "undefined")
    {
        if (typeof $s === "undefined") $s = $(".swiper-slider").filter(":not(.slider-events-added)");
        $s.each(function(){
            var $this = $(this);
            var swiper = new Swiper($this.find('.swiper-container'), {
                direction: (typeof $this.data("slider-direction") !== "undefined")?$this.data("slider-direction"):'horizontal',
                loop: (typeof $this.data("slider-loop") !== "undefined")?$this.data("slider-loop"):false,
                //loopAdditionalSlides: 13,
                autoplay: (typeof $this.data("slider-autoplay") !== "undefined")?$this.data("slider-autoplay"):false,
                initialSlide: (typeof $this.data("slider-initial-slide") !== "undefined")?$this.data("slider-initial-slide"):0,
                pagination: (typeof $this.data("slider-pagination") !== "undefined")?$this.data("slider-pagination"):$this.find('.swiper-pagination'),
                paginationType: (typeof $this.data("slider-pagination-type") !== "undefined")?$this.data("slider-pagination-type"):'bullets',
                paginationBulletRender: function(swiper, index, className) {
                    var $slider = $(swiper.container).closest(".swiper-slider");
                    var name = $(swiper.slides).filter("[data-swiper-slide-index='"+index+"']").first().attr("data-pagination-name");
                    var tag = 'span';
                    if ($slider.length)
                    {
                        if ($slider.data("slider-pagination-element"))
                        {
                            tag = $slider.data("slider-pagination-element");
                        }
                    }
                    if (!name) name = "";
                    return '<'+tag+' class="' + className + '">' + name + '</'+tag+'>';
                },
                paginationElement: (typeof $this.data("slider-pagination-element") !== "undefined") ? $this.data("slider-pagination-element") : 'span',
                scrollbar: ($this.find('.swiper-scrollbar').length)?$this.find('.swiper-scrollbar'):null,
                scrollbarHide: (typeof $this.data("slider-scrollbar-hide") !== "undefined")?$this.data("slider-scrollbar-hide"):false,
                scrollbarDraggable: (typeof $this.data("slider-scrollbar-draggable") !== "undefined")?$this.data("slider-scrollbar-draggable"):true,
                scrollbarSnapOnRelease: (typeof $this.data("slider-scrollbar-snap-on-release") !== "undefined")?$this.data("slider-scrollbar-snap-on-release"):true,
                freeMode: (typeof $this.data("slider-free-mode") !== "undefined")?$this.data("slider-free-mode"):false,
                autoHeight: (typeof $this.data("slider-auto-height") !== "undefined")?$this.data("slider-auto-height"):false,
                centeredSlides: (typeof $this.data("slider-centered-slides") !== "undefined")?$this.data("slider-centered-slides"):false,
                slidesPerView: (typeof $this.data("slider-slides-per-view") !== "undefined")?$this.data("slider-slides-per-view"):1,
                slidesPerGroup: (typeof $this.data("slider-slides-per-group") !== "undefined")?$this.data("slider-slides-per-group"):1,
                paginationClickable: true,
                effect: (typeof $this.data("slider-effect") !== "undefined")?$this.data("slider-effect"):"slide",
                fade: {
                    crossFade: true
                },
                grabCursor: (typeof $this.data("slider-grabcursor") !== "undefined")?$this.data("slider-grabcursor"):false,
                simulateTouch: (typeof $this.data("slider-simulate-touch") !== "undefined")?$this.data("slider-simulate-touch"):true,
                onlyExternal: (typeof $this.data("slider-only-external") !== "undefined")?$this.data("slider-only-external"):false,
                spaceBetween: (typeof $this.data("slider-space-between") !== "undefined")?$this.data("slider-space-between"):0,
                prevButton: (typeof $this.data("slider-prev-button") !== "undefined")?$this.data("slider-prev-button"):$this.find('.swiper-button-prev'),
                nextButton: (typeof $this.data("slider-next-button") !== "undefined")?$this.data("slider-next-button"):$this.find('.swiper-button-next'),
                speed: (typeof $this.data("slider-speed") !== "undefined")?$this.data("slider-speed"):300,
                buttonDisabledClass: 'disabled',
                slidesOffsetBefore: (typeof $this.data("slider-slides-offset-before") !== "undefined")?$this.data("slider-slides-offset-before"):0,
                slidesOffsetAfter: (typeof $this.data("slider-slides-offset-after") !== "undefined")?$this.data("slider-slides-offset-after"):0,
                roundLengths: (typeof $this.data("slider-round-lengths") !== "undefined")?$this.data("slider-round-lengths"):true,
                lazyLoading: (typeof $this.data("slider-lazy-loading") !== "undefined")?$this.data("slider-lazy-loading"):false,
                lazyLoadingInPrevNext: (typeof $this.data("slider-lazy-loading-in-prev-next") !== "undefined")?$this.data("slider-lazy-loading-in-prev-next"):true,
                lazyLoadingOnTransitionStart: true,
                nested: (typeof $this.data("slider-nested") !== "undefined")?$this.data("slider-nested"):false,
                resistanceRatio: (typeof $this.data("slider-resistance-ratio") !== "undefined")?$this.data("slider-resistance-ratio"):0.85,
                breakpoints: (typeof $this.data("slider-breakpoints") !== "undefined")?$this.data("slider-breakpoints"):null,
                slideToClickedSlide: (typeof $this.data("slider-slide-to-clicked-slide") !== "undefined")?$this.data("slider-slide-to-clicked-slide"):false,
                mousewheelControl: (typeof $this.data("slider-mousewheel-control") !== "undefined")?$this.data("slider-mousewheel-control"):false,
                mousewheelReleaseOnEdges: (typeof $this.data("slider-mousewheel-release-on-edges") !== "undefined")?$this.data("slider-mousewheel-release-on-edges"):false
            });
        }).addClass("slider-events-added");

        $s.each(function(){
            var $this = $(this);

            if (typeof $this.data("slider-control-thumbs") !== "undefined" && typeof $this.find('.swiper-container')[0].swiper !== "undefined")
            {
                var $thumbs_swiper = $($this.data("slider-control-thumbs"));

                if (typeof $thumbs_swiper.find('.swiper-container')[0].swiper !== "undefined")
                {
                    var thumbs_swiper = $thumbs_swiper.find('.swiper-container')[0].swiper;
                    thumbs_swiper.thumbs_goal_swiper = $this.find('.swiper-container')[0].swiper;
                    thumbs_swiper.params.onTap = function(swiper, e){
                        var clicked = swiper.clickedIndex
                        swiper.activeIndex = clicked; //don't need this
                        swiper.updateClasses(); //don't need this
                        $(swiper.slides).removeClass('is-selected');
                        $(swiper.clickedSlide).addClass('is-selected');
                        swiper.slideTo(clicked, swiper.params.speed, false);
                        swiper.thumbs_goal_swiper.slideTo(clicked, swiper.thumbs_goal_swiper.params.speed, true);
                    };
                };

                $this.find('.swiper-container')[0].swiper.params.onSlideChangeEnd = function(swiper){
                    var $o = $(swiper.container.closest(".swiper-slider").data("slider-control-thumbs"));
                    if (typeof $o.find('.swiper-container')[0].swiper !== "undefined")
                    {
                        var thumbs_swiper = $o.find('.swiper-container')[0].swiper;
                    }
                    var activeIndex = swiper.activeIndex;
                    if (typeof thumbs_swiper !== "undefined")
                    {
                        $(thumbs_swiper.slides).removeClass('is-selected');
                        $(thumbs_swiper.slides).eq(activeIndex).addClass('is-selected');
                        thumbs_swiper.slideTo(activeIndex, thumbs_swiper.params.speed, false);
                    }
                };
                $this.find('.swiper-container')[0].swiper.params.onSlideChangeStart = $this.find('.swiper-container')[0].swiper.params.onSlideChangeEnd;
                $this.find('.swiper-container')[0].swiper.params.onSlideChangeEnd($this.find('.swiper-container')[0].swiper);
            }

            $this.find('.swiper-container')[0].swiper.on('slideChangeStart', function (swiper) {
                var $activeSlide = $(swiper.slides).eq(swiper.activeIndex);
                if ($activeSlide.hasClass("home-reviews-item")){
                    var counter = $activeSlide.data("counter-name");
                    $(".home-reviews-counter").text(counter);
                }
                $activeSlide.find(".swiper-lazy-preloader").css({
                    top: swiper.height/2
                });
                $(swiper.slides).find(".video-block").each(function(){
                    var player = $(this).data("player");
                    if (player)
                    {
                        player.pauseVideo();
                    }
                });
            });

            $this.find('.swiper-container')[0].swiper.on('onLazyImageReady', function (swiper) {
                swiper.setWrapperTransition(swiper.params.speed);
                swiper.updateAutoHeight();
            });

        });

        $(window).on("resize orientationchange", function(){
            delay_slider_resize(function(){
                $(".swiper-slider.slider-events-added").each(function(){
                    if ($(this).data("reinitialize-on-resize") && typeof $(this).find(".swiper-container")[0].swiper !== "undefined")
                    {
                        var swiper = $(this).find(".swiper-container")[0].swiper;
                        swiper.destroy(true, true);
                        slider_swiper_init($(this));
                    }
                });
            }, 300);
        });

        $(window).trigger("resize-swiper-wrapper-center-if-less");
    }
}

var delay_slider_resize = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();


function sliceSlider_init() {
    (function ($) {

        var SliceSlider = {

            /**
             * Settings Object
             */
            settings: {
                delta: 0,
                currentSlideIndex: 0,
                scrollThreshold: 40,
                slides: $('.home-slide'),
                numSlides: $('.home-slide').length,
                navPrev: $('.js-prev'),
                navNext: $('.js-next'),
            },

            /**
             * Init
             */
            init: function () {
                s = this.settings;
                this.bindEvents();
            },

            /**
             * Bind our click, scroll, key events
             */
            bindEvents: function () {

                // Scrollwheel & trackpad
                /*s.slides.on({
                    'DOMMouseScroll mousewheel' : SliceSlider.handleScroll
                });*/
                // On click prev
                s.navPrev.on({
                    'click': SliceSlider.prevSlide
                });
                // On click next
                s.navNext.on({
                    'click': SliceSlider.nextSlide
                });
                // On Arrow keys
                $(document).keyup(function (e) {
                    // Left or back arrows
                    if ((e.which === 37) || (e.which === 38)) {
                        SliceSlider.prevSlide();
                    }
                    // Down or right
                    if ((e.which === 39) || (e.which === 40)) {
                        SliceSlider.nextSlide();
                    }
                });
            },

            /**
             * Interept scroll direction
             */
            handleScroll: function (e) {

                // Scrolling up
                if (e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0) {

                    s.delta--;

                    if (Math.abs(s.delta) >= s.scrollThreshold) {
                        SliceSlider.prevSlide();
                    }
                }

                // Scrolling Down
                else {

                    s.delta++;

                    if (s.delta >= s.scrollThreshold) {
                        SliceSlider.nextSlide();
                    }
                }

                // Prevent page from scrolling
                return false;
            },

            /**
             * Show Slide
             */
            showSlide: function () {
                // reset
                s.delta = 0;
                // Bail if we're already sliding
                if ($('body').hasClass('is-sliding')) {
                    return;
                }
                // Loop through our slides
                s.slides.each(function (i, slide) {

                    // Toggle the is-active class to show slide
                    $(slide).toggleClass('is-active', (i === s.currentSlideIndex));
                    $(slide).toggleClass('is-prev', (i === s.currentSlideIndex - 1));
                    $(slide).toggleClass('is-next', (i === s.currentSlideIndex + 1));

                    // Add and remove is-sliding class
                    $('body').addClass('is-sliding');

                    setTimeout(function () {
                        $('body').removeClass('is-sliding');
                    }, 1000);
                });
            },

            /**
             * Previous Slide
             */
            prevSlide: function () {

                // If on first slide, loop to last
                if (s.currentSlideIndex <= 0) {
                    s.currentSlideIndex = s.numSlides;
                }
                s.currentSlideIndex--;

                SliceSlider.showSlide();
            },

            /**
             * Next Slide
             */
            nextSlide: function () {

                s.currentSlideIndex++;

                // If on last slide, loop to first
                if (s.currentSlideIndex >= s.numSlides) {
                    s.currentSlideIndex = 0;
                }

                SliceSlider.showSlide();
            },
        };
        SliceSlider.init();
    })(jQuery);

}

/* UI Slider init*/


function ui_slider_init() {


    $( "#u-slider" ).slider({
        range: "min",
        value: 100000,
        min: 10000,
        max: 1000000,
        step: 10000,
        slide: function( event, ui ) {
            $( ".offer-sum--amount" ).html( ui.value.toLocaleString() + "<span> рублей</span>");
            $( "input[name='form_AMOUNT']" ).val( ui.value);
        }
    });
    $( ".offer-sum--amount" ).html( $( "#u-slider" ).slider( "value" ).toLocaleString() + "<span> рублей</span>" );
    $( "input[name='form_AMOUNT']" ).val( $( "#u-slider" ).slider( "value" ));


}


function ymap_load(){

    var items;

    ymaps.ready(init);

    function init() {
        var myMap = new ymaps.Map('map', {
            center: [58.637982, 49.578829],
            zoom: 14,
            controls: ['smallMapDefaultSet']
            }, {
                searchControlProvider: 'yandex#search'
            });

        var collection = new ymaps.GeoObjectCollection(null);

        var arPlace = [];



        createPlaceMarks();


        function createPlaceMarks () {


            placemark = new ymaps.Placemark([58.637982, 49.578829], {
                hintContent: "Компания Конкрит",
                balloonContent: "Киров, п. Ганино, улица Тарасовская, дом 10"
            }, {
                iconLayout: 'default#image',
                iconImageHref: '/local/templates/Konkrit/img/fav.png',
                iconImageSize: [35, 30],
                iconImageOffset: [-14, -26]
            });

            arPlace.push(placemark);

            collection.add(placemark);

        }

        myMap.geoObjects.add(collection);

    }
}

/* MAP init */

function gmap_load()
{
    if ($(".map").length && !$("#api-maps-google").length)
    {
        var script = document.createElement('script');
        script.id = 'api-maps-google';
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=gmap_init&key=AIzaSyArXFUoj17I4IKRuUSeRiWUakoxs6mHKiE';
        document.body.appendChild(script);
    }
    else if ($("#api-maps-google").length) {
        gmap_init();
    }
}

function gmap_init()
{
    if (typeof google === "undefined") return;
    CustomMarkerInit();
    $(".map:not(.map--inited)").each(function(){
        var center = $(this).data("center").split(",");
        var zoom = $(this).data("zoom");
        var map_center_point = new google.maps.LatLng(center[0], center[1]);

        var mapOptions = {
            zoom: zoom,
            center: map_center_point,
            panControl: false,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            //disableDoubleClickZoom: true,
            streetViewControl: false,
            fullscreenControl: false,
            scrollwheel: false,
            draggable: true,
            overviewMapControl: false,
            gestureHandling: Modernizr.touchevents?'cooperative':false,
            styles:
                [{"stylers": [{"hue": "#f3f3f3"}, {"invert_lightness": false}, {"saturation": -100}, {"lightness": 33}, {"gamma": 0.5}]}, {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{"color": "#f3f3f3"}]
                }]
        };

        var map = new google.maps.Map($(this)[0], mapOptions);
        $(this).data("map", map);
        map._div = $(this);
        $(this).data("map", map);
        map._div = $(this);

        google.maps.event.addListenerOnce(map, 'idle', function(){
            var $map = $(this._div);
            var this_map = this;
            setTimeout(function(){
                google.maps.event.trigger(this_map, "resize");
            }, 0);
        });

        $(window).on('resize orientationchange', function() {
            map_set_default_center();
        });

        if ($(this).data("point"))
        {
            var point = $(this).data("point").split(",");
            var marker_class = $(this).data("marker-class");
            map_set_marker(map, point, marker_class);
        }

        $(this).addClass("map--inited");
    });
}

function map_set_marker(map, point, marker_class)
{
    if (typeof marker_class === "undefined") {
        marker_class = 'default';
    }
    if (point.length > 1)
    {
        var point_name = point[0]+"_"+point[1];
        if (!$(map._div).data("markers")) {
            $(map._div).data("markers", {});
        }
        if (!$(map._div).data("markers")[point_name]) {
            var marker = new CustomMarker(
                new google.maps.LatLng(point[0], point[1]),
                map,
                {
                    html: "<div class='marker-pin marker-pin--"+marker_class+"'></div>"
                }
            );
            var marker_obj = {};
            marker_obj[point_name] = marker;
            $(map._div).data("markers", $.extend({}, $(map._div).data("markers"), marker_obj));
        }
    }
}

function map_set_default_center()
{
    $(".map.map--inited").each(function(){
        var $map = $(this);
        if ($map.length && $map.data("map"))
        {
            var center = $map.data("center").split(",");
            $map.data("map").setCenter(new google.maps.LatLng(center[0], center[1]));

            if ($map.data("pan-by"))
            {
                var panby = $map.data("pan-by").split(",");
                if (panby.length > 1)
                {
                    if (panby[0].indexOf("%") !== -1) panby[0] = $map.width()*parseFloat(panby[0])/100;
                    $map.data("map").panBy(1*panby[0], 1*panby[1]);
                }
            }
        }
    });
}

function CustomMarker(latlng, map, args) {
    this.latlng = latlng;
    this.args = args;
    this.setMap(map);
}

function CustomMarkerInit()
{
    if (typeof CustomMarker.prototype.draw !== "undefined") return;
    CustomMarker.prototype = new google.maps.OverlayView();

    CustomMarker.prototype.draw = function() {

        var self = this;

        var div = this.div;

        if (!div) {

            div = this.div = document.createElement('div');
            div.style.position = 'absolute';

            if (typeof self.args !== 'undefined' && typeof self.args.html !== 'undefined') {
                var $div = $(div);
                $div.html(self.args.html);
                div = $div[0];
            }

            if (typeof self.args !== 'undefined' && typeof self.args.marker_id !== 'undefined') {
                div.dataset.marker_id = self.args.marker_id;
            }

            google.maps.event.addDomListener(div, "click", function(event) {
                google.maps.event.trigger(self, "click");
            });

            var panes = this.getPanes();
            panes.overlayImage.appendChild(div);
        }

        var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

        if (point) {
            div.style.left = point.x + 'px';
            div.style.top = point.y + 'px';
        }
    };

    CustomMarker.prototype.remove = function() {
        if (this.div) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    };

    CustomMarker.prototype.getPosition = function() {
        return this.latlng;
    };
}