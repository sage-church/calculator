import './button.css';

function Button (props) {
    return (
        <div 
            className='button' 
            id={props.id} 
            onClick={props.onClick}
        >
         {props.value}
        </div>
    )
}

export default Button;