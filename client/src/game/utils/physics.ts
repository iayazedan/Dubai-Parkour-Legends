import { Position, Velocity } from '../types';

/**
 * Apply gravity to an object's velocity
 */
export function applyGravity(velocity: Velocity, gravity: number = 0.5): Velocity {
  return {
    x: velocity.x,
    y: velocity.y + gravity
  };
}

/**
 * Apply friction to slow down horizontal movement
 */
export function applyFriction(velocity: Velocity, friction: number = 0.8): Velocity {
  return {
    x: velocity.x * friction,
    y: velocity.y
  };
}

/**
 * Apply a jump force to the velocity
 */
export function jump(velocity: Velocity, jumpForce: number = -15): Velocity {
  return {
    x: velocity.x,
    y: jumpForce
  };
}

/**
 * Update position based on velocity
 */
export function updatePosition(position: Position, velocity: Velocity): Position {
  return {
    x: position.x + velocity.x,
    y: position.y + velocity.y
  };
}

/**
 * Calculate next position with physics
 */
export function calculateNextPosition(
  position: Position,
  velocity: Velocity,
  gravity: number = 0.5,
  friction: number = 0.8
): { position: Position; velocity: Velocity } {
  // Apply gravity
  const newVelocity = applyGravity(velocity, gravity);
  
  // Apply friction to horizontal movement
  const velocityWithFriction = {
    x: newVelocity.x * friction,
    y: newVelocity.y
  };
  
  // Calculate new position
  const newPosition = updatePosition(position, velocityWithFriction);
  
  return { position: newPosition, velocity: velocityWithFriction };
}
