var twitchUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];


// var endpoint = 'https://wind-bow.glitch.me/twitch-api/channels/ESL_SC2';
// var endpoint = 'https://wind-bow.glitch.me/twitch-api/streams/ca2live';


var channelInfo = [];
var streamInfo = [];


twitchUsers.forEach(cb);

function cb(channel) {
  extractData('channels', channelInfo);
  extractData('streams', streamInfo);

  function extractData(type, arr) {
    var endpoint = `https://wind-bow.glitch.me/twitch-api/${type}/${channel}`;
    return ajaxReq(endpoint)
      .then(function (val){
        return arr.push(val);
      })
      .catch( function (err){
        console.log(err);
      } )
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
