export default function Clan(clan) {
    return (
        <div class="clan">
            <img class="clanIcon" src={clan.emblems.x256.wowp}></img>
            <div class="clanTag">{"["+clan.tag+"]"}</div>
            <div class="clanName">{clan.name}</div>          
        </div>
    )
}