var setSong = function(songNumber){
  if (currentSoundFile) {
        currentSoundFile.stop();
    }
   currentlyPlayingSongNumber = parseInt(songNumber);
   currentSongFromAlbum = currentAlbum.songs[songNumber -1];
   //#1
   currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
     //#2
     formats: ['mp3'],
     preload: true
   });
     setVolume(currentVolume);
  };

  var setCurrentTimeInPlayerBar = function(currentTime){
    //set text of element with .current-time class to current time in the song
    document.querySelector('.current-time').text(currentTime)
    //add method so current time updates with the song playback
    updateSeekBarWhileSongPlays()
  }

  var setTotalTimeInPlayerBar = function(totalTime){
    //set text of element with .total-time class to the length of the song
    document.querySelector('.total-time').text(totalTime.length)
    //add method so the total time is set when a song first plays.
    updatePlayerBarSong();
  }

  var filterTimeCode = function(timeInSeconds){
    //Use parseFloat method to get the seconds in number form
    parseFloat(timeInSeconds);
    //store variable for the whole seconds and whole minutes
    var wholeSeconds = Math.floor()
    var wholeMinutes = Math.floor()
    //return the time formatted as X:XX
    return timeInSeconds
  }

  var seek = function(time) {
       if (currentSoundFile) {
           currentSoundFile.setTime(time);
       }
   }

  var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

var getSongNumberCell = function(number){
       return $('.song-item-number[data-song-number="' + number + '"]');
  };

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
       var songNumber = parseInt($(this).attr('data-song-number'));

       if (currentlyPlayingSongNumber !== null) {
       var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
       currentlyPlayingCell.html(currentlyPlayingSongNumber);
     }
       if (currentlyPlayingSongNumber !== songNumber) {
       $(this).html(pauseButtonTemplate);
       setSong(songNumber);
       currentSoundFile.play();
       updateSeekBarWhileSongPlays()
       updatePlayerBarSong();
       var $volumeFill = $('.volume .fill');
       var $volumeThumb = $('.volume .thumb');
       $volumeFill.width(currentVolume + '%');
       $volumeThumb.css({left: currentVolume + '%'});

     } else if (currentlyPlayingSongNumber === songNumber) {
             if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays()
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
             }
     }
    };

     var onHover = function(event){
       var $songNumberCell = $(this).find(".song-item-number")
       var songNumber = parseInt($songNumberCell.attr('data-song-number'));

       if(songNumber !== currentlyPlayingSongNumber){
         $songNumberCell.html(playButtonTemplate);
       }
     };

     var offHover = function(event){
       var $songNumberCell = $(this).find(".song-item-number")
       var songNumber = parseInt($songNumberCell.attr('data-song-number'));

       if(songNumber !== currentlyPlayingSongNumber){
         $songNumberCell.html(songNumber);
         console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
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

     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);

     $albumSongList.empty();

     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

 var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');

             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };

 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {
   // #6
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
        // #3
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        // #4
        var seekBarFillRatio = offsetX / barWidth;
        if($(this).parent().attr('class') == 'seek-control') {
          seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
          setVolume(seekBarFillRatio * 100);
        }
        // #5
        updateSeekPercentage($(this), seekBarFillRatio);
       });
       // #7
    $seekBars.find('.thumb').mousedown(function(event) {
       // #8
       var $seekBar = $(this).parent();
       // #9
       $(document).bind('mousemove.thumb', function(event){
           var offsetX = event.pageX - $seekBar.offset().left;
           var barWidth = $seekBar.width();
           var seekBarFillRatio = offsetX / barWidth;

           if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio);
            }

           updateSeekPercentage($seekBar, seekBarFillRatio);
       });
       // #10
       $(document).bind('mouseup.thumb', function() {
           $(document).unbind('mousemove.thumb');
           $(document).unbind('mouseup.thumb');
       });
   });
};

 var trackIndex = function(album, song) {
      return album.songs.indexOf(song);
};

var nextSong = function(){
  //what is current song
  var currentSong = trackIndex(currentAlbum, currentSongFromAlbum);
  //if current song is last song in list wrap to first
  currentSong++;
  if (currentSong >= currentAlbum.songs.length){
     currentSong = 0;
  }
  //save last song number
   var lastSongNumber = currentlyPlayingSongNumber;
  //set new current song
  setSong(currentSong + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays()
  //updatePlayerBarSong to current song
    updatePlayerBarSong();
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
  //update previous song .song-item-number to a number
  //update the new song .song-item-number to a pause button
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function(){
  //what is current song
  var currentSong = trackIndex(currentAlbum, currentSongFromAlbum);
  //if current song is first song wrap to the last song
  currentSong--;
  if (currentSong < 0) {
    currentSong = currentAlbum.songs.length - 1;
  }
  //save last song number
  var lastSongNumber = currentlyPlayingSongNumber;
  //set new current song
  setSong(currentSong + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays()
  //updatePlayerBarSong to current song
  updatePlayerBarSong();
  //WHy is this different than the nextSong??
  $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
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
 var currentSoundFile = null;
 var currentVolume = 80;
 var currentAlbum = null;

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
});
