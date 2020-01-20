'use strict';

global.fetch = require('node-fetch');

function getWeather(geoId) {
  const url = `https://api.weather.yandex.ru/v1/forecast?hours=false&limit=7&geoid=${geoId}`;

  function validateWeather(forecast) {
    if (forecast === 'partly-cloudy' || forecast === 'clear') {
      return 'sunny';
    } else if (forecast === 'overcast' || forecast === 'cloudy') {
      return 'cloudy';
    }

    return 'bad weather';
  }

  return global
    .fetch(url)
    .then(response => response.json())
    .catch(error => {
      throw new Error('Failed to get weather conditions: ' + error);
    })
    .then(json => ({
      id: geoId,
      weather: json['forecasts'].map(day => validateWeather(day['parts']['day_short']['condition']))
    }))
    .catch(error => {
      throw new Error('Something went wrong: ' + error);
    });
}

/**
 * @typedef {object} TripItem Город, который является частью маршрута.
 * @property {number} geoid Идентификатор города
 * @property {number} day Порядковое число дня маршрута
 */

class TripBuilder {
  constructor(geoIds) {
    this.geoIds = geoIds;
    this.conditions = [];
    this.maxDuration = Infinity;
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества солнечных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `clear`;
   * * `partly-cloudy`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  sunny(daysCount) {
    for (let i = 0; i < daysCount; i++) {
      this.conditions.push('sunny');
    }

    return this;
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества пасмурных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `cloudy`;
   * * `overcast`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  cloudy(daysCount) {
    for (let i = 0; i < daysCount; i++) {
      this.conditions.push('cloudy');
    }

    return this;
  }

  /**
   * Метод, добавляющий условие максимального количества дней.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  max(daysCount) {
    this.maxDuration = daysCount;

    return this;
  }

  /**
   * Метод, возвращающий Promise с планируемым маршрутом.
   * @returns {Promise<TripItem[]>} Список городов маршрута
   */
  build() {
    return Promise.all(this.geoIds.map(getWeather)).then(cities => {
      const pathDuration = this.conditions.length;
      const mapDaysInCities = new Map();

      const path = (visited, previousId) => {
        const today = visited.length;

        if (today === pathDuration) {
          return visited;
        }

        for (let i = 0; i < cities.length; i++) {
          const currentCity = cities[i];
          const currentWeather = currentCity.weather[today];
          const currentId = currentCity.id;
          const currentDuration = mapDaysInCities.has(currentId)
            ? mapDaysInCities.get(currentId)
            : 0;

          if (
            currentWeather === this.conditions[today] &&
            (currentDuration === 0 ||
              (currentId === previousId && currentDuration < this.maxDuration))
          ) {
            mapDaysInCities.set(currentId, currentDuration + 1);

            const pathSuffix = path(
              visited.concat({ geoid: currentId, day: today + 1 }),
              currentId
            );

            if (pathSuffix !== null) {
              return pathSuffix;
            }

            mapDaysInCities.set(currentId, currentDuration);
          }
        }

        return null;
      };

      const result = path([], -1);

      if (result !== null) {
        return result;
      }

      throw new Error('Не могу построить маршрут!');
    });
  }
}

/**
 * Фабрика для получения планировщика маршрута.
 * Принимает на вход список идентификаторов городов, а
 * возвращает планировщик маршрута по данным городам.
 *
 * @param {number[]} geoids Список идентификаторов городов
 * @returns {TripBuilder} Объект планировщика маршрута
 * @see https://yandex.ru/dev/xml/doc/dg/reference/regions-docpage/
 */
function planTrip(geoids) {
  return new TripBuilder(geoids);
}

module.exports = {
  planTrip
};
