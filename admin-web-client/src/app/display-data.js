'use client';

import { useState } from "react";
import { data } from "./data";

var retrieve;

export function NewDataButton({children}) {
    const handleClick = () => {
        retrieve();
    }

    return (
        <button onClick={handleClick}>{children}</button>
    );
}


export default function Data() {
    const [dataList, setDataList] = useState([]);

    const retreiveData = () => {
        //request and retreive pending verification data
        setDataList(data.map(x => x));
    }
    retrieve = retreiveData;

    const handleClick = (index, tag) => {
        //update tag and send back to server

        //remove from list
        delete dataList[index];
        setDataList(dataList.map((x) => x));
    }

    return (
        <tbody>{dataList.map((d, i) =>
            <tr>
                <td>
                    <img src={d.imageURL} width={500} height={500}/>
                </td>
                <td>
                    <h2>
                        {d.tag}
                    </h2>
                </td>
                <td>
                    <button onClick={() => handleClick(i, "dog")}>Dog</button><br/>
                    <button onClick={() => handleClick(i, "cat")}>Cat</button><br/>
                    <button onClick={() => handleClick(i, "")}>Neither</button>
                </td>
            </tr>)}
        </tbody>
    );
}