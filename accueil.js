// Animation du menu de navigation
document.addEventListener('DOMContentLoaded', function() {
    // Gestion de la classe active pour la navigation
    const navLinks = document.querySelectorAll('nav a');
    
    function setActiveLink() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Écouter le scroll pour mettre à jour le lien actif
    window.addEventListener('scroll', setActiveLink);

    // Gestion du clic sur les liens
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Retirer la classe active de tous les liens
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Ajouter la classe active au lien cliqué
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation du menu au scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.backgroundColor = '#fff';
            header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        }
    });

    // Animation des sections au scroll
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });

    // Fonction de recherche
    const searchBar = document.querySelector('.search-bar');
    const searchIcon = document.querySelector('.search-icon');

    searchIcon.addEventListener('click', function() {
        if (searchBar.value.trim() !== '') {
            console.log('Recherche :', searchBar.value);
        }
    });

    searchBar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && searchBar.value.trim() !== '') {
            console.log('Recherche :', searchBar.value);
        }
    });

    // Animation des compétences
    const competences = document.querySelectorAll('.competence-item');
    
    competences.forEach(competence => {
        // Animation de la barre de progression au survol
        competence.addEventListener('mouseenter', function() {
            const levelBar = this.querySelector('.competence-level');
            const level = parseInt(levelBar.textContent);
            const progressBar = this.querySelector('.progress-bar');
            
            // Réinitialiser la barre
            progressBar.style.width = '0%';
            
            // Animer la barre jusqu'au niveau
            let currentWidth = 0;
            const interval = setInterval(() => {
                if (currentWidth >= level) {
                    clearInterval(interval);
                } else {
                    currentWidth++;
                    progressBar.style.width = currentWidth + '%';
                }
            }, 10);
        });

        // Réinitialiser la barre quand on quitte la compétence
        competence.addEventListener('mouseleave', function() {
            const progressBar = this.querySelector('.progress-bar');
            progressBar.style.width = '0%';
        });
    });

    // Appeler setActiveLink au chargement de la page
    setActiveLink();

    // Gestion du menu mobile
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    header.appendChild(menuToggle);

    menuToggle.addEventListener('click', function() {
        const nav = document.querySelector('nav');
        nav.classList.toggle('active');
    });

    // Fermer le menu mobile lors du clic sur un lien
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function() {
            const nav = document.querySelector('nav');
            nav.classList.remove('active');
        });
    });
});

function generateCV() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Styles
    const primaryColor = '#007bff';
    const secondaryColor = '#6c757d';
    const textColor = '#333333';
    const lightGray = '#f8f9fa';
    const borderColor = '#dee2e6';

    // Récupérer les données
    const name = document.querySelector('.hero-content h1').textContent;
    const title = document.querySelector('.hero-content p').textContent;
    
    const diplomes = Array.from(document.querySelectorAll('.diplome-item')).map(item => ({
        titre: item.querySelector('h3').textContent,
        institution: item.querySelector('.institution').textContent,
        date: item.querySelector('.date').textContent
    }));

    const competences = Array.from(document.querySelectorAll('.competence-item')).map(item => ({
        nom: item.querySelector('.competence-name').textContent,
        niveau: item.querySelector('.competence-level').textContent
    }));

    const experiences = Array.from(document.querySelectorAll('.experience-item')).map(item => ({
        titre: item.querySelector('h3').textContent,
        date: item.querySelector('.date').textContent,
        description: item.querySelector('.description').textContent
    }));

    // Fonction pour dessiner une section
    function drawSection(title, y) {
        doc.setFillColor(lightGray);
        doc.rect(10, y, 190, 7, 'F');
        doc.setFontSize(14);
        doc.setTextColor(primaryColor);
        doc.text(title, 15, y + 5);
        return y + 10;
    }

    // En-tête avec photo
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor('#ffffff');
    doc.text(name, 20, 20);
    
    doc.setFontSize(12);
    doc.text(title, 20, 28);

    // Photo (si disponible)
    try {
        const img = new Image();
        img.src = 'photo.jpg';
        doc.addImage(img, 'JPEG', 160, 5, 40, 40);
    } catch (e) {
        console.log('Photo non disponible');
    }

    // Coordonnées
    let yPos = 40;
    doc.setFontSize(10);
    doc.setTextColor(textColor);
    doc.text('Email: kamssone7@gmail.com', 20, yPos);
    doc.text('WhatsApp: +225 01 01 62 51 60', 20, yPos + 5);
    doc.text('Messenger: karimdao', 20, yPos + 10);
    yPos += 20;

    // Formation
    yPos = drawSection('FORMATION', yPos);
    doc.setFontSize(11);
    doc.setTextColor(textColor);

    diplomes.forEach(diplome => {
        doc.setFont(undefined, 'bold');
        doc.text(diplome.titre, 15, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(diplome.institution, 15, yPos + 5);
        doc.setTextColor(secondaryColor);
        doc.text(diplome.date, 15, yPos + 10);
        doc.setTextColor(textColor);
        yPos += 15;
    });

    // Compétences
    yPos = drawSection('COMPÉTENCES', yPos);
    doc.setFontSize(11);

    // Organiser les compétences en colonnes
    const columnWidth = 90;
    let columnX = 15;
    let columnY = yPos;
    let maxColumnHeight = 0;

    competences.forEach((competence, index) => {
        if (columnY > 250) {
            columnX += columnWidth;
            columnY = yPos;
        }

        doc.setFont(undefined, 'bold');
        doc.text(competence.nom, columnX, columnY);
        doc.setFont(undefined, 'normal');
        
        // Barre de progression
        const level = parseInt(competence.niveau);
        doc.setFillColor(lightGray);
        doc.rect(columnX, columnY + 2, 50, 3, 'F');
        doc.setFillColor(primaryColor);
        doc.rect(columnX, columnY + 2, (level / 100) * 50, 3, 'F');
        
        columnY += 10;
        maxColumnHeight = Math.max(maxColumnHeight, columnY - yPos);
    });

    yPos += maxColumnHeight + 10;

    // Expériences
    yPos = drawSection('EXPÉRIENCES PROFESSIONNELLES', yPos);
    doc.setFontSize(11);

    experiences.forEach(experience => {
        doc.setFont(undefined, 'bold');
        doc.text(experience.titre, 15, yPos);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(secondaryColor);
        doc.text(experience.date, 15, yPos + 5);
        doc.setTextColor(textColor);
        
        // Description sur plusieurs lignes si nécessaire
        const descriptionLines = doc.splitTextToSize(experience.description, 180);
        doc.text(descriptionLines, 15, yPos + 10);
        
        yPos += 20 + (descriptionLines.length * 5);
    });

    // Pied de page
    doc.setFillColor(lightGray);
    doc.rect(0, 280, 210, 10, 'F');
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor);
    doc.text('© 2024 Portfolio DAO KARIM', 105, 285, { align: 'center' });

    // Sauvegarder le PDF
    doc.save('CV_DAO_KARIM.pdf');
}
