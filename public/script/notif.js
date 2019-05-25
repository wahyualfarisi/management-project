function notifications(text){
    return new Noty({
        type: 'notification',
        layout: 'topRight',
        text: text,
        progressBar: true,
        timeout: 2500,
        animation: {
            open: 'animated bounceInRight', // Animate.css class names
            close: 'animated bounceOutRight' // Animate.css class names
        }
    }).show()
}

// function makeNotif(text){
//     setTimeout(() => {
//         new Noty({
//             type: 'notification',
//             layout: 'topRight',
//             text: text,
//             progressBar: true,
//         }).show()
//     }, 5000)

// }