import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const PullToRefreshBanner = () => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  useEffect(() => {
    const handleTouchStart = (e) => {
      const touchY = e.touches[0].clientY;

      // Allow pull ONLY if user is at top AND user initiates touch in top region
      if (window.scrollY === 0 && document.body.scrollTop === 0 && touchY < 30) {
        setStartY(touchY);
        setIsPulling(true);
      } else {
        setIsPulling(false);
      }
    };

    const handleTouchMove = (e) => {
      if (!isPulling) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startY;

      if (distance > 0 && window.scrollY === 0) {
        setPullDistance(Math.min(distance, 120));
      } else {
        setIsPulling(false);
        setPullDistance(0);
      }
    };

    const handleTouchEnd = () => {
      if (isPulling && pullDistance > 80) {
        setIsRefreshing(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }

      setIsPulling(false);
      setPullDistance(0);
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullDistance, startY, isPulling]);

  return (
    <Box
      sx={{
        height: pullDistance,
        backgroundColor: "#121212",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        transition: "height 0.2s ease-out",
        overflow: "hidden",
      }}
    >
      {pullDistance > 20 && (
        <Typography
          variant="body2"
          sx={{ color: "#ffffff", mb: 1, fontWeight: 500 }}
        >
          {isRefreshing ? "Refreshing the page..." : "Pull to refresh"}
        </Typography>
      )}
    </Box>
  );
};

export default PullToRefreshBanner;
