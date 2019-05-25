const authDOM = {
    fieldEmail: '#email',
    fieldFullname: '#fullname',
    fieldPass: '#password',
    fieldPass2: '#password2',
    fieldJobs: '#jobs',
    fieldGituser: '#githubusername',
    formRegister: '#form-register',

    formLogin: '#form-login',
    fieldEmailLog: '#email_login',
    fieldPassLog: '#password_login'
}

class Authentication {
    constructor(email, password, fullname, jobs, gitusername){
        this.email = email;
        this.password = password;
        this.fullname = fullname;
        this.jobs = jobs;
        this.gitusername = gitusername;
    }

    add(){
        var data = {
            email: this.email,
            password: this.password,
            fullname: this.fullname,
            jobs: this.jobs,
            githubusername: this.gitusername
        }
         $.ajax({
            url: `/api/owner/register`,
            method: 'post',
            data: data,
            success: function(data){
               if(data.code === 1){
                   notifications(data.msg);
                   window.location.href = '/';
               }
            },
            error: function(err){
                if(err.responseJSON.errors){
                    return err.responseJSON.errors.forEach(msg => notifications(msg.msg))
                }
                notifications(err.responseJSON.msg)          
            }
        })
    }

    signIn(){
        var data = {
            email: this.email,
            password: this.password
        }

        $.ajax({
            url: `/api/owner/login`,
            method: 'post',
            data: data,
            success: function(data){
                if(data.login){
                     localStorage.setItem('privatesite', JSON.stringify(data));
                     window.location.href = '/owner';
                }else{
                    console.log('salah')
                }
                
            },
            error: function(err){
                if(err.responseJSON.errors){
                    return err.responseJSON.errors.forEach(msg => notifications(msg.msg))
                }
                notifications(err.responseJSON[0].email)  
            }
        })
    }

}

const eventListener = function(){

    $(authDOM.formRegister).on('submit', function(e) {
        e.preventDefault();
        var email, password, fullname, githubusername, jobs;

        email = $(authDOM.fieldEmail).val()
        password = $(authDOM.fieldPass).val()
        password2 = $(authDOM.fieldPass2).val()
        jobs = $(authDOM.fieldJobs).val()
        githubusername = $(authDOM.fieldGituser).val()
        fullname = $(authDOM.fieldFullname).val()
        
        if($.trim(password) !== "" && $.trim(password2) !== ""){
            if(password === password2 ){
                var newData = new Authentication(email, password, fullname, jobs, githubusername);
                newData.add();
            }else{
                return notifications('Password must be same with Confirmed password')
            }
        }else{
            return notifications('Field Empty')
        }
    });

    $(authDOM.formLogin).on('submit', e => {
        e.preventDefault();
        var email, password;
        email = $(authDOM.fieldEmailLog).val()
        password = $(authDOM.fieldPassLog).val()

        if($.trim(email) !== ""){
            if($.trim(password) !== ""){
                var login = new Authentication(email, password, null, null, null);
                login.signIn()
            }else{
                return notifications('Password is required')
            }
        }else{
            return notifications('Email is required')
        }

    })

 
   

    return {
        init: function(){
            console.log('event is fired!')
        }
    }
}();

$(document).ready(function($) {
    eventListener.init();
});