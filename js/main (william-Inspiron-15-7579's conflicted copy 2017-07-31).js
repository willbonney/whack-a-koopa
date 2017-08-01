$.fn.extend({
  animateCss: function(animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);
    });
    return this;
  }
});


const Peach = function() {
  this.name = "peach";
  this.health = 1;
  this.points = 1;
  this.imageSrc = "images/peach.png";
  this.sound = "sounds/peach.wav";
}
const Koopa = function() {
  this.health = 1;
  this.points = 1;
  this.colors = ["red", "green", "white", "wings", "mecha", "blue"];
  this.color = _.sample(this.colors);
  this.imageSrc = "images/koopa-" + this.color + ".png";
  this.sound = "sounds/koopa.wav";
}

const Goomba = function() {
  this.health = 1;
  this.points = 1;
  this.imageSrc = "images/goomba.png";
  this.sound = "sounds/goomba.wav";;
}

const Bowser = function() {
  this.health = 5;
  this.points = 5;
  this.imageSrc = "images/bowser.png";
  this.sound = "sounds/bowser.wav";
}

const Bomb = function() {
  this.name = "bomb";
  this.health = 1;
  this.points = -10;
  this.imageSrc = "images/bomb.png"
  this.sound = "sounds/bomb.wav"
}
const Oneup = function() {
  this.name = "oneup";
  this.health = 5;
  this.points = 10;
  this.imageSrc = "images/oneup.png"
  this.sound = "sounds/oneup.wav"
}
const Piranha = function() {
  this.name = "piranha";
  this.health = 1;
  this.points = -5;
  this.imageSrc = "images/piranha.png"
  this.sound = "sounds/piranha.wav"
}

const Mushroom = function() {
  this.health = 3;
  this.imageSrc = "images/mushroom.png";
  this.sound = "sounds/mushroom.wav";
}

Bomb.prototype.gotClicked = function() {
  $("#game-container").css("opacity", 0.02);
  setTimeout(function() {
    $("#game-container").css("opacity", 1)
  }, 1000);
};

Oneup.prototype.gotClicked = function() {
  growGridSize(2);
};

Piranha.prototype.gotClicked = function() {
  shrinkGridSize(2);
};

Bowser.prototype.gotClicked = function() {
  console.log("Bowser clicked");
};

//mushroom
//flower
//yoshi
//star

koopa = new Koopa();
koopa2 = new Koopa();
koopa3 = new Koopa();
bowser = new Bowser();
peach = new Peach();
bomb = new Bomb();

const unitCollection = [koopa, koopa2, koopa3, bowser, peach, bomb];


let points = 0;
let gridSize = 8;
let flipSpeed = 1000;
let maxFlipped = 2;
let tileImgSrc = "images/mushroom.png";


$(document).ready(function() {
  //grab dom elements
  const gameContainer = $("#game-container");
  const tileInsert = "<div class='tile'></div>";
  const rowInsert = "<div class='row game-row'></div>"
  //populate game-rows
  function addRows(amount) {
    for (let i = 0; i < amount; i++) {
      $("#game-container").append(rowInsert);
    };
  }

  addRows(gridSize);

  let gameRow = $(".game-row")

  //populate tiles
  function addColumns(amount) {
    _.forEach(gameRow, function(el, index) {
      for (let i = 0; i < amount; i++) {
        $(el).append(tileInsert);
      }
    })
  };

  let tiles = $(".tile");

  addColumns(gridSize);

  //assign column and row numbers as classes to grid
  function assignClasses() {
    _.forEach(gameRow, function(el, index) {
      let rowToAdd = ("r" + (index + 1));
      $(el).addClass(rowToAdd);
      let populatedTile = $(el).find(".tile");
      _.forEach(populatedTile, function(el, index) {
        let columnToAdd = ("c" + (index + 1));
        $(el).addClass(columnToAdd);
      });
    });
  };

  assignClasses();


  //grow gridSize
  function growGridSize(increase) {
    $("#game-container").empty();
    gridSize += increase;
    console.log("new gridsize", gridSize);
    addRows(gridSize);
    gameRow = $(".game-row");
    addColumns(gridSize);
    tiles = $(".tile");
    assignClasses();
    $("#start-button").trigger("click");

  };

  //shrink gridSize
  function shrinkGridSize(decrease) {
    $("#game-container").empty();
    gridSize -= decrease;
    console.log("new gridsize", gridSize);
    addRows(gridSize);
    gameRow = $(".game-row")
    addColumns(gridSize);
    tiles = $(".tile");
    assignClasses();
    $("#start-button").trigger("click");
  };


  $("#grow-grid").on("click", function() {
    console.log("grow");
    growGridSize(2);
  });


  $("#shrink-grid").on("click", function() {
    console.log("grow");
    shrinkGridSize(2);
  });



  //counter




  //start game logic
  $("#start-button").on("click", function() {
    let tileCountdownArray = [];
    $(".tile").data("unit", {
      health: 0
    });

    function updateScore() {
      $("#points").text(points);

    }


    function flip () {
      //flip tile
      const rowRandom = _.random(1, gridSize);
      const colRandom = _.random(1, gridSize);
      const tileRandom = ".r" + rowRandom + " .c" + colRandom;
      const chosenTile = $(tileRandom);
      tileCountdownArray.push(chosenTile);
      if (chosenTile.hasClass("flipped")) {
        //getting slow at end
        // return;
        //do nothing

      } else {
        chosenTile.addClass("flipped");
        const chosenUnit = _.sample(unitCollection);
        const chosenImg = "url('" + chosenUnit.imageSrc + "')";
        chosenTile.css("background", chosenImg);
        $(chosenTile).data("unit", {
          name: chosenUnit.name,
          health: chosenUnit.health,
          click: chosenUnit.gotClicked,
          points: chosenUnit.points

        });

      };

    }

    let flipInterval = setInterval(flip, flipSpeed);

      function changeSpeed(change) {
        flipSpeed += change;
        clearInterval(flipInterval);
        flipInterval = setInterval(flip, flipSpeed);
        clearInterval(unflipInterval);
        unflipInterval = setInterval(unflip, flipSpeed);
        console.log("changed speed to ", flipSpeed);
      }

      $("#fast-button").on("click", function() {
        changeSpeed(-200);
      });

      $("#slow-button").on("click", function() {
        changeSpeed(500);
      });



    $(".tile").on("click", function() {
      if ($(this).hasClass("flipped")) {
        const unitPoints = $(this).data("unit").points;
        const unitName = $(this).data("unit").name;
        const unitClick = $(this).data("unit").click;
        const clickCol = $(this).attr('class').match(/\bc(\d+)\b/)[1];
        const clickRow = $(this).parent().attr('class').match(/\br(\d+)\b/)[1];;

        function clickSuccess(target) {
          points += unitPoints;
          //update score
          updateScore();
          $(target).removeClass("flipped");
          $(target).css("background", "black");
          _.remove(tileCountdownArray, $(target));
          $(target).data("unit").health = 0;
          return;
        }


        //if clikc powerup, set state


        $(this).data("unit").health -= 1;

        if (unitName === "peach") {
          alert("you lose");
          clearInterval(flipInterval);
          return;
        }

        // if($(this).data("unit").name = "bomb"){
        //   unitClick();
        // }
        let mushroom = false;
        $("#mushroom-button").on("click", function() {
          mushroom = true;
        });

        if (mushroom) {
          const upOne = _.toNumber(clickRow) - 1;
          const downOne = _.toNumber(clickRow) + 1;
          const leftOne = _.toNumber(clickCol) - 1;
          const rightOne = _.toNumber(clickCol) + 1;
          const upOneEl = $(".r" + upOne + " .c" + _.toNumber(clickCol));
          const downOneEl = $(".r" + downOne + " .c" + _.toNumber(clickCol));
          const leftOneEl = $(".r" + _.toNumber(clickRow) + " .c" + leftOne);
          const rightOneEl = $(".r" + _.toNumber(clickRow) + " .c" + rightOne);

          upOneEl.animateCss("bounce");
          downOneEl.animateCss("bounce");
          leftOneEl.animateCss("bounce");
          rightOneEl.animateCss("bounce");

          upOneEl.data("unit").health -= 1;
          downOneEl.data("unit").health -= 1;
          leftOneEl.data("unit").health -= 1;
          rightOneEl.data("unit").health -= 1;

          //if any die, clickSuccess

          if (upOneEl.data("unit").health === 0) {
            clickSuccess(upOneEl);
          }
          if (downOneEl.data("unit").health === 0) {
            clickSuccess(downOneEl);
          }
          if (leftOneEl.data("unit").health === 0) {
            clickSuccess(leftOneEl);
          }
          if (rightOneEl.data("unit").health === 0) {
            clickSuccess(rightOneEl);
          }

        } //end mushroom

        if ($(this).data("unit").health === 0) {
          clickSuccess(this);
        }
      }

    });

//need to reset this?
  function unflip() {
      if (tileCountdownArray.length > maxFlipped) {
        const oldestTile = _.head(tileCountdownArray);
        oldestTile.removeClass("flipped");
        oldestTile.css("background", "black");
        _.remove(tileCountdownArray, oldestTile);

        points -= oldestTile.data("unit").health;;
        updateScore();
      }
    }

    let unflipInterval = setInterval(unflip, flipSpeed);



    //yoshi setInterval not working
    $("#yoshi-button").on("click", function() {
      const numberFlipped = $(".flipped").length;
      for (let i = 0; i < numberFlipped; i++) {
        let flippedTiles = $(".flipped");
        console.log("flipped array", flippedTiles);
        let yoshiFlip = flippedTiles[0];
        // let yoshiFlip = _.sample(flippedTiles);
        console.log("sampled array", yoshiFlip);
        let yoshiPoints = $(yoshiFlip).data().unit.points;
        $(yoshiFlip).animateCss("shake");
        $(yoshiFlip).removeData();
        points += yoshiPoints;
        updateScore();
      };
      //remove yoshi button
    });



  });

});
