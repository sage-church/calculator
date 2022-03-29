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

        function isButtonValueUsed (buttonValue) {
            switch(buttonValue) {
                case '^':
                case '/':
                case '*':
                case '+':
                case '-':
                case '.':
                    return false;
                default:
                    return true;
            }
        }

        if (!displayValue) {
            switch (buttonValue) {
                case 'C':
                case '+/-':
                case '^':
                case '/':
                case '*':
                case '+':
                case '=':
                    break;
                default:
                    newDisplayValue = buttonValue;
            }
        } else {
            let lastDisplayValueChar = displayValue.slice(displayValue.length - 1);

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
                            newDisplayValue = displayValue * -1
                        } 
                        break;
                    case '=':

                        break;
                    default:
                        newDisplayValue = displayValue + buttonValue;
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