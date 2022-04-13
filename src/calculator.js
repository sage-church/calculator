// TODO: '+/-' on long decimal reduces decimal points
// todo: make screen slightly wider
// TODO: README
// TODO: License


import './calculator.css'
import Screen from './screen';
import ButtonBox from './button-box';
import React, {useState} from 'react';
import handleResult from './result';

export default function Calculator () {

    const [displayValue, setDisplayValue] = useState('');
    const [runningEquation, setRunningEquation] = useState('');
    const [wasEqualsSignLastClick, setWasEqualsSignLastClick] = useState(false);

    function handleInputChange (e) {

        const buttonValue = e.target.textContent;
        let newDisplayValue = displayValue.replace(/,/g, ''),
            newRunningEquation = runningEquation,
            lastCharOfEquation = runningEquation.slice(-1),
            indexOfNumAtEndOfEquation = newRunningEquation.lastIndexOf(newDisplayValue),
            newWasEqualsSignLastClick = wasEqualsSignLastClick,
            indexOfDecimal;      

        function multiplyByNegativeOne (numberString) {
          numberString = (numberString * -1).toString();
          return numberString;
        }

        function removeLastCharacter (string) {
            string = string.slice(0, -1);
            return string;
        }

        function removeLastNumOfEquation (string) {
            string = string.slice(0, indexOfNumAtEndOfEquation);
            return string;
        }

        function removeLastParenthesizedNum (string) {
            string = string.slice(0, indexOfNumAtEndOfEquation - 1);
            return string;
        }

        function findIndexOfDecimal (string) {
            let index = string.indexOf('.');
            return index;
        }

        function toScientificNotation (numberString) {
            let result = Number(numberString).toExponential(7);
            return result;
        }

        function roundResult (numberString, indexOfDecimal) {
            let digitsBeforeDecimal = numberString.slice(0, indexOfDecimal);
            let numOfDigitsBeforeDecimal = digitsBeforeDecimal.length;
            let number = Number(numberString);

            for (let i = 1, x = 10; i < 12; i++, x--) {
                if (i === numOfDigitsBeforeDecimal) {
                    let roundedNum = number.toFixed(x);
                    let roundedString = roundedNum.toString();
                    return roundedString;
                }
            }
        }
        
        // if there are currently no numbers displayed, last input was invalid, or last result was 
        // higher than JS infinity), run this switch
        if (!displayValue || displayValue === 'Invalid input' || displayValue === '>1.79769e+308') {
            switch (buttonValue) {
                case '+/-':
                case '^':
                case '/':
                case '*':
                case '+':
                case '-':
                case '=':
                    break;
                case 'C':
                    newDisplayValue = '';
                    break;
                default:
                    newDisplayValue = newRunningEquation = buttonValue;
            }
        } else if (newDisplayValue.indexOf('e') !== -1) {
            switch(buttonValue) {
                case '+/-':
                case '^':
                case '/':
                case '*':
                case '+':
                case '-':
                case '=':
                    break;
                case 'C':
                    newDisplayValue = '';
                    break;
                default:
                    newDisplayValue = newRunningEquation = buttonValue;
            }
        } else if (wasEqualsSignLastClick) {
            switch (buttonValue) {
                case '+/-':
                    newRunningEquation = multiplyByNegativeOne(newRunningEquation);
                    newDisplayValue = multiplyByNegativeOne(newDisplayValue);
                    break;
                case '^':
                    newRunningEquation += '**';
                    break;
                case '/':
                    newRunningEquation += '/';
                    break;
                case '*':
                    newRunningEquation += '*';
                    break;
                case '+':
                    newRunningEquation += '+';
                    break;
                case '-':
                    newRunningEquation += '-';
                    break;
                case '=':
                    break;
                case 'C':
                    newDisplayValue = '';
                    newRunningEquation = '';
                    break;
                default:
                    newDisplayValue = buttonValue;
                    newRunningEquation = buttonValue;
            }
        } else {
            // If the last character of the running equation is NOT an integer, run this switch. 
            // Need to check for 0 since Number('0') would return 0 and be treated as false
            if (!Number(lastCharOfEquation) && lastCharOfEquation !== '0') {
                switch (buttonValue) {
                    case 'C':
                        newDisplayValue = '';
                        newRunningEquation = '';
                        break;
                    case '+/-':
                        if (newDisplayValue === '0' || newDisplayValue === '0.') {
                            return;
                        } else if (lastCharOfEquation === '.' && removeLastCharacter(newDisplayValue)) {

                            if (indexOfNumAtEndOfEquation === 0) {

                                newRunningEquation = multiplyByNegativeOne(newDisplayValue) + '.';
                                newDisplayValue = multiplyByNegativeOne(newDisplayValue) + '.';

                            } else {
                                // The following adds parentheses around a negative number in the running equation. This
                                // prevents situation like '2--3**4' occurring. eval() cannot compute when two 
                                // negative symbols preceed '**'. Alternatively, it will show '2-(-3)**4'
                                newRunningEquation = removeLastNumOfEquation(newRunningEquation) +
                                    '(' + multiplyByNegativeOne(newDisplayValue) + '.' + ')';
    
                                newDisplayValue = multiplyByNegativeOne(newDisplayValue) + '.'; 
                            }

                        } else if (lastCharOfEquation === ')' && newDisplayValue.slice(-1) !== '.') {

                            
                            newRunningEquation = removeLastParenthesizedNum(newRunningEquation) +
                                multiplyByNegativeOne(newDisplayValue);
                            newDisplayValue = multiplyByNegativeOne(newDisplayValue);

                        } else if (lastCharOfEquation === ')') {

                            newRunningEquation = removeLastParenthesizedNum(newRunningEquation) +
                            multiplyByNegativeOne(newDisplayValue) + '.';
                            newDisplayValue = multiplyByNegativeOne(newDisplayValue) + '.';

                        }

                        break;
                    case '^': 
                        if (lastCharOfEquation === '.' && removeLastCharacter(newDisplayValue)) {

                            // The following adds parentheses around a negative number in the running equation. This
                            // prevents situation like '2--3**4' occurring. eval() cannot compute when two 
                            // negative symbols preceed '**'. Alternatively, it will show '2-(-3)**4'
                            newRunningEquation = removeLastNumOfEquation(newRunningEquation) + '(' +
                                removeLastCharacter(newDisplayValue) + ')' + '**';
                            newDisplayValue = removeLastCharacter(newDisplayValue);

                        } else if (newDisplayValue === '.') {

                            newDisplayValue = '0';
                            newRunningEquation = removeLastNumOfEquation(newRunningEquation) + '0'
                                + '**';

                        } 
                        else if (lastCharOfEquation === ')' && newDisplayValue.slice(-1) === '.') {

                            newDisplayValue = removeLastCharacter(newDisplayValue);
                            newRunningEquation = removeLastParenthesizedNum(newRunningEquation) +
                                '(' + newDisplayValue + ')' + '**'; 

                        } else if (lastCharOfEquation === ')') {
                            newRunningEquation += '**';
                        }
                        break;
                    case '/':
                    case '*':
                    case '+':
                    case '-':
                        if (lastCharOfEquation === '.') {
                            
                            if (removeLastCharacter(newDisplayValue)) {
                                newDisplayValue = removeLastCharacter(newDisplayValue);
                                newRunningEquation = removeLastCharacter(newRunningEquation) + buttonValue;
                            } else {
                                newDisplayValue = '0'
                                newRunningEquation = removeLastCharacter(newRunningEquation) + newDisplayValue
                                     + buttonValue;
                            }
                        } else if (lastCharOfEquation === ')'){
                            newRunningEquation += buttonValue;
                        }
                        break;
                    case '.':
                        if (lastCharOfEquation === '.') {
                            return;
                        } else if (lastCharOfEquation === ')' && newDisplayValue.indexOf('.') === -1) {

                            newRunningEquation = removeLastParenthesizedNum(newRunningEquation) + 
                                '(' + newDisplayValue + buttonValue + ')';
                            newDisplayValue += buttonValue;

                        } else if (lastCharOfEquation !== ')') {
                            newDisplayValue = buttonValue;
                            newRunningEquation += buttonValue;
                        }
                        break;
                    case '=':

                        if (newDisplayValue === '.') {

                            let equationToEval = removeLastCharacter(newRunningEquation) + '0';
                            let result = eval(equationToEval).toString();
                            indexOfDecimal = findIndexOfDecimal(result);

                            newRunningEquation = newDisplayValue = handleResult (
                                result, indexOfDecimal, roundResult, toScientificNotation
                            );

                        } else if (lastCharOfEquation === '.') {

                            let equationToEval = removeLastNumOfEquation(newRunningEquation) + 
                                removeLastCharacter(newDisplayValue);
                            let result = eval(equationToEval).toString();
                            indexOfDecimal = findIndexOfDecimal(result);
    
                            newRunningEquation = newDisplayValue = handleResult (
                                result, indexOfDecimal, roundResult, toScientificNotation
                            );
                            
                        } else if (lastCharOfEquation === ')') {

                            let result = eval(newRunningEquation).toString();
                            indexOfDecimal = findIndexOfDecimal(result);

                            newRunningEquation = newDisplayValue = handleResult (
                                result, indexOfDecimal, roundResult, toScientificNotation
                            );

                        } else {
                            newDisplayValue = 'Invalid input';
                            newRunningEquation = '';
                        }
                        break; 
                    default:
                        if (lastCharOfEquation === '.') {
                            newDisplayValue += buttonValue;
                            newRunningEquation += buttonValue;
                        } else if (lastCharOfEquation === ')') {

                            newRunningEquation = removeLastParenthesizedNum(newRunningEquation) + 
                                '(' + newDisplayValue + buttonValue + ')'; 
                            newDisplayValue += buttonValue;

                        } else {
                            newDisplayValue = buttonValue;
                            newRunningEquation += buttonValue;
                        }
                }
            // if the last character of the running equation IS a number, run this switch
            } else {
                switch (buttonValue) {
                    case 'C':
                        newDisplayValue = '';
                        newRunningEquation = '';
                        break;
                    case '+/-':
                            if (indexOfNumAtEndOfEquation === 0) {
                                newRunningEquation = multiplyByNegativeOne(newRunningEquation);
                            } else if (newDisplayValue !== '0' && newDisplayValue !== '0.') {

                            // The following adds parentheses around a negative number in the running equation. This
                            // prevents situation like '2--3**4' occurring. eval() cannot compute when two 
                            // negative symbols preceed '**'. Alternatively, it will show '2-(-3)**4'
                                newRunningEquation = removeLastNumOfEquation(newRunningEquation) + 
                                    '(' + multiplyByNegativeOne(newDisplayValue) + ')';
                            }
                            newDisplayValue = multiplyByNegativeOne(newDisplayValue);
                            
                        break;
                    case '^': 
                        // The following adds parentheses around a negative number in the running equation. This
                        // prevents situation like '2--3**4' occurring. eval() cannot compute when two 
                        // negative symbols preceed '**'. Alternatively, it will show '2-(-3)**4'
                        if (newDisplayValue[0] === '-') {
                            newRunningEquation = removeLastNumOfEquation(newRunningEquation) + '('
                                + newDisplayValue + ')' + '**';
                        } else {
                            newRunningEquation += '**'
                        }
                        break;
                    case '/':
                        newRunningEquation += '/'
                        break;
                    case '*':
                        newRunningEquation += '*'
                        break;
                    case '+':
                        newRunningEquation += '+'
                        break;
                    case '-':
                        newRunningEquation += '-'
                        break;
                    case '=':
                        let result = eval(newRunningEquation).toString();
                        indexOfDecimal = findIndexOfDecimal(result);

                        newRunningEquation = newDisplayValue = handleResult (
                            result, indexOfDecimal, roundResult, toScientificNotation
                        );

                        break;
                    case '.':
                        if (newDisplayValue.indexOf('.') === -1) {
                            newDisplayValue += buttonValue;
                            newRunningEquation += buttonValue;
                        }
                        break;
                    case '0':
                        if (lastCharOfEquation !== '0' || newDisplayValue.length !== 1) {
                            newDisplayValue += buttonValue;
                            newRunningEquation += buttonValue;
                        }
                        break;
                    default:
                        if (newDisplayValue === '0') {
                            newDisplayValue = buttonValue;
                            newRunningEquation = removeLastCharacter(newRunningEquation) + buttonValue;
                        } else {
                            newDisplayValue += buttonValue;
                            newRunningEquation += buttonValue;
                        }
                        
                }
            }
        }

        let indexOfE = newDisplayValue.indexOf('e');
        indexOfDecimal = findIndexOfDecimal(newDisplayValue);

        if (newRunningEquation === 'Infinity') {

            newDisplayValue = '>1.79769e+308';

        } else if (indexOfDecimal === -1) {

            let resultWithCommas = newDisplayValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            newDisplayValue = resultWithCommas;

        } else if (indexOfE === -1) {

            let numsBeforeDecimal = newDisplayValue.slice(0, indexOfDecimal);
            let numsBeforeDecimalWithCommas = numsBeforeDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            let resultWithCommas = numsBeforeDecimalWithCommas + newDisplayValue.slice(indexOfDecimal);
            newDisplayValue = resultWithCommas;
        }

        if (buttonValue === '=') {
            newWasEqualsSignLastClick = true;
        } else {
            newWasEqualsSignLastClick = false;
        } 
        
        setDisplayValue(newDisplayValue);
        setRunningEquation(newRunningEquation);
        setWasEqualsSignLastClick(newWasEqualsSignLastClick);

        console.log(newRunningEquation);

    }

    return (
        <div id='outline'>
            <Screen value={displayValue}/>
            <ButtonBox onClick={handleInputChange}/>
        </div>
    )
}