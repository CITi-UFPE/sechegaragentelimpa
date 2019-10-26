const gel = el => document.querySelector(el);

window.fbAsyncInit = () => {
	FB.init({
		appId: '1329423883914707',
		autoLogAppEvents: true,
		xfbml: true,
		version: 'v1.0'
	});
	gel('.fb-login-button').addEventListener('click', () => {
		FB.login((res) => {
			if (!res || !res.authResponse) return;
			const id = res.authResponse.userID;
			const userImgSrc = `https://graph.facebook.com/${id}/picture?type=normal`;
			FB.api(id, (res) => {
				const userName = res.name;
			});
		});
	});
};

// Slick
let mymap = L.map('mapid').setView([-8.704159, -35.079526], 13);

let myIcon = L.icon({
    iconUrl: '../../static/image/mancha.png',
    iconSize: [25, 20],
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1IjoiZXVsYWxpYWFpcmVzIiwiYSI6ImNrMjR3dzFnZjAwaWwzb24zeW5oM251M2YifQ.ep0gsH5sTXA24OnvexZoKg'
}).addTo(mymap);

const tiles = async () => {
    const positions = await axios.get('/positions')

    Object.values(positions.data).map( (position) => {    
        L.marker([position.lat, position.long], {icon: myIcon, draggable: true}).addTo(mymap);
    });
}

tiles()

mymap.on('click', async (e) => {
    const lat = e.latlng.lat;
    const long = e.latlng.lng
    
    const res = await axios.post('/', {
        lat,
        long,
    });
    
    let marker = L.marker([lat, long], {icon: myIcon, draggable: true}).addTo(mymap);
    marker.bindPopup("<b>Atenção!</b><br>Derramamento de óleo.").openPopup();
	marker.addEventListener('click',(e) => {
		mymap.removeLayer(marker);
    });
	
});

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
    
