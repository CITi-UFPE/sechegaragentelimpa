const gel = el => document.querySelector(el);

// const gel = el => document.querySelector(el);

// window.fbAsyncInit = async () => {
//   FB.init({
//     appId: '1329423883914707',
//     autoLogAppEvents: true,
//     xfbml: true,
//     version: 'v1.0'
//   });
//   gel('.fb-login-button').addEventListener('click', () => {
//     FB.login((res) => {
//       if (!res || !res.authResponse) return;
//       const id = res.authResponse.userID;
//       const userImgSrc = `https://graph.facebook.com/${id}/picture?type=normal`;
//       FB.api(id, async (res) => {
//         const userName = res.name;
//         const response = await axios.post('/user', {
//           id: id,
//           img: userImgSrc,
//           name: userName,
//         });
//       });
//     });
//   });
// };




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

  Object.values(positions.data).map((position) => {
    const marker = L.marker([position.lat, position.long], { icon: myIcon, draggable: true }).addTo(mymap);
    marker.addEventListener('click', (e) => {
      const remove = true;

      const res = axios.post('/', {
        remove,
        lat: marker._latlng.lat,
        long: marker._latlng.lng,
      });
      mymap.removeLayer(marker);
    });
  });
}

tiles()

window.saveMarker = async (lat, long) => {
  const val = document.querySelectorAll("input[type=checkbox]:checked")
  let list = []
  if(val.length > 0){
    for(var i of val){
      list.push(i.name)
    }
    await axios.post('/?problem=true', { 
      item: list,
      lat: lat,
      long: long,
    });
  } else {
    // TODO: mensagem de erro
  }
}

mymap.on('click', async (e) => {
  const lat = e.latlng.lat;
  const long = e.latlng.lng

  let marker = L.marker([lat, long], { icon: myIcon, draggable: true }).addTo(mymap);
  marker.bindPopup(`
  <div class="modal">
    <p class="modal-title">Do que você precisa?</p>
    <div class="modal-checkbox">
      <input type="checkbox" class="checkbox" name="pessoas">
      <label for="pessoas">Pessoas</label>
      <input type="checkbox" class="checkbox" name="epi">
      <label for="epi">Equipamento de proteção Individual</label>
      <input type="checkbox" class="checkbox" name="transporte">
      <label for="transporte">Transporte</label>
    </div>
    <button id="modal-send-button" onclick="window.saveMarker(${lat}, ${long})">Enviar</button>
  </div>
  `).openPopup();

  // Fecha Popup
  const submitButton = document.getElementById('modal-send-button')
  L.DomEvent.addListener(submitButton, 'click', function (e) {
    marker.closePopup();
  });
  
  marker.addEventListener('click', (e) => {
    const remove = true;

    const res = axios.post('/', {
      remove,
      lat: marker._latlng.lat,
      long: marker._latlng.lng,
    });
    mymap.removeLayer(marker);
  });

});

$(document).ready(function () {
  $('.carousel').slick({
    arrows: false,
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
  });

  //carrega imagens
  var ref = firebase.database().ref("users");
  ref.on("child_added", function(snapshot) {
    $("#add-mosaic-images").append("<div class=\"mosaic-item\"><img title=\""+snapshot.val().name+"\" class=\"mosaic-image\" src=\""+snapshot.val().profile_picture+"?type=normal\"></div>");
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // [START_EXCLUDE]
      document.getElementById('login-btn').hidden = true;
      document.getElementById('logout-btn').hidden = false;
      var ref = firebase.database().ref('users/' + user.uid);
      ref.set({
          name: user.displayName,
          email: user.email,
          profile_picture: user.photoURL
        });
        console.log(user);
      // [END_EXCLUDE]
    } else {
      // User is signed out.
      // [START_EXCLUDE]
      document.getElementById('login-btn').hidden = false;
      document.getElementById('logout-btn').hidden = true;
      // [END_EXCLUDE]
    }
  });
});

document.querySelector('#login-btn').addEventListener('click', function(e) {
  firebase.auth().signOut();
  e.preventDefault();
  e.stopPropagation();

  var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      let userRef = firebase.database.ref('users/' + user.uid);
      userRef.child(
        user.uid).set({
          name: user.displayName,
          email: user.email,
          profile_picture: user.photoURL
        });
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  // Step 2
  //  Get a credential with firebase.auth.emailAuthProvider.credential(emailInput.value, passwordInput.value)
  //  If there is no current user, log in with auth.signInWithCredential(credential)
  //  If there is a current user an it's anonymous, atttempt to link the new user with firebase.auth().currentUser.link(credential) 
  //  The user link will fail if the user has already been created, so catch the error and sign in.
});

document.querySelector('#logout-btn').addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  firebase.auth().signOut();
});


//Mosaic
/*
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
*/

  const morphingWaveTop = anime({
    targets: '#wave_top',
    d: [
      { value: 'M293.4,0s47.65,159.048,208.79,299.665,200.6,173.493,311.191,284.847,205.814,215.693,205.814,215.693L-1.52,799.617V0' },
      { value: 'M293.4,0s34.477,168.927,195.618,309.544,246.7,158.674,357.293,270.028,172.884,220.633,172.884,220.633L-1.52,799.617V0' },
    ],
    easing: 'easeInOutSine',
    duration: 3000,
    loop: true,
    direction: 'alternate',
    autoplay: true
  });

  const morphingColorTop = anime({
    targets: '#wave_top',
    fill: 'rgba(0,0,0,0.48)',
    delay: 7000,
    loop: true,
    direction: 'alternate',
    duration: 5000,
    autoplay: true
  })


  const morphingWaveBottom = anime({
    targets: '#wave_bottom',
    d: [
      { value: 'M293.4,0s24.927,186.874,186.068,327.491,236.491,130.848,347.085,242.2,192.642,230.512,192.642,230.512L-1.52,799.617V0' },
    ],
    easing: 'easeInOutSine',
    duration: 2000,
    loop: true,
    direction: 'alternate',
    autoplay: true
  });

  const morphingColorBottom = anime({
    targets: '#wave_bottom',
    fill: 'rgba(0,0,0,0.48)',
    delay: 7000,
    loop: true,
    direction: 'alternate',
    duration: 5000,
    autoplay: true
  })
