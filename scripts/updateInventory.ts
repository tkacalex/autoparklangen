import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { parseMobileInventoryHtml, type InventoryVehicle } from './mobileInventoryParser'

const SOURCE_URL = 'https://home.mobile.de/AUTOPARKLANGEN'
const OUTPUT_PATH = resolve('src/data/inventory.json')

type InventoryJson = {
  source: string
  sourceLabel: string
  fetchedAt: string
  status: 'partial' | 'complete'
  note: string
  vehicles: InventoryVehicle[]
}

async function fetchDealerPage(pageNumber: number) {
  const url = pageNumber === 1 ? SOURCE_URL : `${SOURCE_URL}?pageNumber=${pageNumber}`
  const response = await fetch(url, {
    headers: {
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'de-DE,de;q=0.9,en;q=0.8',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    },
  })

  return response.text()
}

async function loadExistingInventory() {
  try {
    const existing = await readFile(OUTPUT_PATH, 'utf8')
    return JSON.parse(existing) as InventoryJson
  } catch {
    return undefined
  }
}

const dedupe = (vehicles: InventoryVehicle[]) =>
  Array.from(new Map(vehicles.map((vehicle) => [vehicle.id, vehicle])).values())

async function main() {
  const pages = await Promise.all([1, 2, 3, 4, 5].map((page) => fetchDealerPage(page)))
  const vehicles = dedupe(pages.flatMap((html) => parseMobileInventoryHtml(html)))

  if (vehicles.length === 0) {
    const existing = await loadExistingInventory()
    console.error(
      [
        'mobile.de konnte nicht zuverlässig importiert werden.',
        'Die vorhandene src/data/inventory.json wurde nicht überschrieben.',
        'Grund: keine Fahrzeugkarten gefunden. Häufige Ursache ist Access denied, Consent oder Bot Schutz.',
        `Vorhandene Datensätze: ${existing?.vehicles.length ?? 0}`,
      ].join('\n'),
    )
    process.exitCode = 1
    return
  }

  const payload: InventoryJson = {
    source: SOURCE_URL,
    sourceLabel: 'mobile.de Händlerbestand',
    fetchedAt: new Date().toISOString(),
    status: vehicles.length >= 100 ? 'complete' : 'partial',
    note:
      vehicles.length >= 100
        ? 'Automatisch importierter Bestand aus der öffentlich erreichbaren mobile.de Händlerseite.'
        : 'Automatisch importierte Auswahl aus der öffentlich erreichbaren mobile.de Händlerseite. Der vollständige Bestand ist über den mobile.de Link erreichbar.',
    vehicles,
  }

  await mkdir(dirname(OUTPUT_PATH), { recursive: true })
  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  console.info(`Inventory aktualisiert: ${vehicles.length} Fahrzeuge in ${OUTPUT_PATH}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
