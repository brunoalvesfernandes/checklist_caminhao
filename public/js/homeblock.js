$('#home').click((event) => {
    removeClass()
    $(event.currentTarget).addClass('active');

    if (window.innerWidth < 1151) {
        active = !active
        $('.menu_').fadeOut(200)
    }
    displayNoneAll()
    $('.homeblock').show()
})

$('#users').click((event) => {
    removeClass()
    $(event.currentTarget).addClass('active');

    if (window.innerWidth < 1151) {
        active = !active
        $('.menu_').fadeOut(200)
    }
    displayNoneAll()
    $('.usuarios').show()
})

$('#problem').click((event) => {
    removeClass()
    $(event.currentTarget).addClass('active');

    if (window.innerWidth < 1151) {
        active = !active
        $('.menu_').fadeOut(200)
    }
    displayNoneAll()
    $('.problems').show()
})