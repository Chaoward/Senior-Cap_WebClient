"use client";

import { useState } from "react";
import { data } from "./data";

export default function TagSelection({entry}) {
    const index = data.indexOf(entry);

    const handleInput = (e) => {
        e.preventDefault();

        console.log(e.target.value);
        data[index].tag = e.target.value;
    }


    return (
        <div>
            <img width={250} height={250} src={entry.imageURL}/>
            <label>Tag: </label>
            <select name="new_tag" defaultValue={entry.tag} onInput={handleInput}>
                <option value="dog" >Dog</option>
                <option value="cat">Cat</option>
                <option value="none">Neither</option>
            </select>
        </div>
    );
}