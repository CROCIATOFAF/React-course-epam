export interface Country {
  name: {
    common: string;
  };
  population: number;
  region: string;
  flags: {
    png: string;
  };
}

export interface SchedulerInteraction {
  id: number;
  name: string;
  timestamp: number;
}

export type ExtendedProfilerOnRenderCallback = (
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
  interactions: Set<SchedulerInteraction>,
  lanes: number,
  _param9: unknown,
  _param10: unknown,
  ...extra: unknown[]
) => void;
