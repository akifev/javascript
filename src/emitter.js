'use strict';

/**
 * Сделано дополнительное задание: реализованы методы several и through.
 */
const isExtraTaskSolved = true;

/**
 * Получение нового Emitter'а
 * @returns {Object}
 */
function getEmitter() {
  const events = new Map();

  return {
    /**
     * Подписка на событие
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     */
    on: function(event, context, handler) {
      if (events.has(event)) {
        events.get(event).push({ context: context, handler: handler });
      } else {
        events.set(event, [{ context: context, handler: handler }]);
      }

      return this;
    },

    /**
     * Отписка от события
     * @param {string} event
     * @param {Object} context
     */
    off: function(event, context) {
      if (!events.has(event)) {
        return this;
      }

      for (const eventName of events.keys()) {
        if (eventName === event || eventName.startsWith(event + '.')) {
          events.set(
            eventName,
            events.get(eventName).filter(function(subscriber) {
              return subscriber.context !== context;
            })
          );
        }
      }

      return this;
    },

    /**
     * Уведомление о событии
     * @param {string} event
     */
    emit: function(event) {
      function emitEvent(e) {
        if (!events.has(e)) {
          return;
        }

        for (const { context, handler } of events.get(e)) {
          handler.call(context);
        }
      }

      emitEvent(event);
      for (let i = event.length - 1; i >= 0; i--) {
        if (event[i] !== '.') {
          continue;
        }
        const underEvent = event.substr(0, i);
        emitEvent(underEvent);
      }

      return this;
    },

    /**
     * Подписка на событие с ограничением по количеству отправляемых уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} times Сколько раз отправить уведомление
     */
    several: function(event, context, handler, times) {
      if (times <= 0) {
        return this.on(event, context, handler);
      }

      let timesToCall = times;

      return this.on(event, context, function() {
        if (timesToCall > 0) {
          handler.call(context);
          --timesToCall;
        }
      });
    },

    /**
     * Подписка на событие с ограничением по частоте отправки уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} frequency Как часто уведомлять
     */
    through: function(event, context, handler, frequency) {
      if (frequency <= 0) {
        return this.on(event, context, handler);
      }

      let timesToSkip = 0;

      return this.on(event, context, function() {
        if (timesToSkip === 0) {
          handler.call(context);
          timesToSkip = frequency;
        }
        --timesToSkip;
      });
    }
  };
}

module.exports = {
  getEmitter,

  isExtraTaskSolved
};
