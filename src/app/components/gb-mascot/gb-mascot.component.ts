import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MascotPose = 'wave' | 'think' | 'celebrate' | 'sad' | 'search';

@Component({
  selector: 'gb-mascot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mascot-container" [class]="'mascot-container mascot--' + pose" [style.fontSize.rem]="size">
      <div class="mascot-body">
        <!-- Body -->
        <div class="body-oval"></div>
        <!-- Eyes -->
        <div class="eyes">
          <div class="eye" [class.blink]="blinking"><div class="pupil"></div></div>
          <div class="eye" [class.blink]="blinking"><div class="pupil"></div></div>
        </div>
        <!-- Mouth -->
        <div class="mouth" [class]="'mouth mouth--' + pose"></div>
        <!-- Arm -->
        <div class="arm arm-left" [class]="'arm arm-left arm--' + pose"></div>
        <div class="arm arm-right" [class]="'arm arm-right arm--' + pose"></div>
        <!-- Accessory per pose -->
        @if (pose === 'think') {
          <div class="bubble">💭</div>
        }
        @if (pose === 'celebrate') {
          <div class="confetti-bits">🎊</div>
        }
        @if (pose === 'search') {
          <div class="magnifier">🔍</div>
        }
      </div>
      @if (message) {
        <div class="speech-bubble">{{ message }}</div>
      }
    </div>
  `,
  styles: [`
    .mascot-container {
      display: flex; flex-direction: column; align-items: center; gap: 0.6em;
      animation: mascotFloat 3s ease-in-out infinite;
    }

    .mascot-body {
      position: relative; width: 4em; height: 4.5em;
    }

    .body-oval {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 35% 35%, #FFE566, #FFD700);
      border-radius: 50% 50% 48% 52% / 55% 55% 45% 45%;
      border: 0.15em solid rgba(0,0,0,0.12);
      box-shadow: 0 0.3em 1em rgba(255,215,0,0.4);
    }

    .eyes {
      position: absolute; top: 30%; left: 50%;
      transform: translateX(-50%);
      display: flex; gap: 0.6em;
    }
    .eye {
      width: 0.75em; height: 0.75em; border-radius: 50%;
      background: #2c2c54; display: flex; align-items: center; justify-content: center;
      transition: height 0.1s;
    }
    .eye.blink { height: 0.1em; }
    .pupil {
      width: 0.3em; height: 0.3em; border-radius: 50%;
      background: white; transform: translate(0.08em, -0.05em);
    }

    /* Mouth per pose */
    .mouth {
      position: absolute; top: 58%; left: 50%; transform: translateX(-50%);
      width: 1em; height: 0.5em;
      border: 0.12em solid rgba(0,0,0,0.3);
      border-top: none;
      border-radius: 0 0 1em 1em;
      background: #FF6B6B;
    }
    .mouth--sad {
      top: 65%; border-bottom: none; border-top: 0.12em solid rgba(0,0,0,0.3);
      border-radius: 1em 1em 0 0; height: 0.4em; background: #c0392b;
    }
    .mouth--think { width: 0.5em; border-radius: 50%; height: 0.5em; border: 0.12em solid rgba(0,0,0,0.3); }

    /* Arms */
    .arm {
      position: absolute; bottom: 18%; width: 0.6em; height: 1.4em;
      background: #FFD700; border-radius: 0.5em; border: 0.1em solid rgba(0,0,0,0.12);
    }
    .arm-left  { left: -0.5em;  transform-origin: top right; transform: rotate(-20deg); }
    .arm-right { right: -0.5em; transform-origin: top left;  transform: rotate(20deg);  }

    .arm--wave.arm-left { transform: rotate(-60deg); animation: waveArm 0.8s ease-in-out infinite alternate; }
    .arm--celebrate.arm-left  { transform: rotate(-80deg); }
    .arm--celebrate.arm-right { transform: rotate(80deg); }
    .arm--think.arm-right { transform: rotate(-30deg) translateY(-0.3em); }

    /* Accessories */
    .bubble, .confetti-bits, .magnifier {
      position: absolute; top: -0.8em; right: -1em; font-size: 1.2em;
    }

    /* Speech bubble */
    .speech-bubble {
      background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.2); border-radius: 1em;
      padding: 0.5em 1em; font-family: 'Nunito', sans-serif;
      font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.85);
      max-width: 18em; text-align: center;
    }

    @keyframes mascotFloat {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-0.4em); }
    }
    @keyframes waveArm {
      from { transform: rotate(-60deg); }
      to   { transform: rotate(-30deg); }
    }
  `]
})
export class GbMascotComponent {
  @Input() pose: MascotPose = 'wave';
  @Input() message = '';
  @Input() size = 2; // font-size rem multiplier

  blinking = false;

  ngOnInit() {
    setInterval(() => {
      this.blinking = true;
      setTimeout(() => (this.blinking = false), 150);
    }, 3500 + Math.random() * 2000);
  }
}
