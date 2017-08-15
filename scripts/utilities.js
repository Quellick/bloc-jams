var forEach = function (array, callback) {
  for (var i = 0; i < array.length; i++){
<<<<<<< HEAD
    callback(array[i]);
  }
}

=======
    callback();
  }
  function callback(){
    animatePoints();
  }
}




>>>>>>> checkpoint-10-dom-scripting-collection-view
/*
var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
       var points = document.getElementsByClassName('point');

       var revealPoint = function(index) {
          points[index].style.opacity= 1;
          points[index].style.transform = "scaleX(1) translateY(0)";
          points[index].style.msTransform = "scaleX(1) translateY(0)";
          points[index].style.WebkitTransform = "scaleX(1) translateY(0)";
    }
    for  (var i = 0; i < points.length; i++){
         revealPoint(i);
    }
};
*/
