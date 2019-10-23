'use strict';

/**
 * Флаг решения дополнительной задачи
 * @see README.md
 */
const isExtraTaskSolved = true;

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
  const timezone = workingHours.from[6];
  const segments = [];
  const days = {};
  days['ПН'] = 1;
  days['ВТ'] = 2;
  days['СР'] = 3;
  days['ЧТ'] = 4;
  days['ПТ'] = 5;
  days['СБ'] = 6;
  days['ВС'] = 7;
  const nums = {};
  nums[1] = 'ПН';
  nums[2] = 'ВТ';
  nums[3] = 'СР';
  nums[4] = 'ЧТ';
  nums[5] = 'ПТ';
  nums[6] = 'СБ';
  nums[7] = 'ВС';

  function addSegments(robberSchedule) {
    function correctTimezone(date) {
      let weekday = days[date.substr(0, 2)];
      let hour = Number(date.substr(3, 2));
      const minutes = Number(date.substr(6, 2));
      const robberTimezone = Number(date.substr(9));

      hour += timezone - robberTimezone;

      if (hour < 0) {
        hour += 24;
        weekday--;
      } else if (hour >= 24) {
        hour -= 24;
        weekday++;
      }

      return { weekday: weekday, hour: hour, minutes: minutes };
    }

    if (robberSchedule.length === 0) {
      return;
    }

    for (const { from, to } of Object.values(robberSchedule)) {
      segments.push({ from: correctTimezone(from), to: correctTimezone(to) });
    }
  }
  addSegments(schedule.Danny);
  addSegments(schedule.Rusty);
  addSegments(schedule.Linus);

  function addBankSegments() {
    for (let weekday = 1; weekday < 8; weekday++) {
      const hourFrom = Number(workingHours.from.substr(0, 2));
      const minutesFrom = Number(workingHours.from.substr(3, 2));

      segments.push({
        from: { weekday: weekday, hour: 0, minutes: 0 },
        to: { weekday: weekday, hour: hourFrom, minutes: minutesFrom }
      });

      const hourTo = Number(workingHours.to.substr(0, 2));
      const minutesTo = Number(workingHours.to.substr(3, 2));

      segments.push({
        from: { weekday: weekday, hour: hourTo, minutes: minutesTo },
        to: { weekday: weekday + 1, hour: 0, minutes: 0 }
      });
    }
  }

  addBankSegments();

  function getKey(date) {
    return date.weekday * 10000 + date.hour * 100 + date.minutes;
  }

  segments.sort(function(a, b) {
    return getKey(a.from) - getKey(b.from);
  });

  //console.log(segments);

  function addDuration(date, time) {
    const hourDuration = parseInt(time / 60);
    const minutesDuration = parseInt(time % 60);

    let weekday = date.weekday;
    let hour = date.hour + hourDuration;
    let minutes = date.minutes + minutesDuration;

    if (minutes >= 60) {
      minutes -= 60;
      hour++;
    }

    if (hour >= 24) {
      hour -= 24;
      weekday++;
    }

    return { weekday: weekday, hour: hour, minutes: minutes };
  }

  function hasIntersection(window, segment) {
    return getKey(segment.from) < getKey(window.to) && getKey(segment.to) > getKey(window.from);
  }

  function getWindow(time, start) {
    let beg = start;
    let end = addDuration(beg, time);
    for (const segment of Object.values(segments)) {
      if (getKey(segment.from) > getKey(end)) {
        break;
      }

      if (hasIntersection({ from: beg, to: end }, segment)) {
        beg = segment.to;
        end = addDuration(beg, time);
      }
    }

    return { from: beg, to: end };
  }

  let window = getWindow(duration, { weekday: 1, hour: 0, minutes: 0 });

  return {
    /**
     * Найдено ли время
     * @returns {boolean}
     */
    exists() {
      return window.to.weekday < 4;
    },

    /**
     * Возвращает отформатированную строку с часами
     * для ограбления во временной зоне банка
     *
     * @param {string} template
     * @returns {string}
     *
     * @example
     * ```js
     * getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
     * ```
     */
    format(template) {
      if (!this.exists()) {
        return '';
      }

      return template
        .replace('%DD', nums[window.from.weekday])
        .replace('%HH', (window.from.hour < 10 ? '0' : '') + window.from.hour)
        .replace('%MM', (window.from.minutes < 10 ? '0' : '') + window.from.minutes);
    },

    /**
     * Попробовать найти часы для ограбления позже [*]
     * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
     * @returns {boolean}
     */
    tryLater() {
      if (!this.exists()) {
        return false;
      }
      const nextWindow = getWindow(duration, addDuration(window.from, 30));
      if (nextWindow.to.weekday >= 4) {
        return false;
      }

      window = nextWindow;

      return true;
    }
  };
}

module.exports = {
  getAppropriateMoment,

  isExtraTaskSolved
};
