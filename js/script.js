var twitchUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas"];

var streams = twitchUsers.map(requestStreamInfo);
var channels = twitchUsers.map(requestChannelInfo);
function requestStreamInfo(channel) {
  return ajaxReq(`https://wind-bow.glitch.me/twitch-api/streams/${channel}`);
}
function requestChannelInfo(channel) {
  return ajaxReq(`https://wind-bow.glitch.me/twitch-api/channels/${channel}`);
}

Promise.all( channels )
.then( function(channelsArr){
  displayChannelInfo(channelsArr);
  return Promise.all( streams );
} )
.then( function(streamArr){
  isOnline(streamArr);
} )
.catch( function(err){
  console.log(err);
} );

const displayChannelInfo = function displayChannelInfo(arr = []) {
  var ulEl = document.querySelector('ul');

  return ulEl.innerHTML = arr.map(function(channel){
    return `
      <li>
        <a href="${channel.url}" target="_blank">
          <div class="channelInfo">
            <img src="${channel.logo}"></img>
            <div class="channelDescription">
              <h1>${channel.display_name}</h1>
              <p>${channel.followers}</p>
              <p>${channel.views}</p>
            </div>
          </div>
        </a>
      </li>
    `
  }).join('');
}

const isOnline = function isOnline(arr) {
  var divEl = Array.from( document.querySelectorAll('.channelDescription') );
  console.log(divEl);
  console.log(arr);

  for (let i = 0; i < divEl.length; i++) {
    if (arr[i].stream !== null) {
      var onlineText =  document.createTextNode(arr[i].stream.channel.status);
      divEl[i].appendChild(onlineText);
    } else {
      var offlineText =  document.createTextNode('offline');
      divEl[i].appendChild(offlineText)
    }
  }
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
