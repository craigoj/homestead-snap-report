import React from 'react';
import { AlertTriangle, FileX, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProblemSection = () => {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Insurance Claims Get Denied",
      quote: "I lost everything in the fire, but couldn't prove what I owned.",
      stat: "67% of claims are underpaid",
      description: "Without proper documentation, insurance companies deny or drastically reduce payouts, leaving families financially devastated.",
    },
    {
      icon: FileX,
      title: "No Documentation When You Need It",
      quote: "I had photos on my phone, but it was destroyed too.",
      stat: "$11,000 average loss",
      description: "Most people have no inventory of their belongings. When disaster strikes, there's no evidence of what was lost.",
    },
    {
      icon: Clock,
      title: "Manual Inventory Takes Forever",
      quote: "I started listing everything but gave up after 3 rooms.",
      stat: "40+ hours to complete",
      description: "Traditional home inventory methods are time-consuming and overwhelming. Most people never finish them.",
    },
    {
      icon: DollarSign,
      title: "Massive Financial Loss",
      quote: "The settlement was 30% of what we actually lost.",
      stat: "$23,000 average shortfall",
      description: "Families lose thousands because they can't prove the value of their belongings to insurance companies.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-dark text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Hidden Cost of Being
            <span className="block text-red-400">Unprepared</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Every year, millions of homeowners lose thousands of dollars because they can't prove 
            what they owned when disaster strikes. Don't let this happen to you.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className={`group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 
                hover:bg-white/10 hover:border-white/20 transition-all duration-500
                animate-fade-in-up stagger-${index + 1}`}
            >
              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <problem.icon className="h-8 w-8 text-red-400" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">{problem.title}</h3>
                
                {/* Quote */}
                <blockquote className="text-lg italic text-gray-300 border-l-4 border-red-400 pl-4">
                  "{problem.quote}"
                </blockquote>

                {/* Statistic */}
                <div className="inline-block bg-red-500/20 border border-red-500/30 rounded-full px-4 py-2">
                  <span className="text-red-400 font-bold text-lg">{problem.stat}</span>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed">{problem.description}</p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-orange-500/0 group-hover:from-red-500/5 group-hover:to-orange-500/5 rounded-2xl transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-block p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <h3 className="text-3xl font-bold mb-4">Don't Become Another Statistic</h3>
            <p className="text-xl text-gray-300 mb-6">
              Protect your family's financial future with HomeGuard's AI-powered inventory system.
            </p>
            <div className="text-4xl font-bold text-warning mb-2">
              $15,000+
            </div>
            <div className="text-lg text-gray-300 mb-6">
              Average amount our users recover that would have been lost
            </div>
            <Button 
              size="lg" 
              className="btn-warning px-8 py-4 text-lg font-semibold"
              onClick={() => window.location.href = '/auth'}
            >
              Get Started - Save Money Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};