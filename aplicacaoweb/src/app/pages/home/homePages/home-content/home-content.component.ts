import {
  AfterViewInit,
  Component,
  ElementRef,
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

/** Serviço exibido na seção "Serviços". */
interface Service {
  id: string;
  /** Numeração exibida no card (01, 02, ...). */
  index: string;
  /** Classe do ícone Font Awesome (ex.: 'fa-database'). */
  icon: string;
  title: string;
  /** Frase curta de impacto, sempre visível. */
  hook: string;
  /** Palavras-chave exibidas como etiquetas. */
  chips: string[];
  /** Texto completo, exibido ao clicar em "Ver detalhes". */
  description: string;
  /** Card em destaque, ocupa a largura toda da grade. */
  featured?: boolean;
}

@Component({
  selector: 'app-home-content',
  standalone: true,
  imports: [],
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss'],
})
export class HomeContentComponent implements OnInit, AfterViewInit, OnDestroy {
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

  /**
   * Serviços da Volit. A ordem aqui é a ordem exibida na tela —
   * para reordenar, basta mover os itens deste array.
   */
  services: Service[] = [
    {
      id: 'capacitacao',
      index: '01',
      icon: 'fa-graduation-cap',
      title: 'Capacitação',
      hook: 'Times preparados para a tecnologia que a sua empresa já usa.',
      chips: ['SQL', 'Análise de Dados', 'IA aplicada', 'Turmas in company'],
      description:
        'Oferecemos capacitação profissional para aprimorar habilidades, otimizar processos e preparar sua equipe para atender aos requisitos tecnológicos da sua empresa. As turmas são práticas, com exercícios reais e foco no que o mercado realmente utiliza.',
      featured: true,
    },
    {
      id: 'desenvolvimento',
      index: '02',
      icon: 'fa-code',
      title: 'Desenvolvimento de Software',
      hook: 'Aplicações sob medida, do aplicativo mobile à integração via API.',
      chips: ['Mobile', 'Web', 'E-commerce', 'APIs'],
      description:
        'Desenvolvemos aplicações mobile, websites, e-commerce, APIs e soluções para controle de acesso veicular, otimização de inventário e rastreamento de ativos. Oferecemos serviços especializados, focados em melhorar a eficiência e a gestão do seu negócio.',
    },
    {
      id: 'banco-de-dados',
      index: '03',
      icon: 'fa-database',
      title: 'Banco de Dados',
      hook: 'Estabilidade, segurança e performance na sua base de dados.',
      chips: ['Administração', 'Modelagem', 'Migração segura', 'Performance tuning'],
      description:
        'Oferecemos administração detalhada, garantindo estabilidade e segurança, além de designs personalizados e migrações seguras. Investimos em performance tuning para proporcionar uma experiência de usuário ágil e eficiente. Transforme seus dados em valor e otimize seus processos conosco!',
    },
    {
      id: 'rfid',
      index: '04',
      icon: 'fa-tower-broadcast',
      title: 'RFID & IoT',
      hook: 'Rastreabilidade e controle dos seus ativos em tempo real.',
      chips: ['Varejo', 'Hospitalar', 'Indústria', 'Transporte', 'Pedágio'],
      description:
        'A tecnologia RFID sustenta parte da Indústria 4.0 por meio de aplicações em IoT. Processos baseados nessa tecnologia garantem um alto nível de precisão, rastreabilidade e controle sobre os produtos aos quais estão associados. A Volit possui experiência no tratamento desses processos em varejo, hospitalar, industrial, transporte e meios de cobrança.',
    },
    {
      id: 'mediacao',
      index: '05',
      icon: 'fa-scale-balanced',
      title: 'Mediação de Conflitos',
      hook: 'Resolva disputas online, com agilidade e confidencialidade.',
      chips: ['Mediação', 'Conciliação', 'Arbitragem', 'Vídeo assistência'],
      description:
        'Nossa Plataforma de Mediação Jurídica oferece soluções avançadas de mediação, conciliação e arbitragem, com vídeo assistência para comunicação direta e eficiente, além de gerenciamento detalhado de conflitos. A plataforma é flexível, adaptando-se a qualquer tipo de disputa, garantindo agilidade, segurança e confidencialidade.',
    },
    {
      id: 'validacao',
      index: '06',
      icon: 'fa-clipboard-check',
      title: 'Validação de Sistemas',
      hook: 'Conformidade garantida junto à ANVISA e ao Banco Central.',
      chips: ['ANVISA', 'Banco Central', 'Auditoria', 'Documentação'],
      description:
        'Prestamos serviços de assessoria para a validação de sistemas em entidades como a ANVISA e o Banco Central. Oferecemos assessoria especializada para garantir que seus sistemas atendam aos padrões estabelecidos por esses órgãos reguladores.',
    },
  ];

  /** Id do serviço com a descrição completa aberta (null = todos fechados). */
  expandedService: string | null = null;

  private readonly autoplayInterval = 6000;
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;
  private revealObserver: IntersectionObserver | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private host: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    // Animação quando o componente carrega
    this.addLoadedClass();
    this.startAutoplay();
  }

  ngAfterViewInit(): void {
    this.observeServiceCards();
  }

  ngOnDestroy(): void {
    this.pauseAutoplay();
    this.revealObserver?.disconnect();
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

  /* ============================
     SEÇÃO DE SERVIÇOS
     ============================ */

  /** Abre/fecha a descrição completa de um serviço. */
  toggleService(id: string): void {
    this.expandedService = this.expandedService === id ? null : id;
  }

  /** Leva o visitante até o formulário de contato. */
  scrollToContact(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    document
      .getElementById('contato')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /**
   * Revela os cards de serviço conforme entram na tela.
   * Sem IntersectionObserver (ou no SSR) os cards já nascem visíveis.
   */
  private observeServiceCards(): void {
    if (
      !isPlatformBrowser(this.platformId) ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return;
    }

    const grid = this.host.nativeElement.querySelector('.svc-grid');
    const cards = this.host.nativeElement.querySelectorAll('.svc-card');
    if (!grid || !cards.length) {
      return;
    }

    // só agora os cards podem começar escondidos — o JS assumiu a revelação
    grid.classList.add('reveal-on');

    this.revealObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    );

    cards.forEach((card) => this.revealObserver!.observe(card));
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
