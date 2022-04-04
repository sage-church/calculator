// TODO: handle large inputs and results
// TODO: eval() can't handle equations like '-10**2', error says number preceding '**' must have parentheses

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
            indexOfNumAtEndOfEquation = newRunningEquation.lastIndexOf(displayValue),
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
                    // console.log(wasEqualsSignLastClick);
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

                            newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation) +
                                (newDisplayValue * -1) + '.';

                            newDisplayValue = (newDisplayValue * -1) + '.'; 
                        } 
                        break;
                    case '^': 
                    if (lastCharOfEquation === '.' && newDisplayValue.slice(0, -1)) {

                        
                        newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation) + '(' +
                            newDisplayValue.slice(0, -1) + ')' + '**';
                        newDisplayValue = newDisplayValue.slice(0, -1);
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
                                newRunningEquation = newRunningEquation.slice(0, -1) + '0' + buttonValue;
                            }
                        }
                        break;
                    case '.':
                        if (lastCharOfEquation === '.') {
                            return;
                        } else {
                            newDisplayValue = buttonValue;
                            newRunningEquation += buttonValue;
                        }
                        break;
                    case '=':
                        if (lastCharOfEquation === '.') {
                            newRunningEquation = newRunningEquation.slice(0, -1)

                            newRunningEquation = eval(newRunningEquation).toString();
                            newDisplayValue = newRunningEquation;
                        } else {
                            newDisplayValue = 'Invalid input';
                            newRunningEquation = '';
                        }
                        break;
                    default:
                        if (lastCharOfEquation === '.') {
                            newDisplayValue += buttonValue;
                            newRunningEquation += buttonValue;
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
                                newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation) + 
                                    displayValue * -1;
                            }
                            newDisplayValue = (newDisplayValue * -1).toString();
                            
                        break;
                    case '^': 
                        newRunningEquation += '**'
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
                        newDisplayValue = newRunningEquation;
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
        } else {
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