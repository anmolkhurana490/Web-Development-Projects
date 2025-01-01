import React, { useEffect, useState } from "react";
import ServerInfo from "./components/ServerInfo";

function App() {
  const [serverInfoData, setServerInfoData] = useState()
  useEffect(() => {
    fetch('http://localhost:8080/serverInfo')
    .then(response => response.json())
    .then(data => setServerInfoData(data))
    .catch(err => console.log('Some error: ' + err));
  }, [])

  return <ServerInfo playerData={serverInfoData} setPlayerData={setServerInfoData}/>;
}

export default App;