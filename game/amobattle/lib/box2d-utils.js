/**
 * box2dweb utils
 * box2dweb 上层封装工具类
 *
 * @version 0.0.1
 * @author yujiang<zhihao.gzh@alibaba-inc.com>
 * @data 2014-03-13
 */

//+++++++++++++++++++++++++++++++++++
//定义box2变量
//+++++++++++++++++++++++++++++++++++
window.b2 = (function() {

	var b2 = {};

	var b2Vec2 = b2.b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2AABB = b2.b2AABB = Box2D.Collision.b2AABB;
	var b2BodyDef = b2.b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = b2.b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = b2.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = b2.b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = b2.b2World = Box2D.Dynamics.b2World;
	var b2MassData = b2.b2MassData = Box2D.Collision.Shapes.b2MassData;
	var b2PolygonShape = b2.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2CircleShape = b2.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	var b2DebugDraw = b2.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
	var b2MouseJointDef = b2.b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
	var b2DistanceJointDef = b2.b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
	var b2RevoluteJointDef = b2.b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
	var b2ContactListener = b2.b2ContactListener = Box2D.Dynamics.b2ContactListener;
	var b2BuoyancyController = b2.b2BuoyancyController = Box2D.Dynamics.Controllers.b2BuoyancyController;

	var SCALE = b2.SCALE = 30;
	var world = b2.world = new b2World(
		new b2Vec2(0, 10), // gravity
		true // allow sleep
	);

	b2.b2Utils = {};
	var b2Utils = b2.b2Utils;

	//+++++++++++++++++++++++++++++++++++
	// 获取鼠标
	//+++++++++++++++++++++++++++++++++++
	b2Utils.mouseOffset = {
		x: 0,
		y: 0
	}
	b2Utils.captureMouse = function(element) {
		var mouse = {
			x: 0,
			y: 0
		};
		element.addEventListener('mousemove', function(event) {
			event.preventDefault();
			var x, y;
			if (event.pageX || event.pageY) {
				x = event.pageX;
				y = event.pageY;
			} else {
				x = event.clientX + document.body.scrollLeft +
					document.documentElement.scrollLeft;
				y = event.clientY + document.body.scrollTop +
					document.documentElement.scrollTop;
			}
			x -= element.offsetLeft + b2Utils.mouseOffset.x;
			y -= element.offsetTop + b2Utils.mouseOffset.y;
			mouse.x = x;
			mouse.y = y;

		}, false);
		return mouse;
	}

	//+++++++++++++++++++++++++++++++++++
	// 获取touch
	//+++++++++++++++++++++++++++++++++++
	b2Utils.captureTouch = function(element) {
		var touch = {
			x: null,
			y: null,
			isPressed: false
		};

		element.addEventListener('touchstart', function(event) {
			touch.isPressed = true;
		}, false);

		element.addEventListener('touchend', function(event) {
			touch.isPressed = false;
			touch.x = null;
			touch.y = null;
		}, false);

		element.addEventListener('touchmove', function(event) {
			var x, y;
			var touchEvent = event.touches[0];

			if (touchEvent.pageX || touchEvent.pageY) {
				x = touchEvent.pageX;
				y = touchEvent.pageY;
			} else {
				x = touchEvent.clientX + document.body.scrollLeft +
					document.documentElement.scrollLeft;
				y = touchEvent.clientY + document.body.scrollTop +
					document.documentElement.scrollTop;
			}
			x -= element.offsetLeft;
			y -= element.offsetTop;

			touch.x = x;
			touch.y = y;
		}, false);
		return touch;
	}

	b2Utils.random = function(min, max) {
		return Math.floor(Math.random() * (max + 1 - min)) + min;
	}

	b2Utils.getDis = function(x1, y1, x2, y2) {
		return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	}

	//+++++++++++++++++++++++++++++++++++
	// 图形创建
	//+++++++++++++++++++++++++++++++++++
	b2Utils.createCircle = function(x, y, radius, _config) {
		var config = _config || {},
			type = config.type || 'd',
			density = (config.density === undefined) ? 1.0 : config.density,
			friction = (config.friction === undefined) ? 0.1 : config.friction,
			restitution = (config.restitution === undefined) ? 0.2 : config.restitution;
			isSensor = (config.isSensor === undefined) ? false : config.isSensor;

		//构建刚体
		var bodyDef = new b2BodyDef;
		if (type == 'd') {
			bodyDef.type = b2Body.b2_dynamicBody;
		} else {
			bodyDef.type = b2Body.b2_staticBody;
		}
		bodyDef.position.x = x / SCALE;
		bodyDef.position.y = y / SCALE;

		var body;

		//指定材质
		var fixDef = new b2FixtureDef;
		fixDef.isSensor = isSensor;
		fixDef.density = density;
		fixDef.friction = friction;
		fixDef.restitution = restitution;
		fixDef.shape = new b2CircleShape(radius / SCALE);

		body = world.CreateBody(bodyDef);
		body.CreateFixture(fixDef);

		return body;
	}

	//+++++++++++++++++++++++++++++++++++
	// 创建矩形
	//+++++++++++++++++++++++++++++++++++
	b2Utils.createRect = function(x, y, w, h, _config) {
		var config = _config || {};
		var angle = config.angle || 0,
			type = config.type || 'd',
			density = (config.density === undefined) ? 1.0 : config.density,
			friction = (config.friction === undefined) ? 0.1 : config.friction,
			restitution = (config.restitution === undefined) ? 0.2 : config.restitution;

		var bodyDef = new b2BodyDef;

		//指定物体类型
		if (type == 'd') {
			bodyDef.type = b2Body.b2_dynamicBody;
		} else {
			bodyDef.type = b2Body.b2_staticBody;
		}
		bodyDef.position.x = x / SCALE;
		bodyDef.position.y = y / SCALE;
		bodyDef.angle = angle;

		var body;

		//指定材质
		var fixDef = new b2FixtureDef;
		fixDef.density = density;
		fixDef.friction = friction;
		fixDef.restitution = restitution;
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(w / SCALE, h / SCALE);

		body = world.CreateBody(bodyDef);
		body.CreateFixture(fixDef);

		return body;
	}

	//+++++++++++++++++++++++++++++++++++
	// 创建多边形
	//+++++++++++++++++++++++++++++++++++
	b2Utils.createPolygon = function(x, y, v, _config) {
		var config = _config || {};
		var angle = config.angle || 0,
			type = config.type || 'd',
			density = (config.density === undefined) ? 1.0 : config.density,
			friction = (config.friction === undefined) ? 0.1 : config.friction,
			restitution = (config.restitution === undefined) ? 0.2 : config.restitution;

		if (v.length < 3) {
			throw new Error('length must lager than 2');
			return undefined;
		}

		var vertices = [];

		var bodyDef = new b2BodyDef;

		//指定物体类型
		if (type == 'd') {
			bodyDef.type = b2Body.b2_dynamicBody;
		} else {
			bodyDef.type = b2Body.b2_staticBody;
		}
		bodyDef.position.x = x / SCALE;
		bodyDef.position.y = y / SCALE;
		bodyDef.angle = angle;

		var body;

		//指定材质
		var fixDef = new b2FixtureDef;
		fixDef.density = density;
		fixDef.friction = friction;
		fixDef.restitution = restitution;
		fixDef.shape = new b2PolygonShape;

		v.forEach(function(vec) {
			vertices.push(new b2Vec2(vec[0] / SCALE, vec[1] / SCALE));
		});

		fixDef.shape.SetAsArray(vertices);

		body = world.CreateBody(bodyDef);
		body.CreateFixture(fixDef);

		return body;
	}

	//+++++++++++++++++++++++++++++++++++
	// 组合物体
	//+++++++++++++++++++++++++++++++++++
	b2Utils.createCombineGraphics = function(_config, shapes) {

		var config = _config || {},
			x = config.x || 0,
			y = config.y || 0,
			angle = config.angle || 0,
			type = config.type || 'd',
			density = (config.density === undefined) ? 1.0 : config.density,
			friction = (config.friction === undefined) ? 0.1 : config.friction,
			restitution = (config.restitution === undefined) ? 0.2 : config.restitution;

		var bodyDef = new b2BodyDef;

		//指定物体类型
		if (type == 'd') {
			bodyDef.type = b2Body.b2_dynamicBody;
		} else {
			bodyDef.type = b2Body.b2_staticBody;
		}
		bodyDef.position.x = x / SCALE;
		bodyDef.position.y = y / SCALE;
		bodyDef.angle = angle;

		var body;

		body = world.CreateBody(bodyDef);
		//组合多个图形
		shapes.forEach(function(shape) {
			var fixDef = new b2FixtureDef;
			fixDef.density = density;
			fixDef.friction = friction;
			fixDef.restitution = restitution;
			shape(body, fixDef);
		});

		return body;
	}

	//+++++++++++++++++++++++++++++++++++
	// 设置边界
	//+++++++++++++++++++++++++++++++++++
	b2Utils.createBound = function(_w, _h, _ply, _config) {
		var config = _config || {};
		var w = _w / SCALE,
			h = _h / SCALE,
			ply = (_ply / SCALE) || (5 / SCALE),
			density = (config.density === undefined) ? 1.0 : config.density,
			friction = (config.friction === undefined) ? 0.1 : config.friction,
			restitution = (config.restitution === undefined) ? 0.2 : config.restitution;

		var body = b2Utils.createCombineGraphics({
			x: 0,
			y: 0,
			type: 's'
		}, [

			function(body, fixDef) {
				fixDef.shape = new b2.b2PolygonShape;
				fixDef.shape.SetAsOrientedBox(w / 2, ply, new b2.b2Vec2(w / 2, 0), 0);
				fixDef.density = density;
				fixDef.friction = friction;
				fixDef.restitution = restitution;
				body.CreateFixture(fixDef);
			},
			function(body, fixDef) {
				fixDef.shape = new b2.b2PolygonShape;
				fixDef.shape.SetAsOrientedBox(ply, h / 2, new b2.b2Vec2(0, h / 2), 0);
				fixDef.density = density;
				fixDef.friction = friction;
				fixDef.restitution = restitution;
				body.CreateFixture(fixDef);
			},
			function(body, fixDef) {
				fixDef.shape = new b2.b2PolygonShape;
				fixDef.shape.SetAsOrientedBox(w / 2, ply, new b2.b2Vec2(w / 2, h), 0);
				fixDef.density = density;
				fixDef.friction = friction;
				fixDef.restitution = restitution;
				body.CreateFixture(fixDef);
			},
			function(body, fixDef) {
				fixDef.shape = new b2.b2PolygonShape;
				fixDef.shape.SetAsOrientedBox(ply, h / 2, new b2.b2Vec2(w, h / 2), 0);
				fixDef.density = density;
				fixDef.friction = friction;
				fixDef.restitution = restitution;
				body.CreateFixture(fixDef);
			}
		]);

		return body;
	}

	//+++++++++++++++++++++++++++++++++++
	// 设置拖动
	//+++++++++++++++++++++++++++++++++++
	b2Utils.setDrag = function(setting, element, _force) {

		b2Utils.mouse = b2Utils.captureMouse(element || document.body);

		var force = _force || 1000;
		b2Utils._moveBody = null;
		var mouseJointDef = new b2MouseJointDef();
		var mouseVec2;

		if (!b2Utils._mouseDownHandle) {
			b2Utils._mouseDownHandle = function(e) {
				mouseVec2 = new b2Vec2(b2Utils.mouse.x / SCALE, b2Utils.mouse.y / SCALE);
				world.QueryPoint(function(fixture) {

					b2Utils._moveBody = fixture.GetBody();

					if (b2Utils._moveBody._noDrag) {
						b2Utils._moveBody = null;
						return;
					}

					mouseJointDef.bodyA = world.GetGroundBody();
					mouseJointDef.bodyB = b2Utils._moveBody;
					mouseJointDef.target.Set(b2Utils.mouse.x / SCALE, b2Utils.mouse.y / SCALE);
					mouseJointDef.maxForce = force;
					b2Utils._moveBody._joint = world.CreateJoint(mouseJointDef);

				}, mouseVec2);
			}

			b2Utils._mouseUpHandle = function(e) {
				if (b2Utils._moveBody) {
					world.DestroyJoint(b2Utils._moveBody._joint);
					b2Utils._moveBody._joint = null;
					b2Utils._moveBody = null;
				}
			}
		}

		if (setting) {
			window.addEventListener('mousedown', b2Utils._mouseDownHandle, false);
			window.addEventListener('mouseup', b2Utils._mouseUpHandle, false);
		} else {
			window.removeEventListener('mousedown', b2Utils._mouseDownHandle, false);
			window.removeEventListener('mouseup', b2Utils._mouseUpHandle, false);
		}
	}
	b2Utils.watchDrag = function() {
		if (b2Utils._moveBody) {
			if (b2Utils._moveBody._joint != null) {
				b2Utils._moveBody._joint.SetTarget(new b2Vec2(b2Utils.mouse.x / SCALE, b2Utils.mouse.y / SCALE));
			}
		}
	}

	//+++++++++++++++++++++++++++++++++++
	// 圆形边界
	//+++++++++++++++++++++++++++++++++++
	b2Utils.createCircleBound = function(_config) {

		var config = _config || {};
		var _x = config.x || 100,
			_y = config.y || 100,
			radius = config.radius || 30,
			num = config.num || 20,
			type = config.type || 's',
			density = (config.density === undefined) ? 1.0 : config.density,
			friction = (config.friction === undefined) ? 0.1 : config.friction,
			restitution = (config.restitution === undefined) ? 0.2 : config.restitution;
		h = config.height || 5;

		var x = 0,
			y = 0,
			deg = 0,
			partDeg = Math.PI * 2 / num;

		var bodyDef = new b2BodyDef;
		bodyDef.position.x = _x / SCALE;
		bodyDef.position.y = _y / SCALE;
		bodyDef.angle = 0;

		if (type == 'd') {
			bodyDef.type = b2Body.b2_dynamicBody;
		} else {
			bodyDef.type = b2Body.b2_staticBody;
		}

		var body;

		var fixDef = new b2FixtureDef;
		fixDef.density = density;
		fixDef.friction = friction;
		fixDef.restitution = restitution;

		fixDef.shape = new b2PolygonShape;

		var w = Math.sqrt(radius * radius * 2 * (1 - Math.cos(partDeg))) / 2;
		body = world.CreateBody(bodyDef);

		for (var i = 0; i < 111; i++) {
			x = Math.cos(deg) * radius + _x,
			y = Math.sin(deg) * radius + _y;

			fixDef.shape.SetAsOrientedBox(w / SCALE, h / SCALE, new b2Vec2(x / SCALE, y / SCALE), deg);
			body.CreateFixture(fixDef);

			deg += partDeg;

		}

	}

	//+++++++++++++++++++++++++++++++++++
	// 距离关节
	//+++++++++++++++++++++++++++++++++++
	b2Utils.createDistanceJoint = function(body1, body2) {

		var distanceJoint = new b2DistanceJointDef();

		distanceJoint.Initialize(body1, body2,
			new b2Vec2(body1.GetPosition().x, body1.GetPosition().y),
			new b2Vec2(body2.GetPosition().x, body2.GetPosition().y));
		distanceJoint.collideConnected = false;

		return world.CreateJoint(distanceJoint);
	}

	//+++++++++++++++++++++++++++++++++++
	// 路径边界
	//+++++++++++++++++++++++++++++++++++
	b2Utils.createPathBound = function(path, _h, type, _config) {

		var config = _config || {},
			density = (config.density === undefined) ? 1.0 : config.density,
			friction = (config.friction === undefined) ? 0.1 : config.friction,
			restitution = (config.restitution === undefined) ? 0.2 : config.restitution;

		var first = {
			x: path[0].x,
			y: path[0].y
		}

		var bodyDef = new b2BodyDef;
		//b2_dynamicBody
		if (type == 'd') {
			bodyDef.type = b2Body.b2_dynamicBody;
		} else {
			bodyDef.type = b2Body.b2_staticBody;
		}
		bodyDef.position.x = first.x / SCALE;
		bodyDef.position.y = first.y / SCALE;
		bodyDef.angle = 0;

		var body = world.CreateBody(bodyDef);

		var fixDef = new b2FixtureDef;
		fixDef.density = density;
		fixDef.friction = friction;
		fixDef.restitution = restitution;

		var x = 0,
			y = 0,
			w = 0,
			h = _h || 5;
		deg = 0;

		var shape,
			midX = 0,
			midY = 0;

		for (var i = 1; i < path.length; i++) {
			x = path[i - 1].x;
			y = path[i - 1].y;
			w = b2Utils.getDis(x, y, path[i].x, path[i].y);
			midX = ((path[i].x - x) / 2 + x - first.x);
			midY = ((path[i].y - y) / 2 + y - first.y);
			deg = Math.atan2(path[i].y - y, path[i].x - x);

			fixDef.shape = new b2PolygonShape;
			fixDef.shape.SetAsOrientedBox(w / 2 / SCALE, h / SCALE, new b2Vec2(midX / SCALE, midY / SCALE), deg);
			body.CreateFixture(fixDef);

		}

		return body;

	}

	//+++++++++++++++++++++++++++++++++++
	// 距离旋转
	//+++++++++++++++++++++++++++++++++++
	b2Utils.createRevoluteJoint = function(body1, body2, vec, _config) {

		var config = _config || {};
		var collide = config.collide || false,
			speed = config.speed || Math.PI,
			torque = config.torque || 500;

		var revoluteJoint = new b2RevoluteJointDef();

		revoluteJoint.collideConnected = collide;
		revoluteJoint.enableMotor = true;
		//转速
		revoluteJoint.motorSpeed = speed;
		//扭力
		revoluteJoint.maxMotorTorque = torque;

		revoluteJoint.Initialize(body1, body2, vec);

		return world.CreateJoint(revoluteJoint);
	}

	//+++++++++++++++++++++++++++++++++++
	// 碰撞检测
	//+++++++++++++++++++++++++++++++++++
	b2Utils._contactItem = [];
	b2Utils.contactWith = function(body1, body2, callback) {
		if (Object.prototype.toString.call(body2) === '[object Array]') {
			body2.forEach(function(body) {
				body1._contactId = b2Utils._contactItem.length;
				body._contactId = b2Utils._contactItem.length;
				b2Utils._contactItem.push({
					body1: body1,
					body2: body,
					callback: callback
				});
			});
		} else {
			body1._contactId = b2Utils._contactItem.length;
			body2._contactId = b2Utils._contactItem.length;
			b2Utils._contactItem.push({
				body1: body1,
				body2: body2,
				callback: callback
			});
		}
	}
	b2Utils.startContactListener = function() {
		var contactListener = new b2.b2ContactListener;
		var body1,
			body2;
		contactListener.BeginContact = function(contact, manifold) {
			body1 = contact.GetFixtureA().GetBody();
			body2 = contact.GetFixtureB().GetBody();
			b2Utils._contactItem.forEach(function(obj) {
				if ((body1._contactId == obj.body1._contactId &&
						body2._contactId == obj.body2._contactId) ||
					(body2._contactId == obj.body1._contactId &&
						body1._contactId == obj.body2._contactId)) {
					obj.callback(obj.body1, obj.body2);
				}
			});

		};
		contactListener.preSolve = function(contact, manifold) {

		};
		contactListener.PostSolve = function(contact, manifold) {};
		contactListener.EndContact = function(contact, manifold) {

		};
		b2.world.SetContactListener(contactListener);
	}

	//持续碰撞的检测	
	b2Utils._contactItemSustain = [];
	b2Utils.contactWithSustain = function(body1, body2, callback) {
		body1._contactIdSustain = b2Utils._contactItem.length;
		body2._contactIdSustain = b2Utils._contactItem.length;
		b2Utils._contactItemSustain.push({
			body1: body1,
			body2: body2,
			callback: callback
		});
	}
	b2Utils.startContactListenerSustain = function() {
		var contactListener = new b2.b2ContactListener;
		var body1,
			body2;
		contactListener.BeginContact = function(contact, manifold) {};
		contactListener.preSolve = function(contact, manifold) {

		};
		contactListener.PostSolve = function(contact, manifold) {
			body1 = contact.GetFixtureA().GetBody();
			body2 = contact.GetFixtureB().GetBody();
			b2Utils._contactItemSustain.forEach(function(obj) {
				if ((body1._contactIdSustain == obj.body1._contactIdSustain &&
						body2._contactIdSustain == obj.body2._contactIdSustain) ||
					(body2._contactIdSustain == obj.body1._contactIdSustain &&
						body1._contactIdSustain == obj.body2._contactIdSustain)) {
					obj.callback(obj.body1, obj.body2);
				}
			});
		};
		contactListener.EndContact = function(contact, manifold) {

		};
		b2.world.SetContactListener(contactListener);
	}

	//+++++++++++++++++++++++++++++++++++
	// debug
	//+++++++++++++++++++++++++++++++++++
	b2Utils.debug = function(debugCanvas) {
		var debugDraw = new b2.b2DebugDraw();
		debugDraw.SetSprite(debugCanvas.getContext("2d"));
		debugDraw.SetDrawScale(SCALE);
		debugDraw.SetFillAlpha(0.2);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2.b2DebugDraw.e_shapeBit | b2.b2DebugDraw.e_jointBit);
		b2.world.SetDebugDraw(debugDraw);
	}

	//+++++++++++++++++++++++++++++++++++
	// 镜头跟随（debug）
	//+++++++++++++++++++++++++++++++++++
	b2Utils._camera = {};
	b2Utils._offset = {x:0,y:0};
	b2Utils.cameraFollowUpdate = function(body) {
		b2Utils._camera.body = body;
	}
	b2Utils.cameraFollow = function(body, _config) {

		var config = _config || {};

		b2Utils._camera.body = body;
		b2Utils._camera.debugCanvas = config.debugCanvas || document.getElementById("debug-canvas");
		b2Utils._camera.debugCtx = b2Utils._camera.debugCanvas.getContext('2d');

		b2Utils._camera.space = config.space || 100;
		b2Utils._camera.x = config.x || 0;
		b2Utils._camera.y = config.y || 0;
		b2Utils._camera.ox = b2Utils._camera.x;
		b2Utils._camera.oy = b2Utils._camera.y;
		b2Utils._camera.dx = 0;
		b2Utils._camera.dy = 0;

		b2Utils._camera.stagePortWidth = config.stagePortWidth;
		b2Utils._camera.stagePortHeight = config.stagePortHeight;
		b2Utils._camera.gamePortHeight = config.gamePortHeight;
		b2Utils._camera.gamePortWidth = config.gamePortWidth;

	}

	var cbody_x,
		cbody_y,
		clocal_x,
		clocal_y;

	b2Utils.watchCamera = function() {

		(function(camera) {

			cbody_y = camera.body.GetPosition().y * SCALE;
			clocal_y = cbody_y - camera.y;

			cbody_x = camera.body.GetPosition().x * SCALE;
			clocal_x = cbody_x - camera.x;

			//向下
			//利用相对于stage的坐标来作为计算
			//而camera作为偏移量
			if (clocal_y > (camera.stagePortHeight - camera.space)) {
				camera.y = (camera.stagePortHeight - camera.space) - cbody_y;
				if (camera.y <= camera.stagePortHeight - camera.gamePortHeight) {
					camera.y = camera.stagePortHeight - camera.gamePortHeight;
				}
			} else if (clocal_y < camera.space) {
				camera.y = camera.space - cbody_y;
				if (camera.y >= 0) {
					camera.y = 0;
				}
			}

			//左右
			if (clocal_x < camera.space) {
				camera.x = camera.space - cbody_x;
				if (camera.x >= 0) {
					camera.x = 0;
				}
			} else if (clocal_x > (camera.stagePortWidth - camera.space)) {
				camera.x = (camera.stagePortWidth - camera.space) - cbody_x;
				if (camera.x <= camera.stagePortWidth - camera.gamePortWidth) {
					camera.x = camera.stagePortWidth - camera.gamePortWidth;
				}
			}

			camera.dx = camera.x - camera.ox;
			camera.dy = camera.y - camera.oy;

			camera.ox = camera.x;
			camera.oy = camera.y;

			b2Utils._offset.x = -camera.x;
			b2Utils._offset.y = -camera.y;

			//console.log([camera.dx, camera.dy]);
			b2Utils.mouseOffset.x = camera.x;
			b2Utils.mouseOffset.y = camera.y;
			camera.debugCtx.translate(camera.dx, camera.dy);
			camera.debugCtx.clearRect(0, 0, camera.gamePortWidth, camera.gamePortHeight);

		})(b2Utils._camera);


	}

	return b2;
})();