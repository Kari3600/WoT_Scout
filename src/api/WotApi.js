var application_id = ''

export function setKey(apiKey) {
    application_id = apiKey
}

async function fetchWotRaw(url, params) {
    params.application_id = application_id
    const query = `https://api.worldoftanks.eu/wot/${url}?${new URLSearchParams(params)}`
    let ret = await fetch(query)
    if (!ret.ok) {
        throw Error(ret.text)
    }
    return await ret.json()
}

async function fetchWot(url, params) {
    let ret = await fetchWotRaw(url, params)
    let data = ret.data
    if (Object.hasOwn(ret.meta, "page_total")) {
        const page_total = ret.meta.page_total
        for (let id=1; id < page_total; id++) {
            params.page_no = id+1
            let subret = await fetchWotRaw(url, params)
            data = Object.assign({}, data, subret.data)
        }
    }
    return data
}

export async function getClans(search) {
    return await fetchWot("clans/list/", {search: search})
}

export async function getClanDetails(clan_id) {
    return (await fetchWot("clans/info/", {clan_id: clan_id}))[clan_id]
}

export async function getPlayerStrongholdGamesPerTank(account_id) {
    return (await fetchWot("tanks/stats/", {in_garage: 1, account_id: account_id, fields: 'tank_id,stronghold_defense.battles'}))[account_id]
}

export async function getTanks() {
    return await fetchWot("encyclopedia/vehicles/", {fields: 'short_name', tier: 10})
}