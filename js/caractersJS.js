	/*
		caracterJS -Do Note

		Jx5 
		______________________________
	*/

	/*
		estas funciones determinar carateres disponibles
		para las entradas de las imputs de formularios...

		Con expresiones regulares...
	*/

	let errsI = 0,
		errs = 0;

	const expresiones = {

		nombre : /^[a-zA-Z0-9\_\-]{0,40}\s?[a-zA-Z0-9\_\-]{0,40}?$/, //letras. nombres, numeros, guion y guion medio
		contra : /^.{0,12}$/,
		correo : /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9-.]+$/,
		contenido : /^.{0,700}$/
	}

	const msg = (msg) =>{
 
		Swal.fire({
			toast : true,
			icon : 'error',
			title : msg,
			position : 'bottom-end',
			timer : 3000,
			timerProgressBar : true,
			showConfirmButton : false
		});
	}

	/*
		0.1
	*/

	const validarCaracteres = (e) =>{

		let border_reset = '2px solid #051e2473',
			border_error = '2.4px solid #ec1717';

		switch (e.target.name){

			case 'nombre':

				if(expresiones.nombre.test(e.target.value)){ //No existe error

					e.target.style.border = border_reset;
					errs--;
					
					return {error : false}
	
				} else{ //SI hay error
					
					e.target.style.border = border_error;
					errs++;
					
					return {
						error : true,
						input : 'nombre',
						msgError : 'Verfica los caracteres del nombre'
					}
				}

			break;

			case 'contra':

				if(expresiones.contra.test(e.target.value)){ //no hay error

					e.target.style.border = border_reset;

					return {error : false};
				
				} else{ //si hay error
					
					e.target.style.border = border_error;


					return { //si hay error

						error : true,
						input : 'contra',
						msgError : 'Comprueba el limite de caracteres de tu contraseña'
					};
				}

			break;

			case 'gmail':

				if(expresiones.correo.test(e.target.value)){ //no hay error

					e.target.style.border = border_reset;

					return {error : false};
				
				} else{ ///si hay error
					
					e.target.style.border = border_error;

					return { //si hay error

						error : true,
						input : 'correo',
						msgError : 'Tu correo no es valido'
					};
				}

			break;

			case 'contenido':

				if(expresiones.contenido.test(e.target.value)){ //no hay error

					e.target.style.border = border_reset;

					return {error : false};
				
				} else{ ///si hay error
					
					e.target.style.border = border_error;

					return { //si hay error

						error : true,
						input : 'contendio',
						msgError : 'El contenido es demasiado largo'
					};
				}

			break;
		}
	}