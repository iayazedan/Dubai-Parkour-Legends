import { Sprite, SpriteFrame } from '../types';

/**
 * Get the current frame from a sprite sheet
 */
export function getSpriteFrame(
  sprite: Sprite,
  frameIndex: number
): SpriteFrame {
  const { width, height, frames } = sprite;
  
  if (frameIndex >= frames.length) {
    frameIndex = frameIndex % frames.length;
  }
  
  const frame = frames[frameIndex];
  
  return {
    x: frame.x,
    y: frame.y,
    width,
    height
  };
}

/**
 * Create animation frames for a sprite sheet
 */
export function createSpriteFrames(
  columns: number,
  rows: number,
  frameWidth: number,
  frameHeight: number
): SpriteFrame[] {
  const frames: SpriteFrame[] = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      frames.push({
        x: col * frameWidth,
        y: row * frameHeight,
        width: frameWidth,
        height: frameHeight
      });
    }
  }
  
  return frames;
}

/**
 * Draw a sprite on a canvas context
 */
export function drawSprite(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  sprite: Sprite,
  frameIndex: number,
  x: number,
  y: number,
  flipped: boolean = false
): void {
  const frame = getSpriteFrame(sprite, frameIndex);
  
  ctx.save();
  
  if (flipped) {
    ctx.translate(x + sprite.width, y);
    ctx.scale(-1, 1);
    ctx.drawImage(
      image,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      0,
      0,
      sprite.width,
      sprite.height
    );
  } else {
    ctx.drawImage(
      image,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      x,
      y,
      sprite.width,
      sprite.height
    );
  }
  
  ctx.restore();
}
