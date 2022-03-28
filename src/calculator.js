import './calculator.css'
import Screen from './screen';
import ButtonBox from './button-box';
import React, {useState} from 'react';

export default function Calculator (props) {

    const [displayValue, setDisplayValue] = useState('')

    function handleInputChange (e) {
        const buttonValue = e.target.textContent;
        let newDisplayValue = displayValue;

        if (!displayValue) {
            switch (buttonValue) {
                case 'C':
                case '+/-':
                case '=':
                case '0':
                    break;
                default:
                    newDisplayValue = displayValue + buttonValue;
            }
        } else {
            switch (buttonValue) {
                case 'C':
                    newDisplayValue = '';
                    break;
                case '+/-':
                case '=':
                    break;
                default:
                    newDisplayValue = displayValue + buttonValue;
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