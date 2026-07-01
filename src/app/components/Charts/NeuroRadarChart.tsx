import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface NeuroRadarChartProps {
  emotions: string[];
  claim: string;
}

export function NeuroRadarChart({ emotions, claim }: NeuroRadarChartProps) {
  // Base state
  let calm = 50;
  let energy = 50;
  let focus = 50;

  // Reactivity based on FR-004 logic
  if (emotions.includes("Reassurance & Comfort")) calm += 20;
  if (emotions.includes("Sustained Grounding & Calm")) {
    calm += 30;
    focus += 10;
  }
  if (emotions.includes("Vitality & Energy Induction")) {
    energy += 40;
    focus += 15;
  }

  if (claim === "Anxiety Relief") {
    calm += 22; // "A calculated +22% alpha-wave activation milestone spike"
  } else if (claim === "High Focus") {
    focus += 40;
    energy += 10;
  } else if (claim === "Sleep Quality Improvement") {
    calm += 35;
    energy -= 20;
  }

  // Cap values at 100
  calm = Math.min(100, Math.max(0, calm));
  energy = Math.min(100, Math.max(0, energy));
  focus = Math.min(100, Math.max(0, focus));

  const data = {
    labels: ['Calm (Alpha Wave)', 'Energy (Beta Wave)', 'Focus (Gamma Wave)'],
    datasets: [
      {
        label: 'Neuro-Metric Simulation',
        data: [calm, energy, focus],
        backgroundColor: 'rgba(232, 160, 184, 0.2)', // #E8A0B8 with opacity
        borderColor: '#E8A0B8',
        borderWidth: 2,
        pointBackgroundColor: '#C4758A',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#C4758A',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        },
        ticks: {
          display: false,
          min: 0,
          max: 100
        }
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: "'Inter', sans-serif",
          }
        }
      }
    }
  };

  return (
    <div className="w-full bg-[#1A1A1A] rounded-xl p-5 border border-white/10 mt-6 shadow-sm">
      <div className="text-[0.67rem] font-medium text-white/50 uppercase tracking-widest mb-3 text-center" style={{ fontFamily: "'DM Mono', monospace" }}>
        Live Neuro-Metric Simulation
      </div>
      <div className="relative w-full aspect-square max-h-[300px] mx-auto flex items-center justify-center">
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}
