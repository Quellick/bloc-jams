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
       currentSongFromAlbum = currentAlbum.songs[songNumber -1];
     } else if (currentlyPlayingSongNumber === songNumber) {
       // Switch from Pause -> Play button to pause currently playing song.
       $(this).html(playButtonTemplate);
       currentlyPlayingSongNumber = null;
       currentSongFromAlbum = null;
     }
};

     var onHover = function(event){
       var $songnumberCell = $(this).find(".song-item-number")
       var songNumber = parseInt($songnumberCell.attr("data-song-number"));
       //check to see if song is playing
       if(songNumber !== currentlyPlayingSongNumber){
         $songnumberCell.html(playButtonTemplate);
       }

     };

     var offHover = function(event){
       var $songnumberCell = $(this).find(".song-item-number")
       var songNumber = parseInt($songnumberCell.attr("data-song-number"));
       if(songNumber !== currentlyPlayingSongNumber){
         $songnumberCell.html(songNumber);
       }
     };

     $row.find('song-item-number').click(clickHandler);
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

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
};

 // Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentAlbum = null;

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
});
