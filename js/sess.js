	/*
		VALIDAR SESSION Y DELETEDB -Do Note

		Jx5 
		______________________________
	*/

	const validarSession = () =>{

		/*
			si ya iniciado secion o es un nuevo usuario
			___________________________________________
		*/

		if(localStorage.getItem('Nombre') == null){

			window.location = 'index.html';
		}

		/*
			eliminar datos de la base si no existen los datos de secion
		*/

		if(sessionStorage.getItem('deleteDB') == 'si'){

			let deleteRequest = window.indexedDB.deleteDatabase('datos');

			deleteRequest.onerror = (event) =>{

				window.location = 'index.html';
			}

			deleteRequest.onsuccess = (event) =>{

				window.location = 'inicio.html';
			}

			sessionStorage.setItem('deleteDB', 'no');
		}
	}

	validarSession();
