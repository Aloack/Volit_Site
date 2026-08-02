import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Banner exibido no carrossel da home. */
interface Banner {
  image: string;
  alt: string;
  /** Link de destino do banner. Deixe vazio ('') para o banner não ser clicável. */
  link: string;
}

@Component({
  selector: 'app-home-content',
  standalone: true,
  imports: [],
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss'],
})
export class HomeContentComponent implements OnInit, OnDestroy {
  /**
   * Banners do carrossel da home.
   * Para tornar um banner clicável, basta preencher o campo `link`
   * (ex.: link: 'https://volit.com.br/capacitacao/sql-basico').
   */
  banners: Banner[] = [
    {
      image: 'banners/banner-sql-basico.png',
      alt: 'Capacitação SQL Básico - Dê o primeiro passo rumo a uma carreira de sucesso em TI',
      link: '',
    },
    {
      image: 'banners/banner-ia.png',
      alt: 'A IA já faz parte da sua vida - Vibe Code Engineering',
      link: '',
    },
    {
      image: 'banners/banner-analise-dados.png',
      alt: 'Capacitação em Análise de Dados - Transforme dados em decisões',
      link: '',
    },
  ];

  currentSlide = 0;

  private readonly autoplayInterval = 6000;
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Animação quando o componente carrega
    this.addLoadedClass();
    this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.pauseAutoplay();
  }

  /* ============================
     CARROSSEL DE BANNERS
     ============================ */

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.banners.length;
    this.restartAutoplay();
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.banners.length) % this.banners.length;
    this.restartAutoplay();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.restartAutoplay();
  }

  /** Inicia o autoplay (somente no browser, nunca durante o SSR/prerender). */
  startAutoplay(): void {
    if (!isPlatformBrowser(this.platformId) || this.banners.length <= 1) {
      return;
    }

    this.pauseAutoplay();
    this.autoplayTimer = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.banners.length;
    }, this.autoplayInterval);
  }

  /** Pausa o autoplay (usado no hover e ao destruir o componente). */
  pauseAutoplay(): void {
    if (this.autoplayTimer !== null) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  /** Reinicia a contagem do autoplay após uma navegação manual. */
  private restartAutoplay(): void {
    if (this.autoplayTimer !== null) {
      this.startAutoplay();
    }
  }

  /**
   * Adiciona a classe 'loaded' para animação de entrada
   */
  private addLoadedClass(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

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
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert('😎 Texto copiado! Você pode colar em qualquer lugar.');
        })
        .catch((err) => {
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
   * Função para enviar email
   */
  sendEmail(): void {
    const subject = encodeURIComponent('Contato do Site');
    const body = encodeURIComponent('Olá! Gostaria de entrar em contato.');
    window.open(
      `mailto:volit@volit.com.br?subject=${subject}&body=${body}`,
      '_blank'
    );
  }

  /**
   * Função para abrir WhatsApp
   */
  openWhatsApp(): void {
    const message = encodeURIComponent('Olá! Vim pelo site.');
    window.open(`https://wa.me/5511930301084?text=${message}`, '_blank');
  }

  /**
   * Função para abrir Google Maps com direções
   */
  openGoogleMaps(): void {
    const address = encodeURIComponent(
      'Rua José de Carvalho 313 Chácara Santo Antonio São Paulo SP'
    );
    window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
  }
}
