// TODO: handle the entry of 0 correctly
// TODO: commas are still added after decimal points; fix this
// TODO: handle large inputs and results

import './calculator.css'
import Screen from './screen';
import ButtonBox from './button-box';
import React, {useState} from 'react';

export default function Calculator () {

    const [displayValue, setDisplayValue] = useState('');
    const [runningEquation, setRunningEquation] = useState('');

    function handleInputChange (e) {

        const buttonValue = e.target.textContent;
        let newDisplayValue = displayValue.replace(/,/g, ''),
            newRunningEquation = runningEquation,
            lastCharOfEquation = runningEquation.slice(-1);

        // Creates array containing a string of the numerical characters at the end of the running
        // equation (will be null if last character in running equation is not a numerical character).
        let numAtEndOfEquationArr = runningEquation.match(/[0-9]+$/);
        
        // Convert the string of numerical characters in 'numAtEndOfEquationArr' to number type. 
        // 'numAtEndOfEquation' is set to NaN if 'numAtEndOfEquationArr' === null to avoid passing
        // null to the 'Number' method, which would return 0.
        let numAtEndOfEquation;
        if (numAtEndOfEquationArr === null) {
            numAtEndOfEquation = NaN;
        } else {
            numAtEndOfEquation = Number(numAtEndOfEquationArr[0])
        };

        // console.log(displayValue);
        let indexOfNumAtEndOfEquation = newRunningEquation.lastIndexOf(displayValue);
        // console.log(indexOfNumAtEndOfEquation);

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
        } else {
            // if the last character of the running equation is NOT a numerical character, run this switch
            if (!numAtEndOfEquation) {
                switch (buttonValue) {
                    case 'C':
                        newDisplayValue = '';
                        newRunningEquation = '';
                        break;
                    case '+/-':
                        // TODO: write rules for when buttonValue is '.'
                        if (lastCharOfEquation === '.') {
                            if (newDisplayValue.slice(0, -1)) {

                                // Using newDisplayValue to find index since newDisplayValue will include
                                // any preceding '-' that indicates the '+/-' has previously been clicked on the
                                // currently displayed number
                                indexOfNumAtEndOfEquation = newRunningEquation.lastIndexOf(newDisplayValue);

                                newRunningEquation = newRunningEquation.slice(0, indexOfNumAtEndOfEquation) +
                                    (newDisplayValue * -1) + '.';

                                newDisplayValue = (newDisplayValue * -1) + '.';
                            } else {
                                // TODO: should multiplying by -1 be allowed when just '.' is present?
                                
                            }
                            
                        } 
                        break;
                    case '^': 
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
                    default:
                        newDisplayValue += buttonValue;
                        newRunningEquation += buttonValue;
                }
            }
        }
        newDisplayValue = newDisplayValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        setDisplayValue(newDisplayValue);
        setRunningEquation(newRunningEquation);

        console.log(newRunningEquation);

    }

    

    return (
        <div id='outline'>
            <Screen value={displayValue}/>
            <ButtonBox onClick={handleInputChange}/>
        </div>
    )
}