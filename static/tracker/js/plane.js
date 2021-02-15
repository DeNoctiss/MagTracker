class AirPlane{
	constructor(id, race, from_, to_, checkLayer_, date_){
		this.checked = false;
		this.id = id;
		this.race = race;
		this.from_ = from_;
		this.to_ = to_;
		this.checkLayer= checkLayer_;
		this.date = date_;
		this.radiusCheck = {
			2: 4.32,
			3: 2.55,
			4: 1.44,
			5: 0.68,
			6: 0.33,
			7: 0.18,
			8: 0.08,
			9: 0.04,
			10: 0.03,
			11: 0.02,
			12: 0.01,
			13: 0.003,
			14: 0.0013,
			15: 0.0007,
			16: 0.0003,
			17: 0.0001,
			18: 0.00009,
			19: 0.00004,
			20: 0.00002,
			21: 0.00001,
			22: 0.000004,
			23: 0.000001,
			24: 0.0000007
		};

		this.urls = ["https://i.ibb.co/511xyyd/image.png", //0
          			  "https://i.ibb.co/Gd8R47V/15.png", //15
			          "https://i.ibb.co/hXScwtq/30.png", //30
			          "https://i.ibb.co/cwwsHpV/45.png", //45
			          "https://i.ibb.co/j5w9XMH/60.png", //60
			          "https://i.ibb.co/r3nd1kd/75.png", //75
			          "https://i.ibb.co/TBLRM5t/90.png", //90
			          "https://i.ibb.co/6wS6Lf5/105.png", //105
			          "https://i.ibb.co/BstrfKP/120.png", //120
			          "https://i.ibb.co/2ZV3KK8/135.png", //135
			          "https://i.ibb.co/LvdDGMg/150.png", //150
			          "https://i.ibb.co/KmsTBhB/165.png", //165
			          "https://i.ibb.co/St0r7zN/180.png", //180
			          "https://i.ibb.co/qMm3mWz/195.png", //195
			          "https://i.ibb.co/Bqz4Y48/210.png", //210
			          "https://i.ibb.co/yRYZGJc/225.png", //225
			          "https://i.ibb.co/7nSv0PY/240.png", //240
			          "https://i.ibb.co/zZ7NDtH/255.png", //255
			          "https://i.ibb.co/3yRqhJD/270.png", //270
			          "https://i.ibb.co/Ssf7R7K/285.png", //285
			          "https://i.ibb.co/D8wgS5t/300.png", //300
			          "https://i.ibb.co/yk1n1RK/315.png", //315
			          "https://i.ibb.co/W0zkjpZ/330.png", //330
			          "https://i.ibb.co/8YVzF9Z/345.png", //345
			          "https://i.ibb.co/sHXmdyr/360.png"  //360
			          ]
			          this.curPos = 0;
			          this.prevPos = 0;
			          this.routePath = [];
			          this.total = [];
			          this.Bx = [];
			          this.By = [];
			          this.Bz = [];
			          this.labels = [];
			          this.directions = [];
			          this.longitudes = [];
			          this.latitudes = [];
			          this.altitudes = [];
			          this.position = new Array(this.total.length);
			          this.position[this.curPos] = this.total[this.curPos];
			          this.radius = new Array(this.total.length);
			          this.radius[this.curPos] = 7;
			          this.ready = false;
			          let xhr = new XMLHttpRequest();
			          let limit = 300;
			          let offset = 0;
			          xhr.open('GET', 'dataflight/'+this.id, false);
			          xhr.send();
			          if(xhr.status != 200){
			          	alert( xhr.status + ': ' + xhr.statusText )
			          } else {
			          	let routeData = JSON.parse(xhr.responseText);
			          	for( let i=0; i<routeData.length; i++){
			          		let coords = [];
			          		coords.push(Number(routeData[i].longitude));
			          		coords.push(Number(routeData[i].latitude));
			          		coords.push(i+1);
			          		this.longitudes.push(Number(routeData[i].longitude));
			          		this.latitudes.push(Number(routeData[i].latitude));
			          		this.routePath.push(coords);
			          		this.total.push(routeData[i].total_intensity);
			          		this.Bx.push(routeData[i].Bx);
			          		this.By.push(routeData[i].By);
			          		this.Bz.push(routeData[i].Bz);
			          		this.labels.push(routeData[i].time);
			          		this.directions.push(routeData[i].direction);
			          		this.altitudes.push(routeData[i].altitude)
			          	}
			          }




			          


			      }

			      showInfo(){


			      	let race = document.getElementById('raceValue');
			      	race.innerHTML = this.race;
			      	console.log(this.id);

			      	let latitude = document.getElementById('latitude');
			      	latitude.innerHTML = this.latitudes[this.curPos];

			      	let longitude = document.getElementById('longitude');
			      	longitude.innerHTML = this.longitudes[this.curPos];

			      	let altitude = document.getElementById('altitude');
			      	altitude.innerHTML = this.altitudes[this.curPos];

			      	let total = document.getElementById('total');
			      	total.innerHTML = this.total[this.curPos];

			      	let takeoff = document.getElementById('takeoffValue');
			      	takeoff.innerHTML = this.from_;

			      	let landing = document.getElementById('landingValue');
			      	landing.innerHTML = this.to_;
			      }

			      drawGraf(){
			      	var position = new Array(this.total.length);
			      	position[this.curPos] = this.total[this.curPos];

			      	var radius = new Array(this.total.length);
			      	radius[this.curPos] = 7;

			      	window.myLine.config.data.labels = this.labels;
			      	window.myLine.config.data.datasets[1].data = [];

			      	switch(window.plotType){
			      		case 1:
			      		window.myLine.config.data.datasets[0].label = 'Total-intensity';
			      		window.myLine.config.data.datasets[1].label = 'Current total-intensity';
			      		window.myLine.config.options.title.text = 'Total-intensity';
			      		window.myLine.config.data.datasets[0].data = this.total;
			      		window.myLine.config.data.datasets[1].data[this.curPos] = this.total[this.curPos];
			      		break;
			      		case 2:
			      		window.myLine.config.data.datasets[0].label = 'North-intensity';
			      		window.myLine.config.data.datasets[1].label = 'Current north-intensity';
			      		window.myLine.config.options.title.text = 'North-intensity';
			      		window.myLine.config.data.datasets[0].data = this.Bx;
			      		window.myLine.config.data.datasets[1].data[this.curPos] = this.Bx[this.curPos];
			      		break;
			      		case 3:
			      		window.myLine.config.data.datasets[0].label = 'East-intensity';
			      		window.myLine.config.data.datasets[1].label = 'Current east-intensity';
			      		window.myLine.config.options.title.text = 'East-intensity';
			      		window.myLine.config.data.datasets[0].data = this.By;
			      		window.myLine.config.data.datasets[1].data[this.curPos] = this.By[this.curPos];
			      		break;
			      		case 4:
			      		window.myLine.config.data.datasets[0].label = 'Vertical-intensity';
			      		window.myLine.config.data.datasets[1].label = 'Current verical-intensity';
			      		window.myLine.config.options.title.text = 'Vertical-intensity';
			      		window.myLine.config.data.datasets[0].data = this.Bz;
			      		window.myLine.config.data.datasets[1].data[this.curPos] = this.Bz[this.curPos];
			      		break;
			      	}

			      	window.myLine.update();
			      }



			      draw(graphicsLayer, pointGraphic){
			      	var point = {
	        type: "point", // autocasts as new Point()
	        x: this.longitudes[this.curPos],
	        y: this.latitudes[this.curPos]
	    };
	    let markerSymbol;
	    if(this.checked){
	    	markerSymbol = {
		        type: "picture-marker", // autocasts as new SimpleMarkerSymbol()
		        color: [0, 255, 0],
		        url: this.urls[Math.floor(Number(this.directions[this.curPos])/15)],
		        //url: "0.svg",
		        width: 30
		    };
		    pointGraphic.geometry = point;
		    pointGraphic.symbol = markerSymbol;

		    this.checkLayer.removeAll();
		    this.checkLayer.add(pointGraphic);
		} else{
			markerSymbol = {
		        type: "picture-marker", // autocasts as new SimpleMarkerSymbol()
		        //color: [226, 119, 40],
		        url: this.urls[Math.floor(Number(this.directions[this.curPos])/15)],
		        //url: "0.svg",
		        width: 30
		    };

		    pointGraphic.geometry = point;
		    pointGraphic.symbol = markerSymbol;

		    graphicsLayer.add(pointGraphic);
		}
		

		

	}

	pathDraw(polylineGraphic,pathLayer){
		var polyline = {
	        type: "polyline", // autocasts as new Polyline()
	        paths: this.routePath,
	        hasZ: false,
	        hasM: true,
	        spatialReference: { wkid: 4326 }
	    };

	    let lineSymbol = {
	        type: "simple-line", // autocasts as SimpleLineSymbol()
	        color: [226, 119, 40],
	        width: 4
	    };

	    polylineGraphic.geometry = polyline;
	    polylineGraphic.symbol = lineSymbol;

	    pathLayer.add(polylineGraphic);

	    this.showInfo();
	    this.drawGraf();

	}

	clickCheck(longitude,latitude,zoom){
		let distance = Math.sqrt(((longitude - this.longitudes[this.curPos]) * (longitude - this.longitudes[this.curPos])) + ((latitude - this.latitudes[this.curPos]) * (latitude - this.latitudes[this.curPos])));
		let r = (10 - zoom)*0.04 +0.03;
		return distance < this.radiusCheck[zoom];
	}

	next(){
		if(this.curPos < this.routePath.length-1){
			this.prevPos = this.curPos;
			this.curPos = this.curPos+1;
		}
		if(this.checked){
			this.showInfo();
			
			window.myLine.config.data.datasets[1].data[this.prevPos] = null;
			window.myLine.config.data.datasets[1].pointRadius[this.prevPos] = null;
			window.myLine.config.data.datasets[1].pointRadius[this.curPos] = 7;
			
			switch(window.plotType){
				case 1:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.total[this.curPos];
				break;
				case 2:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.Bx[this.curPos];
				break;
				case 3:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.By[this.curPos];
				break;
				case 4:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.Bz[this.curPos];
				break;
			}


			window.myLine.update();
		}
	}

	prev(){
		if(this.curPos > 0){
			this.prevPos = this.curPos;
			this.curPos = this.curPos-1;
		}
		if(this.checked){
			this.showInfo();
			
			window.myLine.config.data.datasets[1].data[this.prevPos] = null;
			window.myLine.config.data.datasets[1].pointRadius[this.prevPos] = null;
			window.myLine.config.data.datasets[1].pointRadius[this.curPos] = 7;
			
			switch(window.plotType){
				case 1:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.total[this.curPos];
				break;
				case 2:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.Bx[this.curPos];
				break;
				case 3:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.By[this.curPos];
				break;
				case 4:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.Bz[this.curPos];
				break;
			}

			window.myLine.update();
		}
	}

	first(){
		this.prevPos = this.curPos;
		this.curPos = 0;
		if(this.checked){
			this.showInfo();
			
			window.myLine.config.data.datasets[1].data[this.prevPos] = null;
			window.myLine.config.data.datasets[1].pointRadius[this.prevPos] = null;
			window.myLine.config.data.datasets[1].pointRadius[this.curPos] = 7;

			switch(window.plotType){
				case 1:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.total[this.curPos];
				break;
				case 2:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.Bx[this.curPos];
				break;
				case 3:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.By[this.curPos];
				break;
				case 4:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.Bz[this.curPos];
				break;
			}

			window.myLine.update();
		}
	}	

	last(){
		this.prevPos = this.curPos;
		this.curPos = this.routePath.length-1;
		if(this.checked){
			this.showInfo();
			
			window.myLine.config.data.datasets[1].data[this.prevPos] = null;
			window.myLine.config.data.datasets[1].pointRadius[this.prevPos] = null;
			window.myLine.config.data.datasets[1].pointRadius[this.curPos] = 7;

			switch(window.plotType){
				case 1:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.total[this.curPos];
				break;
				case 2:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.Bx[this.curPos];
				break;
				case 3:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.By[this.curPos];
				break;
				case 4:
				window.myLine.config.data.datasets[1].data[this.curPos] = this.Bz[this.curPos];
				break;
			}

			window.myLine.update();
		}
	}

	
}