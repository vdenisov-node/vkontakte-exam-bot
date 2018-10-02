function pick(list) {

  return list[ parseInt(Math.random() * list.length) ];

}

// ######################### //

if (require.main === module) {

  arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  console.log(
    `\nRandom data list -> ${ JSON.stringify(arr) }` +
    `\nRandom element -> "${ pick(arr) }"\n`);

}

module.exports = { pick };
