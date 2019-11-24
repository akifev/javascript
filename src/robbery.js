'use strict';

/**
 * Флаг решения дополнительной задачи
 * @see README.md
 */
const isExtraTaskSolved = true;

const days = {
  ПН: 1,
  ВТ: 2,
  СР: 3,
  ЧТ: 4,
  ПТ: 5,
  СБ: 6,
  ВС: 7
};
Object.freeze(days);
const nums = {
  1: 'ПН',
  2: 'ВТ',
  3: 'СР',
  4: 'ЧТ',
  5: 'ПТ',
  6: 'СБ',
  7: 'ВС'
};
Object.freeze(nums);

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
  const timezoneRegexp = new RegExp('[0-9]+$');
  const timezone = Number(timezoneRegexp.exec(workingHours.from)[0]);
  const segments = [];

  function addSegments(robberSchedule) {
    function correctTimezone(date) {
      let weekday = days[date.substr(0, 2)];
      let hour = Number(date.substr(3, 2));
      const minutes = Number(date.substr(6, 2));
      const robberTimezone = Number(timezoneRegexp.exec(date)[0]);

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

  for (const robberSchedule of Object.values(schedule)) {
    addSegments(robberSchedule);
  }

  function addBankSegments() {
    for (let weekday = 1; weekday <= 7; weekday++) {
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

  segments.sort((a, b) => getKey(a.from) - getKey(b.from));

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

  function hasIntersection(robberyTime, segment) {
    return (
      getKey(segment.from) < getKey(robberyTime.to) && getKey(segment.to) > getKey(robberyTime.from)
    );
  }

  function getRobberyTime(time, start) {
    let from = start;
    let to = addDuration(from, time);
    for (const segment of Object.values(segments)) {
      if (getKey(segment.from) > getKey(to)) {
        break;
      }

      if (hasIntersection({ from, to }, segment)) {
        from = segment.to;
        to = addDuration(from, time);
      }
    }

    return { from, to };
  }

  let robberyTime = getRobberyTime(duration, { weekday: 1, hour: 0, minutes: 0 });

  return {
    /**
     * Найдено ли время
     * @returns {boolean}
     */
    exists() {
      return robberyTime.to.weekday < 4;
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
        .replace('%DD', nums[robberyTime.from.weekday])
        .replace('%HH', robberyTime.from.hour.toString().padStart(2, '0'))
        .replace('%MM', robberyTime.from.minutes.toString().padStart(2, '0'));
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
      const PREPARATION_TIME = 30;
      const nextRobberyTime = getRobberyTime(
        duration,
        addDuration(robberyTime.from, PREPARATION_TIME)
      );
      if (nextRobberyTime.to.weekday >= 4) {
        return false;
      }

      robberyTime = nextRobberyTime;

      return true;
    }
  };
}

module.exports = {
  getAppropriateMoment,

  isExtraTaskSolved
};
