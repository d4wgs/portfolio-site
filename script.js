// Minimal particle grid + section reveals + ticker content
;(() => {
  const canvas = document.getElementById("bg")
  const ctx = canvas.getContext("2d")
  let w,
    h,
    t = 0
  function resize() {
    w = canvas.width = innerWidth
    h = canvas.height = innerHeight
  }
  addEventListener("resize", resize, { passive: true })
  resize()

  // Draw animated grid
  function draw() {
    t += 0.004
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#0a0a0b"
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = "rgba(225,29,72,0.15)"
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

    // floating points
    const count = 60
    for (let i = 0; i < count; i++) {
      const px = (i * 137.5 + t * 800) % w
      const py = (i * 73.3 + t * 420) % h
      const r = 1.2 + (i % 3)
      ctx.fillStyle = "rgba(225,29,72,0.35)"
      ctx.beginPath()
      ctx.arc(px, py, r, 0, Math.PI * 2)
      ctx.fill()
    }
    requestAnimationFrame(draw)
  }
  draw()

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("show")
      })
    },
    { threshold: 0.1 },
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

  // Year
  const year = document.getElementById("year")
  if (year) year.textContent = new Date().getFullYear()

  // Enhanced ticker content with real-time updates
  const track = document.getElementById("tickerTrack")
  const symbols = ["S&P500", "NASDAQ", "VIX", "BTC", "PLTR", "HII", "NVDA", "TSM"]
  const tickerData = {}

  // Generate mock data for ticker
  function generateTickerData() {
    return symbols.map((symbol) => {
      const price = Math.random() * 1000 + 50
      const change = (Math.random() - 0.5) * 20
      const changePercent = (change / price) * 100

      return {
        symbol,
        price: price.toFixed(2),
        change: change.toFixed(2),
        changePercent: changePercent.toFixed(2),
        isPositive: change >= 0,
      }
    })
  }

  function updateTicker() {
    const data = generateTickerData()
    const tickerHTML = data
      .map((item) => {
        const colorClass = item.isPositive ? "positive" : "negative"
        const arrow = item.isPositive ? "▲" : "▼"
        return `
      <span class="ticker-item ${colorClass}">
        <strong>${item.symbol}</strong>
        $${item.price}
        <span class="change">${arrow} ${Math.abs(item.change)} (${Math.abs(item.changePercent)}%)</span>
      </span>
    `
      })
      .join("")

    // Duplicate for seamless scrolling
    track.innerHTML = tickerHTML + tickerHTML
  }

  // Initial ticker update
  updateTicker()

  // Auto-update ticker every hour on weekdays
  function scheduleTickerUpdates() {
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Only update on weekdays (Monday = 1 to Friday = 5)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      setInterval(updateTicker, 60 * 60 * 1000) // Update every hour
    }
  }

  scheduleTickerUpdates()

  // Add ticker styles dynamically
  const tickerStyles = `
  .ticker-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 16px;
    font-size: 0.9rem;
    white-space: nowrap;
  }
  
  .ticker-item.positive {
    color: #10b981;
  }
  
  .ticker-item.negative {
    color: #ef4444;
  }
  
  .ticker-item .change {
    font-size: 0.8rem;
    opacity: 0.8;
  }
`

  // Inject styles
  const styleSheet = document.createElement("style")
  styleSheet.textContent = tickerStyles
  document.head.appendChild(styleSheet)
})()
