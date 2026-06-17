import { describe, expect, it } from 'vitest'
import { parseMobileInventoryHtml } from './mobileInventoryParser'

describe('parseMobileInventoryHtml', () => {
  it('extracts vehicle cards from mobile.de dealer html', () => {
    const html = `
      <a href="/fahrzeuge/details.html?id=425456138">
        <img src="https://img.classistatic.de/api/v1/mo-prod/images/6c/vehicle.jpg" alt="Ford Transit Custom 2.0 TDCi" />
        <h2>Ford Transit Custom 2.0 TDCi 320 L2H1 Trend Sortimo</h2>
        <span>19.277 €</span>
        <span>16.199 € (Netto)</span>
        <div>07/2021</div>
        <div>141.950 km</div>
        <div>96 kW (131 PS)</div>
        <div>Diesel</div>
        <div>Kastenwagen hoch + lang</div>
      </a>
    `

    expect(parseMobileInventoryHtml(html)).toEqual([
      {
        id: '425456138',
        title: 'Ford Transit Custom 2.0 TDCi 320 L2H1 Trend Sortimo',
        priceGross: '19.277 €',
        priceNet: '16.199 € (Netto)',
        firstRegistration: '07/2021',
        mileage: '141.950 km',
        power: '96 kW (131 PS)',
        fuel: 'Diesel',
        category: 'Kastenwagen hoch + lang',
        imageUrl: 'https://img.classistatic.de/api/v1/mo-prod/images/6c/vehicle.jpg',
        detailUrl: 'https://suchen.mobile.de/fahrzeuge/details.html?id=425456138',
      },
    ])
  })
})
