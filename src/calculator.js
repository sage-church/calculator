// TODO: README
// TODO: License
// todo: can't do equations like (-243)**.2


import './calculator.css'
import Screen from './screen';
import ButtonBox from './button-box';
import React, {useState} from 'react';
import handleResult from './result';

export default function Calculator () {

    const emptyString = '';
    const [displayValue, setDisplayValue] = useState(emptyString);
    const [runningEquation, setRunningEquation] = useState(emptyString);
    const [wasEqualsSignLastClick, setWasEqualsSignLastClick] = useState(false);

    function handleInputChange (e) {

        const buttonValue = e.target.textContent,
              capitalC = 'C',
              plusMinus = '+/-',
              powerCarrot = '^',
              forwardSlash = '/',
              asterisk = '*',
              plus = '+',
              minus = '-',
              decimal = '.',
              equals = '=',
              powerAsterisks = '**',
              openingParenthesis = '(',
              closingParenthesis = ')';

        let newDisplayValue = displayValue.replace(/,/g, emptyString),
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
            let index = string.indexOf(decimal);
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
                case plusMinus:
                case powerCarrot:
                case forwardSlash:
                case asterisk:
                case plus:
                case minus:
                case equals:
                    break;
                case capitalC:
                    newDisplayValue = newRunningEquation = emptyString;
                    break;
                default:
                    newDisplayValue = newRunningEquation = buttonValue;
            }
        } else if (newDisplayValue.indexOf('e') !== -1) {
            switch(buttonValue) {
                case plusMinus:
                case powerCarrot:
                case forwardSlash:
                case asterisk:
                case plus:
                case minus:
                case equals:
                    break;
                case capitalC:
                    newDisplayValue = emptyString;
                    break;
                default:
                    newDisplayValue = newRunningEquation = buttonValue;
            }
        } else if (wasEqualsSignLastClick) {
            switch (buttonValue) {
                case plusMinus:
                    newRunningEquation = multiplyByNegativeOne(newRunningEquation);
                    newDisplayValue = multiplyByNegativeOne(newDisplayValue);
                    break;
                case powerCarrot:
                    newRunningEquation += powerAsterisks;
                    break;
                case forwardSlash:
                    newRunningEquation += forwardSlash;
                    break;
                case asterisk:
                    newRunningEquation += asterisk;
                    break;
                case plus:
                    newRunningEquation += plus;
                    break;
                case minus:
                    newRunningEquation += minus;
                    break;
                case equals:
                    break;
                case capitalC:
                    newDisplayValue = emptyString;
                    newRunningEquation = emptyString;
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
                    case capitalC:
                        newDisplayValue = emptyString;
                        newRunningEquation = emptyString;
                        break;
                    case plusMinus:
                        if (newDisplayValue === '0' || newDisplayValue === '0.') {
                            return;
                        } else if (lastCharOfEquation === decimal && removeLastCharacter(newDisplayValue)) {

                                // The following adds parentheses around a negative number in the running equation. This
                                // prevents situation like '2--3**4' occurring. eval() cannot compute when two 
                                // negative symbols preceed powerAsterisks. Alternatively, it will show '2-(-3)**4'
                                newRunningEquation = removeLastNumOfEquation(newRunningEquation) +
                                    openingParenthesis + multiplyByNegativeOne(newDisplayValue) + 
                                    decimal + closingParenthesis;
    
                                newDisplayValue = multiplyByNegativeOne(newDisplayValue) + decimal; 
                            

                        } else if (
                            lastCharOfEquation === closingParenthesis && 
                            newDisplayValue.slice(-1) !== decimal
                        ) {

                            newRunningEquation = removeLastParenthesizedNum(newRunningEquation) +
                                multiplyByNegativeOne(newDisplayValue);
                            newDisplayValue = multiplyByNegativeOne(newDisplayValue);

                        } else if (lastCharOfEquation === closingParenthesis) {

                            newRunningEquation = removeLastParenthesizedNum(newRunningEquation) +
                                multiplyByNegativeOne(newDisplayValue) + decimal;
                            newDisplayValue = multiplyByNegativeOne(newDisplayValue) + decimal;

                        }

                        break;
                    case powerCarrot: 
                        if (lastCharOfEquation === decimal && removeLastCharacter(newDisplayValue)) {

                            // The following adds parentheses around a negative number in the running equation. This
                            // prevents situation like '2--3**4' occurring. eval() cannot compute when two 
                            // negative symbols preceed powerAsterisks. Alternatively, it will show '2-(-3)**4'
                            newRunningEquation = removeLastNumOfEquation(newRunningEquation) + 
                                openingParenthesis + removeLastCharacter(newDisplayValue) + 
                                closingParenthesis + powerAsterisks;
                            newDisplayValue = removeLastCharacter(newDisplayValue);

                        } else if (newDisplayValue === decimal) {

                            newDisplayValue = '0';
                            newRunningEquation = removeLastNumOfEquation(newRunningEquation) + '0'
                                + powerAsterisks;

                        } 
                        else if (
                            lastCharOfEquation === closingParenthesis && 
                            newDisplayValue.slice(-1) === decimal
                            ) {

                            newDisplayValue = removeLastCharacter(newDisplayValue);
                            newRunningEquation = removeLastParenthesizedNum(newRunningEquation) +
                                openingParenthesis + newDisplayValue + closingParenthesis + powerAsterisks; 

                        } else if (lastCharOfEquation === closingParenthesis) {
                            newRunningEquation += powerAsterisks;
                        }
                        break;
                    case forwardSlash:
                    case asterisk:
                    case plus:
                    case minus:
                        if (lastCharOfEquation === decimal) {
                            
                            if (removeLastCharacter(newDisplayValue)) {
                                newDisplayValue = removeLastCharacter(newDisplayValue);
                                newRunningEquation = removeLastCharacter(newRunningEquation) + buttonValue;
                            } else {
                                newDisplayValue = '0'
                                newRunningEquation = removeLastCharacter(newRunningEquation) + newDisplayValue
                                     + buttonValue;
                            }
                        } else if (lastCharOfEquation === closingParenthesis){
                            newRunningEquation += buttonValue;
                        }
                        break;
                    case decimal:
                        if (lastCharOfEquation === decimal || newDisplayValue.length > 15) {
                            return;
                        } else if (
                            lastCharOfEquation === closingParenthesis && 
                            newDisplayValue.indexOf(decimal) === -1
                        ) {

                            newRunningEquation = removeLastParenthesizedNum(newRunningEquation) + 
                                openingParenthesis + newDisplayValue + buttonValue + closingParenthesis;
                            newDisplayValue += buttonValue;

                        } else if (lastCharOfEquation !== closingParenthesis) {
                            newDisplayValue = buttonValue;
                            newRunningEquation += buttonValue;
                        }
                        break;
                    case equals:

                        if (newDisplayValue === decimal) {

                            let equationToEval = removeLastCharacter(newRunningEquation) + '0';
                            let result = eval(equationToEval).toString();
                            indexOfDecimal = findIndexOfDecimal(result);

                            newRunningEquation = newDisplayValue = handleResult (
                                result, indexOfDecimal, roundResult, toScientificNotation
                            );

                            if (eval(newRunningEquation) === 0) {

                                newDisplayValue = newRunningEquation = '0';
                    
                            }

                        } else if (lastCharOfEquation === decimal) {

                            let equationToEval = removeLastNumOfEquation(newRunningEquation) + 
                                removeLastCharacter(newDisplayValue);
                            let result = eval(equationToEval).toString();
                            indexOfDecimal = findIndexOfDecimal(result);
    
                            newRunningEquation = newDisplayValue = handleResult (
                                result, indexOfDecimal, roundResult, toScientificNotation
                            );

                            if (eval(newRunningEquation) === 0) {

                                newDisplayValue = newRunningEquation = '0';
                    
                            }
                            
                        } else if (lastCharOfEquation === closingParenthesis) {

                            let result = eval(newRunningEquation).toString();
                            indexOfDecimal = findIndexOfDecimal(result);

                            newRunningEquation = newDisplayValue = handleResult (
                                result, indexOfDecimal, roundResult, toScientificNotation
                            );

                            if (eval(newRunningEquation) === 0) {

                                newDisplayValue = newRunningEquation = '0';
                    
                            }

                        } else {
                            newDisplayValue = 'Invalid input';
                            newRunningEquation = emptyString;
                        }
                        break; 
                    default:
                        if (lastCharOfEquation === decimal) {
                            newDisplayValue += buttonValue;
                            newRunningEquation += buttonValue;
                        } else if (
                            lastCharOfEquation === closingParenthesis && 
                            newDisplayValue.length < 17
                        ) {

                            newRunningEquation = removeLastParenthesizedNum(newRunningEquation) + 
                                openingParenthesis + newDisplayValue + buttonValue + closingParenthesis; 
                            newDisplayValue += buttonValue;

                        } else if (lastCharOfEquation !== closingParenthesis) {
                            newDisplayValue = buttonValue;
                            newRunningEquation += buttonValue;
                        }
                }
            // if the last character of the running equation IS a number, run this switch
            } else {
                switch (buttonValue) {
                    case capitalC:
                        newDisplayValue = emptyString;
                        newRunningEquation = emptyString;
                        break;
                    case plusMinus:
                            if (newDisplayValue !== '0' && newDisplayValue !== '0.') {

                            // The following adds parentheses around a negative number in the running equation. This
                            // prevents situation like '2--3**4' occurring. eval() cannot compute when two 
                            // negative symbols preceed powerAsterisks. Alternatively, it will show '2-(-3)**4'
                                newRunningEquation = removeLastNumOfEquation(newRunningEquation) + 
                                    openingParenthesis + multiplyByNegativeOne(newDisplayValue) + 
                                    closingParenthesis;
                            }
                            newDisplayValue = multiplyByNegativeOne(newDisplayValue);
                        break;
                    case powerCarrot: 
                        // The following adds parentheses around a negative number in the running equation. This
                        // prevents situation like '2--3**4' occurring. eval() cannot compute when two 
                        // negative symbols preceed powerAsterisks. Alternatively, it will show '2-(-3)**4'
                        if (newDisplayValue[0] === minus) {
                            newRunningEquation = removeLastNumOfEquation(newRunningEquation) + 
                                openingParenthesis + newDisplayValue + closingParenthesis + powerAsterisks;
                        } else {
                            newRunningEquation += powerAsterisks
                        }
                        break;
                    case forwardSlash:
                        newRunningEquation += forwardSlash
                        break;
                    case asterisk:
                        newRunningEquation += asterisk
                        break;
                    case plus:
                        newRunningEquation += plus
                        break;
                    case minus:
                        newRunningEquation += minus
                        break;
                    case equals:
                        let result = eval(newRunningEquation).toString();
                        indexOfDecimal = findIndexOfDecimal(result);

                        newRunningEquation = newDisplayValue = handleResult (
                            result, indexOfDecimal, roundResult, toScientificNotation
                        );

                        if (eval(newRunningEquation) === 0) {

                            newDisplayValue = newRunningEquation = '0';
                
                        }

                        break;
                    case decimal:
                        if (newDisplayValue.indexOf(decimal) === -1 && newDisplayValue.length < 15) {
                            newDisplayValue += buttonValue;
                            newRunningEquation += buttonValue;
                        }
                        break;
                    case '0':
                        // don't allow 17 digit long display values
                        if (
                            (newDisplayValue !== '0' || newDisplayValue.length !== 1) && 
                            newDisplayValue.length < 16
                        ) {
                            newDisplayValue += buttonValue;
                            newRunningEquation += buttonValue;
                        }
                        break;
                    default:
                        if (newDisplayValue === '0') {
                            newDisplayValue = buttonValue;
                            newRunningEquation = removeLastCharacter(newRunningEquation) + buttonValue;
                        } else if (newDisplayValue.length < 16) {
                            newDisplayValue += buttonValue;
                            newRunningEquation += buttonValue;
                        }
                }
            }
        }

        let indexOfE = newDisplayValue.indexOf('e');
        let digitsBeforeE = newRunningEquation.slice(0, indexOfE)
        indexOfDecimal = findIndexOfDecimal(newDisplayValue);

        if (newRunningEquation === 'Infinity') {

            newDisplayValue = '>1.79769e+308';

        } else if (indexOfE !== -1 && digitsBeforeE.length > 9) {

            digitsBeforeE = digitsBeforeE.slice(0, 9);
            newDisplayValue = digitsBeforeE + newRunningEquation.slice(indexOfE);

        } else if (indexOfDecimal === -1) {

            let resultWithCommas = newDisplayValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            newDisplayValue = resultWithCommas;

        } else if (indexOfE === -1) {

            let numsBeforeDecimal = newDisplayValue.slice(0, indexOfDecimal);
            let numsBeforeDecimalWithCommas = numsBeforeDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            let resultWithCommas = numsBeforeDecimalWithCommas + newDisplayValue.slice(indexOfDecimal);
            newDisplayValue = resultWithCommas;
        }

        if (buttonValue === equals) {
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