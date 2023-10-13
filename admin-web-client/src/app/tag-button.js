"use client";

import { cache } from "./data";

export default function TagSelection({entry}) {
    const handleInput = (e) => {
        e.preventDefault();

        const index = cache.indexOf(entry);
        console.log(e.target.value);
        cache[index].tag = e.target.value;
    }


    return (
        <div>
            <img width={250} height={250} src={entry.imageUrl}/>
            <label>Tag: </label>
            <select name="new_tag" defaultValue={entry.tag} onInput={handleInput}>
                <option value="dog" >Dog</option>
                <option value="cat">Cat</option>
                <option value="none">Neither</option>
            </select>
        </div>
    );
}