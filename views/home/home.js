$(document).ready(function(){
    $('.carousel').slick({
        arrows: false,
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
    });
});


//Mosaic
let lastId = 48;
let lastModify = -1;

setInterval(function setImage(){
    let number = Math.floor((Math.random() * 48) + 1);

    while (number == lastModify) {
        number = Math.floor((Math.random() * 48) + 1);
    }

    let el = document.querySelectorAll('.mosaic-item')[number];

    el.innerHTML += `<img class="mosaic-image -show" src="../../static/examples/${lastId % 8 + 1}.jpg">`;

    setTimeout(function(){
        el.querySelector('.mosaic-image').remove();
        el.querySelector('.mosaic-image').classList.remove('-show');
    }, 200);

    lastId++;
    lastModify = number;
}, 750);
