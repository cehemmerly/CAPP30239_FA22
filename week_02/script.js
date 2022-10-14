/*
This is a javascript exapme for week 2
*/

// inline comment

let num = 100; //inline

function foo(){
    let num2 = 200
    console.log(num)
}; //optional semicolon

// console.log(num2) //error in dev tool, out of scoppe

foo();

// let anonFun = function(){
//     console.log('hello');
// }; //anonymous function

let anonFun = () => console.log('hello') //shortened format, arrow function

(function() {
    console.log('hi')
})(); //will automatically run - immediately invoked //i think only works without other code around it

let person = 'Summer';

function people(peopleName){
    console.log('hello ' + peopleName);
};

people(person);

let arr = ["foo", 123, ['subarray', 'bar']]

console.log(arr[1]);

arr[1] = 'barbar'

console.log(arr[1]);

arr.push('car'); //append in python

arr.splice(2, 1); //removes items from array (index, count) 

for (let item of arr) {
    console.log(item);
} // prints each item

for (let i in arr) {
    console.log(i + ' ' + arr[i])
} //prints index and item at index

// 'of' gets item, 'in' gets index

arr.forEach((item, i) => console.log(i + ' ' + item)); // does same as above

//json
let obj1 = {
    name: 'Jill',
    age: 85,
    job: "Cactus Hunter",
    'also this': 'works too'
};

//access things in json
console.log(obj1.name);
console.log(obj1['name'])
console.log(obj1['also this'])

obj1.job = 'Barista'
console.log(obj1.job)

for (let key in obj1){
    let value = obj1[key]
    console.log(`${key}: ${value}`) // string literal
}

for (let i = 0; i<10; i++) { //set i as 0, while i is less than 10, do the thing, add 1 to i
    console.log(i);
}

let x = 75;
if (x>50) {
    console.log('above avg')
} else if (x>5){
    console.log('below avg')
} else {
    console.log('really bad')
}

// ternary operator 
let y = (x > 50) ? 'above avg':'below avg'; //condition ? if true : if false

console.log(y)

//traverse DOM
let example = document.getElementById('example'); //document is key word in javascript, searching html to get divs w/ id example 
//will only search for things in html file above where the script is being called
//document is referencing the html document that calls the script file, so multiple html files can call this script
example.innerHTML += 'Hellow  world!' //will print on webpage