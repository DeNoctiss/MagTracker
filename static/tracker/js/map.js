window.onload = function () { 


	require([
		"esri/Map",
		"esri/views/SceneView",
		"esri/layers/GraphicsLayer",
		"esri/Graphic"
		], function(Map, SceneView, GraphicsLayer, Graphic) {

			let AirPlanes = [];
			let chekcedInd = 0;
			let datePicker = document.getElementById('date');
			let lastDate = datePicker.value;
			let anim = false;
			let myInterval;


			var map = new Map({
				basemap: "gray", 
              //https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
              ground: "world-elevation"
          });



			var view = new SceneView({
				container: "viewDiv",
				map: map,
				center: [-0.178,51.48791],
				zoom: 10
			});



			var graphicsLayer = new GraphicsLayer();
			map.add(graphicsLayer);

			var pathLayer = new GraphicsLayer();
			map.add(pathLayer);

			var checekdPlaneLayer = new GraphicsLayer();
			map.add(checekdPlaneLayer);

			let selectPlot = document.getElementById('selectplot');
			selectPlot.onchange = function(){
				switch(this.options[selectplot.selectedIndex].innerHTML){
					case 'Bt':
					window.plotType = 1;
					break;
					case 'Bx':
					window.plotType = 2;
					break;
					case 'By':
					window.plotType = 3;
					break;
					case 'Bz':
					window.plotType = 4;
					break;
				}
			}

			window.plotType=1;

			function clearInfo(){
				console.log(chekcedInd);
				console.log(AirPlanes);
				AirPlanes[chekcedInd].checked = false;
				let pointGraphic = new Graphic();
				AirPlanes[chekcedInd].draw(graphicsLayer, pointGraphic);
				pathLayer.removeAll();
				checekdPlaneLayer.removeAll();
				document.getElementById('hiddenMenu').style.top = '-110vh';

			}

			function createRouteBlock(){


				let list = document.getElementById('selectBox');
				let selectFlight = document.createElement('option');
				selectFlight.innerHTML = 'Select flight';
				list.appendChild(selectFlight);

				for(let i=0; i<AirPlanes.length; i++){

					let opt = document.createElement('option');
					opt.setAttribute('value',i);
					opt.innerHTML = AirPlanes[i].race;


					list.appendChild(opt);
					list.onchange = function(){
						if(this.options[selectBox.selectedIndex].innerHTML == 'Select flight'){
							document.getElementById('graf').innerHTML='';
							clearInfo();
						} else{
							if(chekcedInd >= 0){
								AirPlanes[chekcedInd].checked = false;
								let pointGraphic = new Graphic();
								AirPlanes[chekcedInd].draw(graphicsLayer, pointGraphic);
								pathLayer.removeAll();
								checekdPlaneLayer.removeAll();
								clearInfo();
								document.getElementById('graf').innerHTML='';
							}
							let config = {
								type: 'line',
								data: {
									labels: [],
									datasets: [{
										label: 'Total-intensity',
										data: []
									},{
										label: 'Current total-intensity',
										backgroundColor: 'rgb(226,156,28)',
										borderColor: 'rgb(226,156,28)',
										data: [],
										pointRadius: []
									}]
								},
								options: {
									responsive: true,
									title: {
										display: true,
										text: 'Total-intensity'
									},
									elements: {
										point: {
											pointStyle: 'circle'
										}
									}
								}
							}
							let graf = document.getElementById('graf');
							let canvas = document.createElement('canvas');
							var ctx = canvas.getContext('2d');
							graf.appendChild(canvas);
							window.myLine = new Chart(ctx, config);

							let selectPlot = document.getElementById('selectplot');
							selectPlot.onchange = function(){
								switch(this.options[selectplot.selectedIndex].innerHTML){
									case 'Bt':
									window.plotType = 1;
									AirPlanes[chekcedInd].drawGraf();
									break;
									case 'Bx':
									window.plotType = 2;
									AirPlanes[chekcedInd].drawGraf();
									break;
									case 'By':
									window.plotType = 3;
									AirPlanes[chekcedInd].drawGraf();
									break;
									case 'Bz':
									window.plotType = 4;
									AirPlanes[chekcedInd].drawGraf();
									break;
								}
							}

							let ind = this.options[selectBox.selectedIndex].value;
							console.log(ind);
							AirPlanes[ind].checked = true;
							chekcedInd = ind;
							var polylineGraphic = new Graphic();
							AirPlanes[ind].pathDraw(polylineGraphic,pathLayer);
							let pointGraphic = new Graphic();
							AirPlanes[ind].draw(graphicsLayer, pointGraphic);
							view.center = AirPlanes[ind].routePath[AirPlanes[i].curPos];
							document.getElementById('hiddenMenu').style.top = '0px';
							let backBtn = document.getElementById('back');
							backBtn.onclick = function(){
								clearInfo();
								document.getElementById('selectBox').selectedIndex = 0;
							}

							let toCSV = document.getElementById('toCSV');

							let csvContent = "data:text/csv;charset=utf-8,";
							let row;

							for(let j=0; j < AirPlanes[chekcedInd].total.length; j++){
								if(j==0){
									row = 'race'+','+AirPlanes[chekcedInd].race;
									csvContent += row + "\r\n";
									row = 'takeoff'+','+AirPlanes[chekcedInd].from_;
									csvContent += row + "\r\n";
									row = 'landing'+','+AirPlanes[chekcedInd].to_;
									csvContent += row + "\r\n";
									row = "time,latitude,longitude,altitude,total intensity, north intensity, east intensity, vertical intensity\r\n";
									csvContent += row;
								}
								row = AirPlanes[chekcedInd].labels[j]+','+AirPlanes[chekcedInd].latitudes[j]+','+AirPlanes[chekcedInd].longitudes[j]+','+AirPlanes[chekcedInd].altitudes[j]+','+AirPlanes[chekcedInd].total[j]+','+AirPlanes[chekcedInd].Bx[j]+','+AirPlanes[chekcedInd].By[j]+','+AirPlanes[chekcedInd].Bz[j];
								csvContent += row + "\r\n";
							}
							var encodedUri = encodeURI(csvContent);
							var link = document.getElementById("download");
							link.setAttribute("href", encodedUri);
							link.setAttribute("download", AirPlanes[ind].race+".csv");
						}

					}



				}

			}





			function repaint(){
				chekcedInd= 0;
				graphicsLayer.removeAll();
				pathLayer.removeAll();

				let xhr = new XMLHttpRequest();
				xhr.open('GET', 'routesday/'+datePicker.value, false);
				xhr.send();
				if(xhr.status != 200){
					alert( xhr.status + ': ' + xhr.statusText )
				} else {
					routes = JSON.parse(xhr.responseText);

					AirPlanes = [];
					for(let i=0; i<routes.length; i++){
						let AirPlane_ = new AirPlane(routes[i].id, routes[i].race, routes[i].from, routes[i].to, checekdPlaneLayer, routes[i].date);
						AirPlanes.push(AirPlane_);

					}

				}



				for(let i=0; i<AirPlanes.length; i++){
					let pointGraphic = new Graphic();
					AirPlanes[i].draw(graphicsLayer,pointGraphic);
				}

				view.on("click", function(event){
              // event is the event handle returned after the event fires.

              if(chekcedInd >= 0){
              	AirPlanes[chekcedInd].checked = false;
              	let pointGraphic = new Graphic();
              	AirPlanes[chekcedInd].draw(graphicsLayer, pointGraphic);
              	pathLayer.removeAll();
              	checekdPlaneLayer.removeAll();
              	clearInfo();
              	document.getElementById('graf').innerHTML='';
              	document.getElementById('selectBox').selectedIndex = 0;
              }
              for(let i = AirPlanes.length-1; i>=0; i--){
              	if(AirPlanes[i].clickCheck(event.mapPoint.longitude, event.mapPoint.latitude, Math.round(view.zoom))){
              		pathLayer.removeAll();
              		AirPlanes[i].checked = true;
              		chekcedInd = i;

              		let config = {
              			type: 'line',
              			data: {
              				labels: [],
              				datasets: [{
              					label: 'Total-intensity',
              					data: []
              				},{
              					label: 'Current total-intensity',
              					backgroundColor: 'rgb(226,156,28)',
              					borderColor: 'rgb(226,156,28)',
              					data: [],
              					pointRadius: []
              				}]
              			},
              			options: {
              				responsive: true,
              				title: {
              					display: true,
              					text: 'Total-intensity'
              				},
              				elements: {
              					point: {
              						pointStyle: 'circle'
              					}
              				}
              			}
              		}

              		let graf = document.getElementById('graf');
              		let canvas = document.createElement('canvas');
              		var ctx = canvas.getContext('2d');
              		graf.appendChild(canvas);

              		window.myLine = new Chart(ctx, config);
              		var polylineGraphic = new Graphic();
              		AirPlanes[i].pathDraw(polylineGraphic,pathLayer);
              		let pointGraphic = new Graphic();
              		AirPlanes[i].draw(graphicsLayer, pointGraphic);
                  //view.center = AirPlanes[i].routePath[0];
                  let backBtn = document.getElementById('back');
                  backBtn.onclick = function(){
                  	clearInfo();
                  }
                  document.getElementById('hiddenMenu').style.top = '0px';
                  let toCSV = document.getElementById('toCSV');

                  let csvContent = "data:text/csv;charset=utf-8,";
                  let row;
                  
                  for(let j=0; j < AirPlanes[chekcedInd].total.length; j++){
                  	if(j==0){
                  		row = AirPlanes[chekcedInd].from_+','+AirPlanes[chekcedInd].to_;
                  		csvContent += row + "\r\n";
                  		row = "time,latitude,longitude,altitude,total intensity, north intensity, east intensity, vertical intensity\r\n";
                  		csvContent += row;
                  	}
                  	row = AirPlanes[chekcedInd].labels[j]+','+AirPlanes[chekcedInd].latitudes[j]+','+AirPlanes[chekcedInd].longitudes[j]+','+AirPlanes[chekcedInd].altitudes[j]+','+AirPlanes[chekcedInd].total[j]+','+AirPlanes[chekcedInd].Bx[j]+','+AirPlanes[chekcedInd].By[j]+','+AirPlanes[chekcedInd].Bz[j];
                  	csvContent += row + "\r\n";
                  }
                  var encodedUri = encodeURI(csvContent);
                  var link = document.getElementById("download");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", AirPlanes[chekcedInd].race+".csv");
                  break;
              }
          }


      });


				let animation = function(){
					if (anim == true){
						graphicsLayer.removeAll();
						for(let i=0; i<AirPlanes.length; i++){
							AirPlanes[i].next();
							let pointGraphic = new Graphic();
							AirPlanes[i].draw(graphicsLayer,pointGraphic);
						}
					}

				}

				let btnStart = document.querySelector('.startBtn');
				btnStart.onclick = function(){
					if(this.classList.contains("startBtn")){
						anim = true;
						this.classList.remove('startBtn');
						this.classList.add('stopBtn');
						myInterval = setInterval(animation,1000);
					}
					else {
						anim = false;
						this.classList.add('startBtn');
						this.classList.remove('stopBtn');
						clearInterval(myInterval);
					}
				}

				let btnPrev = document.querySelector('.prevBtn');
				btnPrev.onclick = function(){
					graphicsLayer.removeAll();
					for(let i=0; i<AirPlanes.length; i++){
						AirPlanes[i].prev();
						let pointGraphic = new Graphic();
						AirPlanes[i].draw(graphicsLayer,pointGraphic);
					}
				}

				let btnNext = document.querySelector('.nextBtn');
				btnNext.onclick = function(){
					graphicsLayer.removeAll();
					for(let i=0; i<AirPlanes.length; i++){
						AirPlanes[i].next();
						let pointGraphic = new Graphic();
						AirPlanes[i].draw(graphicsLayer,pointGraphic);
					}
				}

				let btnLast = document.querySelector('.lastBtn');
				btnLast.onclick = function(){
					graphicsLayer.removeAll();
					for(let i=0; i<AirPlanes.length; i++){
						AirPlanes[i].last();
						let pointGraphic = new Graphic();
						AirPlanes[i].draw(graphicsLayer,pointGraphic);
					}
				}

				let btnFirst = document.querySelector('.firstBtn');
				btnFirst.onclick = function(){
					graphicsLayer.removeAll();
					for(let i=0; i<AirPlanes.length; i++){
						AirPlanes[i].first();
						let pointGraphic = new Graphic();
						AirPlanes[i].draw(graphicsLayer,pointGraphic);
					}
				}

				createRouteBlock();
			}



			repaint();
			datePicker.onchange = function(){
				if(this.value != lastDate) {
					if(anim == true){
						anim = false;
						let btnStart = document.querySelector('.stopBtn');
						btnStart.classList.add('startBtn');
						btnStart.classList.remove('stopBtn');
						clearInterval(myInterval);
					}

					chekcedInd=0;
					lastDate = this.value;
					document.getElementById('selectBox').innerHTML='';
					document.getElementById('graf').innerHTML='';
					if(AirPlanes.length > 0){
						clearInfo();
					}


					repaint();
				}
			}




		});



}