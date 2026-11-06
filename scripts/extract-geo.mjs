// Extract Iran/Iraq region countries from world-atlas 50m TopoJSON into compact GeoJSON
import { readFileSync, writeFileSync } from 'fs'
import * as topojson from 'topojson-client'

const topo = JSON.parse(readFileSync('/tmp/countries-50m.json', 'utf8'))
const fc = topojson.feature(topo, topo.objects.countries)
const names = {
  Iran: 'ایران',
  Iraq: 'عراق',
  Kuwait: 'کویت',
  Turkey: 'ترکیه',
  Syria: 'سوریه',
  'Saudi Arabia': 'عربستان سعودی',
  Jordan: 'اردن',
  Azerbaijan: 'آذربایجان',
  Armenia: 'ارمنستان',
  Turkmenistan: 'ترکمنستان',
  Afghanistan: 'افغانستان',
  Pakistan: 'پاکستان',
}
const out = {
  type: 'FeatureCollection',
  features: fc.features
    .filter(f => names[f.properties.name])
    .map(f => ({
      type: 'Feature',
      properties: { en: f.properties.name, fa: names[f.properties.name] },
      geometry: f.geometry,
    })),
}
// Round coordinates to 2 decimals to shrink size
const round = c => {
  if (Array.isArray(c[0])) return c.map(round)
  return [Math.round(c[0] * 100) / 100, Math.round(c[1] * 100) / 100]
}
out.features.forEach(f => { f.geometry.coordinates = round(f.geometry.coordinates) })
writeFileSync('/home/z/my-project/public/geo/boundaries.json', JSON.stringify(out))
console.log('features:', out.features.length, 'size:', Math.round(JSON.stringify(out).length / 1024), 'KB')
