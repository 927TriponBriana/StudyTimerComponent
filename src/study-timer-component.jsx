import React from 'react';
import { createRoot } from 'react-dom/client';
import StudyTimer from './StudyTimer.jsx';

class StudyTimerComponent extends HTMLElement {
  connectedCallback() {
    this.root = createRoot(this);

    this.root.render(
      <StudyTimer
        duration={Number(this.getAttribute('duration')) || 25}
        breakDuration={Number(this.getAttribute('break-duration')) || 5}
        theme={this.getAttribute('theme') || 'light'}
        onTimerStart={() => this.dispatchEvent(new CustomEvent('timer-started'))}
        onTimerPause={() => this.dispatchEvent(new CustomEvent('timer-paused'))}
        onTimerReset={() => this.dispatchEvent(new CustomEvent('timer-reset'))}
        onTimerFinished={(mode) =>
          this.dispatchEvent(
            new CustomEvent('timer-finished', {
              detail: { completedMode: mode },
            })
          )
        }
        onModeChange={(newMode) =>
          this.dispatchEvent(
            new CustomEvent('mode-changed', {
              detail: { mode: newMode },
            })
          )
        }
        soundEnabled={this.getAttribute('sound') === 'true'}
      />
    );
  }

  disconnectedCallback() {
    this.root.unmount();
  }
}

customElements.define('study-timer-component', StudyTimerComponent);