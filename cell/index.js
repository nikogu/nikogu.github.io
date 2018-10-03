$(function() {
  function random(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }

  function randomTranslate(a, b) {
    return (
      "translate(" + random(a[0], a[1]) + "px, " + random(b[0], b[1]) + "px)"
    );
  }

  function randomRotate(a, b) {
    return "rotate(0" + random(a, b) + "deg)";
  }

  var animationMaker = function() {
    var cellAnim = Amo.keyframes({
      0: {
        transform: randomTranslate([-15, 15], [-15, 15])
      },
      20: {
        transform: randomTranslate([-10, 10], [-10, 10])
      },
      40: {
        transform: randomTranslate([-5, 5], [-5, 5])
      },
      60: {
        transform: randomTranslate([-15, 15], [-15, -15])
      },
      70: {
        transform: randomTranslate([-10, 10], [-10, 10])
      },
      80: {
        transform: randomTranslate([-5, 5], [-5, 5])
      },
      100: {
        transform: randomTranslate([-15, 15], [-15, 15])
      }
    }).animate({
      mode: "forwards",
      duration: random(5000, 15000),
      easing: "linear",
      time: "infinite",
      direction: "alternate"
    });

    var cellBodyAnim = Amo.keyframes({
      0: {
        transform: randomRotate(-40, 40)
      },
      20: {
        transform: randomRotate(-10, 10)
      },
      40: {
        transform: randomRotate(-60, 60)
      },
      60: {
        transform: randomRotate(-80, 80)
      },
      80: {
        transform: randomRotate(-140, 140)
      },
      100: {
        transform: randomRotate(-100, 100)
      }
    }).animate({
      mode: "forwards",
      duration: random(2000, 4000),
      easing: "linear",
      time: "infinite",
      direction: "alternate"
    });

    var c1Anim = Amo.keyframes({
      0: {
        transform: randomRotate(-20, 20)
      },
      20: {
        transform: randomRotate(-20, 20)
      },
      40: {
        transform: randomRotate(-20, 20)
      },
      60: {
        transform: randomRotate(-20, 20)
      },
      80: {
        transform: randomRotate(-20, 20)
      },
      100: {
        transform: randomRotate(-20, 20)
      }
    }).animate({
      mode: "forwards",
      duration: random(2000, 3000),
      easing: "linear",
      time: "infinite",
      direction: "alternate"
    });

    var c2Anim = Amo.keyframes({
      0: {
        transform: randomRotate(-20, 20)
      },
      20: {
        transform: randomRotate(-20, 20)
      },
      40: {
        transform: randomRotate(-20, 20)
      },
      60: {
        transform: randomRotate(-20, 20)
      },
      80: {
        transform: randomRotate(-20, 20)
      },
      100: {
        transform: randomRotate(-20, 20)
      }
    }).animate({
      mode: "forwards",
      duration: random(2000, 3000),
      easing: "linear",
      time: "infinite",
      direction: "alternate"
    });

    return {
      cellAnim: cellAnim,
      cellBodyAnim: cellBodyAnim,
      c1Anim: c1Anim,
      c2Anim: c2Anim
    };
  };

  window.imgerror = function(self) {
    self.src =
      "https://gw.alipayobjects.com/zos/rmsportal/bhSthsKaAbkbWZDeFKmd.png";
  };

  var Cell = function(config, index) {
    // cell
    var id = "cell" + index;

    var node =
      '<div class="cell-wrapper">' +
      '<div id="' +
      id +
      '" class="cell">' +
      '<img class="cell-img" src="' +
      config.image +
      '" onerror="window.imgerror(this)"/>' +
      '<div class="bg1 cell-bg" style="background-color: ' +
      config.color +
      ';"></div>' +
      '<div class="bg2 cell-bg" style="background-color: ' +
      config.color +
      ';"></div>' +
      '<div class="name">' +
      config.name +
      '<img class="cell-icon" src="' +
      config.icon +
      '" onerror="window.imgerror(this)"/>' +
      "</div>" +
      '<div class="jpname">' +
      config.jpname +
      "</div>" +
      "</div>" +
      "</div>";

    var run = function() {
      // cell body
      var cellRoot = $("#" + id);
      var cellBody = cellRoot.find("img")[0];
      var c1 = cellRoot.find(".bg1")[0];
      var c2 = cellRoot.find(".bg2")[0];

      var anim = animationMaker();
      anim.cellAnim.run(cellRoot);
      anim.cellBodyAnim.run(cellBody);
      anim.c1Anim.run(c1);
      anim.c2Anim.run(c2);
    };

    return {
      node: node,
      run: run
    };
  };

  function makeCell(data) {
    var cells = [];
    var root = $("#root");
    var fragment = $("<div/>");
    for (var i = 0; i < data.length; i++) {
      var cell = new Cell(data[i], i);
      fragment.append(cell.node);
      cells.push(cell);
    }
    root.append(fragment);
    return cells;
  }

  var cellData = window.cellData || [];
  var loaded = false;
  var loading = $("#loading");

  function onLoaded() {
    if (loaded) return;
    $("#root").css("opacity", 1);
    $("#footer").css("opacity", 1);
    loading.hide();
    loaded = true;
    var cells = makeCell(cellData);
    for (var i = 0; i < cells.length; i++) {
      cells[i].run();
    }
  }

  // preload
  (function() {
    var node = $("#preload");
    var count = 0;
    var onloadFunc = function() {
      count++;
      if (count >= cellData.length * 2) {
        onLoaded();
      }
    };
    var fragment = $("<div />");
    for (var i = 0; i < cellData.length; i++) {
      var image1 = new Image();
      image1.src = cellData[i].image;
      image1.onload = onloadFunc;

      var image2 = new Image();
      image2.src = cellData[i].icon;
      image2.onload = onloadFunc;

      fragment.append(image1);
      fragment.append(image2);
    }
    node.append(fragment);

    // time out
    setTimeout(() => {
      onLoaded();
    }, 6000);
  })();
});
