const all_buts = document.querySelectorAll('.but');
const display = document.querySelector('.display');
const dis_operator = document.querySelector('.operator');

const operations = document.querySelectorAll('.operation');

// Проверка, нажималась ли точка-разделитель, чтобы нельзя было нажать
// ее второй раз
let check_separ = false;

// Проверка, был ли нажат один из операторов, для сохранения первого
// значения и возможности ввода второго, с начала строки
let operator_active = false; 

let expression_1 = 0; // переменная для первого значения
let expression_2 = 0; // перменная для второго значения

// Переменная для сохранения оператора и передачи его в функцию
// подсчета результата
let operator_on_display = '';

// Проверка для оператора - первое нажатие или нет, для подсчета при
// нажатии на оператор
let first_operation = '';

// Проверка нажатия оператора - дальнейшие действия: ввод или подсчет
let set_expression = false;

//Функция добавления ЧИСЛА и точки на на дисплей
const num_click = (click_num_button) => {
    if (operator_active && click_num_button !== '.') {
        display.innerHTML = '';
        document.querySelector('.separator').innerHTML = '.';
        operator_active = false;
    } else if (operator_active && click_num_button === '.') {
        display.innerHTML = '0';
        document.querySelector('.separator').innerHTML = '.';
        operator_active = false;
    }
    if (display.textContent === '0' && click_num_button !== '.') {
        display.innerHTML = click_num_button;
    } else if (click_num_button === '.' || (display.textContent === '0' && click_num_button === '.')) {
        if (!check_separ) {
            document.querySelector('.separator').innerHTML = '';
            display.append('.');
        }
        check_separ = true;
    } else {
        display.append(click_num_button);
    }
    set_expression = false;
}

//Функция подсчета резульата, в зависимовти от оператора
const count_result = (first, oper, second = expression_2) => {
    switch (oper) {
        case '+':
            return first + second;
        case '−':
            return first - second;
        case '÷':
            return first / second;
        case '×':
            return first * second;
    }
}

//функция подсчета и вывода результата при использовании знака операции
const display_operator = (click_operator_button) => {
    dis_operator.innerHTML = click_operator_button;
    operator_on_display = click_operator_button;
    if (!first_operation || first_operation === '=' || first_operation === '%') {
        expression_1 = Number(display.textContent);
        first_operation = click_operator_button;
    } else if (set_expression) {
        display.innerHTML = String(expression_1);
        first_operation = click_operator_button;
    } else {
        expression_1 = count_result(expression_1, first_operation, Number(display.textContent))
        first_operation = click_operator_button;
    }
    if (click_operator_button === '√') {
        expression_1 = Math.sqrt(expression_1);
        chek_float_result(expression_1);
    }
    display.innerHTML = String(expression_1);
    set_expression = true;
    operator_active = true;
    check_separ = false;
}

const chek_float_result = (total_result) => {
    if (String(total_result).includes('.')) {
        document.querySelector('.separator').innerHTML = '';
    }
}

const get_result = () => {
    dis_operator.innerHTML = '=';
    expression_2 = Number(display.textContent);
    first_operation = '=';
    let total_result = count_result(expression_1, operator_on_display, expression_2);
    if (operator_on_display && operator_on_display !== '√') {
        display.innerHTML = String(total_result);
        chek_float_result(total_result);
    }
    operator_active = true;
}

//Работа кнопки СБРОСА
const reset = () => {
    display.textContent = '0';
    document.querySelector('.separator').innerHTML = '.';
    dis_operator.textContent = ''; 
    check_separ = false;
    operator_active = false;
    expression_1 = expression_2 = 0;
    first_operation = '';
}

//Работа кнопки УДАЛЕНИЯ символа
const backspace = () => {
    if (display.textContent.length > 1) {
        display.textContent = display.textContent.slice(0, -1);
        if (display.textContent[display.textContent.length - 1] === '.') {
            document.querySelector('.separator').innerHTML = '.';
            display.textContent = display.textContent.slice(0, -1);
            check_separ = false;
        }
    } else {
        display.textContent = '0';
        document.querySelector('.separator').innerHTML = '.';
    }
}

//работа кнопки подсчета ПРОЦЕНТОВ
const get_percentage = () => {
    if (expression_1 !== 0) {
        dis_operator.innerHTML = '%';
        if (operator_on_display === '×' || operator_on_display === '÷') {
            expression_2 = Number(display.textContent) / 100;
            console.log(expression_2);
        } else {
            expression_2 = expression_1 * Number(display.textContent) / 100;
        }
        console.log(expression_1, operator_on_display, expression_2);
        let total_result = count_result(expression_1, operator_on_display, expression_2);
        first_operation = '%';
        display.innerHTML = String(total_result);
        chek_float_result(total_result);
        operator_active = true;
    }
}

//Функция обработки нажатия на кнопку калькулятора
const get_number = (push_button) => {
    //проверяем КЛИК мыши
    switch(true) {
        case push_button.classList.contains('num'):
            push_button.onclick = () => num_click(push_button.textContent);
            break;
        case push_button.classList.contains('operation'):
            push_button.onclick = () => display_operator(push_button.textContent);
            break;
        case push_button.classList.contains('percentage'):
            push_button.onclick = () => get_percentage();
            break;
        case push_button.classList.contains('reset'):
            push_button.onclick = () => reset();
            break;
        case push_button.classList.contains('backspace'):
            push_button.onclick = () => backspace();
            break;
        case push_button.classList.contains('result'):
            push_button.onclick = () => get_result();
            break;
    }
    
    //Проверяем нажите кнопки на клавиатуре
    document.onkeydown = (event) => {
        for (let i = 0; i < all_buts.length; i++) {
            switch(event.key) {
                case 'Backspace':
                    document.querySelector('.backspace').classList.add('num_active');
                    break;
                case 'Enter':
                    document.querySelector('.result').classList.add('num_active');
                    break;
                case 'Escape':
                    document.querySelector('.reset').classList.add('num_active');
                    break;
                case '-':
                    document.querySelector('.sub').classList.add('num_active');
                    break;
                case '/':
                    document.querySelector('.div').classList.add('num_active');
                    break;
                case '*':
                    document.querySelector('.mul').classList.add('num_active');
                    break;
                case all_buts[i].textContent:
                    all_buts[i].classList.add('num_active');
                    break;
            }
        }
        if (event.key === '.' || Number(event.key) >= 0 && Number(event.key) < 10 && event.key !== ' ') {
            num_click(event.key);
        }
        switch(event.key) {
            case '/':
                display_operator('÷');
                break;
            case '*':
                display_operator('×');
                break;
            case '-':
                display_operator('−');
                break;
            case '+':
                display_operator(event.key);
                break;
            case '%':
                get_percentage();
                break;
            case 'Escape':
                reset();
                break;
            case 'Backspace':
                backspace();
                break;        
            case 'Enter':
            case '=':
                get_result();
                break;        
            }
    
    }
    document.onkeyup = () => {
        for (let i = 0; i < all_buts.length; i++) {
            all_buts[i].classList.remove('num_active');
        }
    }
}

for (let i = 0; i < all_buts.length; i++) {
    get_number(all_buts[i]);
}

