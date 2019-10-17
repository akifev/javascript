'use strict';

function isNumber(a) {
  return typeof a === 'number';
}

function isString(a) {
  return typeof a === 'string';
}

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
  if (!isNumber(a) || !isNumber(b)) {
    throw new TypeError("Expected types 'Number'");
  }
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new RangeError("Expected types 'Integer'");
  }
  return a + b;
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
  if (!isNumber(year)) {
    throw new TypeError("Expected type 'Number'");
  }
  if (!Number.isInteger(year)) {
    throw new RangeError("Expected type 'Integer'");
  }
  if (year < 0) {
    throw new RangeError('Expected not-negative year');
  }
  return Math.ceil(year / 100);
}

/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
  if (!isString(hexColor)) {
    throw new TypeError("Expected type 'string'");
  }
  if (!/^#([A-F]|\d){6}$/i.test(hexColor)) {
    throw new RangeError("Expected 'HEX' string");
  }
  const red = parseInt(hexColor.substr(1, 2), 16);
  const green = parseInt(hexColor.substr(3, 2), 16);
  const blue = parseInt(hexColor.substr(5, 2), 16);
  return `(${red}, ${green}, ${blue})`;
}

/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
  if (!isNumber(n)) {
    throw new TypeError("Expected type 'number'");
  }
  if (!Number.isInteger(n)) {
    throw new RangeError("Expected type 'Integer'");
  }
  if (n <= 0) {
    throw new RangeError("Expected positive 'n'");
  }
  if (n === 1 || n === 2) {
    return 1;
  }
  let a = 1;
  let b = 1;
  for (let i = 3; i <= n; i++) {
    const c = b;
    b = a + b;
    a = c;
  }
  return b;
}

/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
  if (!Array.isArray(matrix) || matrix.length === 0 || !Array.isArray(matrix[0])) {
    throw TypeError('Expected NxM matrix');
  }
  const n = matrix.length;
  const m = matrix[0].length;
  let checkMatrix = true;
  for (let i = 0; i < n; i++) {
    if (!Array.isArray(matrix[i]) || matrix[i].length !== m) {
      checkMatrix = false;
      break;
    }
  }
  if (checkMatrix) {
    const matrixT = [];
    for (let i = 0; i < m; i++) {
      const line = [];
      for (let j = 0; j < n; j++) {
        line.push(matrix[j][i]);
      }
      matrixT.push(line);
    }
    return matrixT;
  } else {
    throw new TypeError('Expected NxM matrix');
  }
}

/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
  if (!isNumber(n) || !isNumber(targetNs)) {
    throw new TypeError("Excpected types 'number'");
  }
  if (!Number.isInteger(targetNs)) {
    throw new TypeError("Excpected target base type 'Integer'");
  }
  if (targetNs < 2 || targetNs > 36) {
    throw new RangeError('Excpected target base in range [2, 36]');
  }
  return n.toString(targetNs);
}

/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
  if (typeof phoneNumber !== 'string') {
    throw new TypeError("Expected type 'String'");
  }
  return /^8-800-\d{3}-\d{2}-\d{2}$/.test(phoneNumber);
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
  if (typeof text !== 'string') {
    throw new TypeError("Expected type 'String'");
  }
  const mathed = text.match(/(:-\))|(\(-:)/g);
  return mathed !== null ? mathed.length : 0;
}

/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
  const FIELD_SIZE = 3;
  const fieldT = [];
  for (let i = 0; i < FIELD_SIZE; i++) {
    const line = [];
    for (let j = 0; j < FIELD_SIZE; j++) {
      line.push(field[j][FIELD_SIZE - i - 1]);
    }
    fieldT.push(line);
  }
  const isWin = function(c) {
    let acceptDiag = true;
    let acceptDiagT = true;
    for (let i = 0; i < FIELD_SIZE; i++) {
      if (field[i][i] !== c) acceptDiag = false;
      if (fieldT[i][i] !== c) acceptDiagT = false;
      let acceptLine = true;
      let acceptLineT = true;
      for (let j = 0; j < FIELD_SIZE; j++) {
        if (!acceptLine && !acceptLineT) break;
        if (field[i][j] !== c) acceptLine = false;
        if (fieldT[i][j] !== c) acceptLineT = false;
      }
      if (acceptLine || acceptLineT) return true;
    }
    return acceptDiag || acceptDiagT;
  };
  let result = 0;
  if (isWin('x')) result++;
  if (isWin('o')) result--;
  return result === 0 ? 'draw' : result === 1 ? 'x' : 'o';
}

module.exports = {
  abProblem,
  centuryByYearProblem,
  colorsProblem,
  fibonacciProblem,
  matrixProblem,
  numberSystemProblem,
  phoneProblem,
  smilesProblem,
  ticTacToeProblem
};
