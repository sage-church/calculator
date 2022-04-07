// TODO: line 191, code doesn't do what is wanted

import './calculator.css'
import Screen from './screen';
import ButtonBox from './button-box';
import React, {useState} from 'react';

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
            newWasEqualsSignLastClick = wasEqualsSignLastClick;      
        
        // if there are currently no numbers displayed (or infinity is shown), run this switch
        if (!displayValue || displayValue === 'Invalid input' || displayValue === 'Infinity') {
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
                    newDisplayValue = buttonValue;
                    newRunningEquation = buttonValue;
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
                    newRunningEquation = '';
                    break;
                default:
                    newDisplayValue = newRunningEquation = buttonValue;
            }
        } else if (wasEqualsSignLastClick) {
            switch (buttonValue) {
                case '+/-':
                    newRunningEquation = (newRunningEquation * -1).toString();
                    newDisplayValue = (newDisplayValue * -1).toString();
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

                        if (lastCharOfEquation === '.' && newDisplayValue.slice(0, -1)) {
        
                            // Using newDisplayValue to find index since newDisplayValue will include
                            // any preceding '-' that indicates '+/-' has previously been clicked on the
                            // currently displayed number
                            indexOfNumAtEndOfEquation = newRunningEquation.lastIndexOf(newDisplayValue);

                            // The following adds parentheses around a negative number in the running equation. This
                            // prevents situation like '2--3**4' occurring. eval() cannot compute when two 
                            // negative symbols preceed '**'. Alternatively, it will show '2-(-3)**4'
                            newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation) +
                                '(' + (newDisplayValue * -1) + '.' + ')';

                            newDisplayValue = (newDisplayValue * -1) + '.'; 

                        } else if (lastCharOfEquation === ')' && newDisplayValue.slice(-1) !== '.') {

                            
                            newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation - 1) +
                                (newDisplayValue * -1)
                            newDisplayValue = (newDisplayValue * -1).toString();

                        } else if (lastCharOfEquation === ')') {

                            newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation - 1) +
                            (newDisplayValue * -1) + '.';
                            newDisplayValue = (newDisplayValue * -1).toString() + '.';

                        }

                        break;
                    case '^': 
                        if (lastCharOfEquation === '.' && newDisplayValue.slice(0, -1)) {

                            // The following adds parentheses around a negative number in the running equation. This
                            // prevents situation like '2--3**4' occurring. eval() cannot compute when two 
                            // negative symbols preceed '**'. Alternatively, it will show '2-(-3)**4'
                            newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation) + '(' +
                                newDisplayValue.slice(0, -1) + ')' + '**';
                            newDisplayValue = newDisplayValue.slice(0, -1);

                        } else if (newDisplayValue === '.') {

                            newDisplayValue = '0';
                            newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation) + '0'
                                + '**';

                        } 
                        else if (lastCharOfEquation === ')' && newDisplayValue.slice(-1) === '.') {

                            newDisplayValue = newDisplayValue.slice(0, -1)
                            newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation - 1) +
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
                            
                            if (newDisplayValue.slice(0, -1)) {
                                newDisplayValue = newDisplayValue.slice(0, -1);
                                newRunningEquation = newRunningEquation.slice(0, -1) + buttonValue;
                            } else {
                                newDisplayValue = '0'
                                newRunningEquation = newRunningEquation.slice(0, -1) + newDisplayValue
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

                            newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation -1) + 
                                '(' + newDisplayValue + buttonValue + ')';
                            newDisplayValue += buttonValue;

                        } else if (lastCharOfEquation !== ')') {
                            newDisplayValue = buttonValue;
                            newRunningEquation += buttonValue;
                        }
                        break;
                    case '=':
                        if (newDisplayValue === '.') {

                            newRunningEquation = eval((newRunningEquation.slice(0, -1) + '0')).toString()

                            if (newRunningEquation.length < 12) {

                                newRunningEquation = newRunningEquation.slice(0, -1) + '0';
                                newRunningEquation = eval(newRunningEquation).toString();
                                newDisplayValue = newRunningEquation;
                            }

                        } else if (lastCharOfEquation === ')') {

                            newRunningEquation = eval(newRunningEquation).toString();

                            if (newRunningEquation.length < 12) {
                                newDisplayValue = newRunningEquation;
                            } else {
                                newDisplayValue = Number(newRunningEquation).toExponential(2).toString()
                            }

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

                            newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation -1) + 
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
                                newRunningEquation = (newRunningEquation * -1).toString();
                            } else {
                            // The following adds parentheses around a negative number in the running equation. This
                            // prevents situation like '2--3**4' occurring. eval() cannot compute when two 
                            // negative symbols preceed '**'. Alternatively, it will show '2-(-3)**4'
                                newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation) + 
                                    '(' + newDisplayValue * -1 + ')';
                            }
                            newDisplayValue = (newDisplayValue * -1).toString();
                            
                        break;
                    case '^': 
                    // The following adds parentheses around a negative number in the running equation. This
                    // prevents situation like '2--3**4' occurring. eval() cannot compute when two 
                    // negative symbols preceed '**'. Alternatively, it will show '2-(-3)**4'
                        if (newDisplayValue[0] === '-') {
                            newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation) + '('
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
                        newRunningEquation = eval(newRunningEquation).toString();

                        if (newRunningEquation.length < 12) {
                            newDisplayValue = newRunningEquation;
                        } else {
                            newDisplayValue = Number(newRunningEquation).toExponential(2).toString()
                        }
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
                        if (lastCharOfEquation === '0' && newDisplayValue.length === 1) {
                            newDisplayValue = buttonValue;
                            newRunningEquation = buttonValue;
                        } else {
                            newDisplayValue += buttonValue;
                            newRunningEquation += buttonValue;
                        }
                        
                }
            }
        }

        let indexOfDecimal = newDisplayValue.indexOf('.')

        if (indexOfDecimal === -1) {

            newDisplayValue = newDisplayValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

        } else if (newDisplayValue.indexOf('e') === -1) {

            newDisplayValue = newDisplayValue.slice(0, indexOfDecimal).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 
            newDisplayValue.slice(indexOfDecimal);
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