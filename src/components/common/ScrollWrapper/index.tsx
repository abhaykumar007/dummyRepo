import React, { useEffect, useRef, useState } from "react";
import "./style.scss";

interface ScrollWrapperProps {
  maxHeight: string;
  children: React.ReactNode;
}

const ScrollWrapper: React.FC<ScrollWrapperProps> = ({
  maxHeight,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      setIsScrolling(true);

      clearTimeout((container as any).scrollTimeout);
      (container as any).scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`hidden-scrollbar ${isScrolling ? "scrolling" : ""}`}
      style={{
        height: "auto",
        maxHeight: maxHeight,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollWrapper;
