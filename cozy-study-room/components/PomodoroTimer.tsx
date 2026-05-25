"use client"; // pomodoroTimer

import { useCallback, useEffect, useRef, useState } from "react";


type PomodoroTimerProps = {
    // function will run every time the user earns 1 tree point
    onEarnpoint: (pointsToAdd: number) => Promise<void> | void;

    // Optional function when timer reaches 0 completes the study session
    onSessionComplete?:
    (
        taskName: string,
        durationMinutes: number,
        pointsEarned: number
    ) => Promise<void> | void;
};

// Minimum timer length 20min
const MIN_MINUTES = 20;

// Maximum timer length 180min
const MAX_MINUTES = 180;

// increment/decrement for timer (5min)
const STEP_MINUTES = 5;

// How many seconds are in one minute
const SECONDS_PER_MINUTE = 60;

// user earns 1 point every 20min
const Point_Interval = 20 * SECONDS_PER_MINUTE;

const Bonus_Point_Interval = 30 * SECONDS_PER_MINUTE;

// main pomodoro timer component.
export default function PomodoroTimer({ onEarnpoint, onSessionComplete}: PomodoroTimerProps) {

    // stores selected time
    const [selectedMinutes, setSelectedMinutes ] = useState(MIN_MINUTES);
    // time left in seconds
    const [secondsLeft, setSecondsLeft] = useState(MIN_MINUTES * SECONDS_PER_MINUTE);
    // tracks if timer is running but default state of pomodoro timer (off)
    const [isRunning, setIsRunning] = useState(false);
    // tracks how many points were earned this session
    const [pointsEarnedThisSession, setPointsEarnedThisSession] = useState(0);

    // tracks # of completed focused seconds (20min interval)
    const rewardedNormalSecondsRef = useRef(0); 

    // tracks how many 30min bonus rewards have been given
    const rewardedBonusSecondsRef = useRef(0);

    // Ref version of the session points so the save has the most up-to-date value
    const pointsEarnedRef = useRef(0);

    // Prevents the completed session from being saved more than once
    const sessionSavedRef = useRef(false);

    // seconds into MM:SS format
    function formatTime(totalSeconds: number) {
        // gets full amount of minutes left (rounded down with math.floor)
        const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
        // gets remaining seconds after minutes are removed
        const seconds = totalSeconds % SECONDS_PER_MINUTE;

        // pads min with a leading zero if needed
        const paddedMinutes = String(minutes).padStart(2, "0")
        // pads sec with a leading zero if needed
        const paddedSeconds = String(seconds).padStart(2, "0")

        // returns time in MM:SS format
        return `${paddedMinutes}:${paddedSeconds}`;
    }

    // updates the selected sesh length and resets the countdown to match
    function updateSelectedMinutes(newMinutes: number) {
        const clampedMinutes = Math.min(Math.max(newMinutes, MIN_MINUTES), MAX_MINUTES);

        // updates user's slected timer length
        setSelectedMinutes(clampedMinutes);

        // Should only update the countdown if the timer is not running.
        if (!isRunning){setSecondsLeft(clampedMinutes * SECONDS_PER_MINUTE)}
    }

    function increaseTimer(){
        // prevent changing time while timer is running
        if(isRunning) {return;}

        // Adds 5min 
        updateSelectedMinutes(selectedMinutes + STEP_MINUTES);
    }

    function decreaseTimer(){
        // prevent changing time while timer is running
        if(isRunning) {return;}
        
        // subtracts 5 minutes
        updateSelectedMinutes(selectedMinutes - STEP_MINUTES);
    }

    // starts timer
    function startTimer()
    {
        sessionSavedRef.current = false;

        setIsRunning(true);
    }

    // stops timer
    function stopTimer() {setIsRunning(false);}

    // reset timer
    function resetTimer() {
        // stops counter
        setIsRunning(false);

        // resets the timer to previous selected time
        setSecondsLeft(selectedMinutes * SECONDS_PER_MINUTE);

        // Resets points earned in this current timer session.
        setPointsEarnedThisSession(0);
        pointsEarnedRef.current = 0;

        // resets rewwarded time tracker
        rewardedNormalSecondsRef.current = 0;

        rewardedBonusSecondsRef.current = 0;

        sessionSavedRef.current = false;
    }

    // Helper for awarding points locally and through the parent callback.
    const awardPoints = useCallback(async (pointsToAdd: number) => {
        pointsEarnedRef.current += pointsToAdd;

        setPointsEarnedThisSession(pointsEarnedRef.current);

        try {
            await onEarnpoint(pointsToAdd);
        } catch (error) {
            console.error("Error awarding points:", error);
        }
    }, [onEarnpoint]);


    useEffect(() => {
        // if timer is not runnnig, do nothing
        if (!isRunning) return; 

        // create an interval that runs every second
        const intervalId = setInterval(async () => {

            // updates seconds left safely using the previous value
            setSecondsLeft((previousSeconds) => {

                // stops timer if reaches 0
                if (previousSeconds <= 1){ 
                    setIsRunning(false);

                    return 0; // returns 0 so timer doesn't go negative
                }

                // Subtracts 1 second.
                return previousSeconds -1;
            });
        },1000);
            // cleans up interval when timer stops
            return () => clearInterval(intervalId)
        }, [isRunning]);

        useEffect(() => {
            // calculates total session seconds
            const totalSessionSeconds = selectedMinutes * SECONDS_PER_MINUTE;

            // calculate how many seconds have been completed
            const completedSeconds = totalSessionSeconds - secondsLeft;

            // check if user completed 20min interval
            const shouldEarnNormalPoint = completedSeconds >= rewardedNormalSecondsRef.current + Point_Interval ; 

            const shouldEarnBonusPoint = completedSeconds >= rewardedBonusSecondsRef.current + Bonus_Point_Interval ;

            // if user not reached 20min or did
            if (shouldEarnNormalPoint) {

                // updates rewards track
                rewardedNormalSecondsRef.current += Point_Interval;

                // Adds the point locally, tells the database to save it
                void awardPoints(1);
            }

            if (shouldEarnBonusPoint) {

                // updates rewards track
                rewardedBonusSecondsRef.current += Bonus_Point_Interval;

                // Adds them locally, tells database to save it
                void awardPoints(4);
            
            }

            // Save the completed session once the timer reaches 0.
            // does not calculate points again but rather records what was earned.
            if (secondsLeft === 0 && !sessionSavedRef.current)
            {
                sessionSavedRef.current = true;

                if (onSessionComplete)
                {
                    Promise.resolve(
                        onSessionComplete("Focus Session", selectedMinutes, pointsEarnedRef.current)
                    ).catch((error) => {
                        console.error("Error saving completed session:", error);
                    })
                }
            }

        }, [secondsLeft, selectedMinutes, onSessionComplete, awardPoints]);

 return (
    <section className="flex flex-col items-center gap-4 rounded-xl bg-neutral-800 p-6 text-white">
      {/* Timer title */}
      <h2 className="text-2xl font-bold">Focus Timer</h2>

      {/* Main countdown display */}
      <p className="text-5xl font-bold">{formatTime(secondsLeft)}</p>

      {/* Shows selected session length */}
      <p className="text-sm text-neutral-300">
        Session Length: {selectedMinutes} minutes
      </p>

      {/* Shows points earned during this timer session */}
      <p className="text-sm text-green-300">
        Points Earned This Session: {pointsEarnedThisSession}
      </p>

      {/* Time adjustment buttons */}
      <div className="flex gap-2">
        <button
          onClick={decreaseTimer}
          disabled={isRunning}
          className="rounded-lg bg-neutral-700 px-4 py-2 disabled:opacity-40"
        >
          -5 min
        </button>

        <button
          onClick={increaseTimer}
          disabled={isRunning}
          className="rounded-lg bg-neutral-700 px-4 py-2 disabled:opacity-40"
        >
          +5 min
        </button>
      </div>

      {/* Timer control buttons */}
      <div className="flex gap-2">
        <button
          onClick={startTimer}
          disabled={isRunning}
          className="rounded-lg bg-green-700 px-4 py-2 disabled:opacity-40"
        >
          Start
        </button>

        <button
          onClick={stopTimer}
          disabled={!isRunning}
          className="rounded-lg bg-yellow-700 px-4 py-2 disabled:opacity-40"
        >
          Stop
        </button>

        <button
          onClick={resetTimer}
          className="rounded-lg bg-red-700 px-4 py-2"
        >
          Reset
        </button>
      </div>
    </section>
  );
}



