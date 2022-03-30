import './calculator.css'
import Screen from './screen';
import ButtonBox from './button-box';
import React, {useState} from 'react';

export default function Calculator (props) {

    const [displayValue, setDisplayValue] = useState('')

    function handleInputChange (e) {
        const buttonValue = e.target.textContent;
        let useButtonValue = true;
        let newDisplayValue = displayValue;
        let lastDisplayValueChar = displayValue.slice(displayValue.length - 1);
        let doMath = {
            '^': (a, b) => {return (a ** b).toString()},
            '/': (a, b) => {return (a / b).toString()},
            '*': (a, b) => {return (a * b).toString()},
            '+': (a, b) => {return (a + b).toString()},
            '-': (a, b) => {return (a - b).toString()}
        }

        function isButtonValueUsed (buttonValue) {
            switch(buttonValue) {
                case '^':
                case '/':
                case '*':
                case '+':
                case '-':
                case '.':
                case '=':
                    return false;
                default:
                    return true;
            }
        }

        if (!displayValue || displayValue === 'Invalid input') {
            switch (buttonValue) {
                case '+/-':
                case '^':
                case '/':
                case '*':
                case '+':
                case '=':
                    break;
                case 'C':
                    newDisplayValue = '';
                    break;
                default:
                    newDisplayValue = buttonValue;
            }
        } else {

            switch (lastDisplayValueChar) {
                case '^':
                case '/':
                case '*':
                case '+':
                case '-':
                case '.':
                    useButtonValue = isButtonValueUsed(buttonValue);
            }

            if (useButtonValue) {
                switch (buttonValue) {
                    case 'C':
                        newDisplayValue = '';
                        break;
                    case '+/-':
                        if (!Number.isNaN(Number(displayValue))) {
                            newDisplayValue = (displayValue * -1).toString();
                        } 
                        break;
                    case '=':
                        let i = 0;
                        while (i < newDisplayValue.length) {
                            if (newDisplayValue[i] === '^') {
                                let result = doMath['^'](newDisplayValue[i - 1], newDisplayValue[i + 1]);

                                newDisplayValue = newDisplayValue.substring(0, newDisplayValue[i - 1]) + 
                                    result + newDisplayValue.substring(newDisplayValue[i + 2]);
                            }
                            i++;
                        }
                        console.log(newDisplayValue);
                        break;
                    default:
                        newDisplayValue = displayValue + buttonValue;
                }
            } else {
                switch (buttonValue) {
                    case '=':
                        newDisplayValue = 'Invalid input';
                }
            }
        }
        setDisplayValue(newDisplayValue);
    }

    return (
        <div id='outline'>
            <Screen value={displayValue}/>
            <ButtonBox onClick={handleInputChange}/>
        </div>
    )
}