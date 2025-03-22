import { Position, Size, Platform } from '../types';

interface Entity {
  position: Position;
  size: Size;
}

interface CollisionResult {
  collision: boolean;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

/**
 * Check if two rectangles collide
 */
export function checkCollision(
  entity1: Entity | { x: number; y: number; width: number; height: number },
  entity2: Platform | { x: number; y: number; width: number; height: number },
  returnDirection: boolean = false
): boolean | CollisionResult {
  // Get entity coordinates
  const e1 = 'position' in entity1 
    ? { 
        x: entity1.position.x, 
        y: entity1.position.y, 
        width: entity1.size.width, 
        height: entity1.size.height 
      }
    : entity1;
  
  const e2 = entity2;
  
  // Check for collision
  const collision = (
    e1.x < e2.x + e2.width &&
    e1.x + e1.width > e2.x &&
    e1.y < e2.y + e2.height &&
    e1.y + e1.height > e2.y
  );
  
  if (!returnDirection) {
    return collision;
  }
  
  if (!collision) {
    return { collision: false };
  }
  
  // Calculate sides for directional collision
  const top = e1.y + e1.height >= e2.y && e1.y < e2.y;
  const bottom = e1.y <= e2.y + e2.height && e1.y + e1.height > e2.y + e2.height;
  const left = e1.x + e1.width >= e2.x && e1.x < e2.x;
  const right = e1.x <= e2.x + e2.width && e1.x + e1.width > e2.x + e2.width;
  
  return {
    collision: true,
    top,
    bottom,
    left,
    right
  };
}

/**
 * Check if an entity is on top of a platform
 */
export function isOnGround(
  entity: Entity,
  platform: Platform
): boolean {
  const entityBottom = entity.position.y + entity.size.height;
  const onPlatformY = Math.abs(entityBottom - platform.y) < 5; // 5px tolerance
  
  const entityRight = entity.position.x + entity.size.width;
  const entityLeft = entity.position.x;
  
  const platformRight = platform.x + platform.width;
  const platformLeft = platform.x;
  
  // Check if entity's bottom is at platform's top AND horizontally overlapping
  return (
    onPlatformY &&
    entityRight > platformLeft &&
    entityLeft < platformRight
  );
}

/**
 * Handle collision response with platform
 */
export function handlePlatformCollision(
  entity: Entity,
  platform: Platform,
  velocity: { x: number; y: number }
): { position: Position; velocity: { x: number; y: number } } {
  const result = checkCollision(entity, platform, true) as CollisionResult;
  
  if (!result.collision) {
    return { position: entity.position, velocity };
  }
  
  const newPosition = { ...entity.position };
  const newVelocity = { ...velocity };
  
  // Handle collision from different directions
  if (result.top) {
    newPosition.y = platform.y - entity.size.height;
    newVelocity.y = 0;
  } else if (result.bottom) {
    newPosition.y = platform.y + platform.height;
    newVelocity.y = 0;
  }
  
  if (result.left) {
    newPosition.x = platform.x - entity.size.width;
    newVelocity.x = 0;
  } else if (result.right) {
    newPosition.x = platform.x + platform.width;
    newVelocity.x = 0;
  }
  
  return { position: newPosition, velocity: newVelocity };
}
