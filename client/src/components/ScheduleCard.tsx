import { useState, useEffect } from "react";
import { ScheduleItem } from "@/lib/scheduleData";

interface ScheduleCardProps {
  item: ScheduleItem;
  delay: number;
  isActive: boolean;
  nextPeriodStart?: string;
}

export default function ScheduleCard({ item, delay, isActive, nextPeriodStart }: ScheduleCardProps) {
  const { title, time, startTime, endTime } = item;
  const [countdown, setCountdown] = useState<string>("");
  const [periodProgress, setPeriodProgress] = useState<number>(0);

  // Calculate period progress percentage
  const calculatePeriodProgress = () => {
    if (!isActive) return 0;
    
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    
    // Convert current time to minutes since midnight
    const currentTimeInMinutes = (currentHours * 60) + currentMinutes + (currentSeconds / 60);
    
    // Parse start and end times
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    // Convert to minutes since midnight
    const startTimeInMinutes = (startHours * 60) + startMinutes;
    const endTimeInMinutes = (endHours * 60) + endMinutes;
    
    // Calculate period duration in minutes
    const periodDurationInMinutes = endTimeInMinutes - startTimeInMinutes;
    
    // Calculate elapsed minutes
    const elapsedMinutes = currentTimeInMinutes - startTimeInMinutes;
    
    // Calculate progress percentage (clamped between 0-100)
    const progress = Math.min(100, Math.max(0, (elapsedMinutes / periodDurationInMinutes) * 100));
    
    return Math.round(progress);
  };

  useEffect(() => {
    if (!isActive) return;

    // Calculate countdown to next period
    const calculateTimeLeft = () => {
      if (!nextPeriodStart) return "";
      
      const now = new Date();
      const [nextHours, nextMinutes] = nextPeriodStart.split(':');
      const targetTime = new Date();
      targetTime.setHours(parseInt(nextHours));
      targetTime.setMinutes(parseInt(nextMinutes));
      targetTime.setSeconds(0);
      
      // If target time is already passed for today, no countdown needed
      if (targetTime <= now) return "0:00:00";
      
      const diff = Math.abs(targetTime.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${hours > 0 ? hours + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Update both countdown and progress percentage
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
      setPeriodProgress(calculatePeriodProgress());
    }, 1000);

    // Initial calculations
    setCountdown(calculateTimeLeft());
    setPeriodProgress(calculatePeriodProgress());

    return () => clearInterval(timer);
  }, [isActive, nextPeriodStart, startTime, endTime]);

  return (
    <div 
      className={`schedule-card rounded-lg p-6 shadow-lg transform transition-all duration-300 ${
        isActive 
          ? "scale-105 bg-gradient-to-r from-emerald-600/90 to-teal-700/90 border-l-4 border-yellow-300" 
          : "bg-gradient-to-r from-jungle-medium/60 to-jungle-medium/40 hover:scale-[1.02]"
      }`}
      style={{ 
        animationDelay: `${delay}s`,
        backdropFilter: "blur(8px)"
      }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-3 md:mb-0 flex-grow">
          <h3 className={`font-quicksand text-xl md:text-2xl font-bold ${
            isActive ? "text-white" : "text-jungle-light"
          }`}>{title}</h3>
          
          {isActive && countdown && (
            <div className="mt-2">
              <span className="text-yellow-200 font-semibold">
                Next period in: <span className="text-yellow-100 font-mono bg-black/25 px-2 py-1 rounded">{countdown}</span>
              </span>
            </div>
          )}
        </div>
        
        <div className="font-mono text-lg md:text-xl">
          <span className={`inline-block min-w-[160px] text-center py-2 px-4 rounded ${
            isActive 
              ? "bg-emerald-900/60 text-yellow-100 shadow-inner shadow-black/30" 
              : "bg-jungle-dark/50 text-jungle-leaf"
          }`}>
            {time}
          </span>
        </div>
      </div>
      
      {/* Period progress bar */}
      {isActive && (
        <div className="mt-4 w-full">
          <div className="h-2 w-full bg-jungle-dark/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-jungle-light via-yellow-300 to-jungle-leaf transition-all duration-1000 ease-in-out"
              style={{ width: `${periodProgress}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-right text-yellow-100/80">
            {periodProgress}% of period complete
          </div>
        </div>
      )}
      
      {isActive && (
        <div className="absolute -right-2 -top-2 bg-yellow-300 text-jungle-dark px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          CURRENT
        </div>
      )}
    </div>
  );
}
