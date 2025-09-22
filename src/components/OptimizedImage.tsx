import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'loading'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(priority);

  // Generate optimized src variants
  const generateSrcSet = (baseSrc: string) => {
    if (baseSrc.startsWith('data:') || baseSrc.startsWith('blob:')) {
      return baseSrc;
    }

    const widths = [320, 640, 768, 1024, 1280, 1920];
    const formats = ['webp', 'avif'];
    
    // For external images, return as-is
    if (baseSrc.startsWith('http')) {
      return baseSrc;
    }
    
    // For local images, we'll use the original for now
    // In a real Next.js app, this would generate optimized variants
    return baseSrc;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) {
      setCurrentSrc(generateSrcSet(src));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          setCurrentSrc(generateSrcSet(src));
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(false);
    // Fallback to original src if optimized version fails
    if (currentSrc !== src) {
      setCurrentSrc(src);
    }
  };

  const aspectRatio = width && height ? `${width}/${height}` : undefined;

  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio }}
    >
      {/* Placeholder */}
      {placeholder === 'blur' && blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 filter blur-sm"
          aria-hidden="true"
        />
      )}
      
      {placeholder === 'empty' && !isLoaded && !isError && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ aspectRatio }}
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          isError && "opacity-50"
        )}
        {...props}
      />

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

// Utility function to create optimized image props
export const createImageProps = (
  src: string,
  alt: string,
  options: {
    width?: number;
    height?: number;
    priority?: boolean;
    quality?: number;
    sizes?: string;
  } = {}
) => ({
  src,
  alt,
  ...options
});

// Common responsive sizes presets
export const imageSizes = {
  full: '100vw',
  half: '50vw',
  third: '33vw',
  quarter: '25vw',
  hero: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw',
  thumbnail: '(max-width: 768px) 50vw, 25vw'
};