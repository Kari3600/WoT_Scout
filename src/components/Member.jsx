export default function Member({member}) {
    return (
        <div class="member">
            <div class="memberData">
                <div class="memberRole">{member.role_i18n}</div>
                <div class="memberName">{member.account_name}</div>
            </div>
            <div class="barChart">
                {member.stronghold_games.sort((a, b) => b.stronghold_defense.battles - a.stronghold_defense.battles).slice(0,5).map(tank => (
                    <div>
                        {tank.short_name} - {tank.stronghold_defense.battles}
                    </div>
                ))}
            </div>
        </div>
    )
}