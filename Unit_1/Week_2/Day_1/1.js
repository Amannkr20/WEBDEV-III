const process = require('process');
// function add(x, y){
//     console.log(x+y);
// }
// add(1,2);

const arguments= process.argv;
console.log(arguments);
const operation= arguments[2];
const a=+ arguments[3];
const b=+ arguments[4];
console.log(operation, a, b);
function add(x, y){
    console.log(x+y);
}
function sub(x, y){
    console.log(x-y);
}
add(a, b);
sub(a, b);