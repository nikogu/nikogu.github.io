var Car=function(s){this.name=s.name;this.$scope={};var k=this.$scope;var p=setTimeout;var k={};k.drag=0.3;k.A=2;k.rag=3.46;k.switchPoint=100;k.weight=s.weight||1500;k.tw=s.tire.tw||205;k.tr=s.tire.tr||55;k.rh=s.tire.rh||16;k.shiftDelay=s.shiftDelay||600;k.gears=s.gears||["4.5","2.5","1.7","1.2","1","0.85","0.7"];k.gearCount=s.gears||6;k.maxRPM=s.maxRPM||6400;k.torque=s.torque||200;k.torqueCharacteristics=0;k.updateGears=function(){if(k.gearCount>k.gears.length){while(k.gears.length<k.gearCount){k.gears.push("")}}if(k.gearCount<k.gears.length){while(k.gears.length>k.gearCount){k.gears.pop()}}};k.maxSpeed=200;k.currentGear=1;k.currentSpeed=0;k.currentRPM=0;k.currentAcc=0;k.buttonEnabled=true;k.shiftButtonEnabled=false;k.shiftButtonText="Shift";k.speedLabel50=undefined;k.speedLabel100=undefined;k.speedLabel200=undefined;var i,d,b,l,q,r,j,n,o,a,h,m;k.run=function(){k.buttonEnabled=false;k.data=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];k.currentGear=1;k.currentSpeed=0;k.currentRPM=0;d=0.1;m=k.switchPoint/100;f();b=k.rh*25.4+2*((k.tw*k.tr)/100);b=b/1000;l=3.14159265*b;q=1.2041;r=1;j=k.drag*k.A*0.5*q;n=0;i=false;k.shiftButtonEnabled=false;k.shiftButtonText="Shift";k.speedLabel50=undefined;k.speedLabel100=undefined;k.speedLabel200=undefined;o=k.shiftDelay;a=1;h=1;g(d)};k.forceShift=function(){if(k.currentGear<k.gears.length){k.currentGear++;i=true;k.shiftButtonEnabled=true;k.shiftButtonText="- Shifting -";o=k.shiftDelay}};var g=function(w){var v;if(i){o=o-d*1000;if(o<=0){i=false;if(k.currentGear<k.gears.length){k.shiftButtonEnabled=false;k.shiftButtonText="Shift"}else{k.shiftButtonText="Highest Gear"}}}if(!i){if(k.currentGear<=k.gears.length){var z=j*n*n;var A=k.currentRPM;if(k.torqueCharacteristics!=3){if(A<400){A=400}}if(k.torqueCharacteristics!=2){if(A<600){A=600}}var x=((c((A*100)/k.maxRPM)*k.torque)/(b/2))*k.rag*r*k.gears[k.currentGear-1];var y=x-z;var t=y/k.weight;k.currentAcc=parseFloat(t).toFixed(2);n=t*d+n;v=n/l;v=v*k.rag*k.gears[k.currentGear-1]*60;k.currentRPM=parseFloat(v).toFixed(2);k.currentSpeed=parseFloat(n*3.6).toFixed(2);if(k.speedLabel50==undefined&&k.currentSpeed>=50){k.speedLabel50="50 km/h reached: "+parseFloat(w).toFixed(1)+"s";console.log("** "+s.name+" 50 km/h",parseFloat(w).toFixed(1))}if(k.speedLabel100==undefined&&k.currentSpeed>=100){k.speedLabel100="100 km/h reached: "+parseFloat(w).toFixed(1)+"s";s.node.querySelector("em").innerHTML+=" / "+parseFloat(w).toFixed(1)+"s / ";console.log("** "+s.name+" 100 km/h",parseFloat(w).toFixed(1))}if(k.speedLabel200==undefined&&k.currentSpeed>=200){k.speedLabel200="200 km/h reached: "+parseFloat(w).toFixed(1)+"s";console.log("** "+s.name+" 200 km/h",parseFloat(w).toFixed(1))}if(k.currentSpeed+25>k.coptions.scaleSteps*k.coptions.scaleStepWidth){k.coptions.scaleStepWidth+=5}if(v>k.maxRPM*m){if(k.currentGear<k.gears.length){k.currentGear++;i=true;k.shiftButtonEnabled=true;k.shiftButtonText="- Shifting -";o=k.shiftDelay}}}}if(a%5==0){k.data[0][h]=k.currentSpeed;h++}a++;w+=0.1;if(!i&&k.currentGear==k.gears.length&&v>k.maxRPM){for(var u=h;u<k.data[0].length;u++){k.data[0][u]=k.data[0][h-1]}k.buttonEnabled=true}else{if(w<=15){p(function(){g(w)},100)}else{k.buttonEnabled=true}}};var e=function(t){t=""+t;t=t.replace(",",".");return t};var f=function(){k.weight=e(k.weight);k.drag=e(k.drag);k.A=e(k.A);k.tw=e(k.tw);k.tr=e(k.tr);k.rh=e(k.rh);k.shiftDelay=e(k.shiftDelay);k.rag=e(k.rag);k.switchPoint=e(k.switchPoint);k.maxRPM=e(k.maxRPM);k.torque=e(k.torque);for(var t=0;t<k.gears.length;t++){k.gears[t]=e(k.gears[t])}if(isNaN(k.weight)){k.weight=1500}if(isNaN(k.drag)){k.drag=0.3}if(isNaN(k.switchPoint)){k.switchPoint=100}if(isNaN(k.A)){k.A=2}if(isNaN(k.tw)){k.tw=205}if(isNaN(k.tr)){k.tr=55}if(isNaN(k.rh)){k.rh=16}if(isNaN(k.shiftDelay)){k.shiftDelay=600}if(isNaN(k.maxRPM)){k.maxRPM=6500}if(isNaN(k.torque)){k.torque=250}if(isNaN(k.rag)){k.rag=3.077}if(isNaN(k.gears[0])){k.gears[0]=3.077}for(var t=1;t<k.gears.length;t++){if(isNaN(k.gears[t])){k.gears[t]=k.gears[t-1]*0.7}}k.weight=Math.min(k.weight,50000);k.weight=Math.max(k.weight,10);k.drag=Math.min(k.drag,2.5);k.drag=Math.max(k.drag,0);k.A=Math.min(k.A,1000);k.A=Math.max(k.A,0.01);k.tw=Math.min(k.tw,900);k.tw=Math.max(k.tw,10);k.tr=Math.min(k.tr,100);k.tr=Math.max(k.tr,20);k.rh=Math.min(k.rh,50);k.rh=Math.max(k.rh,1);k.shiftDelay=Math.min(k.shiftDelay,5000);k.shiftDelay=Math.max(k.shiftDelay,0);k.rag=Math.min(k.rag,30);k.rag=Math.max(k.rag,0);k.switchPoint=Math.min(k.switchPoint,100);k.switchPoint=Math.max(k.switchPoint,10);for(var t=0;t<k.gears.length;t++){k.gears[t]=Math.min(k.gears[t],30);k.gears[t]=Math.max(k.gears[t],0.00001)}if(k.torqueCharacteristics==2){k.torqueCharacteristics=Math.min(k.torqueCharacteristics,5000)}k.maxRPM=Math.min(k.maxRPM,26000);k.maxRPM=Math.max(k.maxRPM,600);k.torque=Math.min(k.torque,5000);k.torque=Math.max(k.torque,1);for(var t=1;t<k.gears.length;t++){if(k.gears[t-1]<=k.gears[t]){k.gears[t]=k.gears[t-1]*0.7}}};k.labels=["0","0.5","1","1.5","2","2.5","3","3.5","4","4.5","5","5.5","6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11","11.5","12","12.5","13","13.5","14","14.5","15"];
k.series=["My Vehicle"];k.data=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];k.coptions={scaleLabel:"<%= value    %>",scaleOverride:true,scaleSteps:20,scaleStepWidth:10,scaleStartValue:0};var c=function(u){u=Math.min(100,u);u=Math.max(0,u);var z;if(k.torqueCharacteristics==0){z=-9.80963481*Math.pow(10,-5)*Math.pow(u,3)-1.191724942*Math.pow(10,-2)*Math.pow(u,2)+2.533877234*u+8.447552448}if(k.torqueCharacteristics==1){z=2.602952603*Math.pow(10,-4)*Math.pow(u,3)-6.824009324*Math.pow(10,-2)*Math.pow(u,2)+4.831196581*u+3.517482517}if(k.torqueCharacteristics==2){z=3.739316239*Math.pow(10,-4)*Math.pow(u,3)-8.802447552*Math.pow(10,-2)*Math.pow(u,2)+5.286907537*u+6.909090909}if(k.torqueCharacteristics==3){z=-1.311188811*Math.pow(10,-6)*Math.pow(u,4)+4.030691531*Math.pow(10,-4)*Math.pow(u,3)-4.258449883*Math.pow(10,-2)*Math.pow(u,2)+0.753982129*u+98.88111888}if(k.torqueCharacteristics==4){var t=u/10;t=Math.ceil(t);var v=u-Math.floor(u);var w=k.torqueData[0][t]-k.torqueData[0][t-1];z=k.torqueData[0][t-1]+w*v}if(z>100){z=100}if(z<1){z=1}return z/100};k.setTorque=function(t){k.torqueCharacteristics=t;if(t==0){k.torqueData=[[0,45,56,67,78,89,100,100,85,65,45]]}if(t==1){k.torqueData=[[0,45,80,100,100,100,100,100,90,80,60]]}if(t==2){k.torqueData=[[0,60,80,100,100,90,85,75,65,45,25]];if(k.maxRPM>5000){k.maxRPM=5000}}if(t==3){k.torqueData=[[100,100,100,100,85,70,60,50,40,30,20]]}if(t==4){$("#customTorque").modal("show")}};k.setCustomTorque=function(){for(var t=0;t<k.torqueData[0].length;t++){k.torqueData[0][t]=Math.min(100,k.torqueData[0][t]);k.torqueData[0][t]=Math.max(0,k.torqueData[0][t])}$("#customTorque").modal("hide")};k.torqueLabels=["RPM 0%","10%","20%","30%","40%","50%","60%","70%","80%","90%","100%"];k.torqueSeries=["Torque Characteristics"];k.torqueData=[[0,45,56,67,78,89,100,100,85,65,45]];this.run=k.run;this.currentSpeed=function(){return k.currentSpeed};this.move=function(t){s.node.style.transform="translate("+t+"px, 0px)"};this.x=0;this.node=s.node};(function(){var m=new Car({name:"BMW_M2",node:document.getElementById("bmw_m2"),weight:1595,tire:{tw:265,tr:35,rh:19},shiftDelay:200,gearCount:7,maxRPM:6400,torque:465});var f=new Car({name:"FOCUS_ST",node:document.getElementById("focus_st"),weight:1452,tire:{tw:235,tr:40,rh:18},shiftDelay:500,gearCount:6,maxRPM:5500,torque:345});var t=new Car({name:"FOCUS_RS",node:document.getElementById("focus_rs"),weight:1572,tire:{tw:235,tr:35,rh:19},shiftDelay:500,gearCount:6,maxRPM:6000,torque:440});var s=new Car({name:"AUDI_RS3",node:document.getElementById("audi_rs3"),weight:1520,tire:{tw:235,tr:35,rh:19},shiftDelay:200,gearCount:7,maxRPM:7000,torque:480});var b=new Car({name:"BENZ_A45",node:document.getElementById("benz_a45"),weight:1585,tire:{tw:235,tr:40,rh:18},shiftDelay:200,gearCount:7,maxRPM:6000,torque:450});var n=new Car({name:"Ferrari_458",node:document.getElementById("ferrari_458"),weight:1395,tire:{tw:305,tr:30,rh:20},shiftDelay:100,gearCount:4,maxRPM:9000,torque:540});var e=new Car({name:"McLaren P1",node:document.getElementById("mclaren_p1"),weight:1395,tire:{tw:315,tr:30,rh:20},shiftDelay:100,gearCount:7,maxRPM:7500,torque:720});var q=[m,f,t,s,b,n,e];var h=new Date().getTime();var l=0;var u;var j=2;var g=0;var d=400*j;var c;var p;var i=document.getElementById("btn");var k=document.getElementById("add");function o(){u=new Date().getTime();l=u-h;h=u;c=(((1000/60/60)*l)/1000)*j;q.forEach(function(v){v.x+=v.currentSpeed()*c;v.move(v.x);if(v.x>=d){console.log(v.name,(new Date().getTime()-p)/1000);v.node.querySelector("em").innerHTML+=" "+(new Date().getTime()-p)/1000+"s"+" / "+v.currentSpeed()+"km/h";q.forEach(function(x,w){if(x.name===v.name){q.splice(w,1)}});g++}});if(q.length>0){requestAnimationFrame(o)}else{i.style.display="inline";k.style.display="inline"}}i.addEventListener("click",function(w){var v=w.target;if(v.innerHTML==="Reset"){location.reload();return}v.style.display="none";k.style.display="none";v.innerHTML="Reset";q.forEach(function(x){x.run()});p=new Date().getTime();requestAnimationFrame(o)});var r=[200,500,500,200,200,100];var a=document.getElementById("form");a.addEventListener("submit",function(D){D.preventDefault();try{var z=new FormData(a);var w=z.get("name");var B=z.get("weight");var v=z.get("power");var A=z.get("maxrpm");var F=z.get("torque");var C=z.get("tire");var y=z.get("gears");var H=z.get("geartype");const E=C.split("/");const x="node"+new Date().getTime();var I=document.createElement("div");I.id=x;I.className="car";I.style.background="black";I.style.top=(q.length*50+50)+"px";I.innerHTML="<span>"+w+"</span><em></em>";document.getElementById("container").appendChild(I);const G=new Car({name:w,node:document.getElementById(x),weight:B,tire:{tw:E[0],tr:E[1],rh:E[2],},shiftDelay:r[H*1],gearCount:y,maxRPM:A,torque:F});q.push(G);alert("添加成功")}catch(D){throw new Error(D);alert("不要瞎几把乱搞")}})})();