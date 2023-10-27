//import Image from 'next/image'
import "./stylePage.css";
import React from 'react';
import ImageListData, { FetchButton, SendVerifiedButton } from "./display-data";

export default function Home() {

  return (
    <html>
      <head>
      </head>
      <div className="data-list">
        <ImageListData/>
      </div>
    </html>
  );
}

