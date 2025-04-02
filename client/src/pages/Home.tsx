import ParticlesBackground from "@/components/ParticlesBackground";
import ScheduleCard from "@/components/ScheduleCard";
import { scheduleData } from "@/lib/scheduleData";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState<number>(-1);
  const [dayProgress, setDayProgress] = useState<number>(0);
  
  // Calculate the total school day duration in minutes
  const calculateDayProgress = (currentTimeStr: string) => {
    // Convert current time to minutes since midnight
    const [currentHours, currentMinutes] = currentTimeStr.split(':').map(Number);
    const currentMinutesSinceMidnight = currentHours * 60 + currentMinutes;
    
    // School day start and end times
    const schoolStartStr = scheduleData[0].startTime;
    const schoolEndStr = scheduleData[scheduleData.length - 1].endTime;
    
    const [startHours, startMinutes] = schoolStartStr.split(':').map(Number);
    const [endHours, endMinutes] = schoolEndStr.split(':').map(Number);
    
    const startMinutesSinceMidnight = startHours * 60 + startMinutes;
    const endMinutesSinceMidnight = endHours * 60 + endMinutes;
    
    // Total school day duration in minutes
    const totalSchoolDayMinutes = endMinutesSinceMidnight - startMinutesSinceMidnight;
    
    // Calculate how many minutes have passed since school started
    const minutesElapsed = Math.max(0, currentMinutesSinceMidnight - startMinutesSinceMidnight);
    
    // Calculate progress percentage
    let progressPercentage = 0;
    
    if (currentMinutesSinceMidnight < startMinutesSinceMidnight) {
      // Before school starts
      progressPercentage = 0;
    } else if (currentMinutesSinceMidnight >= endMinutesSinceMidnight) {
      // After school ends
      progressPercentage = 100;
    } else {
      // During school hours
      progressPercentage = Math.min(100, (minutesElapsed / totalSchoolDayMinutes) * 100);
    }
    
    return Math.round(progressPercentage);
  };
  
  // Update current time and active period
  useEffect(() => {
    const checkCurrentPeriod = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${hours}:${minutes}`;
      
      setCurrentTime(`${hours}:${minutes}:${now.getSeconds().toString().padStart(2, '0')}`);
      
      // Calculate school day progress
      const progress = calculateDayProgress(currentTimeStr);
      setDayProgress(progress);
      
      // Find which period we're currently in
      for (let i = 0; i < scheduleData.length; i++) {
        const { startTime, endTime } = scheduleData[i];
        if (currentTimeStr >= startTime && currentTimeStr < endTime) {
          setCurrentPeriodIndex(i);
          return;
        }
      }
      
      // If we're before the first period
      if (currentTimeStr < scheduleData[0].startTime) {
        setCurrentPeriodIndex(-1);
      }
      
      // If we're after the last period
      if (currentTimeStr >= scheduleData[scheduleData.length - 1].endTime) {
        setCurrentPeriodIndex(-1);
      }
    };
    
    // Check immediately and then set interval
    checkCurrentPeriod();
    const intervalId = setInterval(checkCurrentPeriod, 1000); // Check every second for smoother updates
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Find the next period start time for countdown
  const getNextPeriodStart = (currentIndex: number): string | undefined => {
    if (currentIndex === -1 || currentIndex >= scheduleData.length - 1) return undefined;
    return scheduleData[currentIndex + 1].startTime;
  };

  return (
    <div className="min-h-screen font-nunito text-gray-100 overflow-x-hidden bg-jungle-dark">
      {/* Particles.js Container */}
      <ParticlesBackground />

      {/* Content Container */}
      <div className="content container mx-auto px-4 py-8 md:py-16 relative z-10">
        {/* Header */}
        <header className="text-center mb-10 md:mb-16">
          <h1 className="font-quicksand text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200 mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
            PMMS 8th Grade
          </h1>
          <h2 className="font-quicksand text-2xl md:text-4xl text-jungle-mist animate-pulse-slow drop-shadow-lg">
            Bell Schedule
          </h2>
          
          {/* Day Progress Indicator */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-jungle-light">School Day Progress:</span>
              <span className="text-jungle-leaf font-bold">{dayProgress}% Complete</span>
            </div>
            <div className="h-4 w-full bg-jungle-dark/80 rounded-full overflow-hidden shadow-lg border border-jungle-dark">
              <div 
                className="h-full bg-gradient-to-r from-jungle-light via-jungle-leaf to-jungle-mist transition-all duration-1000 ease-in-out"
                style={{ width: `${dayProgress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Current time display */}
          <div className="mt-6 text-xl font-mono">
            <span className="bg-jungle-dark/70 text-jungle-light px-4 py-2 rounded-full shadow-inner inline-block">
              Current Time: {currentTime.replace(':', ':')}
            </span>
          </div>
        </header>

        {/* Schedule Container */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6 md:gap-8 relative">
          {scheduleData.map((item, index) => (
            <ScheduleCard
              key={index}
              item={item}
              delay={index * 0.1}
              isActive={index === currentPeriodIndex}
              nextPeriodStart={index === currentPeriodIndex ? getNextPeriodStart(index) : undefined}
            />
          ))}
          
          {/* Connecting timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500/30 via-emerald-400/20 to-transparent hidden md:block" style={{zIndex: -1}}></div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-400">
          <p className="font-quicksand text-xl text-jungle-light">Made By Cavan</p>
          <div className="mt-4 inline-block">
            <span className="inline-block w-3 h-3 rounded-full bg-jungle-leaf animate-droplet mr-1"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-jungle-mist animate-droplet mr-1" style={{ animationDelay: "0.5s" }}></span>
            <span className="inline-block w-3 h-3 rounded-full bg-jungle-light animate-droplet" style={{ animationDelay: "1s" }}></span>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Particles.js configuration for raindrop effect
const particlesConfig = {
  "particles": {
    "number": {
      "value": 150,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": ["#E2F1E7", "#88D498", "#289674"]
    },
    "shape": {
      "type": "circle",
    },
    "opacity": {
      "value": 0.7,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 0.2,
        "opacity_min": 0.3,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "size_min": 0.5,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "bottom",
      "random": false,
      "straight": true,
      "out_mode": "out",
      "bounce": false,
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "splash"
      },
      "resize": true
    },
    "modes": {
      "repulse": {
        "distance": 100,
        "duration": 0.4
      },
      "splash": {
        "particles_nb": 5,
        "distance": 100
      }
    }
  },
  "retina_detect": true
};
