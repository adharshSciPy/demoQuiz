import React, { useState, useEffect } from 'react';
import styles from './../assets/css/Timer.module.css';

function Timer() {
    const [hours, setHours] = useState(0); // Start with 0 hours
    const [minutes, setMinutes] = useState(1); // Start with 1 minute
    const [seconds, setSeconds] = useState(0); // Start with 0 seconds

    useEffect(() => {
        // If all time units are 0, clear the interval
        if (hours === 0 && minutes === 0 && seconds === 0) return;

        const intervalId = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prevSeconds => prevSeconds - 1);
            } else if (minutes > 0) {
                setMinutes(prevMinutes => prevMinutes - 1);
                setSeconds(59); // Reset seconds to 59 when a minute is reduced
            } else if (hours > 0) {
                setHours(prevHours => prevHours - 1);
                setMinutes(59); // Reset minutes to 59 when an hour is reduced
                setSeconds(59); // Reset seconds to 59
            }
        }, 1000); // Decrease time every 1000 ms (1 second)

        return () => clearInterval(intervalId); // Clear the interval on component unmount
    }, [hours, minutes, seconds]); // Dependency array includes hours, minutes, and seconds

    // Determine if the timer is in the last minute
    const isLastMinute = hours === 0 && minutes === 0 && seconds <= 60;

    return (
        <div className={styles.timerMain}>
            <h6 className={`${styles.timerHead} ${isLastMinute ? styles.timerRed : ''}`}>
                {hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </h6>
        </div>
    );
}

export default Timer;
