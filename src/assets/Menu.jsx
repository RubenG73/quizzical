import React from "react";

export default function Menu(props){
    return(
        <div className="menu">
            <h1>Quizzical</h1>
            <span className="page-description">Video Games Edition!</span>
            <button className="start-button" onClick={() => props.start()}>Start Quizzical</button>
        </div>
    )
}