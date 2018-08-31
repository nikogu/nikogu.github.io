$(function() {
  // cell
  var cell = $("#cell")[0];

  var cellAnim = Amo.keyframes({
    0: {
      transform: "translate(15px, 15px)"
    },
    20: {
      transform: "translate(-3px, -2px)"
    },
    40: {
      transform: "translate(-13px, 15px)"
    },
    60: {
      transform: "translate(-4px, 2px)"
    },
    70: {
      transform: "translate(12px, 12px)"
    },
    80: {
      transform: "translate(-11px, -11px)"
    },
    100: {
      transform: "translate(17px, 13px)"
    }
  }).animate({
    mode: "forwards",
    duration: 10000,
    easing: "linear",
    time: "infinite",
    direction: "alternate"
  });

  cellAnim.run(cell);

  // cell body
  var cellBody = $("#cell-body")[0];

  var cellBodyAnim = Amo.keyframes({
    0: {
      transform: "rotate(0deg)"
    },
    20: {
      transform: "rotate(30deg)"
    },
    40: {
      transform: "rotate(10deg)"
    },
    60: {
      transform: "rotate(90deg)"
    },
    70: {
      transform: "rotate(80deg)"
    },
    80: {
      transform: "rotate(120deg)"
    },
    100: {
      transform: "rotate(100deg)"
    }
  }).animate({
    mode: "forwards",
    duration: 4000,
    easing: "linear",
    time: "infinite",
    direction: "alternate"
  });

  cellBodyAnim.run(cellBody);

  // c1
  var c1 = $("#circle1")[0];
  var c1Anim = Amo.keyframes({
    0: {
      transform: "rotate(-10deg)"
    },
    20: {
      transform: "rotate(20deg)"
    },
    60: {
      transform: "rotate(-5deg)"
    },
    80: {
      transform: "rotate(13deg)"
    },
    100: {
      transform: "rotate(-7deg)"
    }
  }).animate({
    mode: "forwards",
    duration: 2000,
    easing: "linear",
    time: "infinite",
    direction: "alternate"
  });

  c1Anim.run(c1);

  // c2
  var c2 = $("#circle2")[0];
  var c2Anim = Amo.keyframes({
    0: {
      transform: "rotate(-5deg)"
    },
    20: {
      transform: "rotate(13deg)"
    },
    60: {
      transform: "rotate(2deg)"
    },
    80: {
      transform: "rotate(11deg)"
    },
    100: {
      transform: "rotate(4deg)"
    }
  }).animate({
    mode: "forwards",
    duration: 3000,
    easing: "linear",
    time: "infinite",
    direction: "alternate"
  });

  c2Anim.run(c2);
});
