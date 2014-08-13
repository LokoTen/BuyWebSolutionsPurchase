$.fn.myCalendar = function () {
    var self = this;
    var curMonth = new Date().getMonth();
    var curYear = new Date().getFullYear();

    //массив наименований месяцев
    var monthsName = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль",
        "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

    //генерируем шапку  (месяц и год)
    function generateMonthYear() {
        var html = "<div class='calendar'><div><button id='prevmonth'><</button>";
        html += "<span id='curmonth' style='text-align:center;width:70px;display:inline-block'></span><span id='curyear'></span>";
        html += "<button id='nextmonth'>></button></div>";
        html += "<div id='daysgrid'></div>";
        html += "<div id='curdate'></div>";
        html += "<div class='dayweek'>" + showDayWeek() + "</div></div>";

        return html;
    }

    self.html(generateMonthYear());
    
    //Объявляем внутренние контролы
    var $prevMonth = this.find('#prevmonth');
    var $nextMonth = this.find('#nextmonth');
    var $curMonth = this.find('#curmonth');
    var $curYear = this.find('#curyear');
    var $daysGrid = this.find('#daysgrid');
    var $curDate = this.find('#curdate');

    //показываем каждую секунду текущее время
    var timerId = setInterval(showCurrentTime, 1000);

    //перерисовываем календарь
    function renderDate() {
        $curMonth.text(monthsName[curMonth]);
        $curYear.text(curYear);

        generateDays();
    }

    //показываем текущее время
    function showCurrentTime() {
        var daysInWeek = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
        var d = new Date();
        var hour = d.getHours().toString();
        var minute = d.getMinutes().toString();
        var second = d.getSeconds().toString();
        var s = (hour[1] ? hour : "0" + hour[0]) + ":" + (minute[1] ? minute : "0" + minute[0]) + ":" + (second[1] ? second : "0" + second[0]);
        $curDate.html(s);
    }

    //показываем день недели
    function showDayWeek() {
        var daysInWeek = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
        var d = new Date();
        return daysInWeek[d.getDay() - 1];
    }

    renderDate();
    showCurrentTime();
    
    //изменяем месяц
    function addMonth(count) {
        curMonth += count;

        if (curMonth < 0) {
            curYear--;
            curMonth = 11;
        }

        if (curMonth > 11) {
            curYear++;
            curMonth = 0;
        }

        renderDate();
    }

    $prevMonth.bind('click', function () {
        addMonth(-1);
    });

    $nextMonth.bind('click', function () {
        addMonth(1);
    });

    //генерируем сетку дней
    function generateDays() {
        var html = "<table><tr><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Вс</th></tr>";
        //первый день выбранного месяца
        var tempDay = new Date(curYear, curMonth, 1);
        //меняем дату на первый понедельник до начала месяца
        tempDay.setDate(tempDay.getDate() - (tempDay.getDay() - 1));
        //Высчитываем конечную дату (добавляем 42 (6 строк на 7 колонок) дней)
        var endDate = new Date(tempDay.getTime());
        endDate.setDate(endDate.getDate() + 42);
        //Если остаток слишком длинный (например 28 дней в месяце и начинается с понедельника)
        //переносим начальную дату на неделю назад, чтобы распределить остаток
        if (endDate.getDate() > 13) {
            tempDay.setDate(tempDay.getDate() - 7);
            endDate = new Date(tempDay.getTime());
            endDate.setDate(endDate.getDate() + 42);
        }

        while (tempDay < endDate) {
            //Если понедельник, то начинаем новую строку
            if (tempDay.getDay() == 1) html += "<tr>";

            html += "<td class='";
            if (tempDay.getMonth() == curMonth) {
                html += "actual";
            } else {
                html += "nonactual";
            }
            //Если дата совпадает с установленной, делаем ячейку активной
            if (tempDay.getTime() == self.val().getTime())
                html += " active";

            html += "'>" + tempDay.getDate() + "</td>";
            //Увеличиваем дату на 1 день
            tempDay.setDate(tempDay.getDate() + 1);
            //Если следующий день будет понедельником, закрываем строку
            if (tempDay.getDay() == 1) html += "</tr>";

        }
        
        html += "</table>";
        $daysGrid.html(html);
        //получаем дни выбранного месяца
        $days = $daysGrid.find('.actual');
        //обрабатываем клик на выбранном дне
        $days.bind('click', function () {
            var d = new Date(curYear, curMonth, $(this).text());
            //убираем предыдущий выбор
            $days.removeClass('active');
            //выделяем выбранный день
            $(this).addClass('active');
            //устанавливаем значение
            self.val(d);
            self.trigger('change');
        });

    }
}