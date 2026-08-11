//  process input module 

const process = require('process');
console.log(process.argv);

// Output:
// Node.js v24.11.0
// (base) bhavya@Bhavyas-MacBook-Pro Web_Dev_3 % node '/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Unit_1/Week_1/Day_3/2.js'
// [
//   '/usr/local/bin/node',
//   '/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Unit_1/Week_1/Day_3/2.js'
// ]
// (base) bhavya@Bhavyas-MacBook-Pro Web_Dev_3 % node '/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Unit_1/Week_1/Day_3/2.js' hello world 1 2 3 
// [
//   '/usr/local/bin/node',
//   '/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Unit_1/Week_1/Day_3/2.js',
//   'hello',
//   'world',
//   '1',
//   '2',
//   '3'

console.log(process.env);
