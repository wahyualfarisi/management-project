function load_project(){
    $.ajax({
        url: `/api/project`,
        method: 'get',
        headers: {
            'Content-type': 'application/json',
            'x-auth-token': PARSEDATA.token
        },
        success: function(data){
            fetch_data(data);
        }
    })
}

function fetch_data(data){
    var html;
    if(data.length > 0){
        data.forEach(function(item) {
            html += `
                    <tr>
                        <td><span class="text-primary">${item.kode_project}</span></td>
                        <td>${moment(item.start_day).format("YYYY-MM-DD")}</td>
                        <td>${moment(item.finish_day).format("YYYY-MM-DD")}</td>
                        <td>${item.name_of_project}</td>
                        <td><span style="width:100px;"><span class="badge-text badge-text-small info">show link</span></span></td>
                        <td><span style="width:100px;"><span class="badge-text badge-text-small danger">${item.status_project}</span></span></td>
                        <td class="td-actions">
                           <a href="#/invite-team" class="btn btn-primary mr-1 mb-2"> INVITE TEAM </a>
                        </td>
                    </tr> 
            `;
        });
    }
    $('#show-project').html(html);
}





$(document).ready(function() {
    load_project();

    $('#form-create-project').on('submit', function(e) {
        e.preventDefault();
        var data = {
            start_day: moment($('#start_day').val()).format("YYYY-MM-DD") ,
            finish_day:  moment($('#finish_day').val()).format("YYYY-MM-DD"),
            name_project: $('#name_project').val(),
            githubrepo: $('#githubrepo').val(),
            status_project: $('#status_project').val()
        }
        $.ajax({
            url: `/api/project`,
            method: 'post',
            data: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json',
                'x-auth-token': PARSEDATA.token
            },
            success: function(data){
                if(data.status === 1){
                    location.hash = '#/project';
                    return notifications(data.msg)
                }
            },
            error: function(err){
                if(err.responseJSON.errors){
                    err.responseJSON.errors.forEach(item => {
                        return notifications(item.msg)
                    })
                }
                console.log(err.responseJSON.errors);
            }
        })
    });

});