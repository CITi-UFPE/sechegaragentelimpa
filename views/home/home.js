const gel = el => document.querySelector(el);

window.fbAsyncInit = () => {
    FB.init({
      appId            : '1329423883914707',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v4.0'
    });
    gel('.fb-login-button').addEventListener('click', () => {
        FB.login((res) => {
            if (!res || !res.authResponse) return;
            const id = res.authResponse.userID;
            gel('.user-container').innerHTML += `
                <img src="https://graph.facebook.com/${id}/picture?type=normal" />
            `;
            FB.api(id, (res) => {
                gel('.user-container').innerHTML += `
                    <h1>${res.name}</h1>
                `;
            })
        })
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

