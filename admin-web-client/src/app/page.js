//import Image from 'next/image'
import "./stylePage.css";
import React from 'react';
import ImageListData, { FetchButton, SendVerifiedButton } from "./display-data";
import NavBar from "./NavBar";

export default function Home() {

  return (
    <html>
      <head>
      </head>
      <div className="data-list" >
        <NavBar/><br/>
        <ImageListData/>
      </div>
    </html>
  );
}

