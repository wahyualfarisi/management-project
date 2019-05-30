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

function load_github_repo(){
    $.ajax({
        url: `/api/owner/github/${PARSEDATA.githubusername}`,
        method: 'get',
        dataType: 'json',
        beforeSend: function(){
            load_content();
        },
        success: function(data){
            console.log(data);
            var html = '';
            if(data.length > 0){
                data.forEach(item => {
                    html += `
                        <div id="list-group" class="widget-scroll" style="max-height:490px;">
                          <ul class="reviews list-group w-100">
                                <li class="list-group-item" style="margin-top: 20px;">
                                    <div class="media">
                                        <div class="media-body align-self-center">
                                            <div class="username">
                                                <h4><a href="${item.clone_url}" target="_blank"> ${item.full_name} </a> </h4>
                                            </div>
                                            <div class="msg">
                                                <div class="stars">
                                                    <i><button class="btn btn-info">Branch: ${item.default_branch} </button></i>
                                                    <i class="la la-star"></i>
                                                    <i class="la la-star"></i>
                                                    <i class="la la-star"></i>
                                                    <i class="la la-star-half-empty"></i>
                                                </div>
                                                <p>
                                                    ${item.name} 
                                                </p>
                                                <p>
                                                    created at: ${item.created_at}
                                                </p>
                                                <p>
                                                    last update at: ${item.updated_at}
                                                </p>
                                            </div>
                                            <div class="meta">
                                                <span class="mr-3">30 minutes ago - 1 Reply</span>
                                                <a href="#">Reply</a>
                                            </div>
                                        </div>
                                        <div class="media-right pr-3 align-self-center">
                                            <div class="like text-center">
                                                <i class="ion-heart"></i>
                                                <span>12</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                          </ul>
                        </div>
                    `;
                })
            }else{
                html = 'No repository';
            }
            $('#show-github').html(html);
        },
        error: function(err){
            $('#show-github').html(err.responseJSON.msg);
        }
    });
}

function load_content()
{
    var html;
    html = `
    <div class="progress mb-3">
         <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div class="progress mb-3">
        <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div class="progress mb-3">
        <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    `;
    $('#show-github').html(html);
}





$(document).ready(function($) {
    load_value_form()
    load_github_repo();

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
                        localStorage.clear('privatesite');
                        setTimeout(() => {
                            location.reload();
                        }, 2500);
                        return notifications('Update successfully, Please Sign in Again')
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

});//end document ready functions


