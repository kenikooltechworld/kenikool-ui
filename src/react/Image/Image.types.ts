/**
 * Image component type definitions
 */

import type { Size, Color, Radius } from '../../core/types.js';
import React from 'react';

export type ImageVariant = 
  | 'basic'
  | 'hero' 
  | 'avatar'
  | 'thumbnail'
  | 'banner'
  | 'gallery'
  | 'responsive';

export type ImageLoading = 'lazy' | 'eager';
export type ImagePriority = 'high' | 'low';
export type ImageDecoding = 'sync' | 'async' | 'auto';
export type ImageObjectFit = 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
export type ImageCrossOrigin = 'anonymous' | 'use-credentials';

export interface ImageProps {
  /** Image variant type */
  variant?: ImageVariant;
  
  /** Component size (affects avatar and thumbnail variants) */
  size?: Size;
  
  /** Color theme for borders and focus rings */
  color?: Color;
  
  /** Border radius override */
  radius?: Radius;
  
  /** Image source URL */
  src: string;
  
  /** Responsive image sources with sizes */
  srcSet?: string;
  
  /** Responsive image sizes attribute */
  sizes?: string;
  
  /** Alt text for accessibility */
  alt: string;
  
  /** Image width (for CLS prevention) */
  width?: number;
  
  /** Image height (for CLS prevention) */
  height?: number;
  
  /** Loading strategy */
  loading?: ImageLoading;
  
  /** Priority hint for critical images */
  priority?: ImagePriority;
  
  /** Decoding hint */
  decoding?: ImageDecoding;
  
  /** Cross-origin attribute */
  crossOrigin?: ImageCrossOrigin;
  
  /** Object-fit CSS property */
  objectFit?: ImageObjectFit;
  
  /** Aspect ratio (e.g., "16/9", "1", "4/3") */
  aspectRatio?: string;
  
  /** Fallback text for avatars when image fails */
  fallbackText?: string;
  
  /** Fallback image URL when main image fails */
  fallbackSrc?: string;
  
  /** Show loading state */
  isLoading?: boolean;
  
  /** Disable the image */
  disabled?: boolean;
  
  /** Full width */
  full?: boolean;
  
  /** CSS class name */
  className?: string;
  
  /** CSS styles */
  style?: React.CSSProperties;
  
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  
  /** Load event handler */
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  
  /** Error event handler */
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}