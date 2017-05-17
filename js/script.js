"use strict"

var mod = ( function(){
  var twitchUsers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "habathcx", "RobotCaleb", "noobs2ninjas"];

  var streams = twitchUsers.map(requestStreamInfo); // array of streaming info
  var channels = twitchUsers.map(requestChannelInfo); // array of channel info
  function requestStreamInfo(channel) {
    return ajaxReq(`https://wind-bow.glitch.me/twitch-api/streams/${channel}`);
  }
  function requestChannelInfo(channel) {
    return ajaxReq(`https://wind-bow.glitch.me/twitch-api/channels/${channel}`);
  }

  const displayChannelInfo = function displayChannelInfo(arr = []) {
    var ulEl = document.querySelector('ul');
    return ulEl.innerHTML = arr.map(renderLI).join('');
  }

  function renderLI(channel){
    return `
      <li class="channel">
        <a class="clearfix channelContainer" href="${channel.url}" target="_blank">
          <div class="channelInfo">
            <div class="channelLogo">
              <img src="${channel.logo}"></img>
            </div>
            <div class="channelDescription">
              <h1>${channel.display_name}</h1>
              <p>Followers: ${channel.followers}</p>
              <p>Views: ${channel.views}</p>
            </div>
          </div>
        </a>
      </li>
    `
  }

  const isOnline = function isOnline(arr) {
    var divEl = Array.from( document.querySelectorAll('.channelDescription') );

    for (let i = 0; i < divEl.length; i++) {
      var pEl = document.createElement('p');

      if (arr[i].stream !== null) {
        var onlineText =  document.createTextNode(arr[i].stream.channel.status);
        pEl.appendChild(onlineText);
        pEl.classList.add('online');
        divEl[i].appendChild(pEl);

      } else {

        var offlineText =  document.createTextNode('offline');
        pEl.appendChild(offlineText);
        pEl.classList.add('offline');
        divEl[i].appendChild(pEl);
      }
    }
  }

  function filterUsers() {
    var buttonsDiv = document.querySelector('.buttons');
    buttonsDiv.addEventListener('click', cb);

    function cb(evt) {
      var onlineUsers = Array.from( document.querySelectorAll('.online') );
      var offlineUsers = Array.from( document.querySelectorAll('.offline') );
      var allUsers = Array.from( document.querySelectorAll('.channelInfo') );
      var idName = evt.target.id;

      if ( idName === 'all') {
        allUsers.forEach(displayAll);
      } else if ( idName === 'online' ) {
        offlineUsers.forEach(displayNone);
        onlineUsers.forEach(displayBlock);
      } else if (idName === 'offline') {
        offlineUsers.forEach(displayBlock);
        onlineUsers.forEach(displayNone);
      }
    }
  } // end filterUsers()
  const displayAll = (channel) => channel.style.display = 'block';
  const displayNone = (channel) => {
    var grandParentEl = channel.parentElement.parentElement;
    return grandParentEl.style.display = 'none';
  }
  const displayBlock = (channel) => {
    var grandParentEl = channel.parentElement.parentElement;
    return grandParentEl.style.display = 'block';
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

  return {
    filterUsers,
    startPromise() {
      return Promise.all( channels )
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
    }
  }
} )();

mod.startPromise();
mod.filterUsers();
