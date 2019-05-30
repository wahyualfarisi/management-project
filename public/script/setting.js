var SettingDom = {
    fieldEmail: '#email_setting',
    fieldGithub: '#githubusername',
    fieldJobs: '#jobs',
    fieldFullname: '#fullname',
    btnSaveChange: '#btn-save-change'
}

function load_value_form(){
    $.ajax({
        url: `/api/owner/current`,
        method: 'get',
        dataType: 'json',
        headers: {
            'Content-type': 'application/json',
            'x-auth-token': PARSEDATA.token
        },
        success: function(data){
            if(data.length === 1){
                data.forEach(item => {
                    $(SettingDom.fieldFullname).val(item.fullname)
                    $(SettingDom.fieldEmail).val(item.email_owner)
                    $(SettingDom.fieldGithub).val(item.githubusername)
                    $(SettingDom.fieldJobs).val(item.jobs)
                })
            }
        },
        error: function(err){
            console.log(err)
        }
    })
}



$(document).ready(function($) {
    load_value_form()

    $(SettingDom.btnSaveChange).on('click', () => {
        var fullname, email, github, jobs;
        fullname = $(SettingDom.fieldFullname).val();
        email = $(SettingDom.fieldEmail).val();
        github = $(SettingDom.fieldGithub).val();
        jobs = $(SettingDom.fieldJobs).val();

        if($.trim(email) !== "" && $.trim(github) !== "" && $.trim(jobs) !== ""){
            var data = {
                email: email,
                fullname: fullname,
                githubusername: github,
                jobs: jobs
            }
            $.ajax({
                url: '/api/owner/updateprofile',
                method: 'post',
                data: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                    'x-auth-token': PARSEDATA.token
                },
                success: function(data){
                    if(data.code === 1){
                        load_value_form()
                        return notifications('Update successfully')
                    }
                },
                error: function(err){
                    console.log(err)
                }
            })
          
        }else{
            return notifications('field cannot be empty')  
        }


    })

});


