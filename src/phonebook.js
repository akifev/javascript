'use strict';

/**
 * Если вы решили сделать дополнительное задание и реализовали функцию importFromDsv,
 * то выставьте значение переменной isExtraTaskSolved в true.
 */
const isExtraTaskSolved = true;

/**
 * Телефонная книга
 */
const phoneBook = {};

function isValidPerson(phone, name, email) {
  function isString(arg) {
    return typeof arg === 'string';
  }

  if (!isString(phone) || !/^\d{10}$/.test(phone)) {
    return false;
  }

  if (!isString(name) || name === '') {
    return false;
  }

  return !(email !== undefined && !isString(email));
}

/**
 * Добавление записи в телефонную книгу
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */
function add(phone, name, email) {
  if (!isValidPerson(phone, name, email) || phoneBook[phone] !== undefined) {
    return false;
  }

  phoneBook[phone] = { phone: phone, name: name, email: email };

  return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */
function update(phone, name, email) {
  if (!isValidPerson(phone, name, email) || phoneBook[phone] === undefined) {
    return false;
  }

  phoneBook[phone] = { phone: phone, name: name, email: email };

  return true;
}

function russianPhoneFormat(phone) {
  return `+7 (${phone.substr(0, 3)}) ${phone.substr(3, 3)}-${phone.substr(6, 2)}-${phone.substr(
    8,
    2
  )}`;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {string} query
 * @returns {string[]}
 */
function find(query) {
  if (query === '') {
    return [];
  }

  const founded = [];
  for (const person of Object.values(phoneBook)) {
    if (
      query === '*' ||
      person.phone.includes(query) ||
      person.name.includes(query) ||
      (person.email !== undefined && person.email.includes(query))
    ) {
      founded.push(person);
    }
  }

  founded.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

  return founded.map(function(person) {
    return person.email !== undefined
      ? `${person.name}, ${russianPhoneFormat(person.phone)}, ${person.email}`
      : `${person.name}, ${russianPhoneFormat(person.phone)}`;
  });
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {string} query
 * @returns {number}
 */
function findAndRemove(query) {
  if (query === '') {
    return 0;
  }

  let deleted = 0;
  for (const [key, person] of Object.entries(phoneBook)) {
    if (
      query === '*' ||
      person.phone.includes(query) ||
      person.name.includes(query) ||
      (person.email !== undefined && person.email.includes(query))
    ) {
      delete phoneBook[key];
      deleted++;
    }
  }

  return deleted;
}

/**
 * Импорт записей из dsv-формата
 * @param {string} dsv
 * @returns {number} Количество добавленных и обновленных записей
 */
function importFromDsv(dsv) {
  if (typeof dsv !== 'string') {
    return 0;
  }

  const candidates = dsv.split('\n');
  let processed = 0;
  for (const candidate of candidates) {
    const [name, phone, email] = candidate.split(';');
    if (add(phone, name, email) || update(phone, name, email)) {
      processed++;
    }
  }

  return processed;
}

module.exports = {
  add,
  update,
  find,
  findAndRemove,
  importFromDsv,

  isExtraTaskSolved
};
