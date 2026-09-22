'use client';

import React from 'react';

type JourneyMode = 'driving' | 'walking';

type JourneyProgress = {
  fraction: number;
  done: boolean;
};

type Props = {
  originLabel: string;
  schoolName: string;
  distanceKm: number;
  mode: JourneyMode;
  progress: JourneyProgress;
  playing: boolean;
};

function ParentFigure({ passenger = false }: { passenger?: boolean }) {
  return (
    <div className={'school-run-parent ' + (passenger ? 'is-passenger' : 'is-driver')} aria-hidden="true">
      <div className="school-run-parent-head" />
      <div className="school-run-parent-hair" />
      <div className="school-run-parent-torso" />
      <div className="school-run-parent-arm school-run-parent-arm-a" />
      <div className="school-run-parent-arm school-run-parent-arm-b" />
      <div className="school-run-parent-leg school-run-parent-leg-a" />
      <div className="school-run-parent-leg school-run-parent-leg-b" />
      <div className="school-run-parent-shoe school-run-parent-shoe-a" />
      <div className="school-run-parent-shoe school-run-parent-shoe-b" />
    </div>
  );
}

function WhiteRoxx() {
  return (
    <div className="school-run-roxx" aria-label="White Thar Roxx Easter egg">
      <div className="school-run-roxx-shadow" />
      <div className="school-run-roxx-body" />
      <div className="school-run-roxx-bumper school-run-roxx-bumper-front" />
      <div className="school-run-roxx-bumper school-run-roxx-bumper-back" />
      <div className="school-run-roxx-roof" />
      <div className="school-run-roxx-window school-run-roxx-window-front"><span /></div>
      <div className="school-run-roxx-window school-run-roxx-window-back"><span /></div>
      <div className="school-run-roxx-grille"><i /><i /><i /></div>
      <div className="school-run-roxx-headlight headlight-a" />
      <div className="school-run-roxx-headlight headlight-b" />
      <div className="school-run-roxx-wheel wheel-a" />
      <div className="school-run-roxx-wheel wheel-b" />
      <div className="school-run-roxx-wheel wheel-c" />
      <div className="school-run-roxx-wheel wheel-d" />
      <div className="school-run-roxx-badge">ROXX</div>
      <div className="school-run-roxx-cabin">
        <ParentFigure />
        <ParentFigure passenger />
      </div>
    </div>
  );
}

function WalkingCouple() {
  return (
    <div className="school-run-walking-couple" aria-hidden="true">
      <ParentFigure />
      <ParentFigure passenger />
      <div className="school-run-walking-shadow" />
    </div>
  );
}

function SocietyBlock() {
  return (
    <div className="school-run-building school-run-building-society" aria-hidden="true">
      <div className="school-run-building-face">
        <div className="school-run-building-sign">YOUR SOCIETY</div>
        <div className="school-run-building-door" />
        <span className="window w1" /><span className="window w2" /><span className="window w3" />
        <span className="window w4" /><span className="window w5" /><span className="window w6" />
      </div>
      <div className="school-run-building-side" />
      <div className="school-run-building-roof" />
      <div className="school-run-building-base" />
    </div>
  );
}

function SchoolBlock({ active }: { active: boolean }) {
  return (
    <div className={'school-run-building school-run-building-school' + (active ? ' is-arrived' : '')} aria-hidden="true">
      <div className="school-run-building-face">
        <div className="school-run-school-dome" />
        <div className="school-run-building-sign">SCHOOL</div>
        <div className="school-run-school-gate"><span /><span /><span /></div>
        <span className="window w1" /><span className="window w2" /><span className="window w3" />
        <span className="window w4" /><span className="window w5" /><span className="window w6" />
      </div>
      <div className="school-run-building-side" />
      <div className="school-run-building-roof" />
      <div className="school-run-building-base" />
      <div className="school-run-school-flag">◆</div>
    </div>
  );
}

function Tree({ className = '' }: { className?: string }) {
  return (
    <div className={'school-run-tree ' + className} aria-hidden="true">
      <div className="school-run-tree-trunk" />
      <div className="school-run-tree-crown crown-a" />
      <div className="school-run-tree-crown crown-b" />
      <div className="school-run-tree-crown crown-c" />
    </div>
  );
}

export default function SchoolRunDiorama({
  originLabel,
  schoolName,
  distanceKm,
  mode,
  progress,
  playing,
}: Props) {
  const journeyLeft = 9 + progress.fraction * 75;
  const rootClass = 'school-run-diorama ' + (mode === 'driving' ? 'mode-driving' : 'mode-walking') + (playing ? ' is-playing' : '') + (progress.done ? ' is-arrived' : '');

  return (
    <section className={rootClass}>
      <div className="school-run-diorama-topline">
        <div>
          <div className="school-run-diorama-kicker">YOUR SCHOOL RUN</div>
          <h3>{mode === 'driving' ? 'The family drives to school' : 'The family walks to school'}</h3>
          <p>
            {mode === 'driving'
              ? <>A little white <strong>Thar Roxx</strong> carries the couple from {originLabel}.</>
              : <>A short school run from {originLabel} — so the couple heads out on foot.</>}
          </p>
        </div>
        <div className="school-run-diorama-stat">
          <strong>{distanceKm.toFixed(1)} km</strong>
          <span>{progress.done ? 'Arrived' : mode === 'driving' ? 'Driving route' : 'Walking route'}</span>
        </div>
      </div>

      <div className="school-run-diorama-stage">
        <div className="school-run-sky-glow" />
        <div className="school-run-sun" />
        <div className="school-run-cloud cloud-a" />
        <div className="school-run-cloud cloud-b" />
        <div className="school-run-cloud cloud-c" />

        <div className="school-run-backdrop">
          <div className="school-run-hill hill-a" />
          <div className="school-run-hill hill-b" />
          <div className="school-run-cityline"><i /><i /><i /><i /><i /><i /></div>
        </div>

        <SocietyBlock />
        <SchoolBlock active={progress.done} />
        <Tree className="tree-a" />
        <Tree className="tree-b" />
        <Tree className="tree-c" />
        <Tree className="tree-d" />

        <div className="school-run-road-plane">
          <div className="school-run-road-shadow" />
          <div className="school-run-road">
            <span className="lane-mark mark-a" />
            <span className="lane-mark mark-b" />
            <span className="lane-mark mark-c" />
            <span className="lane-mark mark-d" />
            <span className="lane-mark mark-e" />
            <span className="school-run-sidewalk sidewalk-a" />
            <span className="school-run-sidewalk sidewalk-b" />
          </div>
        </div>

        <div className="school-run-journey-label label-start">
          <span>START</span>
          <strong>{originLabel}</strong>
        </div>
        <div className="school-run-journey-label label-end">
          <span>DESTINATION</span>
          <strong>{schoolName}</strong>
        </div>

        <div
          className={'school-run-family-vehicle' + (progress.done ? ' at-school' : '')}
          style={{ left: String(journeyLeft) + '%' }}
        >
          {mode === 'driving' ? <WhiteRoxx /> : <WalkingCouple />}
        </div>

        <div className="school-run-route-pulse pulse-a" />
        <div className="school-run-route-pulse pulse-b" />
        <div className="school-run-route-pulse pulse-c" />

        {progress.done ? (
          <div className="school-run-arrival-burst" aria-hidden="true">
            <span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span>
          </div>
        ) : null}
      </div>

      <div className="school-run-diorama-footer">
        <span className="school-run-auto-note">
          <i />
          {progress.done ? 'Arrived at ' + schoolName : playing ? 'Journey in motion' : 'Press “Run this route” to animate the journey'}
        </span>
        <span className="school-run-mini-distance">{distanceKm.toFixed(2)} km mapped route</span>
      </div>
    </section>
  );
}
