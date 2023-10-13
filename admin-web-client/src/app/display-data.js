'use client';

import { useState } from "react";
import { cache, sendVerified, fetchPending } from "./data";
import TagSelection from "./tag-button";

var retrieve;
var next;

export function FetchButton({ children }) {
    const handleClick = () => {
        retrieve();
    };

    return (
        <button onClick={handleClick}>{children}</button>
    );
}


export function SendVerifiedButton({ children }) {
    const handleClick = () => {
        sendVerified( () => next() );
    };

    return (
        <button onClick={handleClick}>
            {children}
        </button>
    );
}


export default function ImageList() {
    const [startIndex, setStartIndex] = useState(0);
    const [imageList, setImageList] = useState([]);
    const verifiedCount = startIndex - 2;
    const pendingCount = Math.max(0, cache.length - startIndex);
    

    const _retreive = () => {
        //fetch here
        fetchPending(() => {
            _next();
        });
    };
    retrieve = _retreive;

    const _next = () => {
        const endIndex = startIndex + 2;
        const temp = cache.slice(startIndex, endIndex);
        setImageList(temp);
        setStartIndex(endIndex);
    };
    next = _next;

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <table border={3} bgcolor="9cb6db">
                <tr>
                    <th>
                        <FetchButton>Fetch Data</FetchButton>
                        <button onClick={_next}>Next</button>
                        <SendVerifiedButton>
                            Send Verified
                        </SendVerifiedButton>
                    </th>
                </tr>
                <tr>
                    <th bgcolor="47ba5c">Pending: {pendingCount} | Verified: {verifiedCount < 0 ? 0 : verifiedCount}</th>
                </tr>
                {imageList.map((entry) => (
                    <tr key={entry.id}>
                        <td>
                            <TagSelection entry={entry} />
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );

    /*
    return (
        <table border={3} bgcolor="9cb6db">
            <th>Pending: {imageList.length}</th>
            {imageList.map((entry) => <tr>
                <td>
                    <TagSelection key={entry.id} entry={entry}/>
                </td>
            </tr>)}
        </table>
    );
    */
}