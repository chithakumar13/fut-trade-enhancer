const findSbcs = function (item) {
  const name =
    `${item._staticData.firstName} ${item._staticData.lastName}`.replace(
      ' ',
      '-'
    )
  const url = `https://www.futbin.com/search?year=21&term=${name}`
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: (res) => {
        if (res.status !== 200) {
          count++
          return resolve()
        }
        const players = JSON.parse(res.response)

        if (players.error) {
          count++
          return resolve()
        }
        let filteredPlayer = players.filter(
          (p) => parseInt(p.rating, 10) === parseInt(item.rating, 10)
        )
        if (filteredPlayer.length > 1) {
          filteredPlayer = filteredPlayer.filter(
            (p) =>
              p.rare_type === item.rareflag.toString() &&
              p.club_image.endsWith(`/${item.teamId}.png`)
          )
        }
        const itemDetail = {
          futBinId: filteredPlayer[0].id,
          futBinUrl: `https://www.futbin.com/stc/squads?player=${filteredPlayer[0].id}&page=1`,
          resourceId: item.resourceId,
          name
        }
        findAllSbcs(itemDetail).then(() => {
          resolve()
        })
      }
    })
  })
}

const sbcLookup = new Map()

const findAllSbcs = function (itemDetail) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: itemDetail.futBinUrl,
      onload: (res) => {
        if (res.status === 200) {
          count++
          const parser = new DOMParser()
          const doc = parser.parseFromString(res.response, 'text/html')
          const obj = [].map.call(doc.querySelectorAll('tr'), (tr) => {
            return [].slice.call(tr.children).reduce((a, b, i) => {
              if (i === 2) {
                const anchor = b.getElementsByTagName('a')[0]
                if (anchor && anchor.href) {
                  return (
                    (a['prop' + (i + 1)] =
                      anchor.href.match(/squad\/(.*)\/sbc/)[1]),
                    a
                  )
                }
              }
              if (b.textContent) {
                return (
                  (a['prop' + (i + 1)] = b.textContent
                    .replace(/(\r\n|\n|\r)/gm, '')
                    .trim()),
                  a
                )
              }
              return a
            }, {})
          })

          for (let index = 1; index < obj.length; index++) {
            const row = obj[index]
            const lookUpKey = row.prop1 + '_' + row.prop2
            if (!row.prop2) continue
            const sbcDetail = {
              ...itemDetail,
              setName: row.prop1,
              challengeName: row.prop2
            }
            if (!sbcLookup.has(lookUpKey)) {
              sbcLookup.set(lookUpKey, [])
            }
            if (getUserPlatform() === 'ps') {
              itemDetail.price = row.prop4.replace(/[,.]/g, '')
            } else if (getUserPlatform() === 'xbox') {
              itemDetail.price = row.prop5.replace(/[,.]/g, '')
            } else {
              itemDetail.price = row.prop6.replace(/[,.]/g, '')
            }
            sbcLookup.get(lookUpKey).push(sbcDetail)
          }
        }
        resolve()
      }
    })
  })
}

const getSbcPLayer = async () => {
  const squadMembers = await getAllClubPlayers()
  const promisesToWait = []
  for (const member of squadMembers) {
    promisesToWait.push(findSbcs(member))
  }

  await Promise.all(promisesToWait)
  // findAllSbcs(`https://www.futbin.com/stc/squads?player=30109&page=1`);
  console.log(count, 'error count', sbcLookup)

  for (const [key, value] of sbcLookup) {
    console.log(key + ' = ' + value.length)
  }
}

addBtnListner('#btnSbcApplicable', async function () {
  await getSbcPLayer()
})
