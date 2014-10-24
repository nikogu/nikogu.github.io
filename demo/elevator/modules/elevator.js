/**
 * The Elevator
 *
 * @author niko
 * @date 2014-10-21
 */

define(function (require, exports, module) {

    var Util = require('./util');

    //the elevator class
    function Elevator(o) {

        //copy the property
        for (var prop in o || {}) {
            if (o.hasOwnProperty(prop)) {
                this[prop] = o[prop];
            }
        }

        //jquery event extend
        this.e = $({});

        //random id
        this.id = Math.floor(Math.random() * 4000) + Math.floor(Math.random() * 5000) + new Date().getTime();

        this.currentFloor = 1;
        this.targetFloors = [];
        this.checkCallList = [];

        this.moveDir = '';
        this.distance = 0;
        this.speed = 2;
        this.status = 'stop';

        this.callbacks = [];
        this.calllist = {
            up: [],
            down: []
        };

        this.moveTimmer = 0;

        this.nextFloor;
        this.prevFloor;

        this.height = this.height || 40;
        this.width = this.width || 36;
        this.doorWidth = this.width / 2;
        this.floorHeight = this.floorHeight || this.height + 10;

        this.e.on('moving', Util.proxy(function(e, o) {
//            this.movingCallback ? this.movingCallback.call(this) : 1;
        }, this));
        this.e.on('arrive', Util.proxy(function(e, o) {
//            this.arriveCallback ? this.arriveCallback.call(this) : 1;
        }, this));

    }

    //private method
    Util.method(Elevator, {
        //********************************
        //trigger the call list when
        //1. at the top, call down list
        //2. at the bottom, call up list
        //********************************
        _setTargetFloor: function () {

            if (this.targetFloors.length < 1) {
                return;
            }

            if (this.targetFloors.length == 1) {
                this.nextFloor = this.targetFloors[0];
                if (this.nextFloor > this.currentFloor) {
                    if (this.moveDir == 'down') {
                        this._triggerCallList('up');
                    }
                    this.moveDir = 'up';
                } else if (this.nextFloor < this.currentFloor) {
                    if (this.moveDir == 'up') {
                        this._triggerCallList('down');
                    }
                    this.moveDir = 'down';
                } else {
                    this.moveDir = '';
                }
                return;
            }

            if (this.moveDir == 'up') {
                this.nextFloor = Util.arrayGetNext(this.targetFloors, this.currentFloor);

                //next is none
                //need check reversal
                if (this.nextFloor == undefined) {
                    this._triggerCallList('down');
                    this.moveDir = 'down';
                    this._setTargetFloor();
                }
            } else if (this.moveDir == 'down') {
                this.nextFloor = Util.arrayGetPrev(this.targetFloors, this.currentFloor);

                //prev is none
                //need check reversal
                if (this.nextFloor == undefined) {
                    this._triggerCallList('up');
                    this.moveDir = 'up';
                    this._setTargetFloor();
                }
            } else {

                this.nextFloor = this.targetFloors[0];
                if (this.nextFloor > this.currentFloor) {
                    this.moveDir = 'up';
                } else if (this.nextFloor < this.currentFloor) {
                    this.moveDir = 'down';
                } else {
                    this.moveDir = '';
                }
            }

        },
        _goon: function () {
            this.openDoor(function () {
                this.closeDoor(function () {
                    this._setTargetFloor();
                    this.move();
                });
            });
        },
        _addToTargetList: function (floorNum, callback, callbackPrev) {

            if (!Util.isNumber(floorNum)) {
                return;
            }

            //if there is lager than total floors then return
            if (floorNum > this.floors) {
                floorNum = this.floors;
            }
            //check is there already in targetFloors
            if (Util.arrayGetIndex(this.targetFloors, floorNum) == undefined) {
                this.targetFloors.push(floorNum);
            }
            //sort
            this.targetFloors.sort(function (a, b) {
                return a > b;
            });

            //high light the panel
            this.panelViewNode.find('li').eq(floorNum - 1).addClass('active');

            callbackPrev ? callbackPrev.call(this) : 1;

            this._setTargetFloor();

            callback ? callback.call(this) : 1;

            return this;
        },
        //same as tap down the button of elevator
        _trigger: function (floorNum) {

            this._addToTargetList(floorNum, function () {
                this.move();
            });

        },
        _cancelTrigger: function (floorNum) {
            Util.arrayRemove(this.targetFloors, floorNum);

            this.panelViewNode.find('li').eq(floorNum - 1).removeClass('active');
        },
        _triggerCallList: function (type) {

            //**********************************
            // when reversal the direction
            // we need clear the flag of current floor
            // to avoid call current floor again
            //**********************************
            //this.cancelCall(this.currentFloor, type);

            try {
                for (var i = this.calllist[type].length; i--;) {
                    this._addToTargetList(this.calllist[type][i], false, function () {
                        //this.cancelCall(this.calllist[type][i], type);
                    });
                }
            } catch (e) {

            }
        }
    });

    //public method
    Util.method(Elevator, {
        move: function () {
            this.e.trigger('moving', {
                nextFloor: this.nextFloor,
                prevFloor: this.prevFloor,
                currentFloor: this.currentFloor,
                moveDir: this.moveDir
            });

            if (!this.nextFloor || this.status != 'stop') {
                return;
            }
            //update the elevator status
            this.status = 'run';

            var targetDis;

            this.moveTimmer = setInterval(Util.proxy(function () {

                targetDis = (this.nextFloor - 1) * this.floorHeight;

                //check the distance to stop elevator
                if (Math.abs(targetDis - this.distance) < this.speed) {

                    this.prevFloor = this.nextFloor;

                    this.e.trigger('arrive', {
                        nextFloor: this.nextFloor,
                        prevFloor: this.prevFloor,
                        currentFloor: this.currentFloor,
                        moveDir: this.moveDir
                    });

                    this.status = 'stop';

                    this.distance = targetDis;

                    clearInterval(this.moveTimmer);

                    this._cancelTrigger(this.nextFloor);

                    //clear the call class
                    this.e.trigger('cancel-call', {
                        floorNum: this.nextFloor,
                        type: this.moveDir
                    });

                    //set the next step
                    if (this.targetFloors.length > 0) {
                        this._goon();

                    } else {
                        if (this.moveDir == 'up') {
                            this._triggerCallList('down');
                        } else if (this.moveDir == 'down') {
                            this._triggerCallList('up');
                        } else {
                        }

                        if (this.targetFloors.length > 0) {
                            this._goon();

                        } else {
                            //if there is no floor to goon
                            //need open the door...
                            //clear the call class
                            this.e.trigger('cancel-call', {
                                floorNum: this.prevFloor,
                                type: 'up'
                            });
                            this.e.trigger('cancel-call', {
                                floorNum: this.prevFloor,
                                type: 'down'
                            });

                            this.openDoor(function () {
                                this.closeDoor(function() {
                                    this.e.trigger('stop', {
                                        nextFloor: this.nextFloor,
                                        prevFloor: this.prevFloor,
                                        currentFloor: this.currentFloor,
                                        moveDir: this.moveDir
                                    });
                                    this.moveDir = '';
                                });
                            });
                        }
                    }

                    //clear the call class
                    this.e.trigger('cancel-call', {
                        floorNum: this.prevFloor,
                        type: this.moveDir
                    });

                    //update view
                    this.render();

                    return;
                }

                //move it
                if (targetDis > this.distance) {
                    this.distance += this.speed;
                } else {
                    this.distance -= this.speed;
                }

                //update currentFloor
                this.currentFloor = Math.floor(this.distance / this.floorHeight) + 1;

                //update view
                this.render();

            }, this), 50);

        },

        go: function (floorNum) {
            if ( this.currentFloor == floorNum ) {
                return;
            }
            if (this.status == 'stop') {
                this.openDoor(function () {
                    this.closeDoor(function () {
                        this._trigger(floorNum);
                    });
                });
            } else {
                this._addToTargetList(floorNum);
            }
        },
        openDoor: function (callback) {
            this.status = 'open-door';
            this.ldoorNode.animate({
                left: -this.doorWidth
            }, 500, Util.proxy(function () {
                callback ? callback.call(this) : 1;
            }, this));
            this.rdoorNode.animate({
                right: -this.doorWidth
            }, 500);
        },
        closeDoor: function (callback) {
            this.status = 'close-door';
            this.ldoorNode.animate({
                left: -1
            }, 500, Util.proxy(function () {
                this.status = 'stop';
                callback ? callback.call(this) : 1;
            }, this));
            this.rdoorNode.animate({
                right: 0
            }, 500);
        },
        call: function (floorNum, type) {
            //debug
            return;
            if (floorNum > this.currentFloor && type == 'up' && this.moveDir == 'up' ||
                floorNum < this.currentFloor && type == 'down' && this.moveDir == 'down' ||
                this.moveDir == '' && this.status == 'stop' ||
                this.targetFloors.length < 1) {
                this._addToTargetList(floorNum, false, function () {
                    this.cancelCall(floorNum, type);
                });
                //first call & no target
                if (this.moveDir == '' && this.status == 'stop' ||
                    this.targetFloors.length == 1) {
                    this.move();
                }
            } else {
                if (Util.arrayGetIndex(this.calllist[type], floorNum) == undefined) {
                    this.calllist[type].push(floorNum);
                }
            }
        },
        cancelCall: function (floorNum, type) {
            Util.arrayRemove(this.calllist[type], floorNum);
        },
        render: function (node) {
            if (node) {

                //panel view
                this.panelView = '<div id="elevator-panel-' + this.id + '" class="elevator-panel">';
                this.panelView += '<p>Control Panel</p>';
                this.panelView += '<ul>';
                for (var i = 0; i < this.floors; i++) {
                    this.panelView += '<li>' + (i + 1) + '</li>';
                }
                this.panelView += '</ul>';
                this.panelView += '</div>';

                //elevator view
                this.view = [
                        '<div id="light-' + this.id + '" class="light"></div>',
                        '<div id="elevator-' + this.id + '" class="elevator">',
                    '<i class="l"></i>',
                    '<i class="r"></i>',
                    '</div>'
                ].join('');

                node.append(this.view);
                node.append(this.panelView);

                this.viewNode = $('#elevator-' + this.id);
                this.panelViewNode = $('#elevator-panel-' + this.id);
                this.lightNode = $('#light-' + this.id);
                this.ldoorNode = this.viewNode.find('i.l');
                this.rdoorNode = this.viewNode.find('i.r');

                this.panelViewNode.on('click', Util.proxy(function (e) {
                    this.go($(e.target).html() * 1 || undefined);
                }, this));

                this.panelViewNode.on('dblclick', Util.proxy(function (e) {
                    var floor = $(e.target).html() * 1;
                    if (Util.arrayGetIndex(this.targetFloors, floor) !== undefined && !Util.arrayOnlyLast(this.targetFloors, floor, this.currentFloor, this.moveDir) && !Util.arrayOnlyFirst(this.targetFloors, floor, this.currentFloor, this.moveDir)) {
                        this._cancelTrigger(floor);
                        this._setTargetFloor();
                    }
                }, this));

            } else {

                //update
                this.viewNode.css('bottom', this.distance);
                this.lightNode.html(this.moveDir.toLocaleUpperCase());

            }
        }
    });

    module.exports = Elevator;

});
