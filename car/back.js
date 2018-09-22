(function($scope, $timeout) {

  var $timeout = setTimeout;
  var $scope = {};
  $scope.weight = 1500;
  $scope.drag = 0.3;
  $scope.A = 2.0;

  $scope.tw = 205;
  $scope.tr = 55;
  $scope.rh = 16;

  $scope.shiftDelay = 600;
  $scope.rag = 3.46;
  $scope.gears = new Array("4.5", "2.5", "1.7", "1.2", "1", "0.85", "0.7");
  $scope.gearCount = 6;
  $scope.switchPoint = 100;
  $scope.maxRPM = 6400;
  $scope.torque = 200;

  $scope.torqueCharacteristics = 0;

  $scope.updateGears = function() {
    if ($scope.gearCount > $scope.gears.length) {
      while ($scope.gears.length < $scope.gearCount) {
        $scope.gears.push("");
      }
    }
    if ($scope.gearCount < $scope.gears.length) {
      while ($scope.gears.length > $scope.gearCount) {
        $scope.gears.pop();
      }
    }
  };

  $scope.currentGear = 1;
  $scope.currentSpeed = 0;
  $scope.currentRPM = 0;
  $scope.currentAcc = 0;

  $scope.buttonEnabled = true;
  $scope.shiftButtonEnabled = false;
  $scope.shiftButtonText = "Shift";
  $scope.speedLabel50 = undefined;
  $scope.speedLabel100 = undefined;
  $scope.speedLabel200 = undefined;

  var shifting,
    stepSize,
    dRad,
    uRad,
    airPressure,
    efficiency,
    Fwz,
    speed,
    remainingShiftTime,
    iteration,
    idx,
    switchP;
  $scope.run = function() {
    $scope.buttonEnabled = false;
    $scope.data = [
      [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    ];
    $scope.currentGear = 1;
    $scope.currentSpeed = 0;
    $scope.currentRPM = 0;
    stepSize = 0.1;
    switchP = $scope.switchPoint / 100;
    sanityCheck();
    dRad = $scope.rh * 25.4 + 2 * (($scope.tw * $scope.tr) / 100);
    dRad = dRad / 1000;
    uRad = 3.14159265 * dRad;
    airPressure = 1.2041;
    efficiency = 1.0;
    Fwz = $scope.drag * $scope.A * 0.5 * airPressure;
    speed = 0;
    shifting = false;
    $scope.shiftButtonEnabled = false;
    $scope.shiftButtonText = "Shift";
    $scope.speedLabel50 = undefined;
    $scope.speedLabel100 = undefined;
    $scope.speedLabel200 = undefined;
    remainingShiftTime = $scope.shiftDelay;
    iteration = 1;
    idx = 1;
    perform(stepSize);
  };

  $scope.forceShift = function() {
    if ($scope.currentGear < $scope.gears.length) {
      $scope.currentGear++;
      shifting = true;
      $scope.shiftButtonEnabled = true;
      $scope.shiftButtonText = "- Shifting -";
      remainingShiftTime = $scope.shiftDelay;
    }
  };

  var perform = function(i) {
    var rotation;
    if (shifting) {
      remainingShiftTime = remainingShiftTime - stepSize * 1000;
      if (remainingShiftTime <= 0) {
        shifting = false;
        if ($scope.currentGear < $scope.gears.length) {
          $scope.shiftButtonEnabled = false;
          $scope.shiftButtonText = "Shift";
        } else {
          $scope.shiftButtonText = "Highest Gear";
        }
      }
    }
    if (!shifting) {
      if ($scope.currentGear <= $scope.gears.length) {
        var Fw = Fwz * speed * speed;
        var rpm = $scope.currentRPM;
        if ($scope.torqueCharacteristics != 3) {
          if (rpm < 400) {
            rpm = 400;
          }
        }
        if ($scope.torqueCharacteristics != 2) {
          if (rpm < 600) {
            rpm = 600;
          }
        }
        var Fm =
          ((getEfficiency((rpm * 100) / $scope.maxRPM) * $scope.torque) /
            (dRad / 2)) *
          $scope.rag *
          efficiency *
          $scope.gears[$scope.currentGear - 1];
        var Fa = Fm - Fw;
        var a = Fa / $scope.weight;
        $scope.currentAcc = parseFloat(a).toFixed(2);
        speed = a * stepSize + speed;
        rotation = speed / uRad;
        rotation =
          rotation * $scope.rag * $scope.gears[$scope.currentGear - 1] * 60;
        $scope.currentRPM = parseFloat(rotation).toFixed(2);
        $scope.currentSpeed = parseFloat(speed * 3.6).toFixed(2);
        if ($scope.speedLabel50 == undefined && $scope.currentSpeed >= 50) {
          $scope.speedLabel50 =
            "50 km/h reached: " + parseFloat(i).toFixed(1) + "s";
        }
        if ($scope.speedLabel100 == undefined && $scope.currentSpeed >= 100) {
          $scope.speedLabel100 =
            "100 km/h reached: " + parseFloat(i).toFixed(1) + "s";
        }
        if ($scope.speedLabel200 == undefined && $scope.currentSpeed >= 200) {
          $scope.speedLabel200 =
            "200 km/h reached: " + parseFloat(i).toFixed(1) + "s";
        }
        if (
          $scope.currentSpeed + 25 >
          $scope.coptions.scaleSteps * $scope.coptions.scaleStepWidth
        ) {
          $scope.coptions.scaleStepWidth += 5;
        }
        if (rotation > $scope.maxRPM * switchP) {
          if ($scope.currentGear < $scope.gears.length) {
            $scope.currentGear++;
            shifting = true;
            $scope.shiftButtonEnabled = true;
            $scope.shiftButtonText = "- Shifting -";
            remainingShiftTime = $scope.shiftDelay;
          }
        }
      }
    }

    if (iteration % 5 == 0) {
      $scope.data[0][idx] = $scope.currentSpeed;
      idx++;
    }
    iteration++;
    i += 0.1;

    if (
      !shifting &&
      $scope.currentGear == $scope.gears.length &&
      rotation > $scope.maxRPM
    ) {
      for (var j = idx; j < $scope.data[0].length; j++) {
        $scope.data[0][j] = $scope.data[0][idx - 1];
      }
      $scope.buttonEnabled = true;
    } else if (i <= 15) {
      $timeout(function() {
        perform(i);
      }, 100);
    } else {
      $scope.buttonEnabled = true;
    }
  };
  var replaceComma = function(s) {
    s = "" + s;
    s = s.replace(",", ".");
    return s;
  };
  var sanityCheck = function() {
    $scope.weight = replaceComma($scope.weight);
    $scope.drag = replaceComma($scope.drag);
    $scope.A = replaceComma($scope.A);
    $scope.tw = replaceComma($scope.tw);
    $scope.tr = replaceComma($scope.tr);
    $scope.rh = replaceComma($scope.rh);
    $scope.shiftDelay = replaceComma($scope.shiftDelay);
    $scope.rag = replaceComma($scope.rag);
    $scope.switchPoint = replaceComma($scope.switchPoint);
    $scope.maxRPM = replaceComma($scope.maxRPM);
    $scope.torque = replaceComma($scope.torque);
    for (var i = 0; i < $scope.gears.length; i++) {
      $scope.gears[i] = replaceComma($scope.gears[i]);
    }

    if (isNaN($scope.weight)) {
      $scope.weight = 1500;
    }

    if (isNaN($scope.drag)) {
      $scope.drag = 0.3;
    }

    if (isNaN($scope.switchPoint)) {
      $scope.switchPoint = 100;
    }

    if (isNaN($scope.A)) {
      $scope.A = 2.0;
    }

    if (isNaN($scope.tw)) {
      $scope.tw = 205;
    }
    if (isNaN($scope.tr)) {
      $scope.tr = 55;
    }
    if (isNaN($scope.rh)) {
      $scope.rh = 16;
    }
    if (isNaN($scope.shiftDelay)) {
      $scope.shiftDelay = 600;
    }
    if (isNaN($scope.maxRPM)) {
      $scope.maxRPM = 6500;
    }
    if (isNaN($scope.torque)) {
      $scope.torque = 250;
    }
    if (isNaN($scope.rag)) {
      $scope.rag = 3.077;
    }
    if (isNaN($scope.gears[0])) {
      $scope.gears[0] = 3.077;
    }
    for (var i = 1; i < $scope.gears.length; i++) {
      if (isNaN($scope.gears[i])) {
        $scope.gears[i] = $scope.gears[i - 1] * 0.7;
      }
    }
    $scope.weight = Math.min($scope.weight, 50000);
    $scope.weight = Math.max($scope.weight, 10);
    $scope.drag = Math.min($scope.drag, 2.5);
    $scope.drag = Math.max($scope.drag, 0);
    $scope.A = Math.min($scope.A, 1000);
    $scope.A = Math.max($scope.A, 0.01);
    $scope.tw = Math.min($scope.tw, 900);
    $scope.tw = Math.max($scope.tw, 10);
    $scope.tr = Math.min($scope.tr, 100);
    $scope.tr = Math.max($scope.tr, 20);
    $scope.rh = Math.min($scope.rh, 50);
    $scope.rh = Math.max($scope.rh, 1);
    $scope.shiftDelay = Math.min($scope.shiftDelay, 5000);
    $scope.shiftDelay = Math.max($scope.shiftDelay, 0);
    $scope.rag = Math.min($scope.rag, 30);
    $scope.rag = Math.max($scope.rag, 0);
    $scope.switchPoint = Math.min($scope.switchPoint, 100);
    $scope.switchPoint = Math.max($scope.switchPoint, 10);

    for (var i = 0; i < $scope.gears.length; i++) {
      $scope.gears[i] = Math.min($scope.gears[i], 30);
      $scope.gears[i] = Math.max($scope.gears[i], 0.00001);
    }

    if ($scope.torqueCharacteristics == 2) {
      $scope.torqueCharacteristics = Math.min(
        $scope.torqueCharacteristics,
        5000
      );
    }
    $scope.maxRPM = Math.min($scope.maxRPM, 26000);
    $scope.maxRPM = Math.max($scope.maxRPM, 600);
    $scope.torque = Math.min($scope.torque, 5000);
    $scope.torque = Math.max($scope.torque, 1);

    for (var i = 1; i < $scope.gears.length; i++) {
      if ($scope.gears[i - 1] <= $scope.gears[i]) {
        $scope.gears[i] = $scope.gears[i - 1] * 0.7;
      }
    }
  };

  $scope.labels = [
    "0",
    "0.5",
    "1",
    "1.5",
    "2",
    "2.5",
    "3",
    "3.5",
    "4",
    "4.5",
    "5",
    "5.5",
    "6",
    "6.5",
    "7",
    "7.5",
    "8",
    "8.5",
    "9",
    "9.5",
    "10",
    "10.5",
    "11",
    "11.5",
    "12",
    "12.5",
    "13",
    "13.5",
    "14",
    "14.5",
    "15"
  ];
  $scope.series = ["My Vehicle"];
  $scope.data = [
    [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]
  ];
  $scope.coptions = {
    scaleLabel: "<%= value    %>",
    scaleOverride: true,
    scaleSteps: 20,
    scaleStepWidth: 10,
    scaleStartValue: 0
  };
  var getEfficiency = function(x) {
    x = Math.min(100, x);
    x = Math.max(0, x);

    var y;
    if ($scope.torqueCharacteristics == 0) {
      y =
        -9.80963481 * Math.pow(10, -5) * Math.pow(x, 3) -
        1.191724942 * Math.pow(10, -2) * Math.pow(x, 2) +
        2.533877234 * x +
        8.447552448;
    }
    if ($scope.torqueCharacteristics == 1) {
      y =
        2.602952603 * Math.pow(10, -4) * Math.pow(x, 3) -
        6.824009324 * Math.pow(10, -2) * Math.pow(x, 2) +
        4.831196581 * x +
        3.517482517;
    }
    if ($scope.torqueCharacteristics == 2) {
      y =
        3.739316239 * Math.pow(10, -4) * Math.pow(x, 3) -
        8.802447552 * Math.pow(10, -2) * Math.pow(x, 2) +
        5.286907537 * x +
        6.909090909;
    }
    if ($scope.torqueCharacteristics == 3) {
      y =
        -1.311188811 * Math.pow(10, -6) * Math.pow(x, 4) +
        4.030691531 * Math.pow(10, -4) * Math.pow(x, 3) -
        4.258449883 * Math.pow(10, -2) * Math.pow(x, 2) +
        0.753982129 * x +
        98.88111888;
    }
    if ($scope.torqueCharacteristics == 4) {
      var idx = x / 10;
      idx = Math.ceil(idx);
      var portion = x - Math.floor(x);
      var diff = $scope.torqueData[0][idx] - $scope.torqueData[0][idx - 1];
      y = $scope.torqueData[0][idx - 1] + diff * portion;
    }
    if (y > 100) {
      y = 100;
    }
    if (y < 1) {
      y = 1;
    }
    return y / 100;
  };
  $scope.setTorque = function(i) {
    $scope.torqueCharacteristics = i;
    if (i == 0) {
      $scope.torqueData = [[0, 45, 56, 67, 78, 89, 100, 100, 85, 65, 45]];
    }
    if (i == 1) {
      $scope.torqueData = [[0, 45, 80, 100, 100, 100, 100, 100, 90, 80, 60]];
    }
    if (i == 2) {
      $scope.torqueData = [[0, 60, 80, 100, 100, 90, 85, 75, 65, 45, 25]];

      if ($scope.maxRPM > 5000) {
        $scope.maxRPM = 5000;
      }
    }
    if (i == 3) {
      $scope.torqueData = [[100, 100, 100, 100, 85, 70, 60, 50, 40, 30, 20]];
    }
    if (i == 4) {
      $("#customTorque").modal("show");
    }
  };

  $scope.setCustomTorque = function() {
    for (var i = 0; i < $scope.torqueData[0].length; i++) {
      $scope.torqueData[0][i] = Math.min(100, $scope.torqueData[0][i]);
      $scope.torqueData[0][i] = Math.max(0, $scope.torqueData[0][i]);
    }
    $("#customTorque").modal("hide");
  };

  $scope.torqueLabels = [
    "RPM 0%",
    "10%",
    "20%",
    "30%",
    "40%",
    "50%",
    "60%",
    "70%",
    "80%",
    "90%",
    "100%"
  ];
  $scope.torqueSeries = ["Torque Characteristics"];
  $scope.torqueData = [[0, 45, 56, 67, 78, 89, 100, 100, 85, 65, 45]];
})();
