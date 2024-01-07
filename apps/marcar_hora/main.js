const diasContainer = document.getElementById('dias');
const diaMatrix = document.getElementsByClassName('row-semana');
var rowIndex = 0


function obtenerDiasDelMesConDiasSemana(anio, mes) {
    const fechaInicio = new Date(anio, mes - 1, 1);
    const fechaFin = new Date(anio, mes, 0); // El día 0 del siguiente mes es el último día del mes actual

    const diasDelMes = [];

    for (let i = 1; i <= fechaFin.getDate(); i++) {
      const fechaActual = new Date(anio, mes - 1, i);
      let x = fechaActual.getDay()
      imprimirDia(i, x);
      const diaSemana = fechaActual.toLocaleDateString('es-ES', { weekday: 'long' });

      diasDelMes.push({
        dia: i,
        diaSemana: diaSemana,
      });
    }

    return diasDelMes;
}

// Ejemplo de uso
const anio = 2024;
const mes = 12; // Marzo

const diasDeMarzo = obtenerDiasDelMesConDiasSemana(anio, mes);
console.log(diasDeMarzo);




function imprimirDia(diaSemana, diaMes){
    
    diaMes = (diaMes == 0) ? 7 : diaMes;
    
    console.log({diaMes, diaSemana, rowIndex })
    let diaContainer = diaMatrix[rowIndex].children[diaMes-1];

    diaContainer.innerHTML = diaSemana;

    rowIndex = (diaMes == 7) ? rowIndex + 1 : rowIndex;
}


function obtenerNombresDeMeses() {
    const nombresDeMeses = [];
  
    for (let mes = 0; mes < 12; mes++) {
      const fecha = new Date(2000, mes, 1); // Utiliza un año y día arbitrarios
      const nombreMes = fecha.toLocaleDateString('es-ES', { month: 'long' });
      nombresDeMeses.push(nombreMes);
    }
  
    return nombresDeMeses;
  }
  
  // Ejemplo de uso
  const meses = obtenerNombresDeMeses();
  console.log(meses);

  // Obtener la fecha actual
const fechaActual = new Date();

// Obtener el año actual
const anioActual = fechaActual.getFullYear();

// Obtener el mes actual (se suma 1 porque los meses van de 0 a 11)
const mesActual = fechaActual.getMonth() + 1;

// Obtener el día actual
const diaActual = fechaActual.getDate();

// Mostrar los resultados en la consola
console.log("Año actual:", anioActual);
console.log("Mes actual:", mesActual);
console.log("Día actual:", diaActual);