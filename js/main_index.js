(function(){ 

	/*
		index -Do Note

		Jx5 
		______________________________
	*/

		//globales()

	let //titulo, imagen, ops 
		princ = document.querySelector('.princ'),
		ops = document.querySelector('.ops'),

			//bnt de los forms
		ingresar = document.getElementById('ingresar'),
		registrar = document.getElementById('registrar'),

			//section formularios...
		form_i = document.getElementById('f_i'),
		form_r = document.getElementById('f_r'),

			//formularios
		f_i_f = document.getElementById('f-i-f'),
		f_r_f = document.getElementById('f-r-f'),

			//spans 
		span_i = document.getElementById('span_ingre'),
		span_r = document.getElementById('span_regis'),

			//inputs
		inputs = document.querySelectorAll('.input-form'),

			//submits
		s_ingreso = document.getElementById('s_ingreso'),
		s_registro = document.getElementById('s_registro');

		//variable constante para la base de datos local
	const indexedDB = window.indexedDB;
		

		//fun()

	const animaIde = (btn, form) =>{

			princ.style.display = 'none';
			ops.style.display = 'none';
			btn.style.display = 'none';

			form.style.animation = 'V 2s';

		form.style.display = 'block'; 
	} 

	const animaIde2 = (formV, formNV) =>{ 

		formV.style.display = 'none';
		formNV.style.animation = 'V 3s';
		formNV.style.display = 'block'; 
	}

	const validacionEntradas = () =>{ //si existe error alguno dentro de las entradas de registro o ingreso...

		if(errs){

			form_i.addEventListener('submit', (e)=>{

					e.preventDefault();
			});

			form_r.addEventListener('submit', (e)=>{

					e.preventDefault();
			});
		}
	}

	const contraConfirm = (contra, contra_confirm) =>{

		if(contra.value != contra_confirm.value){

			error(contra_confirm, true);
		
		} else{

			error(contra_confirm, false);
		}
	}

	const datosDeUsuario = () =>{

		if(localStorage.getItem('Nombre') == null && localStorage.getItem('Pass') == null){

			ingresar.style.display = 'none';
			span_i.style.display = 'none';
		
		} else{

				//ya existe un usuario registrado

			registrar.style.display = 'none'; 
			span_r.innerHTML = 'Has olvidado tu contraseña?';

			span_r.addEventListener('click', ()=>{

				Swal.fire({

					icon : 'warning',
					title : 'Para esto deberas eliminar tus datos anteriores...',
					showCancelButton : true,
					confirmButtonText : 'Continuar',
			
				}).then((result) =>{

					if(result.isConfirmed){

						Swal.fire({
							title : 'Procederemos a borrar tus datos',
							html : 'Esto incluye: datos de secion y notas almacenadas...',
							confirmButtonText : 'Aceptar'

						}).then((result)=>{

							if(result.isConfirmed){

								//vaciar datos de usuario!!!

								localStorage.clear();
								sessionStorage.clear();

								let deleteRequest = window.indexedDB.deleteDatabase('datos');

								deleteRequest.onerror = (event) =>{

									console.log('algo esta mal pa');
								}

								deleteRequest.onsuccess = (event) =>{

									sessionStorage.setItem('deleteDB', 'si');

									window.location = 'index.html';
								}
							}
						})
					}
				});
			});
		}
	}

	const validarEntrada = (nombre, pass) =>{

		if(nombre.value === localStorage.getItem('Nombre') && pass.value === localStorage.getItem('Pass')){

			window.location = 'inicio.html'
			sessionStorage.setItem('Session', 'si');
		
		} else{

			Swal.fire({
				icon : 'error',
				title : 'Datos Invalidos',
				html : 'Verifica que tus datos sean correctos',
				showConfirmButton : false,
				timer : 3000,
				timerProgressBar : true
			});
		}
	}

	const almDatosUsu = (nombre, email, pass) =>{

		localStorage.setItem('Nombre', nombre);
		localStorage.setItem('Pass', pass);
		localStorage.setItem('Email', email);
	}

	const mainSlider = () =>{

		window.addEventListener('load', ()=>{

			new Glider(document.querySelector('.carousel__lista'), {

				slidesToShow: 1,
			  slidesToScroll: 1,
			  dots: '.carousel__indicadores',
			  arrows: {
			    prev: '.carousel__anterior',
			    next: '.carousel__siguiente'
			  }
			});
		});
	}

					//Events()

		//slider de imagenes-----------------------------------------------

		mainSlider();

		/*
			elementos de los forms-------------------------------------------
		*/

		const inputs_ingreso = {

			nombre : inputs[0],
			contra : inputs[1]
		}

		const inputs_registro = {

			nombre : inputs[2],
			gmail : inputs[3],
			contra : inputs[4],
			contraConfirm : inputs[5]
		}

		//form ingreso-----------------------------------------------------

		ingresar.addEventListener('click', ()=>{animaIde(ingresar, form_i)});
		span_r.addEventListener('click', ()=>{

			if(localStorage.getItem('Nombre') == null && localStorage.getItem('Pass') == null){

				animaIde2(form_i, form_r); 
			}
		});

		s_ingreso.addEventListener('click', (event)=>{

			event.preventDefault();
			validarEntrada(inputs[0], inputs[1]);
		});

		//form registro---------------------------------------------------

			form_r.addEventListener('submit', (e)=>{

				e.preventDefault();
			});

		registrar.addEventListener('click', ()=>{animaIde(registrar, form_r);});
		span_i.addEventListener('click', ()=>{animaIde2(form_r, form_i);});

		s_registro.addEventListener('click', (e)=>{

			e.preventDefault();

			let band = 0; //bandera de errores 

			inputs.forEach((input)=>{

			if(input.style.border == '2.4px solid rgb(236, 23, 23)'){ //uno de los campos tiene un error

				Swal.fire({

					toast : true,
					title : 'Verifica los campos de entrada',
					icon : 'error',
					showConfirmButton : false,
					position : 'bottom-end',
					timer : 3000,
					timerProgressBar : true
				});

					band++;
				
				} else{band--;}
 		});

 			if(band == -6){ //no hay error

				if(inputs_registro.contra.value != inputs_registro.contraConfirm.value){

					Swal.fire({

						toast : true,
						title : 'Las contraseñas no coinciden',
						icon : 'error',
						showConfirmButton : false,
						position : 'bottom-end',
						timer : 3000,
						timerProgressBar : true
					});
				
				} else{ 

					almDatosUsu(inputs[2].value, inputs[3].value, inputs[4].value);

					/*
						Usuario agregado correctamente...
					*/

					window.location.reload();
				}
 			} 
	});


	    //enventos de carga de la pagina---------------------------------
			window.addEventListener('load',()=>{

				let loader = document.querySelector('#loader .div-loader');

				loader.style.animation = 'NV 3s';

				let cont=0, time=setInterval(()=>{ (cont==1)? clearInterval(time) : cont++;

					loader.style.display = 'none';

				},3000);

				Swal.fire({
					toast : true,
					title : `v0.1`,
					position : 'bottom-end',
					timer : 4000,
					timerProgressBar : true,
					showConfirmButton : false
				});
			})

		
		/*
			evaluaciones de inputs de los forms
		*/

	inputs.forEach((input)=>{

		input.addEventListener('keyup', (e)=>{ 

				if(validarCaracteres(e).error){ //existe un error 

					if(e.target.name == 'nombre' || e.target.name == 'contra'){

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
				} 
			});
	});

		/*
			Datos del usario...
		*/

		datosDeUsuario();
}())