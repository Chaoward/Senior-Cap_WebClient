//import Image from 'next/image'
"use client";

import "./stylePage.css";
import React from 'react';
import ImageList, { FetchButton, SendVerifiedButton } from "./display-data";

export default function Home() {
  let testJson = [
      {
        "id": 4,
        "imageUrl":"https://seniorcapstone.s3.amazonaws.com/cat1.jpg",
        "Label": "cat", 
        "confidence":"90"
      },
      {
        "id": 5,
        "imageUrl":"https://seniorcapstone.s3.amazonaws.com/dog1.jpg",
        "Label": "dog", 
        "confidence":"90"
      }
    ];
  

  let testJson2 = [
    {
      "id": 4,
      "imageUrl":"https://seniorcapstone.s3.amazonaws.com/cat1.jpg",
      "Label": "cat", 
      "confidence":"90"
    },
    {
      "id": 5,
      "imageUrl":"https://seniorcapstone.s3.amazonaws.com/dog1.jpg",
      "Label": "dog", 
      "confidence":"90"
    }
  ];

  let testJson3 = ["id", "imageUrl", "Label", "confidence"];
  

  const _temp = () => {
    fetch("https://flaskapp.jondooley87.repl.co/updateUnverified", {
      method: "POST",
      headers: { 'Access-Corntrol-Allow-Origin': 'http://localhost:3000', "Content-Type": "application/json"},
      body: JSON.stringify(testJson)
    }).then((res) => res.json().then( (resJson) => console.log(resJson) ).catch( (e) => console.log(e) ) );
  };

  return (
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="../dist/components/grid.css" />
        <link rel="stylesheet" type="text/css" href="../dist/components/table.css" />
      </head>
      <div className="data-list">
        <button onClick={_temp}>Send</button>
        <ImageList />
      </div>
    </html>
  );
}

