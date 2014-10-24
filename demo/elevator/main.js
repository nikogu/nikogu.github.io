/**
 * The elevate
 *
 * @author niko
 * @date
 */

seajs.use('./modules/elevatorControlCenter', function(ElevatorControlCenter) {
    var e = new ElevatorControlCenter();
    e.render($('.wrapper'));
    window.e = e;
});
