//#5
var animatePoints = function() {
   var revealPoint = function() {
     // #7
     $(this).css({
         opacity: 1,
         transform: 'scaleX(1) translateY(0)'
     });
     };
      $.each($('.point'), revealPoint);
  };
/*
    window.onload = function() {
    // Refactored using JQuery bellow
*/

   $(window).load(function(){
     // #1
     if ($(window).height() > 950) {
            animatePoints();
 }
/*
   var sellingPoints = document.getElementsByClassName('selling-points')[0];
   var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
   // Refactored using JQuery bellow.
*/
   // #2
   var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;
/*
   window.addEventListener('scroll', function(event) {
     if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
             animatePoints(pointsArray);
         }
    });
  // Refactored using JQuery bellow.
*/
    // #3
    $(window).scroll(function(event) {
      // #4
       if ($(window).scrollTop() >= scrollDistance) {
             animatePoints();
      }
   });
});
