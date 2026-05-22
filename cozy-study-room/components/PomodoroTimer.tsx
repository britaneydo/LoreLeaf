"use client";

import { Jersey_20 } from "next/font/google";
import { useEffect, useRef, useState } from "react";


type PomodoroTimerProps = {
    // function will run every time the user earns 1 tree point
    onEarnpoint: () => Promise<void> | void;
};

// Minimum timer length 20min
const MIN_MINUTES = 20;

// Maximum timer length 3hrs
const MAX_MINUTES = 180;

// increment/decrement for timer
const STEP_MINUTES = 5;

// How many seconds are in one minute
const SECONDS_PER_MINUTE = 60;

// user earns 1 point every 20min
const Point_Interval = 20 * SECONDS_PER_MINUTE;

// main pomodoro timer component.
export default function PomodoroTimer({onEarnpoint}; PomodoroTimerProps) {

    // stores selected time
    const [selectedMinutes, setSelectedMinutes ] = useState(MIN_MINUTES);
    // time left in seconds
    const [secondsLeft, setSecondsLeft] = useState(MIN_MINUTES * SECONDS_PER_MINUTE);
    // tracks if timer is running but default state of pomodoro timer (off)
    const [isRunning, setIsRunning] = useState(false);
    const rewardedSecondsRef = useRef(0);

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
        return '${paddedMinutes}:${paddedSeconds}';
    }

    function increaseTimer(){
        // prevent changing time while timer is running
        if(isRunning) return;

        // calcualtes new selcted time without passing the max
        const newMinutes = Math.min(selectedMinutes + STEP_MINUTES, MAX_MINUTES);

        // updates selected minutes
        setSelectedMinutes(selectedMinutes);
        // updates seconds left to match the new selected time
        setSecondsLeft(newMinutes * SECONDS_PER_MINUTE);
    }

    function decreaseTimer(){
        // prevent changing time while timer is running
        if(isRunning) return;

        // calcualtes new selcted time without going below the min
        const newMinutes = Math.min(selectedMinutes - STEP_MINUTES, MIN_MINUTES);

        // updates selected minutes
        setSelectedMinutes(selectedMinutes);
        // updates seconds left to match the new selected time
        setSecondsLeft(newMinutes * SECONDS_PER_MINUTE);
    }

    // starts timer
    function startTimer() {setIsRunning(true);}

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

        // resets rewwarded time tracker
        rewardedSecondsRef.current = 0;
    }
}




