import { Component, AfterViewInit, OnInit } from '@angular/core';

declare var particlesJS: any;

@Component({
  selector: 'app-home-content',
  standalone: true,
  imports: [],
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss']
})
export class HomeContentComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    // Initialize particlesJS after view initialization
    particlesJS('particles-js', {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 }},
        color: { value: "#363b61" },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#363b61" },
          polygon: { nb_sides: 5 },
          image: { src: "img/github.svg", width: 100, height: 100 }
        },
        opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }},
        size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false }},
        line_linked: { enable: true, distance: 150, color: "#000000", opacity: 0.3367165327817598, width: 1 },
        move: { enable: true, speed: 4, direction: "none", random: false, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 }}
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          grab: { distance: 400, line_linked: { opacity: 1 }},
          bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
          repulse: { distance: 200, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 }
        }
      },
      retina_detect: true
    });
  }

   constructor() { }

  ngOnInit(): void {
    // Animação quando o componente carrega
    this.addLoadedClass();
  }

  /**
   * Adiciona a classe 'loaded' para animação de entrada
   */
  private addLoadedClass(): void {
    setTimeout(() => {
      const contactElement = document.querySelector('.contact');
      if (contactElement) {
        contactElement.classList.add('loaded');
      }
    }, 100);
  }

  /**
   * Função para copiar email para a área de transferência
   * @param text - Texto a ser copiado
   */
  copyToClipboard(text: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('📧 Email copiado! Você pode colar em qualquer lugar.');
      }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
        this.fallbackCopyTextToClipboard(text);
      });
    } else {
      this.fallbackCopyTextToClipboard(text);
    }
  }

  /**
   * Fallback para copiar texto em navegadores que não suportam clipboard API
   * @param text - Texto a ser copiado
   */
  private fallbackCopyTextToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Evitar scroll para o elemento
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('📧 Email copiado! Você pode colar em qualquer lugar.');
      } else {
        console.error('Falha ao copiar texto');
      }
    } catch (err) {
      console.error('Erro ao executar comando de cópia: ', err);
    }
    
    document.body.removeChild(textArea);
  }

  /**
   * Função para fazer ligação telefônica
   * @param number - Número de telefone
   */
  callPhone(number: string): void {
    window.open(`tel:${number}`, '_self');
  }

  /**
   * Função para enviar email
   */
  sendEmail(): void {
    const subject = encodeURIComponent('Contato do Site');
    const body = encodeURIComponent('Olá! Gostaria de entrar em contato.');
    window.open(`mailto:volit@volit.com.br?subject=${subject}&body=${body}`, '_blank');
  }

  /**
   * Função para abrir WhatsApp
   */
  openWhatsApp(): void {
    const message = encodeURIComponent('Olá! Vim pelo site.');
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  }

  /**
   * Função para abrir Google Maps com direções
   */
  openGoogleMaps(): void {
    const address = encodeURIComponent('Rua José de Carvalho 313 Chácara Santo Antonio São Paulo SP');
    window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
  }

}

