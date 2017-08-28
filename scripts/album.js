 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     var $row = $(template);

     var clickHandler = function(){
       var songNumber = $(this).attr('data-song-number');

       if (currentlyPlayingSongNumber !== null) {
       // Revert to song number for currently playing song because user started playing new song.
       var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
       currentlyPlayingCell.html(currentlyPlayingSongNumber);
     }
       if (currentlyPlayingSongNumber !== songNumber) {
       // Switch from Play -> Pause button to indicate new song is playing.
       $(this).html(pauseButtonTemplate);
       currentlyPlayingSongNumber = songNumber;
       currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
       updatePlayerBarSong();
     } else if (currentlyPlayingSongNumber === songNumber) {
       // Switch from Pause -> Play button to pause currently playing song.
       $(this).html(playButtonTemplate);
       $('.main-controls .play-pause').html(playerBarPlayButton);
       currentlyPlayingSongNumber = null;
       currentSongFromAlbum = null;
     }
};

     var onHover = function(event){
       var $songNumberCell = $(this).find(".song-item-number")
       var songNumber = $songNumberCell.attr("data-song-number");
       //check to see if song is playing
       if(songNumber !== currentlyPlayingSongNumber){
         $songNumberCell.html(playButtonTemplate);
       }
     };

     var offHover = function(event){
       var $songNumberCell = $(this).find(".song-item-number")
       var songNumber = $songNumberCell.attr("data-song-number");
       if(songNumber !== currentlyPlayingSongNumber){
         $songNumberCell.html(songNumber);
       }
     };

     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

 var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');

     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);

     // #3
     $albumSongList.empty();

     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

 var trackIndex = function(album, song) {
      return album.songs.indexOf(song);
};

var nextSong = function(){
  //what is current song
  var currentSong = trackIndex(currentAlbum, currentSongFromAlbum);
  //if current song is last song in list wrap to first
  if (currentSong >= currentAlbum.songs.length){
     currentSong = 0;
  }
  //save last song number
   var lastSongNumber = currentlyPlayingSongNumber;
  //set new current song
    currentlyPlayingSongNumber = currentSong + 1;
    currentSongFromAlbum = currentAlbum.song[currentSong];
  //updatePlayerBarSong to current song
    updatePlayerBarSong();

    var $nextSongCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
  //update previous song .song-item-number to a number
  //update the new song .song-item-number to a pause button
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function(){
  //what is current song
  var currentSong = trackIndex(currentAlbum, currentSongFromAlbum);
  //if current song is first song wrap to the last song
  if (currentSong < 0) {
    currentSong = currentAlbum.songs.length - 1;
  }
  //save last song number
  var lastSongNumber = currentlyPlayingSongNumber;
  //set new current song
  currentlyPlayingSongNumber = currentSong - 1;
  currentSongFromAlbum = currentAlbum.song[currentSong];
  //updatePlayerBarSong to current song
  updatePlayerBarSong();
  //WHy is this different than the nextSong??
  $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

 // Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 var currentlyPlayingSongNumber = null;
 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');
 var currentSongFromAlbum = null;
 var currentAlbum = null;

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
});
