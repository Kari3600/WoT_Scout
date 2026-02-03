import './App.css';
import { useEffect, useState } from 'react';
import { getClanDetails, getClans, getPlayerStrongholdGamesPerTank, getTanks, setKey } from './api/WotApi';
import Clan from './components/Clan';
import Member from './components/Member';

function App() {
  const [apiKey, setApiKey] = useState("")
  const [tanks, setTanks] = useState([])
  const [clans, setClans] = useState([])
  const [clan, setClan] = useState(null)
  const [searchVal, setSearchVal] = useState("D_M_K")

  useEffect(() => {
    const key = localStorage.getItem("apiKey")
    if (key) setApiKey(key)
  }, [])

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("apiKey", apiKey)
      setKey(apiKey)
    }
  }, [apiKey]);

  useEffect(() => {
    getTanks().then(setTanks)
  }, [apiKey])

  function onClick() {
    getClans(searchVal)
    .then(setClans)
  }

  function onClanClick(clan) {
    getClanDetails(clan.clan_id)
    .then(async clan => {
      const enriched = await Promise.all(
        clan.members.map(async member => {
          const stronghold_games = (await getPlayerStrongholdGamesPerTank(member.account_id))
            .filter(t => t.stronghold_defense.battles > 0)
            .filter(t => Object.hasOwn(tanks, t.tank_id))
            .map(t => {
              return { ...t, short_name: tanks[t.tank_id].short_name}
            })
          return { ...member, stronghold_games: stronghold_games };
        })
      );
      clan.members = enriched
      setClan(clan)
    })
  }

  return (
    <div>
      <input id="apiKey" type='text' value={apiKey} onInput={e => setApiKey(e.target.value)}></input>
      <input id="searchBar" type='text' value={searchVal} onInput={e => setSearchVal(e.target.value)}></input>
      <button onClick={onClick}>Search</button>
      {clans.map(clan => (
        <div onClick={e => onClanClick(clan)}>
          {Clan(clan)}        
        </div>
      ))}
      {clan != null &&
        <div>
          {clan.members.map(member => (
            Member({member})
          ))}
        </div>      
      }
    </div>
  );
}

export default App;
