import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Homeowner",
    location: "Austin, TX",
    rating: 5,
    quote: "SnapAssetAI saved me $18,000 on my insurance claim. The AI scanning is incredibly accurate - it found items I forgot I even owned!",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "David Chen",
    role: "Property Manager",
    location: "San Francisco, CA",
    rating: 5,
    quote: "Managing inventory for 50+ properties used to take weeks. Now it takes hours. The bulk operations feature is a game-changer.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Maria Rodriguez",
    role: "Small Business Owner",
    location: "Miami, FL",
    rating: 5,
    quote: "The professional reports look amazing and my insurance company accepted them immediately. No more paperwork headaches!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "James Wilson",
    role: "Collector",
    location: "Seattle, WA",
    rating: 5,
    quote: "As an art collector, accurate valuations are crucial. SnapAssetAI's AI valuations are spot-on and save me thousands in appraisal fees.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
  },
  {
    name: "Lisa Thompson",
    role: "Insurance Agent",
    location: "Chicago, IL",
    rating: 5,
    quote: "I recommend SnapAssetAI to all my clients. The reports are comprehensive and make the claims process so much smoother for everyone.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face"
  }
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-warning/10 text-warning px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Customer Love
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Trusted by
            <span className="bg-gradient-primary bg-clip-text text-transparent"> 10,000+ Homeowners</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how SnapAssetAI has helped homeowners save time, money, and stress during insurance claims.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {[
            { label: "Average Savings", value: "$12,000", suffix: "per claim" },
            { label: "Time Saved", value: "95%", suffix: "vs manual" },
            { label: "Accuracy Rate", value: "99.2%", suffix: "AI precision" },
            { label: "Customer Rating", value: "4.9/5", suffix: "stars" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
              <div className="text-sm text-muted-foreground/60">{stat.suffix}</div>
            </div>
          ))}
        </div>

        {/* Testimonial Carousel */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="glass-card p-8 md:p-12 border border-border/50">
                    <div className="flex items-center justify-center mb-6">
                      <Quote className="w-12 h-12 text-primary/20" />
                    </div>
                    
                    <blockquote className="text-xl md:text-2xl text-foreground text-center mb-8 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>

                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        <div className="text-sm text-muted-foreground/60">{testimonial.location}</div>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background"
            onClick={nextTestimonial}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button 
            size="lg" 
            className="btn-premium px-8 py-4 text-lg font-semibold mr-4"
            onClick={() => window.location.href = '/auth'}
          >
            Start Your Free Trial
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-4 text-lg font-semibold"
          >
            Read More Reviews
          </Button>
        </div>
      </div>
    </section>
  );
};