// Wires the specimen: appearance settings (saved per visitor), colourway minis, bands, motifs and the sampler's
// interactions. Drawings come from seed.js, lettering.js, motifs.js and follies.js.
;(function () {
  const SG = window.SG
  const M = SG.motifs
  const root = document.documentElement
  const STORE = 'serigraph-specimen'

  const COLOURWAYS = ['sky', 'pistachio', 'coral', 'marigold', 'night']
  const SETTINGS = [
    { key: 'colourway', label: 'Colourway', swatches: COLOURWAYS },
    { key: 'poster', label: 'Poster mat', toggle: ['on', 'off'] },
    { key: 'line', label: 'Line', options: [['1', '1 px'], ['1.5', '1.5 px']] },
    { key: 'fields', label: 'Fields', options: [['tint', 'Tint'], ['paper', 'Paper']] },
    { key: 'pressed', label: 'Pressed', options: [['shade', 'Shade'], ['stipple', 'Stipple'], ['line', 'Line']] },
    { key: 'backdrop', label: 'Dialog backdrop', options: [['stipple', 'Stipple'], ['clouds', 'Clouds']] },
    { key: 'read', label: 'Reading face', options: [['archivo', 'Archivo'], ['instrument', 'Instrument'], ['manrope', 'Manrope']] },
    { key: 'grain', label: 'Paper grain', toggle: ['on', 'off'] },
  ]
  const title = (s) => s[0].toUpperCase() + s.slice(1)

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORE)) || {}
    } catch {
      return {}
    }
  }
  function save() {
    try {
      const out = {}
      SETTINGS.forEach((s) => (out[s.key] = root.dataset[s.key]))
      localStorage.setItem(STORE, JSON.stringify(out))
    } catch {
      /* private windows: settings last for this visit only */
    }
  }

  /** Redraw everything that bakes the line weight into its SVG. */
  function redrawArt() {
    document.querySelectorAll('[data-lettering]').forEach((el) => SG.lettering.mount(el))
    SG.follies.redrawAll()
    drawBands()
    drawMotifs()
    drawBackdrop()
  }

  function set(key, value) {
    root.dataset[key] = value
    document.querySelectorAll(`[data-setting="${key}"] [role="radio"], [data-setting="${key}"] [role="switch"]`).forEach((b) => {
      if (b.getAttribute('role') === 'switch') b.setAttribute('aria-checked', String(value === 'on'))
      else b.setAttribute('aria-checked', String(b.dataset.value === value))
    })
    if (key === 'colourway') document.querySelector('[data-colourway-name]').textContent = title(value)
    if (key === 'line') redrawArt()
    if (key === 'backdrop') drawBackdrop()
    save()
  }

  function buildSettings() {
    const host = document.querySelector('[data-settings]')
    host.innerHTML = SETTINGS.map((s) => {
      const id = `set-${s.key}`
      let control
      if (s.swatches) {
        control =
          `<div class="row"><div class="swatches" role="radiogroup" aria-labelledby="${id}">` +
          s.swatches.map((c) => `<button class="swatch" type="button" role="radio" data-value="${c}" data-colourway="${c}" aria-label="${title(c)}"></button>`).join('') +
          '</div><span class="caps label-sm" data-colourway-name></span></div>'
      } else if (s.toggle) {
        control = `<button class="switch" type="button" role="switch" aria-labelledby="${id}" data-toggle><span class="knob"></span></button>`
      } else {
        control =
          `<div class="segmented" role="radiogroup" aria-labelledby="${id}">` +
          s.options.map(([v, l]) => `<button type="button" role="radio" data-value="${v}">${l}</button>`).join('') +
          '</div>'
      }
      return `<div class="setting" data-setting="${s.key}"><span class="caps label-sm" id="${id}">${s.label}</span>${control}</div>`
    }).join('')
    host.addEventListener('click', (e) => {
      const row = e.target.closest('[data-setting]')
      const btn = e.target.closest('button')
      if (!row || !btn) return
      const s = SETTINGS.find((x) => x.key === row.dataset.setting)
      if (s.toggle) set(s.key, root.dataset[s.key] === 'on' ? 'off' : 'on')
      else set(s.key, btn.dataset.value)
    })
    const stored = load()
    SETTINGS.forEach((s) => set(s.key, stored[s.key] || root.dataset[s.key]))
  }

  function buildMinis() {
    const host = document.querySelector('[data-minis]')
    host.innerHTML = COLOURWAYS.map(
      (c) => `<figure class="mini" data-colourway="${c}">
        <div class="mini-sheet"><div class="canvas mini-canvas">
          <span data-lettering="Dome" data-cap="44"></span>
          <p class="caps label-sm">November 15<span class="ord">th</span></p>
          <div class="arch-window" data-folly="window" data-seed="dome"></div>
          <button class="btn btn-primary btn-sm" type="button">Book</button>
        </div></div>
        <figcaption><button class="btn btn-outline btn-sm" type="button" data-pick="${c}">${title(c)}</button></figcaption>
      </figure>`,
    ).join('')
    host.addEventListener('click', (e) => {
      const pick = e.target.closest('[data-pick]')
      if (pick) set('colourway', pick.dataset.pick)
    })
  }

  function drawBands() {
    const L = SG.linePx()
    document.querySelectorAll('[data-band]').forEach((el, i) => {
      if (el.dataset.band === 'clouds') {
        const body = M.cloudBank(SG.stream(`band-${i}`, 'clouds'), { x0: 0, x1: 1200, base: 120, top: 8, rmin: 28, rmax: 56, fill: 'cloud', L, id: `band${i}` })
        el.innerHTML = SG.el('svg', { viewBox: '0 0 1200 120', preserveAspectRatio: 'xMidYMax slice', focusable: 'false' }, body)
      } else {
        const id = `arcade${i}`
        el.innerHTML = SG.el('svg', { viewBox: '0 0 1200 104', preserveAspectRatio: 'xMidYMin slice', focusable: 'false' }, M.defs(id, { pitch: 3 }) + M.arcadeBand({ L, id }))
      }
    })
  }

  function drawBackdrop() {
    const el = document.querySelector('[data-backdrop-art]')
    if (root.dataset.backdrop !== 'clouds') {
      el.innerHTML = ''
      return
    }
    const L = SG.linePx()
    const back = M.cloudBank(SG.stream('backdrop', 'back'), { x0: 0, x1: 600, base: 240, top: 10, rmin: 40, rmax: 70, fill: 'paper', L, id: 'bd1' })
    const front = M.cloudBank(SG.stream('backdrop', 'front'), { x0: 0, x1: 600, base: 240, top: 70, rmin: 32, rmax: 58, fill: 'cloud', L, id: 'bd2' })
    el.innerHTML = SG.el('svg', { viewBox: '0 0 600 240', preserveAspectRatio: 'xMidYMax slice', focusable: 'false' }, back + front)
  }

  function drawMotifs() {
    const L = SG.linePx()
    const id = 'mt'
    const tiles = [
      ['Pinwheel', M.pinwheel(60, 60, 46, 'action', L)],
      ['Spinner', `<g class="spin">${M.pinwheel(60, 60, 30, 'sun', L)}</g>`],
      ['Sparkles', M.sparkle(48, 54, 26, L) + M.sparkle(88, 30, 12, L) + M.sparkle(84, 88, 9, L)],
      ['Louvers', M.shape('M 18 22 H 102 V 98 H 18 Z', `url(#${id}-louvers)`, L)],
      ['Stipple', M.ball(60, 60, 42, 'bloom', L, id)],
      ['Archway', M.shape('M 22 108 V 54 A 38 38 0 0 1 98 54 V 108 Z', 'structure', L) + M.shape('M 46 108 V 74 A 14 14 0 0 1 74 74 V 108 Z', 'ink', L)],
      ['Platform', M.shape('M 50 64 H 70 V 116 H 50 Z', 'platform', L) + M.shape(M.ellipse(60, 64, 50, 11), 'ink', L) + M.shape(M.ellipse(60, 56, 50, 11), 'platform', L)],
      ['Cloud bank', M.cloudBank(SG.stream('motif', 'cloud'), { x0: 6, x1: 114, base: 104, top: 34, rmin: 16, rmax: 26, fill: 'paper', L, id })],
      ['Rings and dots', M.scatter(SG.stream('motif', 'scatter'), { x0: 16, y0: 16, x1: 104, y1: 104, L, sparkles: 1, rings: 6, dots: 8 })],
    ]
    document.querySelector('[data-motifs]').innerHTML = tiles
      .map(([name, art]) => `<figure class="motif"><svg viewBox="0 0 120 120" aria-hidden="true">${M.defs(id, { pitch: 3.2 })}${art}</svg><figcaption class="caps label-sm">${name}</figcaption></figure>`)
      .join('')
  }

  function wireSampler() {
    document.addEventListener('click', (e) => {
      const sw = e.target.closest('.switch:not([data-toggle])')
      if (sw) sw.setAttribute('aria-checked', String(sw.getAttribute('aria-checked') !== 'true'))
      const seg = e.target.closest('[data-segmented] [role="radio"]')
      if (seg) seg.parentElement.querySelectorAll('[role="radio"]').forEach((b) => b.setAttribute('aria-checked', String(b === seg)))
      if (e.target.closest('[data-reroll]')) {
        const art = document.querySelector('.hero-art')
        art.dataset.seed = Math.random().toString(36).slice(2, 8)
        SG.follies.mount(art)
      }
      if (e.target.closest('[data-panel-toggle]')) togglePanel()
    })

    const texts = [
      'Tonight the dome opens at nine. Three shows, one telescope session, and tea on the terrace between them.',
      'The evening sky at six, Planets in motion at half past seven, Deep sky at nine and The quiet universe at half past ten.',
      'Two seats for Saturday, row F. Tickets can move to any other clear night this month.',
    ]
    const tabs = [...document.querySelectorAll('[data-tabs] [role="tab"]')]
    const choose = (tab) => {
      tabs.forEach((t) => {
        t.setAttribute('aria-selected', String(t === tab))
        t.tabIndex = t === tab ? 0 : -1
      })
      document.querySelector('[data-tab-text]').textContent = texts[tabs.indexOf(tab)]
      document.querySelector('[role="tabpanel"]').setAttribute('aria-labelledby', tab.id)
    }
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => choose(t))
      t.addEventListener('keydown', (e) => {
        const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
        if (!step) return
        const next = tabs[(i + step + tabs.length) % tabs.length]
        choose(next)
        next.focus()
      })
    })

    document.querySelectorAll('.slider').forEach((s) => {
      const update = () => {
        const p = (s.value - s.min) / (s.max - s.min)
        s.style.setProperty('--v', `${p * 100}%`)
        s.style.setProperty('--turn', `${Math.round(p * 360)}deg`)
      }
      s.addEventListener('input', update)
      update()
    })
  }

  function togglePanel(force) {
    const panel = document.getElementById('appearance')
    const open = force ?? panel.hidden
    panel.hidden = !open
    document.querySelectorAll('[aria-controls="appearance"]').forEach((b) => b.setAttribute('aria-expanded', String(open)))
    if (open) panel.querySelector('button').focus()
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('appearance').hidden) {
      togglePanel(false)
      document.querySelector('[aria-controls="appearance"]').focus()
    }
  })

  buildMinis()
  buildSettings()
  wireSampler()
  drawBands()
  drawMotifs()
  drawBackdrop()
  SG.lettering.mountAll()
  SG.follies.mountAll()
  document.fonts?.ready.then(() => document.querySelectorAll('[data-lettering]').forEach((el) => SG.lettering.mount(el)))
})()
