import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface StarProps {
  cx: number;
  cy: number;
  r: number;
  opacity: Animated.Value;
  translateY: Animated.Value;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Star: React.FC<StarProps> = ({ cx, cy, r, opacity, translateY }) => {
  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      r={r}
      fill="white"
      opacity={opacity}
      translateY={translateY}
    />
  );
};

const NUM_STARS = 150;

export default function StarlightBackground() {
  const starsRef = useRef<Array<{
    id: number;
    cx: number;
    cy: number;
    r: number;
    opacity: Animated.Value;
    translateY: Animated.Value;
    twinkleDelay: number;
    floatDelay: number;
  }>>([]);

  if (starsRef.current.length === 0) {
    starsRef.current = Array.from({ length: NUM_STARS }).map((_, i) => ({
      id: i,
      cx: Math.random() * width,
      cy: Math.random() * height,
      r: Math.random() * 2 + 0.5,
      opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
      translateY: new Animated.Value(0),
      twinkleDelay: Math.random() * 2000,
      floatDelay: Math.random() * 3000,
    }));
  }

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];

    starsRef.current.forEach((star) => {
      const twinkleAnimation = Animated.loop(
        Animated.sequence([
          Animated.delay(star.twinkleDelay),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.3 + 0.1,
            duration: 1000 + Math.random() * 1500,
            useNativeDriver: true,
          }),
          Animated.timing(star.opacity, {
            toValue: Math.random() * 0.5 + 0.5,
            duration: 1000 + Math.random() * 1500,
            useNativeDriver: true,
          }),
        ])
      );

      const floatAnimation = Animated.loop(
        Animated.sequence([
          Animated.delay(star.floatDelay),
          Animated.timing(star.translateY, {
            toValue: -10 - Math.random() * 20,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
          Animated.timing(star.translateY, {
            toValue: 0,
            duration: 3000 + Math.random() * 2000,
            useNativeDriver: true,
          }),
        ])
      );

      twinkleAnimation.start();
      floatAnimation.start();
      
      animations.push(twinkleAnimation, floatAnimation);
    });

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg height="100%" width="100%">
        {starsRef.current.map((star) => (
          <Star
            key={star.id}
            cx={star.cx}
            cy={star.cy}
            r={star.r}
            opacity={star.opacity}
            translateY={star.translateY}
          />
        ))}
      </Svg>
    </View>
  );
}