//import Image from 'next/image'
import "./stylePage.css";
import React from 'react';
import Data from "./display-data";
import { NewDataButton } from "./display-data";

export default function Home() {

  return (
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="../dist/components/grid.css"/>
        <link rel="stylesheet" type="text/css" href="../dist/components/table.css"/>
      </head>
      <div>
        <NewDataButton>New Data</NewDataButton>
      </div>
      <div className="data-list">
        <table>
          <thead>
            <th>Image</th>
            <th>Tag</th>
            <th></th>
          </thead>
          <Data/>
        </table>
      </div>
    </html>
  );
}

