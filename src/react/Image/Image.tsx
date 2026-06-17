/**
 * @fileoverview Image React Component
 * 
 * Modern React image component with comprehensive optimization and security features.
 * Wraps the vanilla KImageElement with React-friendly props and event handling.
 */

import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { sanitizeUrl } from '../../core/utils/sanitize.js';
import type { ImageProps } from './Image.types.js';

/**
 * Modern image component with optimization, security, and accessibility features.
 * 
 * @example Basic Usage
 * ```jsx
 * <Image 
 *   src="hero.jpg" 
 *   alt="Hero image" 
 *   width={800} 
 *   height={600}
 * />
 * ```
 * 
 * @example Responsive Hero
 * ```jsx
 * <Image 
 *   variant="hero"
 *   src="hero-800.jpg"
 *   srcSet="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
 *   sizes="100vw"
 *   alt="Company hero"
 *   priority="high"
 * />
 * ```
 * 
 * @example Avatar with Fallback
 * ```jsx
 * <Image 
 *   variant="avatar" 
 *   size="lg"
 *   src="profile.jpg" 
 *   alt="User avatar"
 *   fallbackText="JD"
 *   width={64} 
 *   height={64}
 * />
 * ```
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(({
  variant = 'basic',
  size = 'md',
  color = 'default',
  radius,
  src,
  srcSet,
  sizes,
  alt,
  width,
  height,
  loading = 'lazy',
  priority,
  decoding = 'async',
  crossOrigin,
  objectFit,
  aspectRatio,
  fallbackText,
  fallbackSrc,
  isLoading = false,
  disabled = false,
  full = false,
  className,
  style,
  onClick,
  onLoad,
  onError
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [hasIntersected, setHasIntersected] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Merge refs
  const mergedRef = useCallback((node: HTMLImageElement | null) => {
    imgRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  // Handle image load
  const handleLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageState('loaded');
    if (onLoad) {
      onLoad(event);
    }
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageState('error');
    if (onError) {
      onError(event);
    }
  }, [onError]);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (priority === 'high' || loading === 'eager' || hasIntersected) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setHasIntersected(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasIntersected) {
            setHasIntersected(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '200px 0px',
        threshold: 0
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, loading, hasIntersected]);

  // Build class names
  const containerClasses = [
    'k-image-container',
    className
  ].filter(Boolean).join(' ');

  // Should load image immediately?
  const shouldLoadImage = priority === 'high' || loading === 'eager' || hasIntersected;

  // Build v attribute for data-* attributes
  const vTokens = [
    variant,
    size,
    color !== 'default' && color,
    radius && `r-${radius}`,
    isLoading && 'loading',
    disabled && 'disabled',
    full && 'full'
  ].filter(Boolean).join(' ');

  // Image element props (without ref)
  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> = {
    className: 'k-image-main',
    src: shouldLoadImage ? sanitizeUrl(src) : undefined,
    srcSet: shouldLoadImage && srcSet ? srcSet.split(',').map((entry: string) => {
      const [url, descriptor] = entry.trim().split(/\s+/);
      return `${sanitizeUrl(url)} ${descriptor || ''}`.trim();
    }).join(', ') : undefined,
    sizes: shouldLoadImage ? sizes : undefined,
    alt,
    width,
    height,
    loading: priority === 'high' ? 'eager' : loading,
    decoding,
    crossOrigin,
    onLoad: handleLoad,
    onError: handleError,
    style: {
      '--k-image-object-fit': objectFit,
      '--k-image-aspect-ratio': aspectRatio,
      ...(imageState === 'loaded' ? {} : { display: 'none' })
    } as React.CSSProperties
  };

  // Add fetchpriority if supported
  if (priority === 'high') {
    (imgProps as any).fetchPriority = 'high';
  }

  // Container style
  const containerStyle = {
    '--k-image-aspect-ratio': aspectRatio,
    '--k-image-size': variant === 'avatar' ? 
      size === 'xs' ? '24px' :
      size === 'sm' ? '32px' :
      size === 'md' ? '48px' :
      size === 'lg' ? '64px' :
      size === 'xl' ? '96px' : '48px'
    : variant === 'thumbnail' ? '80px' : undefined,
    ...style
  } as React.CSSProperties;

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      data-variant={variant}
      data-size={size}
      data-color={color}
      data-radius={radius || undefined}
      data-loading={isLoading || undefined}
      data-disabled={disabled || undefined}
      data-full={full || undefined}
      data-state={imageState}
      style={containerStyle}
      onClick={onClick}
      role={onClick ? 'button' : 'img'}
      tabIndex={onClick ? 0 : -1}
      aria-busy={imageState === 'loading'}
      aria-disabled={disabled}
    >
      {/* Loading element */}
      {imageState === 'loading' && (
        <div className="k-image-loading" aria-hidden="true">
          {variant === 'avatar' ? (
            <div className="k-image-spinner" />
          ) : (
            <div className="k-image-skeleton" />
          )}
        </div>
      )}

      {/* Main image */}
      <img ref={mergedRef} {...imgProps} />

      {/* Fallback element for errors */}
      {imageState === 'error' && (
        <>
          {fallbackText && variant === 'avatar' ? (
            <div className="k-image-fallback k-image-fallback-text" aria-hidden="true">
              {fallbackText}
            </div>
          ) : fallbackSrc ? (
            <img
              className="k-image-fallback k-image-fallback-img"
              src={sanitizeUrl(fallbackSrc)}
              alt=""
              aria-hidden="true"
            />
          ) : null}
        </>
      )}
    </div>
  );
});

Image.displayName = 'Image';