import { useState } from "react";
import { fullURL, cache } from "../web-api/api";
import LabelSelection from "./LabelSelection";

export default function TagSelection({ entry }) {
  const [sysValue, setSys] = useState(entry.sysLabel);
  const [userValue, setUser] = useState(entry.userLabel);

  const handleSysChange = (e, val) => {
    e.preventDefault();
    const index = cache.unverified.findIndex((item) => item === entry);
    if (index !== -1) {
      cache.unverified[index].sysLabel = val; 
    }
    setSys(val);
  };

  const handleUserChange = (e) => {
    e.preventDefault();
    const index = cache.unverified.findIndex((item) => item === entry);
    if (index !== -1) {
      cache.unverified[index].userLabel = e.target.value; 
    }
    setUser(e.target.value);
  };

  return (
    <div>
      <img width={250} height={250} src={fullURL(entry.imgURL)} alt={entry.id} />
      <LabelSelection 
        userLabel={userValue}
        sysLabel={sysValue}
        onUserChange={handleUserChange} 
        onSysChange={handleSysChange} 
      />
    </div>
  );
}
