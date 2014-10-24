/**
 * Elevator Control Center
 *
 * @author niko
 * @date
 */

define(function (require, exports, module) {

    var Util = require('./util'),
        Elevator = require('./Elevator');

    //the elevator control center class
    //constructor
    function ElevatorControlCenter() {
        this.floors = 10;
        this.elevatorsNum = 3;

        this.elevators = [];

        this.elevatorWidth = 36;
        this.elevatorheight = 40;

        this.calllist = {
            up: [],
            down: []
        };

        this.id = Math.floor(Math.random() * 4000) + Math.floor(Math.random() * 5000) + new Date().getTime();

        this._initElevator();
    }

    //private method
    Util.method(ElevatorControlCenter, {
        _initElevator: function () {
            console.log(' * Init Elevator ! * ');

            for (var i = this.elevatorsNum; i--;) {
                this.elevators.push(new Elevator({
                    floors: this.floors,
                    width: this.elevatorWidth,
                    height: this.elevatorheight
                }));
            }

            this._bootstrap();
        },
        _bootstrap: function () {
            console.log(' * Elevator is running ! * ');

        },
        _addToCallList: function (index, type) {
            if (Util.arrayGetIndex(this.calllist[type], index) === undefined) {
                this.calllist[type].push(index);
            }
        },
        _removeFromCallList: function (index, type) {
            Util.arrayRemove(this.calllist[type], index);
        },
        _initEvent: function () {
            var that = this,
                buildingNode;

            //init elevator
            for (var i = 0; i < this.elevators.length; i++) {
                (function (i) {
                    buildingNode = that.buildingNode.eq(i);

                    //elevator event
                    that.elevators[i].render(buildingNode);
                    that.elevators[i].e.on('arrive', function (e, o) {
                        that.clearCall(o.nextFloor, o.moveDir);
                    });
                    that.elevators[i].e.on('moving', function (e, o) {
                        that.clearCall(o.prevFloor, o.moveDir);
                    });
                    that.elevators[i].e.on('stop', function (e, o) {
                        that.clearCall(o.currentFloor, 'up');
                        that.clearCall(o.currentFloor, 'down');

                        that._manageCall();
                    });

                    buildingNode.find('.floor .up').on('click', Util.proxy(that.callElevator, that));

                    buildingNode.find('.floor .down').on('click', Util.proxy(that.callElevator, that));

                })(i);
            }
        },
        _selectElevator: function (floor, type) {

            var elevator,
                theElevators = [];

            for (var i = 0; i < this.elevators.length; i++) {
                elevator = this.elevators[i];
                if (elevator.moveDir == type) {
                    if (type == 'up' && elevator.currentFloor < floor) {
                        theElevators.push(elevator);
                    } else if (type == 'down' && elevator.currentFloor > floor) {
                        theElevators.push(elevator);
                    }
                } else if (elevator.status == 'stop' &&
                    elevator.targetFloors.length < 1) {
                    theElevators.push(elevator);
                }
            }
            if (theElevators.length == 1) {
                return theElevators[0];
            }
            //which elevator that is closed to the floor
            if (theElevators.length > 1) {
                theElevators.sort(function (a, b) {
                    return Math.abs(a.currentFloor - floor) > Math.abs(b.currentFloor - floor)
                });
                return theElevators[0];
            }

            return undefined;
        },
        _manageCall: function () {
            var that = this;

            if (that.calllist.up.length < 1 &&
                that.calllist.down.length < 1) {
                return;
            }

            var elevator;

            //up list
            for (var i = 0; i < that.calllist.up.length; i++) {
                elevator = that._selectElevator(that.calllist.up[i], 'up');
                if (elevator) {
                    elevator._addToTargetList(that.calllist.up[i], false, function () {
                        //that._removeFromCallList(that.calllist.up[i], 'up');
                    });
                    if (elevator.targetFloors.length == 1 && elevator.status == 'stop') {
                        elevator.move();
                    }
                }
            }

            //down list
            for (var j = 0; j < that.calllist.down.length; j++) {
                elevator = that._selectElevator(that.calllist.down[j], 'down');
                if (elevator) {
                    elevator._addToTargetList(that.calllist.down[j], false, function () {
                        //that._removeFromCallList(that.calllist.down[j], 'down');
                    });
                    if (elevator.targetFloors.length == 1 && elevator.status == 'stop') {
                        elevator.move();
                    }
                }
            }

        }
    });

    //public method
    Util.method(ElevatorControlCenter, {
        clearCall: function (floorNum, moveDir) {
            var that = this;

            if (!moveDir) {
                that.clearCall(floorNum, 'down');
                that.clearCall(floorNum, 'up');
                return;
            }

            that._removeFromCallList(floorNum, moveDir);
            that.viewNode.find('.building').each(function (index, item) {
                $(item).find('.floor').
                    eq(that.floors - floorNum).
                    find('.' + moveDir).removeClass('active');
            });
        },
        callElevator: function (e) {
            var that = this;

            var target = $(e.target),
                floorIndex = target.attr('data-index') * 1,
                type = target.attr('data-type');

            that._addToCallList(floorIndex, type);

            that._manageCall();

            that.viewNode.find('.building').each(function (index, item) {
                $(item).find('.floor').
                    eq(that.floors - floorIndex).
                    find('.' + type).addClass('active');
            });
        },
        render: function (node) {
            var that = this;

            var html = '<div id="elevator-control-center-' + this.id + '" class="control-center">';

            for (var i = 0; i < this.elevators.length; i++) {
                html += '<div class="building">';
                for (var j = this.floors; j--;) {
                    html += '<div class="floor">';
                    html += '<p class="num">' + (j + 1) + '</p>'
                    html += '<div class="door"></div>';
                    html += '<div class="cover"></div>';
                    html += '<div class="control">';
                    html += '<i class="up" data-build="' + i + '" data-type="up" data-index="' + (j + 1) + '"></i>';
                    html += '<i class="down" data-build="' + i + '" data-type="down" data-index="' + (j + 1) + '"></i>';
                    html += '</div>';
                    html += '</div>';
                }
                html += '<div class="panel">';
                html += '<ul>';
                for (var k = 0; k < this.floors; k++) {
                    html += '<li>' + (k + 1) + '</li>';
                }
                html += '</ul>';
                html += '</div>';
                html += '</div>';
            }

            html += '</div>';

            node.append(html);

            this.viewNode = $('#elevator-control-center-' + this.id);
            this.buildingNode = this.viewNode.find('.building');

            this._initEvent();

        }
    });


    module.exports = ElevatorControlCenter;

});
