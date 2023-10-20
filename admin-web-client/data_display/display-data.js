
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
        sendVerified(() => next());
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
    const [imagesPerPage, setImagesPerPage] = useState(2);
    const verifiedCount = Math.max(0, startIndex - imagesPerPage);
    const pendingCount = Math.max(0, cache.length - startIndex);
    
    const _retrieve = () => {
        fetchPending(() => {
            _next();
        });
    };

    const _next = () => {
        const endIndex = Math.min(startIndex + imagesPerPage, cache.length); // Ensure endIndex is within the bounds of cache.length
        const temp = cache.slice(startIndex, endIndex);
        setImageList(temp);
        setStartIndex(endIndex); // Update startIndex to the actual endIndex or cache.length
    };
    

    const _previous = () => {
        const newStartIndex = Math.max(0, startIndex - imagesPerPage);
        const endIndex = newStartIndex; // Calculate endIndex based on newStartIndex
        setStartIndex(newStartIndex); // Update startIndex first
        const temp = cache.slice(newStartIndex, endIndex);
        setImageList(temp);
    };
    

    const handleImagesPerPageChange = (event) => {
        const newImagesPerPage = parseInt(event.target.value, 10);
        setImagesPerPage(newImagesPerPage);
        setStartIndex(0);
    };

    return (
        <div
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            padding: "20px",
            }}
        >
            <table border={3} bgcolor="9cb6db">
                <tr bgcolor="fafafa">Display <input type="number" min="1" value={imagesPerPage} onChange={handleImagesPerPageChange} /> images per page</tr>
                <tr>
                    <th>
                        <button onClick={_retrieve}>Fetch Data</button>
                        <button onClick={_previous} disabled={startIndex === 0} >Back</button>
                        <button onClick={_next} disabled={startIndex + imagesPerPage >= cache.length}>Next</button>
                        <SendVerifiedButton>Send Verified</SendVerifiedButton>
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
}
