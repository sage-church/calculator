import './button-box.css';
import Button from './button';

function ButtonBox (props) {
    const buttons = [
        {key: 1, button: 'C'},
        {key: 2, button: '+/-'},
        {key: 3, button: '^'},
        {key: 4, button: '/'},
        {key: 5, button: '7'},
        {key: 6, button: '8'},
        {key: 7, button: '9'},
        {key: 8, button: 'x'},
        {key: 9, button: '4'},
        {key: 10, button: '5'},
        {key: 11, button: '6'},
        {key: 12, button: '+'},
        {key: 13, button: '1'},
        {key: 14, button: '2'},
        {key: 15, button: '3'},
        {key: 16, button: '-'},
        {key: 17, button: '0'},
        {key: 18, button: '.'}
    ];
        

    return (
        <div id='button-box'>
            {buttons.map(buttons => 
                <Button 
                    key={buttons.key} 
                    value={buttons.button} 
                    onClick={props.onClick} 
                />
            )}
            <Button id='equals' value='=' onClick={props.onClick}/>
        </div>
    )
}

export default ButtonBox;