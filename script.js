var cellNotClicked = "#8B4513"; // Valor = 0.
var cellClicked = "#DAA520"; // Valor = 1.
var lado;
var pasos;

var matrizBefore = []; // Inicialmente, todo a 0.
var matrizAfter = [];

var diferenciasEntreLas2Matrices = 0; // Nos permite controlador si las 2 matrices son iguales o no.
// Inicialmente, como todo está a 0 en ambas matrices, no hay ninguna diferencia.
var backtrackingEjecutandose = 0;

document.getElementById("initConfig").style.visibility = "visible"; // Todos los paneles ocultos, excepto este.

function getPosicion (x, y, lado) {
	return lado*y + x;
}

function getCoordenadaX (posicion, lado) {
	return posicion % lado;
}

function getCoordenadaY(posicion, lado) {
	return Math.floor(posicion / lado);
}

function getListaVecinos (posicion, lado) {
	var x = getCoordenadaX(posicion, lado);
	var y = getCoordenadaY(posicion, lado);
	var result = [];

	if ((x+1) < lado) {
		result.push(getPosicion(x+1, y, lado));
	}
	if ((x-1) >= 0) {
		result.push(getPosicion(x-1, y, lado));
	}
	if ((y+1) < lado) {
		result.push(getPosicion(x, y+1, lado));
	}
	if ((y-1) >= 0) {
		result.push(getPosicion(x, y-1, lado));
	}
	if (((x+1) < lado) && ((y+1) < lado)) {
		result.push(getPosicion(x+1, y+1, lado));
	}
	if (((x+1) < lado) && ((y-1) >= 0)) {
		result.push(getPosicion(x+1, y-1, lado));
	}
	if (((x-1) >= 0) && ((y+1) < lado)) {
		result.push(getPosicion(x-1, y+1, lado));
	}
	if (((x-1) >= 0) && ((y-1) >= 0)) {
		result.push(getPosicion(x-1, y-1, lado));
	}
	return result;
}

function cambiarColor (elem, matriz, posicion) {
	if (matrizBefore[posicion] == matrizAfter[posicion]) {
		diferenciasEntreLas2Matrices++;
	} else {
		diferenciasEntreLas2Matrices--;
	}
	document.getElementById("cantDiff").innerHTML = "Cantidad de diferencias: " + diferenciasEntreLas2Matrices;

	if (matriz[posicion] === 0) {
		elem.style.backgroundColor = cellClicked;
		matriz[posicion] = 1;
	} else if (matriz[posicion] === 1) {
		elem.style.backgroundColor = cellNotClicked;
		matriz[posicion] = 0;
	} else {
		alert("ERROOOOOOOOOOOOOR!!! En cambiarColor.");
	}
}

function cambiarColorEnMatrizBeforeYVecinas (posicion) {
	var elem = document.getElementById("b-" + posicion);
	var vecinas = getListaVecinos (posicion, lado);
	cambiarColor(elem, matrizBefore, posicion);
	var cont;
	for (cont=0;cont<vecinas.length;cont++) {
		elem = document.getElementById("b-" + vecinas[cont]);
		cambiarColor(elem, matrizBefore, vecinas[cont]);
	}
}

function celdaPulsada (id) {
	if (!backtrackingEjecutandose) {
		var array = id.split("-");
		var posicion = array[1];

		var elem = document.getElementById(id);
		if (array[0] === "a") {
			cambiarColor(elem, matrizAfter, posicion);
		} else if (array[0] === "b") {
			cambiarColor(elem, matrizBefore, posicion);
		} else {
			alert("ERROOOOOOOOOOOOOR!!!");
		}
	}
}

function getLadoReal() {
	var elem = document.getElementById("lado");
	var elemMax = parseInt(elem.max);
	var elemMin = parseInt(elem.min);
	var aux = parseInt(elem.value);
	if (aux < elemMin) {
		return elemMin;
	} else if (aux > elemMax) {
		return elemMax;
	} else {
		return aux;
	}
}

function getPasosReal() {
	var elem = document.getElementById("pasos");
	var elemMax = parseInt(elem.max);
	var elemMin = parseInt(elem.min);
	var aux = parseInt(elem.value);
	if (aux < elemMin) {
		return elemMin;
	} else if (aux > elemMax) {
		return elemMax;
	} else {
		return aux;
	}
}

function funcionConstruirTablero() {
	lado = getLadoReal();
	pasos = getPasosReal();
	var tablaBefore = document.getElementById("tableBefore");
	var tablaAfter = document.getElementById("tableAfter");
	tablaBefore.innerHTML = prepararContenidoTabla(matrizBefore, lado, "b");
	tablaAfter.innerHTML = prepararContenidoTabla(matrizAfter, lado, "a");

	// inputs como solo lectura y botón oculto.
	var listaInputs = document.getElementsByClassName("inputNumber");
	var cont;
	for (cont=0;cont<listaInputs.length;cont++) {
		var typ = document.createAttribute("readonly");
		listaInputs[cont].attributes.setNamedItem(typ);
	}
	document.getElementById("crearEscenario").style.visibility = "hidden";
	document.getElementById("lado").value = lado;
	document.getElementById("pasos").value = pasos;
	// ------------------------------------------------------------------
	document.getElementById("before").style.visibility = "visible";
	document.getElementById("after").style.visibility = "visible";
	document.getElementById("solution").style.visibility = "visible";
	document.getElementById("panelBotonEjecutar").style.visibility = "visible";
}

function prepararContenidoTabla(matriz, lado, pre) {
	var result = "";
	var i;
	var j;
	for (j=0;j<lado;j++) {
		result += "<tr>";
		for (i=0;i<lado;i++) {
			var valor = lado*j + i;
			result += "<td id=" + pre + "-" + valor + " onclick=" + "celdaPulsada(this.id)" + "><br></td>";
			matriz.push(0);
		}
		result += "</tr>";
	}
	return result;
}

function verMatriz () {
	var txt = "";
	var i;
	var j;
	for (j=0;j<lado;j++) {
		for (i=0;i<lado;i++) {
			txt += matrizBefore[lado*j+i] + "    ";
		}
		txt += "\r\n";
	}
	alert(txt);
}

// ---------------------------------------------------------------------------------------------------------------

var nivel; // nivel < pasos
var arraySolucion = []; // longitud del array = pasos.
var fin; // Cuando se encuentre una solución.

function Inicializar() {
	//alert("Dentro de Inicializar. Valor de pasos: " + pasos);
	nivel = 0;
	var cont;
	arraySolucion = [];
	for (cont=0;cont<pasos;cont++) {
		arraySolucion.push(-1);
	}
	fin = false;
	//alert("Dentro de Inicializar");
}

function generar() {
	//alert("Generar: arraySolucion[nivel]: " + arraySolucion[nivel]);
	if (arraySolucion[nivel] > -1) {
		// Deshacemos los cambios hechos en la matriz en el hermano actual.
		cambiarColorEnMatrizBeforeYVecinas (arraySolucion[nivel]);
	}
	arraySolucion[nivel]++; // Avanzamos al siguiente hermano.
	// Realizamos los cambios necesarios en la matriz.
	cambiarColorEnMatrizBeforeYVecinas (arraySolucion[nivel]);
	//alert("Generar: arraySolucion[nivel]: " + arraySolucion[nivel]);
}

function solucion() {
	// Habremos encontrado una solución cuando hayamos llegado a un nodo hoja y ambas matrices sean iguales.
	// Y cuando arraySolucion[nivel] != arraySolucion[nivel-1]
	//return false;
	if (pasos == 1) {
		return (diferenciasEntreLas2Matrices == 0);
	}
	return ((nivel == (pasos-1)) && (diferenciasEntreLas2Matrices == 0) && (arraySolucion[nivel] != arraySolucion[nivel-1]));
}

function criterio() {
	if (pasos == 1) {return false;}
	if (nivel == 0) {return true;}
	return ((nivel < (pasos-1)) && (arraySolucion[nivel] != arraySolucion[nivel-1]));
}

function masHermanos() {
	//alert("Mas hermanos: " + (arraySolucion[nivel] < ((lado*lado)-1)));
	return (arraySolucion[nivel] < ((lado*lado)-1));
}

function retroceder() {
	//alert("Retroceder: " + "Nivel: " + nivel);
	// Antes de retroceder, deshacemos los cambios realizados en la matriz en el nodo actual.
	cambiarColorEnMatrizBeforeYVecinas (arraySolucion[nivel]);
	arraySolucion[nivel] = -1; // Reseteamos el hermano del nivel actual.
	nivel--; // Retrocedemos.
	//alert("Retroceder: " + "Nivel: " + nivel);
}

function backtracking() {
	//alert("Comenzamos backtracking.");
	Inicializar();
	//alert("Salimos de Inicializar");
	do {
		//alert("Entramos al bucle principal");
		generar();
		//alert(verArraySolucion()); // <-------------------------------------------------------------------------------
		//alert("Salimos de generar");
		if (solucion()) {
			//alert("if solucion()");
			fin = true;
		} else if (criterio()) {
			//alert("if criterio()");
			nivel++;
		} else {
			//alert("else");
			while ((nivel > -1) && (!masHermanos())) {
				//alert("Iteración del while");
				retroceder();
			}
			//alert("Despues del while.");
		}
	} while ((!fin) && (nivel > -1));
}

function verArraySolucion() {
	var txt = "";
	var cont = 0;
	while ((cont < pasos) /*&& (arraySolucion[cont] != -1)*/) {
		txt += 	arraySolucion[cont] + "  ";
		cont++;
	}
	return txt;
}

function ejecutarPulsado() {
	if (diferenciasEntreLas2Matrices > 0) {
		backtrackingEjecutandose = 1;
		document.getElementById("estadoEjecucion").innerHTML = "Calculando...";
		var botonEjecutar = document.getElementById("ejecutar");
		botonEjecutar.style.visibility = "hidden";
		alert("Boton Ejecutar pulsado.");
		backtracking();
		var estadoEjecucion = document.getElementById("estadoEjecucion");
		var solucionEncontrada = document.getElementById("solucionEncontrada");
		if (fin) { // Si se ha encontrado solución.
			alert("Busqueda finalizada. Se ha encontrado una solucion.");
			estadoEjecucion.innerHTML = "OK";
			var cont;
			solucionEncontrada.innerHTML = "";
			for (cont=0;cont<arraySolucion.length;cont++) {
				if (arraySolucion[cont] != -1) {
					var indice = cont+1;
					solucionEncontrada.innerHTML += indice + ". ";
					solucionEncontrada.innerHTML += "(" + getCoordenadaX(arraySolucion[cont], lado) + ", " + getCoordenadaY(arraySolucion[cont], lado) + ")";
					if (cont < arraySolucion.length-1) {
						solucionEncontrada.innerHTML += "<br>";
					}
				}
			}
		} else { // Si no.
			alert("Busqueda finalizada. NO se ha encontrado una solucion.");
			estadoEjecucion.innerHTML = "Sin soluci&oacute;n.";
			solucionEncontrada.innerHTML = "Sin soluci&oacute;n.";
		}
		botonEjecutar.style.visibility = "visible";
		backtrackingEjecutandose = 0;
	} else if (diferenciasEntreLas2Matrices == 0) {
		alert("Las matrices ya son iguales.");
	} else {
		alert("ERROOOOOOOOOOOOOR!!! El nº de diferencias es negativo.");
	}
}