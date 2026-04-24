// SyncLogic Systems - Main Interactivity

// 1. Immediate Splash Removal Logic
(function() {
    const removeSplash = () => {
        const splash = document.getElementById('splash-screen');
        const body = document.body;
        if (splash) {
            splash.classList.add('fade-out');
            body.classList.remove('lock-scroll');
            setTimeout(() => {
                splash.style.display = 'none';
            }, 800);
        }
    };

    const initSplash = () => {
        const splash = document.getElementById('splash-screen');
        if (!splash) return;

        // Check if splash was already shown in this session
        const wasShown = sessionStorage.getItem('synclogic_splash_shown');

        if (wasShown) {
            splash.style.display = 'none';
            document.body.classList.remove('lock-scroll');
            return;
        }

        document.body.classList.add('lock-scroll');
        const loaderText = document.getElementById('loader-text');
        const phases = [
            "Initializing Sovereign Protocol...",
            "Decrypting Secure Systems...",
            "Syncing Logic Engine...",
            "Access Granted."
        ];
        let phaseIdx = 0;
        const textInterval = setInterval(() => {
            if (loaderText && phaseIdx < phases.length - 1) {
                phaseIdx++;
                loaderText.textContent = phases[phaseIdx];
            }
        }, 800);

        setTimeout(() => {
            clearInterval(textInterval);
            removeSplash();
            // Mark splash as shown for the rest of the session
            sessionStorage.setItem('synclogic_splash_shown', 'true');
        }, 3000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSplash);
    } else {
        initSplash();
    }
})();

// 2. Background Matrix/Security Animation
(function() {
    const initAnimation = () => {
        // Prevent multiple canvas creation
        if (document.getElementById('bg-canvas')) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        document.body.appendChild(canvas); // Use appendChild for reliability
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 50;
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class SecurityParticle {
            constructor() {
                this.init();
            }
            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 10 + 15;
                this.type = Math.random() > 0.6 ? 'lock' : (Math.random() > 0.5 ? 'shield' : 'node');
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.01;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;
                if (this.x < -30) this.x = canvas.width + 30;
                if (this.x > canvas.width + 30) this.x = -30;
                if (this.y < -30) this.y = canvas.height + 30;
                if (this.y > canvas.height + 30) this.y = -30;
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.beginPath();
                ctx.strokeStyle = '#ef4444'; // Bright Red for visibility
                ctx.lineWidth = 1.5;
                ctx.globalAlpha = 0.3; // Increased opacity

                if (this.type === 'shield') {
                    ctx.moveTo(0, -this.size/2);
                    ctx.lineTo(this.size/2, -this.size/4);
                    ctx.lineTo(this.size/2, this.size/4);
                    ctx.quadraticCurveTo(0, this.size/2 + 5, -this.size/2, this.size/4);
                    ctx.lineTo(-this.size/2, -this.size/4);
                    ctx.closePath();
                } else if (this.type === 'lock') {
                    // Draw a Lock
                    ctx.rect(-this.size/3, -this.size/6, (this.size/3)*2, this.size/2.5);
                    ctx.moveTo(-this.size/4, -this.size/6);
                    ctx.arc(0, -this.size/6, this.size/4, Math.PI, 0);
                } else {
                    ctx.arc(0, 0, this.size/4, 0, Math.PI * 2);
                    ctx.moveTo(-this.size/2, 0); ctx.lineTo(this.size/2, 0);
                    ctx.moveTo(0, -this.size/2); ctx.lineTo(0, this.size/2);
                }
                ctx.stroke();
                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) particles.push(new SecurityParticle());

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Subtle Grid
            ctx.strokeStyle = '#620809';
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = 0.1;
            const gridSize = 120;
            for(let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
            }
            for(let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }

            // High-contrast Red Connections
            ctx.strokeStyle = '#ef4444'; 
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 180) {
                        ctx.beginPath();
                        ctx.globalAlpha = (1 - dist / 180) * 0.15;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        };
        animate();
    };

    // Ensure it runs on all pages
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initAnimation();
    } else {
        document.addEventListener('DOMContentLoaded', initAnimation);
    }
})();

// 3. Form and UI Interaction
(function() {
    const initUI = () => {
        // Handle Selection from URL (Resilient to file:// restrictions)
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const selection = urlParams.get('selection');
            const packageSelect = document.getElementById('packageSelect');
            if (selection && packageSelect) {
                packageSelect.value = selection;
            }
        } catch (e) {
            // Silently fail if local file restrictions block URL search params
        }

        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const btn = contactForm.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = 'Transmitting...';
                btn.style.opacity = '0.7';
                btn.disabled = true;

                // --- Sovereign Webhook Protocol ---
                // Placeholder for future automation integration
                const WEBHOOK_URL = ""; 
                
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData.entries());

                if (WEBHOOK_URL) {
                    fetch(WEBHOOK_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            source: "SyncLogic Systems Website",
                            payload: data,
                            timestamp: new Date().toISOString()
                        })
                    }).catch(err => console.warn("Webhook transmission deferred."));
                }

                setTimeout(() => {
                    alert('Inquiry Received. A Systems Architect will contact you shortly.');
                    btn.textContent = originalText;
                    btn.style.opacity = '1';
                    btn.disabled = false;
                    contactForm.reset();
                }, 1500);
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initUI();
    } else {
        document.addEventListener('DOMContentLoaded', initUI);
    }
})();
