'use strict';

function applyMarriageFilter(friends, filter, maxLevel = Infinity) {
  const bestFriends = friends.filter(friend => friend.best);
  const queue = [bestFriends];
  const invited = new Set();
  let level = 0;
  while (level < maxLevel && queue.length > 0) {
    const guests = queue.shift();
    const following = [];
    guests
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(function(person) {
        if (!invited.has(person)) {
          invited.add(person);

          person.friends.forEach(name => following.push(friends.find(p => p.name === name)));
        }
      });

    if (following.length > 0) {
      queue.push(following);
    }

    ++level;
  }

  return [...invited].filter(filter.isSuitable);
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 */
function Iterator(friends, filter) {
  if (!(filter instanceof Filter)) {
    throw new TypeError('filter must be instance of Filter');
  }

  this.set = applyMarriageFilter(friends, filter);

  this.position = 0;

  this.done = () => this.position === this.set.length;
  this.next = () => (this.done() ? null : this.set[this.position++]);
}

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 * @param {Number} maxLevel Максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
  Iterator.call(this, friends, filter);
  this.set = applyMarriageFilter(friends, filter, maxLevel);
}
LimitedIterator.prototype = Object.create(Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
  this.isSuitable = () => true;
}

/**
 * Фильтр друзей-парней
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
  this.isSuitable = friend => friend.gender === 'male';
}
MaleFilter.prototype = Object.create(Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
  this.isSuitable = friend => friend.gender === 'female';
}
FemaleFilter.prototype = Object.create(Filter.prototype);

module.exports = {
  Iterator,
  Filter,
  LimitedIterator,
  MaleFilter,
  FemaleFilter
};
