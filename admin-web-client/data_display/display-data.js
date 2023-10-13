'use client'
import React, { useState } from "react";
import { data, sendVerified } from "./data";
import TagSelection from "./tag-button";

var retrieve;

export function FetchButton({ children }) {
  const handleClick = () => {
    retrieve();
  };

  return <button onClick={handleClick}>{children}</button>;
}

export function SendVerifiedButton({ children, startIndex, endIndex }) {
  const handleClick = () => {
    const imagesToSend = data.slice(startIndex, endIndex);
    sendVerified(() =>
      alert(imagesToSend.map((x) => `Image${data.indexOf(x) + 1} : ${x.tag}\n`))
    );
    retrieve(); // re-render
  };

  return <button onClick={handleClick}>{children}</button>;
}

export default function ImageList() {
    const [startIndex, setStartIndex] = useState(0);
    const [imageList, setImageList] = useState([]);
  
    const _retrieve = () => {
      const endIndex = startIndex + 2;
      const temp = data.slice(startIndex, endIndex);
      setImageList(temp);
      setStartIndex(endIndex);
    };
  
    retrieve = _retrieve;
  
    const pendingCount = Math.max(0, data.length - startIndex);
  
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
              <SendVerifiedButton>
                Send Verified
              </SendVerifiedButton>
            </th>
          </tr>
          <tr>
            <th bgcolor="47ba5c">Pending: {pendingCount}</th>
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