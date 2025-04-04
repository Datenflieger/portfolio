document.addEventListener('DOMContentLoaded', () => {
    const typingText = document.getElementById('typing-text');
    const techIcons = document.querySelectorAll('.tech-icon');
    
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = this.getRandomColor();
            this.alpha = Math.random() * 0.5 + 0.1;
            this.connected = [];
        }
        
        getRandomColor() {
            const colors = ['#8a00e6', '#b14aff', '#390066'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    const particles = [];
    const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function connectParticles() {
        const maxDistance = 150;
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].connected = [];
            
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    particles[i].connected.push({ particle: particles[j], opacity });
                }
            }
        }
        
        for (let i = 0; i < particles.length; i++) {
            for (const connection of particles[i].connected) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(connection.particle.x, connection.particle.y);
                ctx.strokeStyle = '#8a00e6';
                ctx.globalAlpha = connection.opacity * 0.4;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
    
    let mouse = {
        x: null,
        y: null,
        radius: 150
    };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            if (mouse.x && mouse.y) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    particles[i].x += forceDirectionX * force * 2;
                    particles[i].y += forceDirectionY * force * 2;
                }
            }
        }
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    animate();
    
    techIcons.forEach((icon, index) => {
        const delay = parseInt(icon.getAttribute('data-delay') || index * 100);
        icon.style.setProperty('--delay', delay);
    });
    
    const texts = ['Developer from Germany', 'Minecraft Enthusiast', 'Always Learning'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(typeText, typingSpeed);
    }
    
    typeText();
    
    const card = document.querySelector('.card');
    
    if (card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleY = (x - centerX) / 25;
            const angleX = (centerY - y) / 25;
            
            card.style.transform = `rotateY(${angleY}deg) rotateX(${angleX}deg)`;
            
            const glowX = ((x / rect.width) * 100);
            const glowY = ((y / rect.height) * 100);
            
            card.style.backgroundImage = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(138, 0, 230, 0.1) 0%, transparent 50%)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateY(0) rotateX(0)';
            card.style.backgroundImage = 'none';
        });
    }
    
    techIcons.forEach((icon, index) => {
        const floatDuration = 3 + (index % 3);
        const floatDelay = index * 0.2;
        
        icon.style.animation = `${icon.style.animation}, float ${floatDuration}s ease-in-out ${floatDelay}s infinite alternate`;
        
        icon.addEventListener('mouseover', () => {
            icon.style.filter = 'drop-shadow(0 0 10px rgba(138, 0, 230, 0.8))';
            icon.style.transform = 'scale(1.3) rotate(5deg)';
        });
        
        icon.addEventListener('mouseout', () => {
            icon.style.filter = '';
            icon.style.transform = '';
        });
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
}); 