import React, { useEffect, useState } from "react";

/**
 * Reusable CountUp component for rolling number animation.
 * Safely parses numbers from formatted strings (e.g. "₹4,50,000" or 12).
 */
export default function CountUp({ value, duration = 1200, prefix = "", suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Extract numbers from value if it's passed as a string like "₹45,000"
    let targetNum = 0;
    let extractedPrefix = prefix;
    let extractedSuffix = suffix;

    if (typeof value === "number") {
      targetNum = value;
    } else if (typeof value === "string") {
      // Check for currency symbols or strings
      const numMatch = value.match(/[\d,]+/g);
      if (numMatch) {
        targetNum = parseInt(numMatch.join("").replace(/,/g, ""), 10) || 0;
      }
      if (value.startsWith("₹")) extractedPrefix = "₹";
      if (value.startsWith("+")) extractedPrefix = "+";
    }

    if (targetNum === 0) {
      setDisplayValue(0);
      return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad formula
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(easedProgress * targetNum);
      
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [value, duration, prefix, suffix]);

  const formattedNumber = displayValue.toLocaleString("en-IN");

  return (
    <span>
      {prefix}{formattedNumber}{suffix}
    </span>
  );
}
