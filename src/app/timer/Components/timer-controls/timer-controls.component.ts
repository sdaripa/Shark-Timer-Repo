import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import fscreen from 'fscreen';


@Component({
  selector: 'app-timer-controls',
  templateUrl: './timer-controls.component.html',
  styleUrls: ['./timer-controls.component.css']
})
export class TimerControlsComponent implements OnInit, OnDestroy {
   @ViewChild('alarm', {static: true}) alarmElementRef: ElementRef;
   @Input() timerActive: boolean;

   hasFullscreenSupport: boolean = fscreen.fullscreenEnabled;
   isFullscreen = false;

   timerStart$ = new BehaviorSubject<boolean>(false);
   timerEnd$ = new BehaviorSubject<boolean>(false);
   timerReset$ = new BehaviorSubject<number>(0);

   stopwatchStart$ = new BehaviorSubject<boolean>(false);
   stopwatchReset$ = new Subject<void>();

  alarm: HTMLAudioElement;
  alarmEnabled$ = new BehaviorSubject<boolean>(true);
  alarmSounding$ = new BehaviorSubject<boolean>(false);

  fullScreen$ = new BehaviorSubject<boolean>(false);

  constructor() {
    if (this.hasFullscreenSupport) {
      fscreen.addEventListener('fullscreenchange', () => {
        this.isFullscreen = (fscreen.fullscreenElement !== null);
      }, false);
    }
  }
  ngOnDestroy() {
    // if (this.hasFullscreenSupport) {
    //   fscreen.removeEventListener('fullscreenchange',handle);
    // }
  }

  ngOnInit() {
    this.alarm = this.alarmElementRef.nativeElement;
  }

  startStop() {
    if (this.timerActive) {
      if (!this.timerEnd$.value) {
        this.timerStart$.next(!this.timerStart$.value);
        if (this.timerStart$.value && this.alarmEnabled$.value) {
          this.startAlarm();
        } else {
          this.stopAlarm();
        }
      } else {
        this.stopAlarm();
      }
    } else {
      this.stopwatchStart$.next(!this.stopwatchStart$.value);
    }
  }

  start() {
    if (this.timerActive) {
      this.timerStart$.next(true);
    } else {
      this.stopwatchStart$.next(true);
    }
  }

  stop() {
    if (this.timerActive) {
      this.timerStart$.next(false);
    } else {
      this.stopwatchStart$.next(false);
    }
  }

  reset() {
    if (this.timerActive) {
      this.timerReset$.next(0);
    } else {
      this.stopwatchReset$.next();
    }
  }

  end(timerComplete: boolean) {
    this.timerEnd$.next(timerComplete);
    if (timerComplete) {
      this.startAlarm();
    }
  }

  toggleAlarm() {
    this.alarmEnabled$.next(!this.alarmEnabled$.value);

  }

  startAlarm() {
    if (this.alarmEnabled$.value && !this.alarmSounding$.value) {
      this.alarmSounding$.next(true);
      this.alarm.play();
    }
  }

  stopAlarm() {
    if (this.alarmEnabled$.value && this.alarmSounding$.value) {
      this.alarmSounding$.next(false);
      this.alarm.pause();
    }
  }

  toggleFullscreen() {
    if (this.hasFullscreenSupport && !this.isFullscreen) {
      const elem = document.body;
      fscreen.requestFullscreen(elem);
    } else {
      fscreen.exitFullscreen();
    }
    this.fullScreen$.next(!this.fullScreen$.value);
  }

  get started() {
    return this.timerActive ? this.timerStart$.value : this.stopwatchStart$.value;
  }

}
