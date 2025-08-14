
;(() => {
  // Theme toggle
  const root = document.documentElement
  const themeToggle = document.getElementById('themeToggle')
  const saved = localStorage.getItem('theme')
  if (saved) root.setAttribute('data-theme', saved)
  themeToggle && themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  })

  // i18n
  const strings = {
    de: {
      nav_home: "Home", nav_about: "Über mich", nav_projects: "Projekte", nav_experience:"Erfahrung", nav_contact:"Kontakt",
      hero_title: "Hallo, ich bin Twin",
      hero_sub: "IMS Schülerin Praxisjahr 2026 bis 2027 gesucht",
      hero_desc: "Technik begeistert, teamorientiert und lernfreudig. Ich bringe Ideen in sauberen Code und liebe klare Lösungen.",
      cta_projects: "Projekte ansehen", cta_download: "Lebenslauf herunterladen", cta_games: "Game spielen",
      hi_speed_title:"Schneller Einstieg", hi_speed_text:"Kurze Ramp up Zeit, produktiv vom ersten Tag. Saubere Übergaben und klare Dokumentation.",
      hi_reliable_title:"Zuverlässig", hi_reliable_text:"Verbindliche Kommunikation, pünktliche Abgaben, Fokus auf Qualität und Nutzen.",
      hi_curiosity_title:"Neugierig", hi_curiosity_text:"Ich lerne schnell und eigne mir neue Tools selbstständig an. Immer mit Blick auf das Ziel.",
      exp_title:"Erfahrung", exp_more:"alles ansehen →",
      exp_school_title:"IMS Baden Schulprojekte",
      exp_p1:"Textbasiertes Spiel und Web Tools", exp_p2:"Git Workflow Reviews Dokumentation", exp_p3:"Grundlagen Deployment und SEO",
      fun_title:"Fun Fact",
      fun_text:"Ich habe schon als Kind bei Oikos Tamil Church Technik gemacht. Das hat meine Liebe zu Medien und IT geprägt.",
      fun_btn:"Konfetti",
      cta_cv_title:"Ein Blick in meinen Lebenslauf",
      form_name:"Name", form_name_err:"Bitte Name eingeben.", form_mail:"E Mail", form_mail_err:"Bitte gültige E Mail eingeben.",
      form_subject:"Betreff", form_subject_err:"Bitte Betreff eingeben.", form_msg:"Nachricht", form_msg_err:"Bitte Nachricht eingeben.",
      form_file:"Datei Upload optional PDF ZIP", form_send:"Absenden", contact_more:"Weitere Kontaktwege"
    },
    en: {
      nav_home:"Home", nav_about:"About", nav_projects:"Projects", nav_experience:"Experience", nav_contact:"Contact",
      hero_title:"Hi, I am Twin",
      hero_sub:"IMS student seeking apprenticeship 2026 to 2027",
      hero_desc:"Tech enthusiast, team oriented and eager to learn. I turn ideas into clean code and love clear solutions.",
      cta_projects:"View projects", cta_download:"Download CV", cta_games:"Play game",
      hi_speed_title:"Fast ramp up", hi_speed_text:"Productive from day one. Clean handovers and documentation.",
      hi_reliable_title:"Reliable", hi_reliable_text:"Clear communication, on time delivery, quality and impact.",
      hi_curiosity_title:"Curious", hi_curiosity_text:"I learn fast and adopt new tools independently with a goal in mind.",
      exp_title:"Experience", exp_more:"see all →",
      exp_school_title:"IMS Baden school projects",
      exp_p1:"Text based game and web tools", exp_p2:"Git workflow reviews docs", exp_p3:"Basics of deployment and SEO",
      fun_title:"Fun fact",
      fun_text:"I have helped with tech at Oikos Tamil Church since I was a kid. That sparked my love for media and IT.",
      fun_btn:"Confetti",
      cta_cv_title:"Take a look at my CV",
      form_name:"Name", form_name_err:"Please enter your name.", form_mail:"Email", form_mail_err:"Please enter a valid email.",
      form_subject:"Subject", form_subject_err:"Please enter a subject.", form_msg:"Message", form_msg_err:"Please enter a message.",
      form_file:"File upload optional PDF ZIP", form_send:"Send", contact_more:"More ways to reach me"
    }
  }
  const langToggle = document.getElementById('langToggle')
  const applyLang = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n')
      if (strings[lang] && strings[lang][key]) el.textContent = strings[lang][key]
    })
  }
  const savedLang = localStorage.getItem('lang') || 'de'
  applyLang(savedLang)
  langToggle && langToggle.addEventListener('click', () => {
    const lang = (localStorage.getItem('lang') || 'de') === 'de' ? 'en' : 'de'
    localStorage.setItem('lang', lang); applyLang(lang)
  })

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target) } })
  },{threshold:.15})
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el))

  // Confetti
  const confettiBtn = document.getElementById('confettiBtn')
  confettiBtn && confettiBtn.addEventListener('click', () => {
    const c = document.createElement('canvas')
    Object.assign(c.style,{position:'fixed',left:0,top:0,width:'100vw',height:'100vh',pointerEvents:'none',zIndex:9999})
    document.body.appendChild(c)
    const ctx = c.getContext('2d'); const W = c.width = innerWidth; const H = c.height = innerHeight
    const parts = Array.from({length: 140}, () => ({
      x: Math.random()*W, y: -20, r: 4 + Math.random()*6, vx: (Math.random()-.5)*2, vy: 2+Math.random()*3,
      color: `hsl(${Math.random()*360},85%,60%)`, a:1
    }))
    const tick = () => {
      ctx.clearRect(0,0,W,H)
      parts.forEach(p => { p.x+=p.vx; p.y+=p.vy; p.a -= 0.005; ctx.globalAlpha = Math.max(p.a,0); ctx.fillStyle=p.color; ctx.fillRect(p.x,p.y,p.r,p.r)})
      if (parts.some(p=>p.a>0 && p.y<H+20)) requestAnimationFrame(tick); else c.remove()
    }
    tick()
  })

  // Project filters
  const buttons = document.querySelectorAll('.filter-btn')
  const grid = document.getElementById('projectGrid')
  if(buttons.length && grid){
    buttons.forEach(btn => btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      const f = btn.getAttribute('data-filter')
      grid.querySelectorAll('article').forEach(card => {
        const tags = card.getAttribute('data-tags') || ''
        const show = f === 'all' || tags.split(' ').includes(f)
        card.style.display = show ? '' : 'none'
      })
    }))
  }

  // Contact form validation
  const form = document.getElementById('contactForm')
  if(form){
    form.addEventListener('submit', (ev) => {
      const n = form.name.value.trim(), m = form.message.value.trim(), s = form.subject.value.trim(), e = form.email.value.trim()
      let ok = true
      const set = (id, show) => { const el = document.getElementById(id); if (el) el.classList.toggle('hidden', !show) }
      set('nameError', !n); ok = ok && !!n
      set('subjectError', !s); ok = ok && !!s
      set('messageError', !m); ok = ok && !!m
      set('emailError', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)); ok = ok && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
      if(!ok) ev.preventDefault()
      else {
        const t = document.getElementById('successToast'); t.style.opacity = 1; setTimeout(()=> t.style.opacity=0, 2500)
      }
    })
  }

  // Livestream Hero game
  const g = document.getElementById('livegame')
  if(g){
    const ctx = g.getContext('2d')
    const W = g.width, H = g.height
    const player = {x:40,y:H-60,w:22,h:22, vx:0, vy:0, speed:3}
    let items = [], hazards = [], score = 0, running = true, pressed = {}
    const spawnItem = () => items.push({x:Math.random()*(W-20), y:-20, w:18, h:18, vy:1.6 + Math.random()*1.2, type: Math.random()<.5?'cam':'mic'})
    const spawnHaz = () => hazards.push({x:Math.random()*(W-28), y:-28, w:24, h:24, vy:2 + Math.random()*1.5})
    for(let i=0;i<5;i++) spawnItem()
    for(let i=0;i<2;i++) spawnHaz()
    const drawIcon = (x,y,t) => {
      ctx.save(); ctx.translate(x,y); ctx.fillStyle = t==='cam' ? '#60A5FA' : '#2563EB'
      if(t==='cam'){ ctx.fillRect(0,4,14,8); ctx.fillRect(14,6,6,4); ctx.fillRect(5,12,6,3) }
      else { ctx.beginPath(); ctx.arc(9,9,7,0,Math.PI*2); ctx.fill(); ctx.fillRect(8,12,2,6) }
      ctx.restore()
    }
    const collide = (a,b) => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y
    const tick = () => {
      if(!running) return
      // input
      player.vx = (pressed['ArrowRight']?1:0) - (pressed['ArrowLeft']?1:0)
      player.vy = (pressed['ArrowDown']?1:0) - (pressed['ArrowUp']?1:0)
      player.x += player.vx*player.speed; player.y += player.vy*player.speed
      player.x = Math.max(0, Math.min(W-player.w, player.x))
      player.y = Math.max(0, Math.min(H-player.h, player.y))
      // move objects
      items.forEach(o => o.y += o.vy)
      hazards.forEach(o => o.y += o.vy)
      if(Math.random()<.03) spawnItem()
      if(Math.random()<.02) spawnHaz()
      items = items.filter(o => o.y < H+30)
      hazards = hazards.filter(o => o.y < H+30)
      // collisions
      items.forEach((o,i)=>{
        if(collide(player,o)){ score += 1; items.splice(i,1) }
      })
      hazards.forEach((o)=>{
        if(collide(player,o)){ running = false }
      })
      // draw
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--panel')
      ctx.fillRect(0,0,W,H)
      // stage floor
      ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(0,H-40,W,40)
      // items
      items.forEach(o => drawIcon(o.x,o.y,o.type))
      // hazards visual
      ctx.fillStyle = '#ef4444'; hazards.forEach(o => { ctx.fillRect(o.x,o.y,o.w,o.h) })
      // player
      ctx.fillStyle = '#22c55e'; ctx.fillRect(player.x,player.y,player.w,player.h)
      // ui
      document.getElementById('lscore').textContent = score
      if(running) requestAnimationFrame(tick)
      else {
        ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0,0,W,H)
        ctx.fillStyle = '#ffffff'; ctx.font = '20px Inter'; ctx.fillText('Stream gestört Neustart mit Button', 120, H/2)
      }
    }
    window.addEventListener('keydown', e => { pressed[e.key]=true })
    window.addEventListener('keyup', e => { pressed[e.key]=false })
    document.getElementById('lrestart')?.addEventListener('click', () => {
      items = []; hazards = []; score = 0; running = true; tick()
    })
    tick()
  }
})()
