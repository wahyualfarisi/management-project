console.log('change password is fired');



$(document).ready(function() {
    $('#form-replace-password').css('display','none');

    $('#form-change-password').on('submit', function(e) {
        e.preventDefault();
        var current = $('#current_password').val();
        if($.trim(current) !== ""){
            var data = {
                current_password: current
            }
            $.ajax({
                url: `/api/owner/change-password`,
                method: 'post',
                data: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                    'x-auth-token': PARSEDATA.token
                },
                success: function(data){
                    if(data.status === 1){
                        SHOW_FORM = true;
                        $('#form-change-password').css('display','none');
                        $('#form-replace-password').css('display','block');
                        return notifications(data.msg)
                    }
                },
                error: function(err){
                    console.log(err.responseJSON.msg)
                    return notifications(err.responseJSON.msg)  
                }
            })
        }else{
            return notifications('Password cannot be empty')  
        }
    });

    $('#btn-cancel').click(function() {
        $('#form-change-password').css('display','block');
        $('#form-replace-password').css('display','none');
    })

    $('#form-replace-password').on('submit', function(e) {
        e.preventDefault();
        alert('submited');
    });

});