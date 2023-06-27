function ajaxHandlersInit(){

    $(document).on("submit.valid",".form-ajax form", function(e){
        e.preventDefault();

        var form =  $(this);
        var action =  form.find('.form-action').val();
        var place =  form.find('.form-place').val();

        var data = form.serialize();


        $.ajax({
            type: "POST",
            url: action,
            data: data+"&web_form_submit=Y&submit=Y",
            success: function(data) {
                if (place=="popup"){
                    $.fancybox.close();
                    $.fancybox.open(data);
                }
                else
                {
                    $("#"+place).html(data);
                }

            },
            error: function(data) {
                $(form).find('.js-form-submit').text('Произошла ошибка');
                setTimeout(function() {
                    $(form).find('.js-form-submit').text('Отправить');
                }, 2000);
            }
        });


    });


    $(document).on("click",".blog-like-handler",function (e) {
        var self = $(this);
        var type = $(this).data("type");
        var id = $(this).data("id");

        var data = {
            type: type,
            id: id
        };

        $.ajax({
            type: "POST",
            url: "/ajax/blog_like.php",
            data: data,
            success: function(data) {
                self.parent().html("<h2>Спасибо за ваше мнение!</h2>")
            }
        });

    });


}
    