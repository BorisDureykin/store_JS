"use strict";
let input = document.getElementById('input'), // ввод/вывод
  number = document.querySelectorAll('.numbers div'), // number buttons
  operator = document.querySelectorAll('.operators div'), // operator buttons
  result = document.getElementById('result'), // result button
  clear = document.getElementById('clear'), // clear button
  clear1 = document.getElementById('clear1'),// <- button
  sign = document.getElementById('sign'),// +- button
  resultDisplayed = false; // flag to keep an eye on what output is displayed

// добавление обработчиков щелчков к цифровым кнопкам
for (let i = 0; i < number.length; i++) {
  number[i].addEventListener("click", function(e) {

    // сохранение текущей входной строки и ее последнего символа в переменных - используется позже
    let currentString = input.innerHTML;
    let lastChar = currentString[currentString.length - 1];

    // если результат не отображается, просто продолжайте добавлять
    if (resultDisplayed === false) {
      input.innerHTML += e.target.innerHTML;
    } else if (resultDisplayed === true && lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷"|| lastChar === "%" || lastChar === "√" || lastChar === "²" || lastChar == "³") {
      // если в данный момент отображается результат и пользователь нажал кнопку оператора
      // нам нужно продолжать добавлять к строке для следующей операции
      resultDisplayed = false;
      input.innerHTML += e.target.innerHTML;
    } else {
      // если в данный момент отображается результат и пользователь нажал цифру
      // нам нужно очистить строку ввода и добавить новые входные данные, чтобы начать новую операцию
      resultDisplayed = false;
      input.innerHTML = "";
      input.innerHTML += e.target.innerHTML;
    }

  });
}

// добавление обработчиков щелчков к кнопкам операторов
for (let i = 0; i < operator.length; i++) {
  operator[i].addEventListener("click", function(e) {

    // сохранение текущей входной строки и ее последнего символа в переменных - используется позже
    let currentString = input.innerHTML;
    let lastChar = currentString[currentString.length - 1];

    // если последний введенный символ является оператором, замените его на нажатый в данный момент
    // || lastChar === "%"|| lastChar === "√" || lastChar === "²" || lastChar == "³"
    if (lastChar === "+" || lastChar === "-" || lastChar === "×" || lastChar === "÷"  ) {
      let newString = currentString.substring(0, currentString.length - 1) + e.target.innerHTML;
      input.innerHTML = newString;
    } else if (currentString.length == 0) {
      // если первая нажатая клавиша является оператором, ничего не делайте
      console.log("enter a number first");
    } else {
      // в противном случае просто добавьте нажатый оператор ко входным данным
      input.innerHTML += e.target.innerHTML;
    }

  });
}
// функция вычисления операторов
function calculation() {

      // это строка, которую мы будем обрабатывать,
      let inputString = input.innerHTML;

      // формируем массив чисел.
      let numbers = inputString.split(/\+|\-|\×|\÷|\%|\√|\²|\³/g);
      // формирование массива операторов
      // сначала мы заменяем все цифры и точку пустой строкой, а затем разделяем
      let operators = inputString.replace(/[0-9]|\./g, "").split("");

      console.log(inputString);
      console.log(operators);
      console.log(numbers);

      // теперь мы зацикливаемся на массиве и выполняем по одной операции за раз.
      // сначала разделите, затем умножьте, затем вычитание, а затем сложение
      // по мере продвижения мы изменяем исходный массив чисел и операторов
      // последним элементом, оставшимся в массиве, будет выходной


       let radic = operators.indexOf("√");
      while (radic != -1) {
        numbers.splice(radic, 2, Math.sqrt(numbers[radic]));
        operators.splice(radic, 1);
        radic = operators.indexOf("√");
      };
         let exponent2 = operators.indexOf("²");
      while (exponent2 != -1) {
        numbers.splice(exponent2, 2, Math.pow(numbers[exponent2], 2));
        operators.splice(exponent2, 1);
        exponent2 = operators.indexOf("²");
      };
       let exponent3 = operators.indexOf("³");
      while (exponent3 != -1) {
        numbers.splice(exponent3, 2, Math.pow(numbers[exponent3], 3));
        operators.splice(exponent3, 1);
        exponent3 = operators.indexOf("³");
      };

     let divide = operators.indexOf("÷");
      while (divide != -1) {
        numbers.splice(divide, 2, numbers[divide] / numbers[divide + 1]);
        operators.splice(divide, 1);
        divide = operators.indexOf("÷");
      };

      let multiply = operators.indexOf("×");
      while (multiply != -1) {
        numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]);
        operators.splice(multiply, 1);
        multiply = operators.indexOf("×");
      };

      let subtract = operators.indexOf("-");
      while (subtract != -1) {
        numbers.splice(subtract, 2, numbers[subtract] - numbers[subtract + 1]);
        operators.splice(subtract, 1);
        subtract = operators.indexOf("-");
      };

      let add = operators.indexOf("+");
      while (add != -1) {
        // необходимо использовать parseFloat, иначе это приведет к конкатенации строк :)
        numbers.splice(add, 2, parseFloat(numbers[add]) + parseFloat(numbers[add + 1]));
        operators.splice(add, 1);
        add = operators.indexOf("+");
      };


      input.innerHTML = numbers[0]; // отображение выходных данных

      resultDisplayed = true; // флажок поворота, если отображается результат
}


// при нажатии кнопки "%"
resultPercent.addEventListener("click", function() {

      let inputString = input.innerHTML;
      let numbers = inputString.split(/\+|\-|\×|\÷|\%|\√|\²|\³/g);
      let operators = inputString.replace(/[0-9]|\./g, "").split("");

      console.log(inputString);
      console.log(operators);
      console.log(operators[0])
      console.log(numbers);

    if (operators[0]==("×")){
          let multiply = operators.indexOf("×");
          while (multiply != -1) {
            numbers.splice(multiply, 2, numbers[multiply] * numbers[multiply + 1]/100);
            operators.splice(multiply, 1);
            multiply = operators.indexOf("×");
          };
        };
    if (operators[0]==("-")){
          let subtract = operators.indexOf("-");
          while (subtract != -1) {
            numbers.splice(subtract, 2, (numbers[subtract] - (numbers[subtract]*numbers[subtract + 1]/100)));
            operators.splice(subtract, 1);
            subtract = operators.indexOf("-");
          };
        };
    if (operators[0]==("+")){
              let add = operators.indexOf("+");
              while (add != -1) {
                numbers.splice(add, 2, (parseFloat(numbers[add]) + (parseFloat(numbers[add])*(parseFloat(numbers[add + 1])/100))));
                operators.splice(add, 1);
                add = operators.indexOf("+");
              };
        };
    if (operators[0]==("÷")){
              let divide = operators.indexOf("÷");
              while (divide != -1) {
                numbers.splice(divide, 2, (numbers[divide] / (numbers[divide]*numbers[divide + 1]/100)));
                operators.splice(divide, 1);
                divide = operators.indexOf("÷");
              };
        };


    input.innerHTML = numbers[0];

    resultDisplayed = true;
});

//// при нажатии кнопки "√"
//resultRadic.addEventListener("click", calculation);
//
//// при нажатии кнопки "²"
//resultExponent2.addEventListener("click", calculation);
//
//// при нажатии кнопки "³"
//resultExponent3.addEventListener("click", calculation);

// при нажатии кнопки "равно"
result.addEventListener("click", calculation);

// очистка входных данных при нажатии кнопки очистить
clear.addEventListener("click", function() {
    input.innerHTML = "";
});
// очистка данных по 1 знаку при нажатии кнопки <-
clear1.addEventListener("click", function() {
    let str = input.innerHTML;
    str = str.slice(0, -1);
    input.innerHTML = str;
});
// изменение знака введенного числа
sign.addEventListener("click", function() {
    let str = input.innerHTML;
    str *=-1;
    input.innerHTML = str;
});
