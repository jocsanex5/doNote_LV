(function(){ 
 
	/* 
		JS inicio.php -Do Note

		Jx5
		___________________________________
	*/
  
	let btn_agg_nota = document.getElementById('btn-agg-nota');

	let db;

	//datos de las notas
	let div_notas = document.getElementById('div_notas');

	let n0mbres, c0ntenido, c0lor, cantidadDeNotas = undefined; 

	//elementos de la barra de navegacion

	let menu = document.getElementById('menu'), 
		cuenta = document.getElementById('cuenta');


		/*
			lista de todas las notas generadas
		*/

	let notas;

	/*
		_____________________________________________
		arreglos de los datos de las notas agregadas
	*/

	let clave = [],
		color = [],
		nombres = [], 
		contenido = [],
		fecha = [];

			/*
				estos arreglos alamacenan loa datos de las notas que traidos
				de indexed db por medio del cursor...
			*/

	/*
		Base de datos local
	*/

	const indexedDB = window.indexedDB; //let global de la API 

	if(indexedDB){

		const request = indexedDB.open('datos', 1); //metodo para abrir la base datos

		request.onsuccess = () =>{

			db = request.result;

			console.log('Open');

			mostrarNotas();
		}

		request.onupgradeneeded = () =>{ //se abrio de manera correcta la base de datos local

			db = request.result;

			const objectStore = db.createObjectStore('notas', {

				keyPath : 'id'
			});

			console.log('CREATE');
		}

		request.onerror = (error) =>{

			console.log('Error', error)
		}
	}

	const error = (i, bool, form, msg) =>{

		//posibles errores de las entradas de datos

		if(bool){

			form.onsubmit = false;
			i.style.border = '2.4px solid #ec1717';

			Swal.fire({
				toast : true,
				icon : 'error',
				title : msg,
				position : 'bottom-end',
				timer : 3000,
				timerProgressBar : true,
				showConfirmButton : false
			});
		
		} else{

			i.style.border = '2px solid #051e2473';
		}
	}

	const obtenFecha = (dato) =>{

		let fecha = new Date(),
			dia = fecha.getDate(),
			mes = fecha.getMonth(),
			a = fecha.getFullYear();

		if(dato == 'dia'){ 

			return dia;

		} else if(dato == 'mes'){

			return mes;
		
		} else if(dato == 'a'){

			return a;
		}
 	}

	const agregarDatosAID = (form) =>{ //al momento de agregar las notas 

		form.addEventListener('submit', (event)=>{ 

			/*
				al momento de agregar la nueva nota a la base datos mediante el formulario
			*/

			const datos_de_nota = {
				id : `N${Math.floor(Math.random() * 100)}`,
				nombre : event.target.nombre.value,
				contenido : event.target.contenido.value,
				color : event.target.color.value,
				fecha : `${obtenFecha('dia')} / ${obtenFecha('mes')} / ${obtenFecha('a')}`
			}

			/*
				requerimientos para agg notas al sistema
			*/

			const transaction = db.transaction(['notas'], 'readwrite');
			const objectStore = transaction.objectStore('notas');
			const request = objectStore.add(datos_de_nota);
		});
	}

	const eliminarNotasAID = () =>{

		/*
			Proceso de elimacion de notas del sistema (se recarga la pagina...)
		*/

		//btn de eliminar notas

		let btnElim = document.getElementById('btn-elim');

		btnElim.addEventListener('click', ()=>{ btnElim.className = 'A';

			Swal.fire({
				toast : true,
				icon : 'warning',
				title : 'Selecciona un nota para eliminarla',
				position : 'bottom-end',
				timer : 3000,
				timerProgressBar : true,
				showConfirmButton : false
			});

			for(let key of notas){

				key.addEventListener('click', ()=>{

					Swal.fire({

						title : 'Seguro que quieres eliminar esta nota?',
						showCancelButton : true,
						confirmButtonText : 'Confirmar'

					}).then((result)=>{

						if(result.isConfirmed){

							const transaction = db.transaction(['notas'], 'readwrite');
							const objectStore = transaction.objectStore('notas');
							const request = objectStore.delete(`${key.id}`);

							window.location = 'inicio.html';
						
						} else{

							window.location = 'inicio.html';
						}
					})
				});
			}
		});
	}

	const mostrarNotas = () =>{ //mostar los datos de las notas agregadas a la DB_L

			/*
				traer la cantida de contras almacenadas en el app...
			*/

			let transaction_CN = db.transaction(['notas'], 'readonly');
			let objectStore_CN = transaction_CN.objectStore('notas');
			let countRequest_CN = objectStore_CN.count();


		//se realizo correctamente la consulta de CANT_NOTAS
		countRequest_CN.onsuccess = () =>{

			if(countRequest_CN.result > 0){ //hay mas de una nota

				/*
					definir el cursor que mostrara las notas del usuario en pantalla
				*/

				const transaction = db.transaction(['notas'], 'readonly');
				const objectStore = transaction.objectStore('notas');

			objectStore.openCursor().onsuccess = (e) =>{

					let cursor = e.target.result; //resultados de los datos de las notas

					if(cursor){ 

						clave.push(cursor.key);
						color.push(cursor.value.color);
						nombres.push(cursor.value.nombre);
						contenido.push(cursor.value.contenido);
						fecha.push(cursor.value.fecha);

							cursor.continue(); //para que lea todos los registros

					} else{

						for(let i=0; i<nombres.length; i++){

							//div de cada nota

							let nota = document.createElement('div');
								nota.className = 'div_n'; 

							nota.innerHTML = //se generaran en pantalla lpos divs de las notas con los requerimientos necesarios para sus estilos
									`<div class="nota" style="background: ${color[i]};" id="${clave[i]}">
											<div class="barra-mover">
												<i class="fas fa-bars"></i>
											</div>

											<div>
												<div class="nombre-notas">
													<output id="NN-${clave[i]}">${nombres[i]}</output>
												</div>
											</div>

												<div>
													<div class="cont-notas">
														<p>
															<output id="CN-${clave[i]}">${contenido[i]}</output>
														</p>
													</div>
												</div>

											<div>
												<div class="fecha-notas">
													<output id="FN-${clave[i]}"><i>${fecha[i]}</i></output>
												</div>
											</div>
										</div>`;
							
							div_notas.appendChild(nota); //anadir las notas\\

							/*
								funciones propias de la notas
								_______________________________
							*/

							colorQuitarNota();
							eliminarNotasAID();
						}

						/*
							Funcion de Drag and Drop para las notas creadas
							_______________________________________________
						*/

						notas = document.querySelectorAll('.nota');

						Sortable.create(div_notas, {
							animation : 150,
							group : 'lista-notas',
							handle : '.barra-mover',
							store : {

								//guardar orden de la lista
								set : (sortable)=>{

									const orden = sortable.toArray();

									localStorage.setItem(sortable.options.group.name, orden.join('-'));
								},

								//obtener el orden de la lista
								get : (sortable)=>{

									const orden = localStorage.getItem(sortable.options.group.name);

									return orden ? orden.split('-') : [];
								}
							}
						});
					}
				}

			} else{ 

				//div cuando no existen notas

				let nota = document.createElement('div');
					nota.className = 'div_n_NN'; 

				nota.innerHTML = //no existen notas
					`<div class="img1">
						<img src="recursos/inicioI1.jpg" width="300px" alt="">
					</div>

					<div class="nota" id="NN" style="background: #e8c129bf;" id="NC">
							<div>
								<div class="nombre-notas">
									<output id="NC">Agrega Notas!!!</output>
								</div>
							</div>

								<div>
									<div class="cont-notas">
										<p>
											<output id="NC">
												Por medio del botom que tienes en la parte inferior de tu pantalla
												veras el formulario para obtener los datos de tu nota nueva...
											</output>
										</p>
									</div>
								</div>

							<div>
								<div class="fecha-notas">
									<output id="FN-NC"><i>${obtenFecha('dia')} / ${obtenFecha('mes')} / ${obtenFecha('a')}</i></output>
								</div>
							</div>
						</div>

						<div class="img1">
							<img src="recursos/inicioI2.jpg" width="300px" alt="">
						</div>
					`;

				div_notas.appendChild(nota); 
			}
		}
	}

	const aggNota = () =>{

		//formulario para obtener los datos de la nueva nota...y las validaciones de entrada

		btn_agg_nota.addEventListener('click', ()=>{

			Swal.fire({

				title: '<strong>Agrega notas!!!</strong>',
				html : `
					<form method="get" id="form_agg">
						<div>
							<input type="text" class="input-form" required="" autocomplete="off" name="nombre" id="nombre_nota_agg" placeholder="Nombre">
						</div>

						<div>
							<textarea class="input-form" required="" autocomplete="off" name="contenido" id="contenido_nota_agg" cols="30" rows="10" placeholder="Contenido"></textarea>
						</div>

						<div>
							<div>
								<label class="label-inst-form" for="color_agg">Elige un color para la nota</label>
							</div>

							<div>
								<select class="input-form" name="color" id="color_nota_agg">
									<option value="#1e96aab8">Azul</option>
									<option value="#1eaa34b8">Verde</option>
									<option value="#e8c129bf">Amarillo</option>
									<option value="#9d0c0cbf">Rojo</option>
									<option value="#a73089">Rosado</option>
									<option value="#fff">Blanco</option>
								</select>
							</div>	
						</div>	

						<div>
							<input class="s-form" type="submit" value="Enviar" name="enviar_nota_agg">
						</div>
					</form>
				`,

				showConfirmButton: false,
				showCloseButton: true
			});

			//form agg notas-----------------------------------------------
			let	form_agg = document.getElementById('form_agg'),
				nombre_nota_agg = document.getElementById('nombre_nota_agg'),
				contenido_nota_agg = document.getElementById('contenido_nota_agg');

			//validaciones
			nombre_nota_agg.addEventListener('keyup', (e)=>{

				if(validarCaracteres(e).error){ //existe un error 

					Swal.fire({

						toast : true,
						title : validarCaracteres(e).msgError,
						icon : 'error',
						showConfirmButton : false,
						position : 'bottom-end',
						timer : 3000,
						timerProgressBar : true
					});
				} 
			});

			contenido_nota_agg.addEventListener('keyup', (e)=>{

				if(validarCaracteres(e).error){ //existe un error 

					Swal.fire({

						toast : true,
						title : validarCaracteres(e).msgError,
						icon : 'error',
						showConfirmButton : false,
						position : 'bottom-end',
						timer : 3000,
						timerProgressBar : true
					});
				} 
			});

			//agregar datos a indexedDB...

			agregarDatosAID(form_agg);
		});
	}

	const colorQuitarNota = () =>{

		//funcion que determina el color de la fuente dependiendo su fondo

		let notas = document.querySelectorAll('.nota')

		for(let key of notas){

			if(key.style.background == 'rgb(255, 255, 255) none repeat scroll 0% 0%'){

				key.style.color = '#000';
			}
		}
	}

	const actMenu = () =>{

		//elementos importantes en el menu
		let div_menu = document.getElementById('div-menu'), 
			barra_menu = document.getElementById('barra-menu'),
			btn_quitar_menu = document.getElementById('quitar_menu');

		menu.addEventListener('click', ()=>{

			div_menu.className = 'V'; 
			barra_menu.style.animation = 'barraMenu 1s';
		});

		btn_quitar_menu.addEventListener('click', ()=>{

			div_menu.className = 'NV';  
		});

		//elementos de la barra de menu...
		let	ayuda = document.getElementById('ayuda'),
			aCD = document.getElementById('aCD'),
			mC = document.getElementById('mC'),
			mDJX5 = document.getElementById('mDJX5');

		ayuda.addEventListener('click', ()=>{

			Swal.fire({

				showCloseButton : true,
				icon : 'question',
				title : 'Necesitas Ayuda?',
				showConfirmButton : false,
				html : `
					<ul class="ul-ayuda">
						<li class="li-ayuda">Sobre mi cuenta</li>
						<li class="li-ayuda">Como agregar Notas</li>
					</ul>
				`
			});

				let li_ayuda = document.querySelectorAll('.li-ayuda');

			li_ayuda[0].addEventListener('click', ()=>{

				Swal.fire({

					showCloseButton : true,
					showConfirmButton : false,
					title : 'Ayuda sobre tu cuenta',
					html : `
						<p class="p_ayuda">
							Al momento que te registrastes dentro de la app, tus datos quedan
							guardados remotamente en tu dispositivo para que al momento de ingresar
							solo tu veas tus notas importantes almacenadas. De igual manera tus notas
							quedan almacenadas localmente, es decir no son enviadas a una base de datos
							sino en tu almacenamiento...
						</p>
					`
				});
			});

			li_ayuda[1].addEventListener('click', ()=>{

				Swal.fire({

					showCloseButton : true,
					showConfirmButton : false,
					title : 'Como agergar notas',
					html : `
						<p class="p_ayuda">
							Presiona el botom de mas...
						</p>

						<img src="recursos/liA_1_1.png" width="100px" alt="" class="img_ayuda">

						<p class="p_ayuda">
							Rellena los datos de tu nota y agregar
						</p>

						<img src="recursos/liA_1_2.png" width="100px" alt="" class="img_ayuda">
					`
				});
			});
		});

		aCD.addEventListener('click', ()=>{

			Swal.fire({

				showCloseButton : true,
				showConfirmButton : false,
				title : 'Do-Note',
				html : `
					<img src="recursos/favicon.png" width="200px" alt="" class="img_ayuda">

					<p class="p_ayuda">
						En su version: "localVersion", es una aplicacion web creada para almacenadar
						tus notas o tareas a realizar en tu dia para que las puedas visulaizar
						cada que entres en la app con su fecha. Solo te registras con tus datos
						unicamente en tu dispositivo local podras acceder a tus notas!!!
					</p>
				`
			});			
		});
		
		mDJX5.addEventListener('click', ()=>{
		    
		    Swal.fire({
		        
		        showCloseButton : true,
		        showConfirmButton : false,
		        title : 'Jx5',
		        html : `
		            <img class="img_ayuda" width="150pc
		            x" src="recursos/LogoGitHub.jpg">
		            
		            <p class="p_ayuda">
		                visita mi perfil de GitHub para ver mas de mis proyectos 
		            </p>
		            
		            <a class="a_ayuda" href="https://github.com/jocsanex5">
		                gitHub/jocsanex5
		            </a
		        `
		    });
		});

		mC.addEventListener('click', ()=>{

			div_menu.className = 'NV';

			document.getElementById('div-cuenta').className = 'V'; 
			document.getElementById('barra-cuenta').style.animation = 'barraCuenta 1s';
		});
	}

	const actOpsCuenta = () =>{

		//elemtnos de las opciones de cuenta
		let div_cuenta = document.getElementById('div-cuenta'), 
			barra_cuenta = document.getElementById('barra-cuenta'),
			btn_quitar_cuenta = document.getElementById('quitar_cuenta');

		cuenta.addEventListener('click', ()=>{

			div_cuenta.className = 'V'; 
			barra_cuenta.style.animation = 'barraCuenta 1s';
		});

		btn_quitar_cuenta.addEventListener('click', ()=>{

			div_cuenta.className = 'NV';  
		});

		//datos de usuario
		let nombre = document.getElementById('nombre'),
			correo = document.getElementById('correo');

		nombre.innerHTML = localStorage.getItem('Nombre');
		correo.innerHTML = localStorage.getItem('Email');

		//opciones de cuenta
		let modifDatos = document.getElementById('modifDatos');

		modifDatos.addEventListener('click', ()=>{

			div_cuenta.className = 'NV';  

			Swal.fire({

				showConfirmButton : false,
				showCloseButton : true,
				title : 'Tus datos de usuario',
				html : `
					<form id="fomr-modif">
						<input type="text" required="" autocomplete="off" class="input-form" id="nombreModif" placeholder="${localStorage.getItem('Nombre')}">

						<input type="text" required="" autocomplete="off" class="input-form" id="correoModif" placeholder="${localStorage.getItem('Email')}">

						<br>

						<label class="label-inst-form" for="contra-f-r">Ingresa la contraseña para confimar</label>

						<input type="password" required="" autocomplete="off" class="input-form" name="contraModif" id="contra_modif" autocomplete="off">

						<input class="s-form" id="s_modif" name="submit-modif" type="submit" value="Modificar">
					</form>	
				`
			});

			let nombreModif = document.getElementById('nombreModif'),
				correoModif = document.getElementById('correoModif'),
				contra_confirm = document.getElementById('contra_modif'),
				fomr_modif = document.getElementById('fomr-modif');

				nombreModif.addEventListener('keyup', (e)=>{validarCaracteres(e.key, nombreModif, e.target.value, 'nombre');});
				correoModif.addEventListener('keyup', (e)=>{ validarCaracteres(e.key, correoModif, e.target.value, 'email');});
				contra_confirm.addEventListener('keyup', (e)=>{validarCaracteres(e.key, contra_confirm, e.target.value, 'contra');});

			fomr_modif.addEventListener('submit', (event)=>{

				if(contra_confirm.value === localStorage.getItem('Pass')){

					localStorage.setItem('Nombre', nombreModif.value);
					localStorage.setItem('Email', correoModif.value);

					window.location = 'inicio.html';
				
				} else{

					event.preventDefault();

					Swal.fire({
						showConfirmButton : false,
						showCloseButton : true,
						icon : 'warning',
						title : 'Contraseña invalida!!!'
					});
				}
			});
		});
	}
	
	const cerrarSescion = () =>{
	    
	    let btnCerr = document.getElementById('cerrar_S');
	    
	    btnCerr.addEventListener('click', ()=>{
	        
	        Swal.fire({
	            
	            showCancelButton : true,
	            title : 'Seguro que quieres salir?',
	            icon : 'warning',
	            confirmButtonText : 'Continuar'
	            
	        }).then((result)=>{
	            
	            if(result.isConfirmed){

                    sessionStorage.clear();
                    
                    window.location = 'index.html';
	            }
	        });
	    });
	}

	const busqueda = () =>{

		let lupa = document.getElementById('lupa');

		lupa.addEventListener('click', ()=>{

			Swal.fire({

				showConfirmButton : false,
				showCloseButton : true,
				title : 'Busqueda',
				html : `
					<form id="form_busc">
						<input type="text" autocomplete="off" class="input-form" name="texto" id="texto_busc">

						<label>Ingresa las palabras claves para encontrar tus notas</label>

						<input type="submit" class="s-form" value="Buscar">
					</form>
				`
			})

			document.getElementById('form_busc').addEventListener('submit', (event)=>{

				event.preventDefault();

				//busqueda de datos...

				let texto = document.querySelector('#texto_busc').value;
				let expresion = new RegExp(texto, 'gi');
				let indicesEnc = [];
				let cont=0;
				let sectNotas = document.querySelector('.sectNotas');
				let sectResults = document.querySelector('.sectResults');
				let div_results = document.getElementById('div_results');

				let inidecesCreados = document.querySelectorAll(`.notasResult`);

				inidecesCreados.forEach((input)=>{ 

					div_results.removeChild(document.getElementById('nota_result'));
				})

				/*
					Algoritmo de busqueda...

					By Jx5--------------------------------------------------------------------
				*/

				const mostrarResultados = (i) =>{ 

					cont++;

					let nota = document.createElement('div');
					nota.id = 'nota_result';

					sectNotas.style.display = 'none';
					nota.innerHTML = //se generaran en pantalla lpos divs de las notas con los requerimientos necesarios para sus estilos
						`<div class="nota notasResult" style="background: ${color[i]};" id="${clave[i]}">
								<div class="barra-mover">
									<i class="fas fa-bars"></i>
								</div>

								<div>
									<div class="nombre-notas">
										<output id="NN-${clave[i]}">${nombres[i]}</output>
									</div>
								</div>

									<div>
										<div class="cont-notas">
											<p>
												<output id="CN-${clave[i]}">${contenido[i]}</output>
											</p>
										</div>
									</div>

								<div>
									<div class="fecha-notas">
										<output id="FN-${clave[i]}"><i>${fecha[i]}</i></output>
									</div>
								</div>
							</div>`;

					div_results.appendChild(nota);

					colorQuitarNota();
					eliminarNotasAID();
				}

				//0.1

				for(let i=0; i<clave.length; i++){

					if(expresion.test(nombres[i])){

						mostrarResultados(i);//NOmbres
					
					} else{

						if(expresion.test(contenido[i])){

							mostrarResultados(i);//C0ntenido
						}
					}
				}

				if(cont > 0){

					Swal.fire({
						toast : true,
						icon : 'success',
						title : `${cont} resultados encontrados`,
						position : 'bottom-end',
						timer : 3000,
						timerProgressBar : true,
						showConfirmButton : false
					});

					document.querySelector('.div-agg').style.display = 'none';
					document.querySelector('.div-elim').style.display = 'none';
					document.querySelector('.div-mostAll').style.display = 'block';

					document.querySelector('.div-mostAll').addEventListener('click', ()=>{

						window.location.reload();
					});
				
				} else{

					Swal.fire({
						toast : true,
						icon : 'error',
						title : `${cont} resultados encontrados`,
						position : 'bottom-end',
						timer : 3000,
						timerProgressBar : true,
						showConfirmButton : false
					});
				}
			});
		});
	}

	/*
		Funciones()
	*/

	aggNota();
	actMenu();
	actOpsCuenta();
    cerrarSescion();
    busqueda();
    
      //enventos de carga de la pagina
		window.addEventListener('load',()=>{

			let loader = document.querySelector('#loader .div-loader');

			loader.style.animation = 'NV 3s';

			let cont=0, time=setInterval(()=>{ (cont==1)? clearInterval(time) : cont++;

				loader.style.display = 'none';

			}, 3000);
		})

}())
