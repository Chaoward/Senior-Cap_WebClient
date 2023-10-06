'use client';

import { useState } from "react";
import { data, sendVerified } from "./data";
import TagSelection from "./tag-button";

var retrieve;

export function FetchButton({children}) {
    const handleClick = () => {
        retrieve();
    };

    return (
        <button onClick={handleClick}>{children}</button>
    );
}


export function SendVerifiedButton({children}) {
    const handleClick = () => {
        sendVerified(() => alert( data.map( (x) => `Image${data.indexOf(x)+1} : ${x.tag}\n` ) ) );
        retrieve(); //re-render
    };

    return (
        <button onClick={handleClick}>
            {children}
        </button>
    );
}


export default function ImageList() {
    const [imageList, setImageList] = useState([]);
    const _retreive = () => {
        //fetch here
        const temp = data.map( (x) => x );
        setImageList(temp);
    }
    retrieve = _retreive;

    return (
        <table border={3} bgcolor="9cb6db">
            <th>Pending: {imageList.length}</th>
            {imageList.map((entry) => <tr>
                <td>
                    <TagSelection entry={entry}/>
                </td>
            </tr>)}
        </table>
    );
}


/*
export function Data() {
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
*/