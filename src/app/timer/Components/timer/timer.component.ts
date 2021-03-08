import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, timer } from 'rxjs';
import { filter, map, mapTo, scan, startWith, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';

import { TimerControlsComponent } from '../timer-controls/timer-controls.component';
import { TimerDisplayComponent } from '../timer-display/timer-display.component';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit {

  @ViewChild('timeDisplay', {static: true}) timeDisplay: TimerDisplayComponent ;
  @Input() controls: TimerControlsComponent;
  @Input() active: boolean;

  time$: Observable<number>;
  percent$: Observable<number>;
  start$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  interval$: Observable<number>;
  reset$: Subject<void> = new Subject<void>();
  destroyed$: Subject<void> = new Subject<void>();

  startTime: number = 5 + 1000 * 60 * 5;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.interval$ = timer(0, 10);

    this.controls.timerReset$.subscribe(() => {
      this.resetTimer(this.startTime);
      this.controls.stop();
      this.cd.markForCheck();
    });

    this.timeDisplay.settingTime$.pipe(
      filter(settingTime => settingTime),
    ).subscribe(() => this.controls.stop());

    this.controls.timerStart$.pipe(
      filter(start => start),
    ).subscribe(() => this.timeDisplay.endSetTime());

  }

  resetTimer(startTime: number) {
    this.reset$.next();
    this.controls.end(false);

    this.time$ = this.controls.timerStart$.pipe(
      filter(() => this.active),
      switchMap(start => (start ? this.interval$.pipe(mapTo(10)) : EMPTY)),
      scan((acc, val) => acc - val, startTime),
      startWith(startTime),
      tap(val => {
        if (val === 0) {
          this.controls.end(true);
        }
      }),
      takeUntil(this.reset$),
      takeWhile(val => val >= 0),
    );

    this.percent$ = this.time$.pipe(
      map(time => (1 - time / startTime) * 100),
    );
  }

  setTime(startTime: number) {
    this.startTime = startTime;
    this.resetTimer(this.startTime);
  }

}
