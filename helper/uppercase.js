'use strict'

// fn to uppercase firstLetter and lowercase the rest

const capitalize = str => str[0].toUpperCase() + str.substring(1).toLowerCase();

module.exports = { capitalize };
