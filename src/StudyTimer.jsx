import { useEffect, useRef, useState } from 'react';

function StudyTimer({ duration, breakDuration, theme = 'light',  onTimerStart, onTimerPause, onTimerReset, onTimerFinished, onModeChange }) {
    const [mode, setMode] = useState('focus');
    const [isRunning, setIsRunning] = useState(false);

    const [remainingSeconds, setRemainingSeconds] = useState(duration * 60);

    const intervalRef = useRef(null);
    const hasLoadedFromStorage = useRef(false);
    const STORAGE_KEY = `study-timer-state-${duration}-${breakDuration}-${theme}`;

    const totalSeconds =
        mode === 'focus' ? duration * 60 : breakDuration * 60;

    useEffect(() => {
        const savedState = localStorage.getItem(STORAGE_KEY);

        if (savedState) {
            const parsedState = JSON.parse(savedState);

            setMode(parsedState.mode);
            setRemainingSeconds(parsedState.remainingSeconds);
            setIsRunning(false);
        }

        hasLoadedFromStorage.current = true;
    }, [STORAGE_KEY]);    

    useEffect(() => {
        if (!hasLoadedFromStorage.current) return;

        const stateToSave = {
            mode,
            remainingSeconds,
        };

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(stateToSave)
        );
    }, [mode, remainingSeconds, STORAGE_KEY]);

    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
            if (prev <= 1) {
                clearInterval(intervalRef.current);

                const nextMode =
                    mode === 'focus' ? 'break' : 'focus';

                onTimerFinished?.(mode);
                onModeChange?.(nextMode);

                setMode(nextMode);

                return nextMode === 'focus'
                    ? duration * 60
                    : breakDuration * 60;
                }

            return prev - 1;
        });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [isRunning, mode, duration, breakDuration, onTimerFinished, onModeChange]);

    const startTimer = () => {
        setIsRunning(true);
        onTimerStart?.();
    };

    const pauseTimer = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
        onTimerPause?.();
    };

    const resetTimer = () => {
        pauseTimer();

        const resetSeconds =
            mode === 'focus' ? duration * 60 : breakDuration * 60;

        setRemainingSeconds(resetSeconds);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                mode,
                remainingSeconds: resetSeconds,
            })
        );

        onTimerReset?.();
    };

    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const formattedTime = `${minutes}:${seconds
        .toString()
        .padStart(2, '0')}`;

    const progress =
        ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

    const isDark = theme === 'dark';
    const currentStyles = isDark ? darkStyles : lightStyles;
    
    const radius = 90;
    const stroke = 12;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset =
        circumference - (progress / 100) * circumference;
    
    return (
        <div style={currentStyles.card}>
            <h2 style={{ color: currentStyles.card.color }}>
            {mode === 'focus' ? 'Focus Session' : 'Break Time'}
            </h2>

            {/* <div style={currentStyles.progressContainer}>
            <div
                style={{
                ...currentStyles.progressBar,
                width: `${progress}%`,
                }}
            />
            </div>

            <div style={currentStyles.time}>
            {formattedTime}
            </div> */}
            <div style={currentStyles.circleContainer}>
                <svg height={radius * 2} width={radius * 2}>
                    <circle
                    stroke={currentStyles.circleBackground.stroke}
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    />

                    <circle
                    stroke={currentStyles.circleProgress.stroke}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    style={{
                        transition: 'stroke-dashoffset 1s linear',
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                    }}
                    />
                </svg>

                <div style={currentStyles.timeInsideCircle}>
                    {formattedTime}
                </div>
            </div>

            <div style={currentStyles.buttonContainer}>
            <button style={currentStyles.button} onClick={startTimer}>Start</button>
            <button style={currentStyles.button} onClick={pauseTimer}>Pause</button>
            <button style={currentStyles.button} onClick={resetTimer}>Reset</button>
            </div>
        </div>
    );
}

const baseStyles = {
    circleContainer: {
        position: 'relative',
        width: '180px',
        height: '180px',
        margin: '20px auto',
        },

        timeInsideCircle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '42px',
        fontWeight: 'bold',
    },
    card: {
        width: '320px',
        padding: '24px',
        borderRadius: '16px',
        fontFamily: 'Arial',
        textAlign: 'center',
        margin: '40px auto',
    },

    time: {
        fontSize: '52px',
        fontWeight: 'bold',
        margin: '20px 0',
    },

    buttonContainer: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
    },

    progressContainer: {
        width: '100%',
        height: '12px',
        borderRadius: '10px',
        overflow: 'hidden',
        marginTop: '20px',
    },

    progressBar: {
        height: '100%',
        transition: 'width 1s linear',
    },

    button: {
        padding: '8px 14px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
};

const lightStyles = {
  ...baseStyles,
  circleBackground: {
    stroke: '#dddddd',
    },

    circleProgress: {
    stroke: '#4caf50',
    },
  card: {
    ...baseStyles.card,
    backgroundColor: '#ffffff',
    color: '#222222',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  },
  progressContainer: {
    ...baseStyles.progressContainer,
    backgroundColor: '#dddddd',
  },
  progressBar: {
    ...baseStyles.progressBar,
    backgroundColor: '#4caf50',
  },
  button: {
    ...baseStyles.button,
    backgroundColor: '#eeeeee',
    color: '#222222',
  },
};

const darkStyles = {
  ...baseStyles,
  circleBackground: {
    stroke: '#444444',
    },

    circleProgress: {
    stroke: '#90caf9',
    },
  card: {
  ...baseStyles.card,
  backgroundColor: '#1e1e1e',
  color: '#ffffff',
  boxShadow: '0 4px 16px rgba(255,255,255,0.15)',
},
  progressContainer: {
    ...baseStyles.progressContainer,
    backgroundColor: '#444444',
  },
  progressBar: {
    ...baseStyles.progressBar,
    backgroundColor: '#90caf9',
  },
  button: {
    ...baseStyles.button,
    backgroundColor: '#333333',
    color: '#ffffff',
  },
};

export default StudyTimer;