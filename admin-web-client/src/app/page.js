//import Image from 'next/image'
import "./stylePage.css";
import React from 'react';
import ImageList, { FetchButton, SendVerifiedButton } from "./display-data";

export default function Home() {

  return (
    <html>
      <head>
      </head>
      <div className="data-list">
        <ImageList/>
      </div>
    </html>
  );
}

