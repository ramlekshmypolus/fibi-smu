import {Component, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import { CommonService } from '../services/common.service';
const IDLE_TIME = 1200; // Watching for an event for 1200 seconds(20 min.)
const EXIT_TIME = 300;  // Automatically logouts after 300 seconds(5 min.)

@Component({
  selector: 'app-sessiontimeout',
  templateUrl: 'session-timeout.component.html',
  styleUrls: []
})

export class SessionTimeoutComponent implements OnDestroy {

  private subscription;
  isModal = false;
  timeoutModal = false;
  isWarningModal = true;
  exitTimeInMin: number;
  exitTimeInSec: number;
  timerTime: number = Math.ceil(EXIT_TIME / 60);
  timeToLogout: number = Math.ceil((IDLE_TIME + EXIT_TIME) / 60);

  constructor(private idle: Idle, private _router: Router, private _commonService: CommonService ) {
    idle.setIdle(IDLE_TIME);
    idle.setTimeout(EXIT_TIME);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.subscription = idle.onTimeoutWarning.subscribe((countdown: number) => {
      if (!this.isModal) {
        document.getElementById('sessionModalButton').click();
      }
      this.isModal = true;
      this.exitTimeInMin = Math.floor(countdown / 60);
      this.exitTimeInSec = countdown % 60;
    });
    this.subscription = idle.onTimeout.subscribe(() => {
      this.isWarningModal = false;
    });
    idle.watch();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    this._commonService.logout();
    localStorage.setItem('currentUrl', window.location.hash);
    this._router.navigate(['/login']);
  }

  continueSession() {
    this.isModal = false;
    this.idle.watch();
  }
}
