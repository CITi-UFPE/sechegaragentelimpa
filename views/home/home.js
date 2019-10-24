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

$(document).ready(function(){
    $('.mosaic-carousel').slick({
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 1,
        autoplay: true,
    });
});
