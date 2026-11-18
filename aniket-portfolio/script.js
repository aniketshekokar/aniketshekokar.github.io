const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];
$('#year').textContent = new Date().getFullYear();

// Scroll progress
const progress = $('.scroll-progress span');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
};
addEventListener('scroll', updateProgress, {passive:true});
updateProgress();

// Reveal content as it enters the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold:0.12});
$$('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${Math.min((i % 4) * 75, 225)}ms`;
  observer.observe(el);
});

// Custom cursor with smooth follow
const dot = $('.cursor-dot');
const ring = $('.cursor-ring');
let pointer = {x: innerWidth/2, y: innerHeight/2};
let ringPos = {...pointer};
addEventListener('pointermove', e => {
  pointer = {x:e.clientX, y:e.clientY};
  dot.style.left = `${pointer.x}px`;
  dot.style.top = `${pointer.y}px`;
});
function cursorLoop(){
  ringPos.x += (pointer.x-ringPos.x)*.16;
  ringPos.y += (pointer.y-ringPos.y)*.16;
  ring.style.left = `${ringPos.x}px`;
  ring.style.top = `${ringPos.y}px`;
  requestAnimationFrame(cursorLoop);
}
cursorLoop();
$$('a, button, [data-tilt]').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

// Pointer tilt: restrained depth, disabled on touch screens
const canHover = matchMedia('(hover:hover) and (pointer:fine)').matches;
if (canHover) {
  $$('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width - .5;
      const y = (e.clientY-r.top)/r.height - .5;
      const strength = card.classList.contains('core-wrap') ? 12 : 4;
      card.style.transform = `perspective(900px) rotateX(${-y*strength}deg) rotateY(${x*strength}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

// Magnetic interaction for buttons and links
if (canHover) {
  $$('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left+r.width/2);
      const dy = e.clientY - (r.top+r.height/2);
      el.style.transform = `translate(${dx*.10}px, ${dy*.14}px)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });
}

// Mobile navigation
const menuButton = $('.menu-toggle');
const nav = $('.desktop-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
$$('.desktop-nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Smooth anchor navigation with native browser support
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = $(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    }
  });
});
