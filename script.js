;(() => {
  const canvas = document.getElementById("bg")
  const ctx = canvas.getContext("2d")
  let w, h, t = 0

  function resize() {
    w = canvas.width = innerWidth
    h = canvas.height = innerHeight
  }
  addEventListener("resize", resize, { passive: true })
  resize()

  function draw() {
    t += 0.004
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#0a0a0b"
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = "rgba(225,29,72,0.12)"
    ctx.lineWidth = 1
    const gap = 40
    const offset = Math.sin(t) * 10
    ctx.beginPath()
    for (let x = ((offset % gap) + gap) % gap; x < w; x += gap) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
    }
    for (let y = ((offset % gap) + gap) % gap; y < h; y += gap) {
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
    }
    ctx.stroke()

    const count = 60
    for (let i = 0; i < count; i++) {
      const px = (i * 137.5 + t * 800) % w
      const py = (i * 73.3 + t * 420) % h
      const r = 1 + (i % 3) * 0.5
      ctx.fillStyle = "rgba(225,29,72,0.3)"
      ctx.beginPath()
      ctx.arc(px, py, r, 0, Math.PI * 2)
      ctx.fill()
    }
    requestAnimationFrame(draw)
  }
  draw()

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("show") }),
    { threshold: 0.08 }
  )
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el))

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle")
  const items = document.querySelector(".nav-items")
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = items.classList.toggle("open")
      toggle.setAttribute("aria-expanded", String(open))
    })
  }

  // Close mobile nav on link click
  document.querySelectorAll(".nav-items a").forEach((a) => {
    a.addEventListener("click", () => {
      items.classList.remove("open")
      toggle?.setAttribute("aria-expanded", "false")
    })
  })

  // Year
  const year = document.getElementById("year")
  if (year) year.textContent = new Date().getFullYear()

  // Ticker
  const track = document.getElementById("tickerTrack")
  const symbols = ["S&P500", "NASDAQ", "VIX", "BTC", "PLTR", "HII", "NVDA", "TSM", "GS", "JPM"]

  function generateTickerData() {
    return symbols.map((symbol) => {
      const price = (Math.random() * 1000 + 50).toFixed(2)
      const change = ((Math.random() - 0.5) * 20).toFixed(2)
      const pct = Math.abs((change / price) * 100).toFixed(2)
      const pos = parseFloat(change) >= 0
      return { symbol, price, change, pct, pos }
    })
  }

  function updateTicker() {
    const data = generateTickerData()
    const html = data.map(({ symbol, price, change, pct, pos }) => {
      const cls = pos ? "positive" : "negative"
      const arrow = pos ? "▲" : "▼"
      return `<span class="ticker-item ${cls}"><strong>${symbol}</strong> $${price} <span class="change">${arrow} ${Math.abs(change)} (${pct}%)</span></span>`
    }).join("")
    track.innerHTML = html + html
  }

  updateTicker()

  // Inject ticker styles
  const style = document.createElement("style")
  style.textContent = `
    .ticker-item {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0 18px;
      font-size: 0.88rem;
      white-space: nowrap;
    }
    .ticker-item.positive { color: #10b981; }
    .ticker-item.negative { color: #ef4444; }
    .ticker-item .change { font-size: 0.78rem; opacity: 0.75; }
  `
  document.head.appendChild(style)
})()
