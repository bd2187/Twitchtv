var twitchUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas"];
var streams = twitchUsers.map(function cb(channel) {
  return ajaxReq(`https://wind-bow.glitch.me/twitch-api/streams/${channel}`);
});
var channels = twitchUsers.map(function cb2(channel) {
  return ajaxReq(`https://wind-bow.glitch.me/twitch-api/channels/${channel}`);
});

Promise.all( channels )
.then( function(val){
  console.log(val);
  displayChannelInfo(val);
  return Promise.all( streams );
} )
.then( function(val){
  isOnline(val);
} )


function displayChannelInfo(arr = []) {
  var ulEl = document.querySelector('ul');

  return ulEl.innerHTML = arr.map(function(channel){
    return `
      <li>
        <a href="${channel.url}" target="_blank">
          <div class="channelInfo">
            <img src="${channel.logo}"></img>
            <h1>${channel.display_name}</h1>
          </div>
        </a>
      </li>
    `
  }).join('');
}

function isOnline(arr) {
  var divEl = Array.from( document.querySelectorAll('.channelInfo') );
  console.log(divEl);
  console.log(arr);

}

function ajaxReq(url) {
  return new Promise( function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = handleData;
    xhr.send();

    function handleData() {
      if (xhr.status === 200 && xhr.readyState === 4) {
        var data = JSON.parse(xhr.responseText);
        return resolve (data);
      } else {
        return reject( xhr.statusText );
      }
    }
  } );
}
