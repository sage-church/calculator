import './screen.css';

function Screen (props) {
    return (
        <input id='screen' value={props.value} placeholder='Empty' readOnly/>
    )
}

export default Screen;