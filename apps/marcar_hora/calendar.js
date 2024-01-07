String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

class Calendar{
    constructor(config = {}, schedule = {}){
        this.config = config;
        this.schedule = schedule;
        this.calendarElement = document.getElementById(config['elementId']);
        this.calendarElement.classList.add('container');
        this.lang = this.config['language'];
        this.daySystem = this.config['daySystem'];
        this.date = {year : null, month: null};
        this.createCalendar();
    }

    getCurrentDate(){
        this.currentDate = new Date();

        let year = this.currentDate.getFullYear()
        let month = this.currentDate.getMonth();
        let day = this.currentDate.getDate();

        this.currentDate = {
            day : day,
            month : month,
            year: year
        }
    }

    getWeekDaysName(){
         this.weekDaysNames = [];
         let opt = { weekday: 'long', timeZone: 'UTC' };

        for (let i = 1; i <= 7; i++) {
            let referenceDate;
            if(this.daySystem == 'mon-first'){
                // Usamos enero 2024 como referencia para monday-first
                referenceDate = new Date(Date.UTC(2024, 0, i)); 
            }else{
                // Usamos enero 2024 como referencia para monday-first
                referenceDate = new Date(Date.UTC(2024, 8, i)); 
            }
            let weekDayName = referenceDate.toLocaleDateString(this.lang, opt);
            this.weekDaysNames.push(weekDayName);
        }
    
        return this.weekDaysNames;
    }
    
    getMonthName(index){
        this.monthNames = [];

        for (let month = 0; month < 12; month++) {
            let date = new Date(2000, month, 1);
            let monthName = date.toLocaleDateString( this.lang , { month: 'long' });
            this.monthNames.push(monthName.capitalize());
        }
  
        return this.monthNames[index];
    }

    getMonthDays(year, month){
        // Enero = 0, Febrero= 1
        month = month + 1;

        let endDate = new Date(year, month, 0); 

        var firstPositionY = 0;
        var maxRow = 6;

        let monthDays = [];

        for (let i = 1; i <= endDate.getDate(); i++) {
            let day = new Date(year, month - 1, i);
            // Dia de la semana en numero 0 Domingo, 1 Lunes
            let rowPosition = day.getDay();

            if(this.daySystem == "mon-first"){
                // Primer dia lunes
                rowPosition = (rowPosition == 0) ? 6 : rowPosition - 1;
            }

            let columnPosition = firstPositionY;

            if(rowPosition == maxRow){
              firstPositionY ++;
            }

            monthDays.push({
              day : i,
              axisX: rowPosition,
              axisY: columnPosition
            });
        }

        return monthDays;
    }

    printYear(){
        // Contenedor del año
        let id = 'year'
        let container = document.createElement('div');
        container.setAttribute('id', id);
        container.classList.add('row');

        // Elemento con el año
        let classStyle = 'col';
        this.yearElement = document.createElement('p');
        this.yearElement.classList.add(classStyle);
        this.yearElement.innerHTML = this.currentDate['year'];

        // Elementos de navegacion
        if(this.config['yearScroll']){
            this.navBack = document.createElement('span')
            this.navBack.classList.add(classStyle);
            this.navBack.classList.add('click');
            this.navBack.id = "back-year";
            this.navBack.addEventListener('click', this.yearNavigationBack.bind(this))
            this.navBack.innerHTML = '<';
    
            this.navNext = document.createElement('span')
            this.navNext.classList.add(classStyle);
            this.navNext.classList.add('click');
            this.navNext.id = 'next-year'
            this.navNext.addEventListener('click', this.yearNavigationNext.bind(this))
            this.navNext.innerHTML = '>';
        }

        // Agregar hijos al padre
        if(this.config['yearScroll']) container.appendChild(this.navBack);
        container.appendChild(this.yearElement);
        if(this.config['yearScroll']) container.appendChild(this.navNext);


        // Subir el contenedor de los dias al calendario contenedor
        this.calendarElement.appendChild(container)
    }

    printMonth(){
        // Contenedor del mes
        let id = 'month'
        let classStyle = 'row';
        let container = document.createElement('div');
        container.setAttribute('id', id);
        container.classList.add(classStyle);

        // Elemento con el nombre del mes
        let month = this.getMonthName(this.date['month']);

        classStyle = 'col';
        this.monthElement = document.createElement('p');
        this.monthElement.classList.add(classStyle);
        this.monthElement.innerHTML = month;
        
        // Elementos de navegacion
        let navBack = document.createElement('span')
        navBack.classList.add(classStyle);
        navBack.classList.add('click');
        navBack.id = "back-month";
        //navBack.addEventListener('click', this.monthNavigationBack.bind(this))
        navBack.onclick = this.monthNavigationBack.bind(this);
        navBack.innerHTML = '<';

        let navNext = document.createElement('span')
        navNext.classList.add(classStyle);
        navNext.classList.add('click');
        navNext.id = 'next-month';
        navNext.addEventListener('click', this.monthNavigationNext.bind(this))
        navNext.innerHTML = '>';
        
        // Agregar elementos al padre
        container.appendChild(navBack);
        container.appendChild(this.monthElement);
        container.appendChild(navNext);

        // Subir el contenedor de los dias al calendario contenedor
        this.calendarElement.appendChild(container)
    }

    printWeekDays(){
        // Contenedor de los dias de la semana
        let id = 'week-days'
        let classStyle = 'row';
        let container = document.createElement('div');
        container.setAttribute('id', id);
        container.classList.add(classStyle);

        // Elemento del dia de la semana
        let days = this.getWeekDaysName(this.lang);
        for(let i = 0; i < days.length; i++){
            let classStyle = 'col';
            let dayElement = document.createElement('span');
            dayElement.classList.add(classStyle);
            dayElement.innerHTML = days[i][0].toUpperCase() + days[i][1] + days[i][2];
            container.appendChild(dayElement);
        }

        // Subir el contenedor de los dias al calendario contenedor
        this.calendarElement.appendChild(container)
    }

    generateWeekContainer(){
        // Crear el contenedor semanal
        let container = document.createElement('div');
        container.classList.add('row-week');
        container.classList.add('row');
        let maxDaysInWeek = 7;
        let maxWeeks = 6;
        for(let i = 0; i < maxDaysInWeek; i++){
            let day = document.createElement('span');
            day.classList.add('col'); 
            container.appendChild(day);
        }
        for(let i = 0; i < maxWeeks; i++){
            container.id = `week-${i}`;
            let template = container.cloneNode(true);
            this.calendarElement.appendChild(template);
        }
        this.weeksContainers = document.getElementsByClassName('row-week');
    }
    
    printMonthDays(date){
        this.monthDays = this.getMonthDays(date['year'], date['month']);
        let weeksContainers = document.getElementsByClassName('row-week');

        for(let i = 0; i < this.monthDays.length; i++){
            let y = this.monthDays[i]['axisY'];
            let x = this.monthDays[i]['axisX'];

            let week = weeksContainers[y]
            let day = week.children[x]

            day.innerHTML = this.monthDays[i]['day']
        }


        return this.monthDays
    }

    clearDays(){
        let weeksElements = document.querySelectorAll('.row-week');

        weeksElements.forEach(function(element) {
            element.remove();
        });
    }

    createCalendar(){
        this.getCurrentDate();
        this.date['year'] = this.currentDate['year'];
        this.date['month'] = this.currentDate['month'];
        this.printYear();
        this.printMonth();
        this.printWeekDays()
        this.generateWeekContainer();
        this.printMonthDays(this.date);
        this.printDaysSchedule();
    }

    updateCalendar(){
        this.clearDays();
        this.generateWeekContainer();
        this.printMonthDays(this.date);
        this.printDaysSchedule();
    }

    // Navegacion del calendario
    monthNavigationBack(){
        this.monthNavigation('back');
    }

    monthNavigationNext(){
        this.monthNavigation('next');
    }

    monthNavigation(action){
        let nextYear = null;
        let backYear = null;

        // Imcrementar o disminuir el numero del mes
        if(action == 'next') this.date['month'] = this.date['month'] + 1;
        else this.date['month'] = this.date['month'] - 1;

        // Verificar que no pase de 12 o de 0, y manejar los años
        if(this.date['month'] > 11 && !this.config['yearScroll']) this.date['month'] = 0, nextYear = true;
        else if(this.date['month'] > 11 && this.config['yearScroll']) this.date['month'] = 0;

        else if(this.date['month'] < 0 && !this.config['yearScroll']) this.date['month'] = 11, backYear = true;
        else if(this.date['month'] < 0 && this.config['yearScroll']) this.date['month'] = 11;

        // Verificar que el mes no sea mas pequeño que la fecha actual
        if(this.date['month'] < this.currentDate['month'] && this.date['year'] == this.currentDate['year']) this.date['month'] = this.currentDate['month'];

        //Si se ha cambiado de años
        if(nextYear) console.log('new year'), this.yearNavigation('next');
        if(backYear) console.log('back year'), this.yearNavigation('back');

        this.monthElement.innerHTML = this.getMonthName(this.date['month']);

        this.updateCalendar();
    } 

    yearNavigationBack(){
        this.yearNavigation('back');
    }

    yearNavigationNext(){
        this.yearNavigation('next');
    }

    yearNavigation(action){
        // Imcrementar o disminuir el numero del año
        if(action == 'next') this.date['year'] = this.date['year'] + 1;
        else this.date['year'] = this.date['year'] - 1;

        // Verificar que no sea mas pequeño que el año actual
        if(this.date['year'] < this.currentDate['year']) this.date['year'] = this.currentDate['year'];

        this.yearElement.innerHTML = this.date['year'];

        this.updateCalendar();
    }

    // Horarios 
    printDaysSchedule(){
        let weeks = document.getElementsByClassName('row-week');

        for(let i = 0; i < weeks.length; i++){
            let days = weeks[i].children;

            for(let x = 0; x < days.length; x++){
                if(
                    this.schedule['days'].includes(x) &&
                    this.schedule['months'].includes(this.date['month']) &&
                    days[x].innerHTML != ""
                ){
                    days[x].classList.add('enable-day')
                    days[x].addEventListener('click', () => this.handleDaySelected(event));
                }
                else{
                    days[x].classList.add('disabled-day'); 
                }
                // Dias anteriores al actual desactivados
                if(days[x].innerHTML < this.currentDate['day'] && this.date['month'] == this.currentDate['month'] && this.date['year'] == this.currentDate['year']){
                    days[x].classList = [];
                    days[x].classList.add('disabled-day');
                }
            }
        }
    }

    handleDaySelected(event){
        // Deseleccionar cualquier posible elemento seleccionado
        let weeks = document.getElementsByClassName('row-week');
        for(let i = 0; i < weeks.length; i++){
            let days = weeks[i].children;
            for(let x = 0; x < days.length; x++){
                if (days[x] && days[x].classList.contains('selected')) {
                    days[x].classList.remove('selected');
                }
            }
        }

        let daySelectedElement = event.srcElement;
        daySelectedElement.classList.add('selected')

        let dateSelected = {
            day : daySelectedElement.innerHTML,
            month : this.getMonthName(this.date['month']),
            year : this.date['year']
        }

        console.log(dateSelected);
    }

}

class Schedule{
    constructor(){
        this.x = 0
    }

}

class App{
    constructor(calendarConfig, schedules){
        this.calendar = new Calendar(calendarConfig, schedules);
        this.schedule = new Schedule();
    }
}
var calendarConfig = {
    elementId : 'Calendar',
    language : 'es',
    daySystem : 'mon-first', // 'sun-first' , 'mon-first' 
    yearScroll : false
}

var schedules = {
    years : 'all',
    months : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    weeks : 'all',
    days : [ 1, 2, 3, 4, 5]
}

var calendar = new App(calendarConfig, schedules);

