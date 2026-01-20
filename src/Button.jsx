import React, { useState } from "react";


function ButtonCount(){
    let[counter, setCounter] = useState(15);
    let[msg, setMsg] = useState('');
    console.log( counter );
    const addCount = () =>{
        setCounter((prev) => {
            if (prev < 20) {
                setMsg("");
                console.log(`Counter decreased: ${prev + 1}`);
                return prev + 1;
            } else {
                setMsg("You cannot Remove more than 20");
                return prev;
            }
        });
    }
    const removeCount = () =>{
        setCounter((prev) => {
            if (prev > 1) {
                setMsg("");
                console.log(`Counter decreased: ${prev - 1}`);
                return prev - 1;
            } else {
                setMsg("You cannot Remove less than 1");
                return prev;
            }
        });
    }
    return(
        <>
         <h2>Hello button ButtonCount {counter}</h2>
         <button onClick={addCount}>Add item { counter }</button>
         <button onClick={removeCount}>Remove item {counter}</button>
         {msg && <p style={{ color: "red" }}>{msg}</p>}
        </>
    );
}
export default ButtonCount;