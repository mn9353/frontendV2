import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  @Input() revealOnce = true;
  @Input() revealOffset = '0px 0px -12% 0px';

  private el = inject(ElementRef<HTMLElement>);
  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    node.classList.add('reveal');

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Ensure the browser paints the initial state before transitioning in.
            requestAnimationFrame(() => node.classList.add('reveal-in'));
            if (this.revealOnce) this.observer?.unobserve(node);
          } else if (!this.revealOnce) {
            node.classList.remove('reveal-in');
          }
        }
      },
      { root: null, rootMargin: this.revealOffset, threshold: 0.08 },
    );

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
